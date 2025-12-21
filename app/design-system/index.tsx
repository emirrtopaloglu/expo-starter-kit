import React from 'react';
import { ScrollView, Switch } from 'react-native';
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

export default function DesignSystemScreen() {
  const { theme, setThemePreference, isDark } = useTheme();

  const toggleTheme = () => {
    setThemePreference(isDark ? 'light' : 'dark');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Design System' }} />
      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        style={{ backgroundColor: theme.colors.background.default }}
      >
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
        </VStack>
      </ScrollView>
    </>
  );
}
