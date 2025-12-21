import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Stack } from 'expo-router';
import { Box } from '@/components/ui/Box';
import { VStack, HStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useTheme } from '@/theme/ThemeContext';
import { Info, AlertTriangle, Moon, Sun } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
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

  return (
    <Screen preset="scroll" backgroundColor={theme.colors.background.default}>
      <Stack.Screen options={{ title: 'Design System' }} />
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

              <Divider label="OR" />

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

                  <HStack space="md">
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

              {/* Box spacer for FAB to not overlap content */}
              <Box style={{ height: 80 }} />
            </VStack>
          </Box>
        </VStack>
      </Box>
      {/* Closing Kitchen Sink Padding Box */}
      {/* FAB Floating */}
      <FAB
        icon={<BoxIcon color="white" size={24} />}
        onPress={() => console.log('FAB')}
        label="New"
        style={{ position: 'absolute', right: 16, bottom: 16 }}
      />
    </Screen>
  );
}
