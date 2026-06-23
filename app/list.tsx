import React, { useState, useCallback } from 'react';
import { RefreshControl, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useStore } from '@/store/useStore';
import { Trash2, Plus } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Screen } from '@/components/ui/Screen';
import { Box } from '@/components/ui/Box';
import { HStack, VStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { toast } from '@/utils/toast';
import { haptics } from '@/utils/haptics';

export default function ListScreen() {
  const { items, addItem, removeItem } = useStore();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const handleAddItem = () => {
    haptics.impact();
    addItem(`New Item ${items.length + 1}`);
    toast.success('Task Added', `Successfully created "New Item ${items.length + 1}"`);
  };

  const handleRemoveItem = (id: string, title: string) => {
    haptics.notification(haptics.Notification.Warning);
    removeItem(id);
    toast.success('Task Removed', `Successfully deleted "${title}"`);
  };

  const handleRefresh = useCallback(() => {
    haptics.impact();
    setRefreshing(true);
    // Simulate refetching from server (e.g. standard React Query behavior)
    setTimeout(() => {
      setRefreshing(false);
      haptics.notification(haptics.Notification.Success);
      toast.success('Refreshed', 'Todo list has been synced successfully.');
    }, 1500);
  }, []);

  return (
    <Screen backgroundColor={theme.colors.background.default}>
      <Stack.Screen options={{ title: 'Todo List' }} />

      <Box p="md" style={{ flex: 1 }}>
        <HStack justify="space-between" align="center" style={{ marginBottom: theme.spacing.md }}>
          <Typography variant="h2">My Tasks</Typography>
          <Button
            label="Add"
            size="sm"
            leftIcon={<Plus color="white" size={16} />}
            onPress={handleAddItem}
          />
        </HStack>

        <Box style={{ flex: 1, height: '100%', width: '100%' }}>
          <FlashList
            data={items}
            renderItem={({ item }) => (
              <Box
                bg="paper"
                p="md"
                rounded="md"
                shadow="sm"
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: theme.spacing.sm,
                }}
              >
                <Typography variant="body" style={{ flex: 1, marginRight: theme.spacing.md }}>
                  {item.title}
                </Typography>
                <Pressable onPress={() => handleRemoveItem(item.id, item.title)}>
                  <Trash2 color={theme.colors.error.main} size={20} />
                </Pressable>
              </Box>
            )}
            // @ts-ignore
            estimatedItemSize={60}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                key={theme.mode}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[theme.mode === 'dark' ? '#FFFFFF' : theme.colors.primary]}
                tintColor={theme.mode === 'dark' ? '#FFFFFF' : theme.colors.primary}
                progressBackgroundColor={theme.mode === 'dark' ? theme.colors.primary : '#FFFFFF'}
              />
            }
          />
        </Box>
      </Box>
    </Screen>
  );
}
