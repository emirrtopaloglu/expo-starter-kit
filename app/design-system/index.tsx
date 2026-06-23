import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Box } from '@/components/ui/Box';
import { VStack, HStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useTheme } from '@/theme/ThemeContext';
import { Info, AlertTriangle, Moon, Sun } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { IconBadge } from '@/components/ui/IconBadge';
import { Spinner } from '@/components/ui/Spinner';
import { Avatar } from '@/components/ui/Avatar';
import { Divider } from '@/components/ui/Divider';
import { Switch } from '@/components/ui/Switch';
import { Checkbox } from '@/components/ui/Checkbox';
import { Radio } from '@/components/ui/Radio';
import { ListItem } from '@/components/ui/ListItem';
import { SearchBar } from '@/components/ui/SearchBar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Skeleton } from '@/components/ui/Skeleton';
import { Accordion } from '@/components/ui/Accordion';
import { Modal } from '@/components/ui/Modal';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { FAB } from '@/components/ui/FAB';
import { Stepper } from '@/components/ui/Stepper';
import { Select } from '@/components/ui/Select';
import { OTPInput } from '@/components/ui/OTPInput';
import { Slider } from '@/components/ui/Slider';
import { Tabs } from '@/components/ui/Tabs';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { DatePicker } from '@/components/ui/DatePicker';
import { Screen } from '@/components/ui/Screen';
import { MasonryList } from '@/components/ui/MasonryList';
import { Image } from '@/components/ui/Image';
import { useNetworkStore } from '@/store/useNetworkStore';
import { toast } from '@/utils/toast';
import { Header } from '@/components/ui/Header';
import { useStore } from '@/store/useStore';
import { secureStorage } from '@/utils/secureStorage';
import client from '@/api/client';
import { useTranslation } from 'react-i18next';
import { actionSheet } from '@/utils/actionSheet';
import { biometrics } from '@/utils/biometrics';
import { storeReview } from '@/utils/storeReview';
import { share } from '@/utils/share';
import { useAppUpdate } from '@/hooks/useAppUpdate';
import {
  AlertCircle,
  Box as BoxIcon,
  User,
  Settings,
  Heart,
  ChevronRight,
} from 'lucide-react-native';

