import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator, FlatList, Pressable, Image } from 'react-native';
import { supabase } from '@/utils/supabase';
import { useStore } from '@/store';
import { useTheme } from '@/theme/ThemeContext';
import { useRunPermission } from '@/hooks/useRunPermission';
import { Screen } from '@/components/ui/Screen';
import { Box } from '@/components/ui/Box';
import { VStack, HStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Header } from '@/components/ui/Header';
import { toast } from '@/utils/toast';
import { haptics } from '@/utils/haptics';
import {
  Database,
  Plus,
  Trash2,
  Image as ImageIcon,
  WifiOff,
  User as UserIcon,
  BookOpen,
} from 'lucide-react-native';

interface Todo {
  id: string;
  user_id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
}

export default function SupabaseDemoScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useStore();
  const { executeWithPermission } = useRunPermission();

  // Component local states
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<'connected' | 'disconnected' | 'connecting'>(
    'connecting'
  );

  // Check if credentials are set
  const hasConfig =
    Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL) && Boolean(process.env.EXPO_PUBLIC_SUPABASE_KEY);
  const isActiveProvider = process.env.EXPO_PUBLIC_AUTH_PROVIDER === 'supabase';

  // ==========================================
  // 1. TanStack Query for Database CRUD
  // ==========================================

  // Query: Fetch Todos
  const {
    data: todos = [],
    isLoading: isTodosLoading,
    error: todosError,
  } = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: async () => {
      if (!hasConfig || !isActiveProvider) return [];
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: hasConfig && isActiveProvider && !!user,
  });

  // Mutation: Insert Todo
  const insertMutation = useMutation({
    mutationFn: async (title: string) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('todos')
        .insert([{ title, user_id: user.id }])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setNewTodoTitle('');
      haptics.notification(haptics.Notification.Success);
      toast.success(
        t('protected.supabaseDemo.todoAdded') || 'Todo Added',
        'Item saved to database'
      );
    },
    onError: (err: any) => {
      toast.error('Failed to add todo', err.message);
    },
  });

  // Mutation: Toggle Todo Completion
  const toggleMutation = useMutation({
    mutationFn: async ({ id, isCompleted }: { id: string; isCompleted: boolean }) => {
      const { error } = await supabase
        .from('todos')
        .update({ is_completed: isCompleted })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      haptics.impact();
    },
    onError: (err: any) => {
      toast.error('Failed to update todo', err.message);
    },
  });

  // Mutation: Delete Todo
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('todos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      haptics.notification(haptics.Notification.Warning);
      toast.success(t('protected.supabaseDemo.todoDeleted') || 'Todo Deleted', 'Item removed');
    },
    onError: (err: any) => {
      toast.error('Failed to delete todo', err.message);
    },
  });

  // ==========================================
  // 2. Supabase Realtime Subscription Setup
  // ==========================================
  useEffect(() => {
    if (!hasConfig || !isActiveProvider || !user) return;

    setRealtimeStatus('connecting');

    // Subscribe to public:todos changes
    const channel = supabase
      .channel('public-todos-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, and DELETE
          schema: 'public',
          table: 'todos',
        },
        (payload) => {
          console.log('Realtime change payload:', payload);

          // Force TanStack Query refresh
          queryClient.invalidateQueries({ queryKey: ['todos'] });

          // Interactive feedback
          haptics.selection();
          toast.info(
            'Live Database Event',
            `Todo row ${payload.eventType.toLowerCase()}d in real-time!`
          );
        }
      )
      .subscribe((status) => {
        console.log(`Realtime channel status: ${status}`);
        if (status === 'SUBSCRIBED') {
          setRealtimeStatus('connected');
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setRealtimeStatus('disconnected');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [hasConfig, isActiveProvider, user, queryClient]);

  // ==========================================
  // 3. Storage Upload Handler
  // ==========================================
  const handleImageUpload = () => {
    executeWithPermission('gallery', async () => {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });

        if (result.canceled || !result.assets?.[0]) return;

        const localUri = result.assets[0].uri;
        setIsUploading(true);
        haptics.impact();

        // 1. Fetch file content as a Blob
        const response = await fetch(localUri);
        const blob = await response.blob();

        // 2. Define unique filepath under user folder
        const fileExt = localUri.split('.').pop() || 'jpg';
        const filePath = `${user?.id}/${Date.now()}.${fileExt}`;

        // 3. Upload to "avatars" bucket
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, blob, {
            contentType: blob.type || 'image/jpeg',
            upsert: true,
          });

        if (uploadError) throw uploadError;

        // 4. Retrieve public URL
        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        setUploadedImageUrl(data.publicUrl);

        haptics.notification(haptics.Notification.Success);
        toast.success(
          t('protected.supabaseDemo.uploadSuccess') || 'Upload Successful',
          'File stored in Supabase bucket'
        );
      } catch (err: any) {
        console.error('Storage upload error:', err);
        haptics.notification(haptics.Notification.Error);
        toast.error(
          'Upload Failed',
          err.message || 'Make sure the "avatars" bucket exists and permissions are configured.'
        );
      } finally {
        setIsUploading(false);
      }
    });
  };

  const handleAddTodoSubmit = () => {
    if (!newTodoTitle.trim()) return;
    insertMutation.mutate(newTodoTitle.trim());
  };

  return (
    <Screen safeAreaEdges={['top']} backgroundColor={theme.colors.background.default}>
      <Header title="Supabase Integration" showBackButton onLeftPress={() => router.back()} />

      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <VStack space="lg" style={{ padding: theme.spacing.md, paddingBottom: 120 }}>
            {/* Connection Check Banner */}
            {!isActiveProvider ? (
              <Card
                variant="filled"
                style={{ backgroundColor: theme.colors.warning.light, borderWidth: 0 }}
              >
                <VStack space="xs">
                  <HStack space="xs" align="center">
                    <WifiOff size={20} color={theme.colors.warning.main} />
                    <Typography
                      variant="body"
                      style={{ fontWeight: '700' }}
                      color={theme.colors.warning.dark}
                    >
                      Supabase Provider Inactive
                    </Typography>
                  </HStack>
                  <Typography variant="caption" color={theme.colors.warning.dark}>
                    Set EXPO_PUBLIC_AUTH_PROVIDER=supabase in your env files to activate the
                    Supabase SDK client session engine.
                  </Typography>
                </VStack>
              </Card>
            ) : !hasConfig ? (
              <Card
                variant="filled"
                style={{ backgroundColor: theme.colors.error.light, borderWidth: 0 }}
              >
                <VStack space="xs">
                  <HStack space="xs" align="center">
                    <WifiOff size={20} color={theme.colors.error.main} />
                    <Typography
                      variant="body"
                      style={{ fontWeight: '700' }}
                      color={theme.colors.error.main}
                    >
                      Configuration Missing
                    </Typography>
                  </HStack>
                  <Typography variant="caption" color={theme.colors.error.main}>
                    Please configure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_KEY in your
                    env files.
                  </Typography>
                </VStack>
              </Card>
            ) : (
              <Card variant="outlined">
                <HStack align="center" justify="space-between">
                  <VStack space="xs" style={{ flex: 1 }}>
                    <HStack space="xs" align="center">
                      <Database size={20} color={theme.colors.primary} />
                      <Typography variant="body" style={{ fontWeight: '700' }}>
                        Supabase Online
                      </Typography>
                    </HStack>
                    <Typography variant="caption" color={theme.colors.text.subtle}>
                      Successfully initialized secure store session engine.
                    </Typography>
                  </VStack>

                  {/* Realtime Connection Status */}
                  <Badge
                    label={
                      realtimeStatus === 'connected'
                        ? 'Realtime'
                        : realtimeStatus === 'connecting'
                          ? 'Syncing...'
                          : 'Offline'
                    }
                    variant="solid"
                    colorScheme={
                      realtimeStatus === 'connected'
                        ? 'success'
                        : realtimeStatus === 'connecting'
                          ? 'warning'
                          : 'error'
                    }
                  />
                </HStack>
              </Card>
            )}

            {/* Auth Session Section */}
            <Typography variant="h4" style={{ fontWeight: '700', marginTop: 4 }}>
              Active Auth Session
            </Typography>
            <Card>
              <VStack space="md">
                <HStack space="md" align="center">
                  <Box bg={theme.colors.primary} p="sm" rounded="full">
                    <UserIcon color="white" size={20} />
                  </Box>
                  <VStack space="xs" style={{ flex: 1 }}>
                    <Typography variant="body" style={{ fontWeight: '700' }}>
                      {user?.name}
                    </Typography>
                    <Typography variant="caption" color={theme.colors.text.subtle}>
                      UID: {user?.id}
                    </Typography>
                    <Typography variant="caption" color={theme.colors.text.subtle}>
                      Email: {user?.email}
                    </Typography>
                  </VStack>
                </HStack>
              </VStack>
            </Card>

            {/* Database CRUD section */}
            <Typography variant="h4" style={{ fontWeight: '700', marginTop: 8 }}>
              Database & Realtime CRUD
            </Typography>

            <Card>
              <VStack space="md">
                <Typography variant="bodySmall" color={theme.colors.text.subtle}>
                  Type a task and insert it to save to the database. Realtime sockets sync changes
                  across devices instantly.
                </Typography>

                <HStack space="sm" align="center">
                  <Input
                    placeholder="New todo task..."
                    value={newTodoTitle}
                    onChangeText={setNewTodoTitle}
                    style={{ flex: 1 }}
                    editable={!insertMutation.isPending && hasConfig && isActiveProvider}
                  />
                  <Button
                    label=""
                    size="md"
                    variant="solid"
                    onPress={handleAddTodoSubmit}
                    isLoading={insertMutation.isPending}
                    disabled={!newTodoTitle.trim() || !hasConfig || !isActiveProvider}
                    style={{
                      height: 48,
                      width: 48,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    leftIcon={<Plus size={20} color="white" />}
                  />
                </HStack>

                {/* Todo List */}
                {isTodosLoading ? (
                  <Box style={{ paddingVertical: 20, alignItems: 'center' }}>
                    <ActivityIndicator color={theme.colors.primary} />
                  </Box>
                ) : todosError ? (
                  <Box style={{ paddingVertical: 10 }}>
                    <Typography variant="caption" color={theme.colors.error.main}>
                      Error loading todos: {(todosError as Error).message}
                    </Typography>
                  </Box>
                ) : todos.length === 0 ? (
                  <Box style={{ paddingVertical: 30, alignItems: 'center' }}>
                    <Typography variant="bodySmall" color={theme.colors.text.subtle}>
                      No todos found in 'todos' table.
                    </Typography>
                  </Box>
                ) : (
                  <VStack space="sm" style={{ marginTop: 8 }}>
                    {todos.map((todo) => (
                      <HStack
                        key={todo.id}
                        align="center"
                        justify="space-between"
                        style={{
                          padding: theme.spacing.sm,
                          backgroundColor: theme.colors.background.subtle,
                          borderRadius: theme.radius.md,
                        }}
                      >
                        <HStack space="md" align="center" style={{ flex: 1 }}>
                          <Checkbox
                            checked={todo.is_completed}
                            onCheckedChange={(val: boolean) =>
                              toggleMutation.mutate({ id: todo.id, isCompleted: val })
                            }
                          />
                          <Typography
                            variant="bodySmall"
                            style={{
                              textDecorationLine: todo.is_completed ? 'line-through' : 'none',
                              color: todo.is_completed
                                ? theme.colors.text.subtle
                                : theme.colors.text.default,
                            }}
                          >
                            {todo.title}
                          </Typography>
                        </HStack>
                        <Pressable
                          onPress={() => deleteMutation.mutate(todo.id)}
                          style={({ pressed }) => ({
                            opacity: pressed ? 0.6 : 1,
                            padding: 4,
                          })}
                        >
                          <Trash2 size={18} color={theme.colors.error.main} />
                        </Pressable>
                      </HStack>
                    ))}
                  </VStack>
                )}
              </VStack>
            </Card>

            {/* Storage Bucket Section */}
            <Typography variant="h4" style={{ fontWeight: '700', marginTop: 8 }}>
              Storage Bucket Upload
            </Typography>

            <Card>
              <VStack space="md" align="center">
                <Typography
                  variant="bodySmall"
                  color={theme.colors.text.subtle}
                  align="center"
                  style={{ width: '100%' }}
                >
                  Upload an image to the 'avatars' storage bucket and display the generated public
                  URL.
                </Typography>

                {uploadedImageUrl ? (
                  <Card style={{ width: '100%', padding: 0, overflow: 'hidden' }}>
                    <Box
                      style={{
                        height: 180,
                        width: '100%',
                        backgroundColor: theme.colors.background.subtle,
                      }}
                    >
                      <Image
                        source={{ uri: uploadedImageUrl }}
                        style={{ height: '100%', width: '100%' }}
                        resizeMode="cover"
                      />
                    </Box>
                    <Box p="sm">
                      <Typography
                        variant="caption"
                        color={theme.colors.text.subtle}
                        numberOfLines={1}
                      >
                        URL: {uploadedImageUrl}
                      </Typography>
                    </Box>
                  </Card>
                ) : (
                  <Box
                    style={{
                      height: 120,
                      width: 120,
                      borderRadius: theme.radius.full,
                      backgroundColor: theme.colors.background.subtle,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderStyle: 'dashed',
                      borderColor: theme.colors.border.default,
                    }}
                  >
                    <ImageIcon size={32} color={theme.colors.text.subtle} />
                  </Box>
                )}

                <Button
                  label="Select & Upload Photo"
                  variant="outline"
                  onPress={handleImageUpload}
                  isLoading={isUploading}
                  disabled={!hasConfig || !isActiveProvider}
                  leftIcon={<ImageIcon size={20} color={theme.colors.primary} />}
                  style={{ width: '100%' }}
                />
              </VStack>
            </Card>

            {/* Developer Guide / Database setup */}
            <Typography variant="h4" style={{ fontWeight: '700', marginTop: 8 }}>
              Database SQL Script Setup
            </Typography>

            <Card variant="filled">
              <VStack space="xs">
                <HStack space="xs" align="center">
                  <BookOpen size={16} color={theme.colors.primary} />
                  <Typography variant="bodySmall" style={{ fontWeight: '700' }}>
                    How to prepare database tables?
                  </Typography>
                </HStack>
                <Typography variant="caption" color={theme.colors.text.subtle}>
                  Open the SQL Editor inside your Supabase dashboard and run the SQL schema defined
                  in the implementation plan to create the 'todos' table, enable RLS, and configure
                  security policies correctly.
                </Typography>
              </VStack>
            </Card>
          </VStack>
        }
      />
    </Screen>
  );
}
