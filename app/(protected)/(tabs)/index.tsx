import React from 'react';
import { useRouter, Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { useStore } from '@/store';
import { useTheme } from '@/theme/ThemeContext';
import { Screen } from '@/components/ui/Screen';
import { Box } from '@/components/ui/Box';
import { VStack, HStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCompactNumber } from '@/utils/format';
import { Sparkles, Users, Activity, HelpCircle, ChevronRight } from 'lucide-react-native';

export default function DashboardScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { user } = useStore();
  const router = useRouter();

  // Mock activity feed items
  const feedItems = [
    { id: '101', title: 'User authentication slice registered', time: '10m ago', author: 'System' },
    {
      id: '102',
      title: 'Axios request token refresh queue compiled',
      time: '1h ago',
      author: 'AuthManager',
    },
    {
      id: '103',
      title: 'Zustand persistent local storage loaded',
      time: '4h ago',
      author: 'StorageEngine',
    },
  ];

  return (
    <Screen
      preset="scroll"
      safeAreaEdges={['top']}
      backgroundColor={theme.colors.background.default}
      contentContainerStyle={{ paddingBottom: 110 }}
    >
      <Box p="md">
        <VStack space="lg">
          {/* Welcome Header */}
          <HStack justify="space-between" align="center">
            <VStack space="xs">
              <Typography variant="caption" color={theme.colors.text.subtle}>
                {t('protected.home.welcome')}
              </Typography>
              <Typography variant="h3" style={{ fontWeight: '800' }}>
                {user?.name || 'User'}
              </Typography>
            </VStack>
            <Badge label="Starter Kit" variant="subtle" colorScheme="primary" />
          </HStack>

          {/* Premium Upsell Card */}
          <Card variant="filled" style={{ backgroundColor: theme.colors.primary, borderWidth: 0 }}>
            <HStack justify="space-between" align="center">
              <VStack space="xs" style={{ flex: 1, marginRight: 12 }}>
                <HStack space="xs" align="center">
                  <Sparkles size={18} color="white" />
                  <Typography variant="bodySmall" style={{ fontWeight: '700', color: 'white' }}>
                    {t('protected.paywall.header')}
                  </Typography>
                </HStack>
                <Typography variant="caption" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                  {t('protected.paywall.subtitle')}
                </Typography>
              </VStack>
              <Button
                label={t('protected.home.viewAll')}
                size="sm"
                variant="solid"
                onPress={() => router.push('/paywall')}
                style={{ backgroundColor: 'white', alignSelf: 'center' }}
                textColor={theme.colors.primary}
              />
            </HStack>
          </Card>

          {/* Stats Grid */}
          <Typography variant="h4" style={{ fontWeight: '700', marginTop: 4 }}>
            {t('protected.home.quickStats')}
          </Typography>

          <HStack space="md">
            <Card style={{ flex: 1, padding: theme.spacing.md }}>
              <VStack space="xs">
                <Users size={20} color={theme.colors.primary} />
                <Typography variant="h2" style={{ fontWeight: '800', marginTop: 4 }}>
                  {formatCompactNumber(1250)}
                </Typography>
                <Typography variant="caption" color={theme.colors.text.subtle}>
                  {t('protected.home.totalUsers')}
                </Typography>
              </VStack>
            </Card>

            <Card style={{ flex: 1, padding: theme.spacing.md }}>
              <VStack space="xs">
                <Activity size={20} color={theme.colors.success.main} />
                <Typography variant="h2" style={{ fontWeight: '800', marginTop: 4 }}>
                  12
                </Typography>
                <Typography variant="caption" color={theme.colors.text.subtle}>
                  {t('protected.home.activeTasks')}
                </Typography>
              </VStack>
            </Card>
          </HStack>

          {/* Activity Feed */}
          <Typography variant="h4" style={{ fontWeight: '700', marginTop: 8 }}>
            {t('protected.home.recentActivity')}
          </Typography>

          <Card padding="none">
            <VStack>
              {feedItems.map((item, index) => (
                <Pressable
                  key={item.id}
                  onPress={() => router.push(`/details/${item.id}`)}
                  style={({ pressed }) => [
                    {
                      padding: theme.spacing.md,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottomWidth: index < feedItems.length - 1 ? 1 : 0,
                      borderBottomColor: theme.colors.border.default,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <VStack space="xs" style={{ flex: 1, marginRight: 8 }}>
                    <Typography variant="bodySmall" style={{ fontWeight: '600' }}>
                      {item.title}
                    </Typography>
                    <HStack space="sm">
                      <Typography variant="caption" color={theme.colors.text.subtle}>
                        {item.time}
                      </Typography>
                      <Typography
                        variant="caption"
                        color={theme.colors.primary}
                        style={{ fontWeight: '500' }}
                      >
                        {item.author}
                      </Typography>
                    </HStack>
                  </VStack>
                  <ChevronRight size={18} color={theme.colors.text.subtle} />
                </Pressable>
              ))}
            </VStack>
          </Card>

          {/* Quick Support Link */}
          <Link href="/support" asChild>
            <Button
              label={t('protected.support.title')}
              variant="outline"
              leftIcon={<HelpCircle size={20} color={theme.colors.text.default} />}
              style={{ marginTop: 8 }}
            />
          </Link>
        </VStack>
      </Box>
    </Screen>
  );
}