export default function DesignSystemScreen() {
  const { theme, setThemePreference, isDark } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { isConnected, isSimulatedOffline, setSimulatedOffline } = useNetworkStore();
  const { isLoggedIn, language: storeLanguage, setLoggedIn, setLanguage } = useStore();
  const [shouldCrash, setShouldCrash] = useState(false);

  const [storedAccessToken, setStoredAccessToken] = useState<string | null>(null);
  const [storedRefreshToken, setStoredRefreshToken] = useState<string | null>(null);

  const loadSecureTokens = async () => {
    const access = await secureStorage.getItem('access_token');
    const refresh = await secureStorage.getItem('refresh_token');
    setStoredAccessToken(access);
    setStoredRefreshToken(refresh);
  };

  React.useEffect(() => {
    loadSecureTokens();
  }, []);

  // Native integration states
  const { triggerSimulatedUpdate } = useAppUpdate();
  const [biometricSupported, setBiometricSupported] = useState<boolean | null>(null);
  const [secretInput, setSecretInput] = useState('Vault Access Granted: Gold Vault Key #4492');
  const [retrievedSecured, setRetrievedSecured] = useState<string | null>(null);

  // Check biometric support status on mount
  React.useEffect(() => {
    async function checkSupport() {
      const isAvailable = await biometrics.isSupported();
      setBiometricSupported(isAvailable);
    }
    checkSupport();
  }, []);

  if (shouldCrash) {
    throw new Error('Simulated developer crash to test GlobalErrorBoundary.');
  }

  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Batch 4 State
  const [tabId, setTabId] = useState('tab1');
  const [segIndex, setSegIndex] = useState(0);
  const [stepValue, setStepValue] = useState(1);
  const [sliderValue, setSliderValue] = useState(50);
  const [otp, setOTP] = useState('');

  // Batch 5 State
  // Batch 5 State
  const [selectVal, setSelectVal] = useState<string | number>('');
  const [multiSelectVal, setMultiSelectVal] = useState<string[]>([]);
  const [dateVal, setDateVal] = useState(new Date());
  const [timeVal, setTimeVal] = useState(new Date());

  const toggleTheme = () => {
    setThemePreference(isDark ? 'light' : 'dark');
  };

  const handleOpenActionSheet = () => {
    actionSheet.show(
      {
        title: t('actionSheet.title'),
        message: t('actionSheet.message'),
        options: [
          t('actionSheet.camera'),
          t('actionSheet.gallery'),
          t('actionSheet.cancel'),
        ],
        cancelButtonIndex: 2,
      },
      (index) => {
        if (index === 0) {
          toast.success(t('actionSheet.camera'), 'Camera selected.');
        } else if (index === 1) {
          toast.success(t('actionSheet.gallery'), 'Gallery selected.');
        } else {
          toast.info(t('actionSheet.cancel'), 'Action sheet dismissed.');
        }
      }
    );
  };

  return (
    <Screen
      preset="scroll"
      backgroundColor={theme.colors.background.default}
      floatingContent={
        <FAB
          icon={<BoxIcon color="white" size={24} />}
          onPress={() => console.log('FAB')}
          label="New"
        />
      }
    >
      <Stack.Screen
        options={{
          header: () => (
            <Header
              title="Design System"
              subtitle="Boilerplate UI Kit"
              rightActions={[
                {
                  icon: <Settings size={22} color={theme.colors.text.default} />,
                  onPress: () => toast.success('Header Action', 'Settings action clicked from Custom Header!'),
                },
              ]}
            />
          ),
        }}
      />
      <Box p="md">
        <VStack space="xl">
          {/* Theme Toggle */}
          <Box
            bg="paper"
            p="md"
            rounded="lg"
            shadow="sm"
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <HStack space="sm" align="center">
              {isDark ? (
                <Moon size={20} color={theme.colors.primary} />
              ) : (
                <Sun size={20} color={theme.colors.warning.main} />
              )}
              <Typography variant="h4">Current Theme: {theme.mode}</Typography>
            </HStack>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.neutral[300], true: theme.colors.primary }}
            />
          </Box>
          {/* Typography Section */}
          <Box bg="paper" p="md" rounded="lg" shadow="sm">
            <Typography variant="h2" style={{ marginBottom: 10 }}>
              Typography
            </Typography>
            <VStack space="sm">
              <Typography variant="h1">Heading 1</Typography>
              <Typography variant="h2">Heading 2</Typography>
              <Typography variant="h3">Heading 3</Typography>
              <Typography variant="h4">Heading 4</Typography>
              <Typography variant="body">Body text: Lorem ipsum dolor sit amet.</Typography>
              <Typography variant="bodySmall">Body Small: Detailed description.</Typography>
              <Typography variant="caption" color={theme.colors.text.subtle}>
                Caption text here.
              </Typography>
            </VStack>
          </Box>
          {/* Buttons Section */}
          <Box bg="paper" p="md" rounded="lg" shadow="sm">
            <Typography variant="h2" style={{ marginBottom: 10 }}>
              Buttons
            </Typography>
            <VStack space="md">
              <Button label="Primary Button" onPress={() => console.log('Pressed')} />
              <Button
                variant="outline"
                label="Outline Button"
                leftIcon={<Info size={18} color={theme.colors.primary} />}
              />
              <Button
                variant="ghost"
                label="Ghost Button"
                rightIcon={<AlertTriangle size={18} color={theme.colors.error.main} />}
              />
              <HStack space="md">
                <Button size="sm" label="Small" />
                <Button size="md" variant="outline" label="Medium" />
                {/* <Button size="lg" label="Large" /> */}
              </HStack>
              <Button label="Loading..." isLoading />
              <Button label="Disabled" disabled />
            </VStack>
          </Box>
          {/* Inputs Section */}
          <Box bg="paper" p="md" rounded="lg" shadow="sm">
            <Typography variant="h2" style={{ marginBottom: 10 }}>
              Inputs
            </Typography>
            <VStack space="md">
              <Input label="Email Address" placeholder="Enter your email" />
              <Input
                label="Password"
                placeholder="Enter password"
                secureTextEntry
                helperText="Must be at least 8 characters."
              />
              <Input
                label="Error State"
                value="Invalid Value"
                error="Refer to the error message."
                rightIcon={<AlertTriangle size={20} color={theme.colors.error.main} />}
              />
            </VStack>
          </Box>
          {/* Colors/Box Section */}
          <Box bg="paper" p="md" rounded="lg" shadow="sm">
            <Typography variant="h2" style={{ marginBottom: 10 }}>
              Colors & Layout
            </Typography>
            <HStack space="md" wrap="wrap">
              <Box bg={theme.colors.primary} p="lg" rounded="md">
                <Typography color="white">Primary</Typography>
              </Box>
              <Box bg={theme.colors.success.main} p="lg" rounded="md">
                <Typography color="white">Success</Typography>
              </Box>
              <Box bg={theme.colors.warning.main} p="lg" rounded="md">
                <Typography color="white">Warning</Typography>
              </Box>
              <Box bg={theme.colors.error.main} p="lg" rounded="md">
                <Typography color="white">Error</Typography>
              </Box>
            </HStack>
          </Box>
          {/* Cards Section */}
          <Box bg="paper" p="md" rounded="lg" shadow="sm">
            <Typography variant="h2" style={{ marginBottom: 10 }}>
              Cards
            </Typography>
            <VStack space="md">
              <Card>
                <Card.Header>
                  <Card.Title>Elevated Card</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Typography variant="body">
                    This is a standard card with elevation. It pops off the background.
                  </Typography>
                </Card.Body>
                <Card.Footer>
                  <Button size="sm" label="Action" />
                </Card.Footer>
              </Card>

              <Card variant="outlined">
                <Card.Header>
                  <HStack justify="space-between" align="center">
                    <Card.Title>Outlined Card</Card.Title>
                    <Badge label="New" variant="solid" colorScheme="primary" size="sm" />
                  </HStack>
                </Card.Header>
                <Card.Body>
                  <Typography variant="body">
                    This card has a border and no shadow. Good for secondary content.
                  </Typography>
                </Card.Body>
              </Card>

              <Card variant="filled">
                <Card.Body>
                  <Typography variant="body">
                    Filled card variant. Useful for subtle grouping on complex backgrounds.
                  </Typography>
                </Card.Body>
              </Card>
            </VStack>
          </Box>
          {/* Badges Section */}
          <Box bg="paper" p="md" rounded="lg" shadow="sm">
            <Typography variant="h2" style={{ marginBottom: 10 }}>
              Badges
            </Typography>
            <HStack space="md" wrap="wrap">
              <Badge label="Default" />
              <Badge label="Primary" colorScheme="primary" variant="solid" />
              <Badge label="Success" colorScheme="success" variant="outline" />
              <Badge label="Warning" colorScheme="warning" variant="subtle" />
              <Badge label="Error" colorScheme="error" variant="solid" />
              <Badge label="Info" colorScheme="info" variant="outline" />
            </HStack>
            <Box mt="md">
              <Typography variant="h4" style={{ marginBottom: 8 }}>
                Badge Sizes
              </Typography>
              <HStack space="md">
                <Badge label="Small" size="sm" />
                <Badge label="Medium" size="md" />
              </HStack>
            </Box>
            <Box mt="md">
              <Typography variant="h4" style={{ marginBottom: 8 }}>
                IconBadges (Notification Badges)
              </Typography>
              <HStack space="lg" align="center">
                <IconBadge count={5}>
                  <BoxIcon size={24} color={theme.colors.text.default} />
                </IconBadge>
                <IconBadge count={120} maxCount={99}>
                  <User size={24} color={theme.colors.text.default} />
                </IconBadge>
                <IconBadge showDot size="md">
                  <Settings size={24} color={theme.colors.text.default} />
                </IconBadge>
                <IconBadge showDot size="sm" badgeColor={theme.colors.success.main}>
                  <Heart size={24} color={theme.colors.text.default} />
                </IconBadge>
              </HStack>
            </Box>
          </Box>
          {/* New Batch 2 Components */}
          <Box bg="paper" p="md" rounded="lg" shadow="sm">
            <Typography variant="h2" style={{ marginBottom: 10 }}>
              Feedback & Data
            </Typography>
            <VStack space="lg">
              <Box>
                <Typography variant="h4" style={{ marginBottom: 8 }}>
                  Spinners
                </Typography>
                <HStack space="md">
                  <Spinner size="small" />
                  <Spinner size="large" color={theme.colors.success.main} />
                </HStack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h4" style={{ marginBottom: 8 }}>
                  Avatars
                </Typography>
                <HStack space="md" align="center">
                  <Avatar fallback="ET" size="sm" />
                  <Avatar fallback="JD" size="md" />
                  <Avatar fallback="AB" size="lg" />
                  {/* <Avatar src="https://github.com/shadcn.png" size="md" /> */}
                </HStack>
              </Box>

              {/* Image */}
              <Box>
                <Typography variant="h4" style={{ marginBottom: 8 }}>
                  Image (Cached, Loading & Error States)
                </Typography>
                <Typography variant="bodySmall" color={theme.colors.text.subtle} style={{ marginBottom: 8 }}>
                  Features automatic disk-caching, blurhash, loading skeletons, and error placeholders.
                </Typography>
                <HStack style={{ gap: 16 }}>
                  <Image
                    source="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    style={{ width: 80, height: 80 }}
                    rounded="md"
                    transition={500}
                  />
                  <Image
                    source="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    style={{ width: 80, height: 80 }}
                    rounded="full"
                  />
                  <Image
                    source="https://invalid-image-url-test.com/broken.png"
                    style={{ width: 80, height: 80 }}
                    rounded="md"
                  />
                </HStack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h4" style={{ marginBottom: 8 }}>
                  Form Controls
                </Typography>
                <VStack space="md">
                  <Switch value={true} onValueChange={() => {}} label="Notifications" />
                  <Checkbox checked={true} onCheckedChange={() => {}} label="I agree to terms" />
                  <Checkbox checked={false} onCheckedChange={() => {}} label="Unchecked option" />

                  <Box>
                    <Typography variant="bodySmall" style={{ marginBottom: 4 }}>
                      Radio Group
                    </Typography>
                    <Radio.Group value="opt1" onChange={() => {}}>
                      <Radio value="opt1" label="Option 1" />
                      <Radio value="opt2" label="Option 2" />
                    </Radio.Group>
                  </Box>
                </VStack>
              </Box>
            </VStack>
          </Box>
          {/* Molecules & Organisms */}
          <Box bg="paper" p="md" rounded="lg" shadow="sm">
            <Typography variant="h2" style={{ marginBottom: 10 }}>
              Molecules & Organisms
            </Typography>
            <VStack space="lg">
              <Box>
                <Typography variant="h4" style={{ marginBottom: 8 }}>
                  Search & Lists
                </Typography>
                <VStack space="md">
                  <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onClear={() => setSearchQuery('')}
                  />
                  <Box
                    style={{
                      borderWidth: 1,
                      borderColor: theme.colors.border.subtle,
                      borderRadius: theme.radius.md,
                      overflow: 'hidden',
                    }}
                  >
                    <ListItem
                      title="Profile Settings"
                      subtitle="Manage your account"
                      leftIcon={<User size={20} color={theme.colors.primary} />}
                      showChevron
                    />
                    <Divider />
                    <ListItem
                      title="General Settings"
                      leftIcon={<Settings size={20} color={theme.colors.primary} />}
                      showChevron
                    />
                  </Box>
                </VStack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h4" style={{ marginBottom: 8 }}>
                  Custom Headers
                </Typography>
                <Typography variant="bodySmall" color={theme.colors.text.subtle} style={{ marginBottom: 12 }}>
                  Fully theme-compliant navbar with support for left back actions, centered/left titles, subtitles, and right-aligned buttons.
                </Typography>
                <VStack space="md">
                  {/* Center-aligned header */}
                  <Box style={{ borderWidth: 1, borderColor: theme.colors.border.subtle, borderRadius: theme.radius.md, overflow: 'hidden' }}>
                    <Header
                      title="Detail Screen"
                      titleAlign="center"
                      showBackButton={true}
                      onLeftPress={() => toast.info('Back Press', 'Back action triggered')}
                      safeArea={false}
                      rightActions={[
                        {
                          icon: <Settings size={20} color={theme.colors.text.default} />,
                          onPress: () => toast.success('Settings Pressed', 'Settings action triggered'),
                        },
                      ]}
                    />
                  </Box>

                  {/* Left-aligned header with subtitle */}
                  <Box style={{ borderWidth: 1, borderColor: theme.colors.border.subtle, borderRadius: theme.radius.md, overflow: 'hidden' }}>
                    <Header
                      title="Messages"
                      subtitle="3 unread conversations"
                      titleAlign="left"
                      showBackButton={false}
                      safeArea={false}
                      rightActions={[
                        {
                          icon: <User size={20} color={theme.colors.text.default} />,
                          onPress: () => toast.success('Profile Pressed', 'Profile action triggered'),
                        },
                      ]}
                    />
                  </Box>
                </VStack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h4" style={{ marginBottom: 8 }}>
                  Progress & Loading
                </Typography>
                <VStack space="md">
                  <ProgressBar progress={45} />
                  <ProgressBar progress={80} color={theme.colors.success.main} height={12} />
                  <HStack space="md">
                    <Skeleton width={50} height={50} variant="circle" />
                    <VStack space="sm" style={{ flex: 1 }}>
                      <Skeleton height={20} width="80%" />
                      <Skeleton height={14} width="40%" />
                    </VStack>
                  </HStack>
                </VStack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h4" style={{ marginBottom: 8 }}>
                  Overlays & Collapsibles
                </Typography>
                <VStack space="md">
                  <Accordion title="What is this?">
                    <Typography variant="body">
                      This is an accordion component. It uses LayoutAnimation for smooth expanding
                      and collapsing.
                    </Typography>
                  </Accordion>
                  <Accordion title="Can I customize it?">
                    <Typography variant="body">
                      Yes! You can put any content inside, including other components like buttons
                      or lists.
                    </Typography>
                  </Accordion>

                  <HStack space="sm" style={{ flexWrap: 'wrap', gap: 8 }}>
                    <Button
                      label="Open Modal"
                      onPress={() => setModalOpen(true)}
                      variant="outline"
                    />
                    <Button
                      label="Open Sheet"
                      onPress={() => setSheetOpen(true)}
                      variant="outline"
                    />
                    <Button
                      label="Open Native Menu"
                      onPress={handleOpenActionSheet}
                      variant="outline"
                    />
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </Box>
          {/* Modal & Sheet Implementations */}
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Example Modal">
            <VStack space="md">
              <Typography variant="body">
                This is a fully accessible modal dialog. It has a backdrop, centered content, and
                animation.
              </Typography>
              <HStack space="md" justify="flex-end">
                <Button label="Cancel" variant="ghost" onPress={() => setModalOpen(false)} />
                <Button label="Confirm" onPress={() => setModalOpen(false)} />
              </HStack>
            </VStack>
          </Modal>
          <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} title="Bottom Sheet">
            <VStack space="md">
              <Typography variant="body">
                Bottom sheets are great for mobile actions, menus, or secondary content.
              </Typography>
              <ListItem
                title="Share"
                leftIcon={
                  <Box p="xs" bg={theme.colors.neutral[100]} rounded="full">
                    <User size={16} color="black" />
                  </Box>
                }
              />
              <ListItem
                title="Add to Favorites"
                leftIcon={
                  <Box p="xs" bg={theme.colors.neutral[100]} rounded="full">
                    <Heart size={16} color="black" />
                  </Box>
                }
              />
              <Button
                label="Close Sheet"
                onPress={() => setSheetOpen(false)}
                style={{ marginTop: 10 }}
              />
            </VStack>
          </BottomSheet>
          {/* Advanced Inputs & Navigation */}
          <Box bg="paper" p="md" rounded="lg" shadow="sm">
            <Typography variant="h2" style={{ marginBottom: 10 }}>
              Advanced Inputs & Controls
            </Typography>
            <VStack space="lg">
              <Box>
                <Typography variant="h4" style={{ marginBottom: 8 }}>
                  Selection & Steppers
                </Typography>
                <VStack space="md">
                  <SegmentedControl
                    options={['Daily', 'Weekly', 'Monthly']}
                    selectedIndex={segIndex}
                    onChange={setSegIndex}
                  />
                  <Stepper value={stepValue} onChange={setStepValue} min={0} max={10} />

                  <Select
                    label="Category (Single)"
                    placeholder="Select a category"
                    value={selectVal}
                    onChange={setSelectVal}
                    searchable
                    options={[
                      { label: 'Technology', value: 'tech' },
                      { label: 'Design', value: 'design' },
                      { label: 'Business', value: 'business' },
                      { label: 'Marketing', value: 'marketing' },
                    ]}
                  />

                  <Select
                    label="Tags (Multiple)"
                    placeholder="Select tags"
                    value={multiSelectVal}
                    onChange={setMultiSelectVal}
                    multiple
                    options={[
                      { label: 'React Native', value: 'rn' },
                      { label: 'Expo', value: 'expo' },
                      { label: 'TypeScript', value: 'ts' },
                      { label: 'JavaScript', value: 'js' },
                    ]}
                  />
                  <View style={{ gap: 16 }}>
                    <DatePicker label="Date Picker" value={dateVal} onChange={setDateVal} />
                  </View>
                </VStack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h4" style={{ marginBottom: 8 }}>
                  Sliders & OTP
                </Typography>
                <VStack space="md">
                  <Slider value={sliderValue} onValueChange={setSliderValue} />
                  <Typography variant="caption">Value: {sliderValue}</Typography>

                  <Typography variant="bodySmall" style={{ marginTop: 8 }}>
                    Verify Code
                  </Typography>
                  <OTPInput length={4} onCodeChanged={setOTP} />
                </VStack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h4" style={{ marginBottom: 8 }}>
                  Tabs Navigation
                </Typography>
                <Box
                  style={{
                    height: 150,
                    borderWidth: 1,
                    borderColor: theme.colors.border.subtle,
                    borderRadius: theme.radius.md,
                  }}
                >
                  <Tabs
                    activeTabId={tabId}
                    onTabChange={setTabId}
                    tabs={[
                      {
                        id: 'tab1',
                        label: 'First',
                        content: (
                          <Box p="md">
                            <Typography>Tab 1 Content</Typography>
                          </Box>
                        ),
                      },
                      {
                        id: 'tab2',
                        label: 'Second',
                        content: (
                          <Box p="md">
                            <Typography>Tab 2 Content</Typography>
                          </Box>
                        ),
                      },
                      {
                        id: 'tab3',
                        label: 'Third',
                        content: (
                          <Box p="md">
                            <Typography>Tab 3 Content</Typography>
                          </Box>
                        ),
                      },
                    ]}
                  />
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h4" style={{ marginBottom: 8 }}>
                  Complex Layouts (MasonryList)
                </Typography>
                <Box
                  style={{
                    height: 300,
                    backgroundColor: isDark ? theme.colors.neutral[900] : theme.colors.neutral[100],
                    borderRadius: 8,
                    padding: 8,
                  }}
                >
                  <MasonryList
                    data={[
                      'Item 1 (Short)',
                      'Item 2 (Taller)\n\nExtra content here.',
                      'Item 3',
                      'Item 4 (Medium)\nMore text.',
                      'Item 5',
                      'Item 6',
                    ]}
                    renderItem={(item, index) => (
                      <Box
                        bg="paper"
                        p="md"
                        rounded="md"
                        shadow="sm"
                        style={{ borderWidth: 1, borderColor: theme.colors.border.subtle }}
                      >
                        <Typography variant="h4">Card {index + 1}</Typography>
                        <Typography variant="caption" style={{ marginTop: 4 }}>
                          {item}
                        </Typography>
                      </Box>
                    )}
                  />
                </Box>
              </Box>

              <Divider />

              {/* State & Connection Demos */}
              <Box>
                <Typography variant="h4" style={{ marginBottom: 12 }}>
                  State & Connection Demos (NetInfo & State Fallbacks)
                </Typography>
                
                <VStack space="md">
                  {/* Network Indicator Simulation Card */}
                  <Card>
                    <VStack space="sm">
                      <Typography variant="body" style={{ fontWeight: '700' }}>
                        Network Status & Simulation
                      </Typography>
                      <Typography variant="bodySmall" color={theme.colors.text.subtle}>
                        Toggle simulated offline mode to see the dropdown connection warning banner at the top of the screen in real-time.
                      </Typography>
                      <HStack align="center" justify="space-between" style={{ marginTop: 8 }}>
                        <HStack space="xs" align="center">
                          <Typography variant="bodySmall" style={{ fontWeight: '500' }}>
                            Status:
                          </Typography>
                          <Box
                            style={{
                              backgroundColor: isConnected ? theme.colors.success.light : theme.colors.error.light,
                              paddingHorizontal: 8,
                              paddingVertical: 2,
                              borderRadius: theme.radius.sm,
                            }}
                          >
                            <Typography
                              variant="caption"
                              style={{
                                color: isConnected ? theme.colors.success.dark : theme.colors.error.dark,
                                fontWeight: '700',
                              }}
                            >
                              {isConnected ? 'ONLINE' : 'OFFLINE'}
                            </Typography>
                          </Box>
                        </HStack>
                        <HStack space="sm" align="center">
                          <Typography variant="bodySmall" color={theme.colors.text.subtle}>
                            Simulate Offline
                          </Typography>
                          <Switch
                            value={isSimulatedOffline}
                            onValueChange={(val) => setSimulatedOffline(val)}
                            trackColor={{ false: theme.colors.neutral[300], true: theme.colors.primary }}
                          />
                        </HStack>
                      </HStack>
                    </VStack>
                  </Card>

                  {/* Zustand Persist Card */}
                  <Card>
                    <VStack space="sm">
                      <Typography variant="body" style={{ fontWeight: '700' }}>
                        Zustand Persisted State (AsyncStorage)
                      </Typography>
                      <Typography variant="bodySmall" color={theme.colors.text.subtle}>
                        Login status and language selection are stored persistently in AsyncStorage. Close and reopen the app to verify state persistence.
                      </Typography>

                      <HStack align="center" justify="space-between" style={{ marginTop: 8 }}>
                        <HStack space="xs" align="center">
                          <Typography variant="bodySmall" style={{ fontWeight: '500' }}>
                            Login Status:
                          </Typography>
                          <Typography
                            variant="bodySmall"
                            style={{ fontWeight: '700' }}
                            color={isLoggedIn ? theme.colors.success.main : theme.colors.error.main}
                          >
                            {isLoggedIn ? 'LOGGED IN' : 'LOGGED OUT'}
                          </Typography>
                        </HStack>
                        <Button
                          label={isLoggedIn ? 'Log Out' : 'Log In'}
                          size="sm"
                          variant="outline"
                          onPress={() => {
                            setLoggedIn(!isLoggedIn);
                            toast.success('Zustand Persist', isLoggedIn ? 'Logged out successfully!' : 'Logged in successfully!');
                          }}
                        />
                      </HStack>

                      <HStack align="center" justify="space-between" style={{ marginTop: 8 }}>
                        <HStack space="xs" align="center">
                          <Typography variant="bodySmall" style={{ fontWeight: '500' }}>
                            Preferred Language:
                          </Typography>
                          <Typography variant="bodySmall" style={{ fontWeight: '700', textTransform: 'uppercase' }}>
                            {storeLanguage}
                          </Typography>
                        </HStack>
                        <Button
                          label={storeLanguage === 'en' ? 'Switch to TR' : 'Switch to EN'}
                          size="sm"
                          variant="outline"
                          onPress={() => {
                            const newLang = storeLanguage === 'en' ? 'tr' : 'en';
                            setLanguage(newLang);
                            toast.success('Zustand Persist', `Language changed to ${newLang.toUpperCase()}`);
                          }}
                        />
                      </HStack>
                    </VStack>
                  </Card>

                  {/* SecureStore & Axios Interceptors Card */}
                  <Card>
                    <VStack space="sm">
                      <Typography variant="body" style={{ fontWeight: '700' }}>
                        SecureStore & Axios Interceptors
                      </Typography>
                      <Typography variant="bodySmall" color={theme.colors.text.subtle}>
                        Automatically injects the Bearer Access Token into outbound requests, and triggers the refresh token flow on 401 Unauthorized responses.
                      </Typography>

                      <VStack space="xs" style={{ marginTop: 8 }}>
                        <HStack justify="space-between" align="center">
                          <Typography variant="caption" style={{ fontWeight: '500' }}>
                            Access Token:
                          </Typography>
                          <Typography
                            variant="caption"
                            color={storedAccessToken ? theme.colors.success.main : theme.colors.text.subtle}
                            numberOfLines={1}
                            style={{ maxWidth: 180, fontWeight: '700' }}
                          >
                            {storedAccessToken ? `${storedAccessToken.substring(0, 15)}...` : 'NOT SET'}
                          </Typography>
                        </HStack>
                        <HStack justify="space-between" align="center">
                          <Typography variant="caption" style={{ fontWeight: '500' }}>
                            Refresh Token:
                          </Typography>
                          <Typography
                            variant="caption"
                            color={storedRefreshToken ? theme.colors.success.main : theme.colors.text.subtle}
                            numberOfLines={1}
                            style={{ maxWidth: 180, fontWeight: '700' }}
                          >
                            {storedRefreshToken ? `${storedRefreshToken.substring(0, 15)}...` : 'NOT SET'}
                          </Typography>
                        </HStack>
                      </VStack>

                      <HStack space="xs" style={{ marginTop: 10, flexWrap: 'wrap', gap: 6 }}>
                        <Button
                          label="Set Mock Tokens"
                          size="sm"
                          onPress={async () => {
                            await secureStorage.setItem('access_token', 'mock_jwt_access_token_value_xyz123');
                            await secureStorage.setItem('refresh_token', 'mock_jwt_refresh_token_value_abc789');
                            await loadSecureTokens();
                            toast.success('SecureStore', 'Mock Access and Refresh tokens saved securely.');
                          }}
                        />
                        <Button
                          label="Clear Tokens"
                          size="sm"
                          variant="outline"
                          onPress={async () => {
                            await secureStorage.removeItem('access_token');
                            await secureStorage.removeItem('refresh_token');
                            await loadSecureTokens();
                            toast.success('SecureStore', 'Tokens cleared from secure storage.');
                          }}
                        />
                        <Button
                          label="Test API Call"
                          size="sm"
                          variant="ghost"
                          onPress={async () => {
                            toast.info('API Call', 'Firing HTTP request via Axios client...');
                            try {
                              await client.get('/users/profile');
                            } catch (err: any) {
                              if (err.response) {
                                toast.info('API Error Catch', `Server returned status ${err.response.status}. Interceptor evaluated auth.`);
                              } else {
                                toast.error('API Error', err.message);
                              }
                            }
                          }}
                        />
                      </HStack>
                    </VStack>
                  </Card>

                  {/* Environment Variables Card */}
                  <Card>
                    <VStack space="sm">
                      <Typography variant="body" style={{ fontWeight: '700' }}>
                        Environment Variables (.env)
                      </Typography>
                      <Typography variant="bodySmall" color={theme.colors.text.subtle}>
                        Type-safe configurations loaded from .env development / production files via process.env.
                      </Typography>

                      <VStack space="xs" style={{ marginTop: 8 }}>
                        <HStack justify="space-between" align="center">
                          <Typography variant="caption" style={{ fontWeight: '500' }}>
                            APP_ENV:
                          </Typography>
                          <Typography variant="caption" style={{ fontWeight: '700' }} color={theme.colors.primary}>
                            {process.env.EXPO_PUBLIC_APP_ENV || 'NOT LOADED'}
                          </Typography>
                        </HStack>
                        <HStack justify="space-between" align="center">
                          <Typography variant="caption" style={{ fontWeight: '500' }}>
                            API_URL:
                          </Typography>
                          <Typography variant="caption" style={{ fontWeight: '700' }}>
                            {process.env.EXPO_PUBLIC_API_URL || 'NOT LOADED'}
                          </Typography>
                        </HStack>
                        <HStack justify="space-between" align="center">
                          <Typography variant="caption" style={{ fontWeight: '500' }}>
                            API_KEY:
                          </Typography>
                          <Typography variant="caption" style={{ fontWeight: '700' }} numberOfLines={1}>
                            {process.env.EXPO_PUBLIC_API_KEY || 'NOT LOADED'}
                          </Typography>
                        </HStack>
                      </VStack>
                    </VStack>
                  </Card>

                  {/* Empty State Preview */}
                  <Card>
                    <Typography variant="body" style={{ fontWeight: '700', marginBottom: 8 }}>
                      EmptyState Component Preview
                    </Typography>
                    <Box
                      style={{
                        borderWidth: 1,
                        borderColor: theme.colors.border.subtle,
                        borderRadius: theme.radius.md,
                        padding: theme.spacing.md,
                        backgroundColor: theme.colors.background.default,
                      }}
                    >
                      <EmptyState
                        title="No Notifications Yet"
                        description="We will let you know when something exciting happens."
                      />
                    </Box>
                  </Card>

                  {/* Error State Preview */}
                  <Card>
                    <Typography variant="body" style={{ fontWeight: '700', marginBottom: 8 }}>
                      ErrorState Component Preview
                    </Typography>
                    <Box
                      style={{
                        borderWidth: 1,
                        borderColor: theme.colors.border.subtle,
                        borderRadius: theme.radius.md,
                        padding: theme.spacing.md,
                        backgroundColor: theme.colors.background.default,
                      }}
                    >
                      <ErrorState
                        description="Failed to load transaction history."
                        onRetry={() => {
                          toast.success('Retry Triggered', 'Refreshing network data...');
                        }}
                      />
                    </Box>
                  </Card>

                  {/* Advanced Native Features Showcase Card */}
                  <Card>
                    <VStack space="sm">
                      <Typography variant="body" style={{ fontWeight: '700' }}>
                        Advanced Native Integrations
                      </Typography>
                      <Typography variant="bodySmall" color={theme.colors.text.subtle}>
                        Explore boilerplate helpers for In-App Updates, In-App Reviews, Biometric Secure Storage, Share API, and Pull-to-Refresh.
                      </Typography>
                      <Divider />

                      {/* 1. App Updates (EAS Updates) */}
                      <VStack space="xs">
                        <Typography variant="bodySmall" style={{ fontWeight: '600' }}>
                          1. EAS In-App Updates
                        </Typography>
                        <Typography variant="caption" color={theme.colors.text.subtle}>
                          Simulate receiving a background update notification. Clicking the floating banner triggers `Updates.reloadAsync()`.
                        </Typography>
                        <Button
                          label="Simulate Update Available"
                          size="sm"
                          variant="outline"
                          onPress={() => {
                            triggerSimulatedUpdate();
                            toast.info('Updates Simulator', 'Floating update banner has been triggered at the top of the screen!');
                          }}
                          style={{ marginTop: 4 }}
                        />
                      </VStack>
                      <Divider />

                      {/* 2. In-App Review */}
                      <VStack space="xs">
                        <Typography variant="bodySmall" style={{ fontWeight: '600' }}>
                          2. In-App Review (expo-store-review)
                        </Typography>
                        <Typography variant="caption" color={theme.colors.text.subtle}>
                          Request in-app rating dialogue. If supported and enrolled by Apple/Google policies, the native rating prompt opens directly.
                        </Typography>
                        <Button
                          label="Trigger Store Review Prompt"
                          size="sm"
                          variant="outline"
                          onPress={async () => {
                            toast.info('Store Review', 'Requesting native store review prompt...');
                            const success = await storeReview.requestReview();
                            if (success) {
                              toast.success('Store Review', 'Review request completed successfully.');
                            } else {
                              toast.info('Store Review', 'Review prompt is not available or has been rate-limited.');
                            }
                          }}
                          style={{ marginTop: 4 }}
                        />
                      </VStack>
                      <Divider />

                      {/* 3. Pull-To-Refresh */}
                      <VStack space="xs">
                        <Typography variant="bodySmall" style={{ fontWeight: '600' }}>
                          3. Pull-To-Refresh (Themed FlashList)
                        </Typography>
                        <Typography variant="caption" color={theme.colors.text.subtle}>
                          High-performance list scrolling with integrated theme-aware `RefreshControl` spinner and haptics logic.
                        </Typography>
                        <Button
                          label="Go to Todo List Demo"
                          size="sm"
                          variant="outline"
                          onPress={() => router.push('/list')}
                          style={{ marginTop: 4 }}
                        />
                      </VStack>
                      <Divider />

                      {/* 4. Secure Biometric Storage */}
                      <VStack space="xs">
                        <Typography variant="bodySmall" style={{ fontWeight: '600' }}>
                          4. Biometric Storage (expo-local-authentication)
                        </Typography>
                        <Typography variant="caption" color={theme.colors.text.subtle}>
                          Store sensitive data encrypted and retrieve it behind device fingerprint/face verification checks.
                        </Typography>
                        <Typography variant="caption" style={{ fontWeight: '500', color: biometricSupported ? theme.colors.success.main : theme.colors.error.main }}>
                          Biometrics Support: {biometricSupported === null ? 'Checking...' : biometricSupported ? 'AVAILABLE' : 'NOT SUPPORTED / ENROLLED'}
                        </Typography>

                        <Input
                          label="Secret Key Content"
                          value={secretInput}
                          onChangeText={setSecretInput}
                          placeholder="Type secret value here"
                        />

                        <HStack space="sm" style={{ marginTop: 6 }}>
                          <Button
                            label="Save Biometrically"
                            size="sm"
                            style={{ flex: 1 }}
                            onPress={async () => {
                              await secureStorage.setItemSecured('vault_secret', secretInput);
                              toast.success('SecureStore', 'Secret value saved securely.');
                            }}
                          />
                          <Button
                            label="Retrieve"
                            size="sm"
                            variant="outline"
                            style={{ flex: 1 }}
                            onPress={async () => {
                              toast.info('SecureStore', 'Authenticating via TouchID/FaceID...');
                              const val = await secureStorage.getItemSecured('vault_secret', 'Verify identity to view vault data');
                              if (val !== null) {
                                setRetrievedSecured(val);
                                toast.success('Vault Read', 'Credentials decrypted successfully.');
                              } else {
                                toast.error('Vault Read', 'Failed to retrieve secret (Auth failed/not enrolled).');
                              }
                            }}
                          />
                        </HStack>
                        {retrievedSecured && (
                          <Box bg={theme.colors.background.subtle} p="sm" rounded="sm" style={{ marginTop: 8 }}>
                            <Typography variant="caption" style={{ fontWeight: '600' }}>
                              Retrieved Value:
                            </Typography>
                            <Typography variant="bodySmall">{retrievedSecured}</Typography>
                          </Box>
                        )}
                      </VStack>
                      <Divider />

                      {/* 5. Share API */}
                      <VStack space="xs">
                        <Typography variant="bodySmall" style={{ fontWeight: '600' }}>
                          5. Share API (utils/share.ts)
                        </Typography>
                        <Typography variant="caption" color={theme.colors.text.subtle}>
                          Trigger native system sharing drawer. Works for links, images, and text.
                        </Typography>
                        <Button
                          label="Share Expo Starter Kit Link"
                          size="sm"
                          variant="outline"
                          onPress={async () => {
                            const success = await share.shareUrl(
                              'https://github.com/emirrtopaloglu/expo-starter-kit',
                              'Check out this premium Expo SDK 54 Starter Kit!',
                              'Expo Starter Kit'
                            );
                            if (success) {
                              toast.success('Share API', 'Native sharing drawer dismissed.');
                            }
                          }}
                          style={{ marginTop: 4 }}
                        />
                      </VStack>
                    </VStack>
                  </Card>

                  {/* Crash Screen Trigger Card */}
                  <Card style={{ borderColor: theme.colors.error.main, borderWidth: 1 }}>
                    <VStack space="sm">
                      <Typography variant="body" style={{ fontWeight: '700' }} color={theme.colors.error.main}>
                        Global Error Boundary & Crash Test
                      </Typography>
                      <Typography variant="bodySmall" color={theme.colors.text.subtle}>
                        Simulate a render-time JS crash. The app will catch it and show the CrashScreen fallback UI with a Restart button.
                      </Typography>
                      <Button
                        label="Trigger Javascript Crash"
                        onPress={() => setShouldCrash(true)}
                        style={{ backgroundColor: theme.colors.error.main, marginTop: 8 }}
                      />
                    </VStack>
                  </Card>

                  {/* 404 Not Found Page Test Card */}
                  <Card>
                    <VStack space="sm">
                      <Typography variant="body" style={{ fontWeight: '700' }}>
                        404 Screen Test
                      </Typography>
                      <Typography variant="bodySmall" color={theme.colors.text.subtle}>
                        Navigate to a non-existent route to test the custom fully localized 404 (Not Found) screen.
                      </Typography>
                      <Button
                        label="Go to Non-Existent Route"
                        onPress={() => router.push('/non-existent-route-test')}
                        variant="outline"
                        style={{ marginTop: 8 }}
                      />
                    </VStack>
                  </Card>
                </VStack>
              </Box>

              {/* Box spacer for FAB to not overlap content */}
              <Box style={{ height: 80 }} />
              <Box style={{ marginBottom: 40 }}>
                <Button
                  label="Test Permissions Manager"
                  onPress={() => router.push('/design-system/permissions')}
                  variant="outline"
                />
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Screen>
  );
}
