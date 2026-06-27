import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeContext';
import { Screen } from '@/components/ui/Screen';
import { Box } from '@/components/ui/Box';
import { VStack, HStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Check, X, ShieldAlert, Sparkles } from 'lucide-react-native';
import { toast } from '@/utils/toast';
import { haptics } from '@/utils/haptics';

export default function PaywallScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();

  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');
  const [isBuying, setIsBuying] = useState(false);

  const features = [
    t('protected.paywall.feature1'),
    t('protected.paywall.feature2'),
    t('protected.paywall.feature3'),
    t('protected.paywall.feature4'),
    t('protected.paywall.feature5'),
  ];

  const handleSubscribe = async () => {
    setIsBuying(true);
    haptics.impact();

    try {
      // Simulate Stripe/RevenueCat purchase flow
      await new Promise((resolve) => setTimeout(resolve, 2000));

      haptics.notification(haptics.Notification.Success);
      toast.success(
        t('protected.paywall.subscribeSuccessTitle'),
        t('protected.paywall.subscribeSuccessMessage')
      );
      router.back();
    } catch {
      haptics.notification(haptics.Notification.Error);
      toast.error('Payment Error', 'Purchase was canceled or transaction failed.');
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <Screen
      preset="scroll"
      safeAreaEdges={['top', 'bottom']}
      backgroundColor={theme.colors.background.default}
      contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
    >
      {/* Header bar with close button */}
      <HStack
        justify="space-between"
        align="center"
        style={{ paddingHorizontal: theme.spacing.lg, height: 48 }}
      >
        <Typography variant="body" style={{ fontWeight: '700' }} color={theme.colors.primary}>
          {t('protected.paywall.header')}
        </Typography>
        <Button
          label=""
          variant="ghost"
          onPress={() => router.back()}
          leftIcon={<X size={20} color={theme.colors.text.default} />}
          style={{ width: 40, height: 40, padding: 0 }}
        />
      </HStack>

      <Box p="md">
        <VStack space="lg">
          {/* Pitch Banner */}
          <Box style={{ alignItems: 'center', marginVertical: theme.spacing.sm }}>
            <Box
              bg={theme.colors.success.light}
              p="md"
              rounded="full"
              style={{ marginBottom: theme.spacing.sm }}
            >
              <Sparkles size={28} color={theme.colors.success.main} />
            </Box>
            <Typography variant="h2" align="center" style={{ fontWeight: '800' }}>
              {t('protected.paywall.header')}
            </Typography>
            <Typography
              variant="bodySmall"
              color={theme.colors.text.subtle}
              align="center"
              style={{ marginTop: theme.spacing.xs }}
            >
              {t('protected.paywall.subtitle')}
            </Typography>
          </Box>

          {/* Features Checklist */}
          <VStack space="sm" style={{ paddingHorizontal: theme.spacing.xs }}>
            {features.map((feature, idx) => (
              <HStack key={idx} space="sm" align="center">
                <Box bg={theme.colors.success.light} p="xs" style={{ borderRadius: 999 }}>
                  <Check size={14} color={theme.colors.success.main} />
                </Box>
                <Typography
                  variant="bodySmall"
                  color={theme.colors.text.default}
                  style={{ flex: 1 }}
                >
                  {feature}
                </Typography>
              </HStack>
            ))}
          </VStack>

          {/* Plans selection list */}
          <VStack space="md" style={{ marginTop: theme.spacing.sm }}>
            {/* Annual Card */}
            <Card
              onPress={() => setSelectedPlan('annual')}
              style={{
                borderColor:
                  selectedPlan === 'annual' ? theme.colors.primary : theme.colors.border.default,
                borderWidth: selectedPlan === 'annual' ? 2 : 1,
                padding: theme.spacing.md,
                backgroundColor:
                  selectedPlan === 'annual'
                    ? theme.colors.background.paper
                    : theme.colors.background.card,
              }}
            >
              <HStack justify="space-between" align="center">
                <VStack space="xs" style={{ flex: 1 }}>
                  <HStack space="xs" align="center">
                    <Typography variant="body" style={{ fontWeight: '700' }}>
                      {t('protected.paywall.planAnnual')}
                    </Typography>
                    <Badge
                      label={t('protected.paywall.popular')}
                      variant="solid"
                      colorScheme="success"
                      size="sm"
                    />
                  </HStack>
                  <Typography variant="caption" color={theme.colors.text.subtle}>
                    {t('protected.paywall.planAnnualDetail')}
                  </Typography>
                </VStack>
                <Typography variant="h3" style={{ fontWeight: '800' }}>
                  {t('protected.paywall.planAnnualPrice')}
                </Typography>
              </HStack>
            </Card>

            {/* Monthly Card */}
            <Card
              onPress={() => setSelectedPlan('monthly')}
              style={{
                borderColor:
                  selectedPlan === 'monthly' ? theme.colors.primary : theme.colors.border.default,
                borderWidth: selectedPlan === 'monthly' ? 2 : 1,
                padding: theme.spacing.md,
                backgroundColor:
                  selectedPlan === 'monthly'
                    ? theme.colors.background.paper
                    : theme.colors.background.card,
              }}
            >
              <HStack justify="space-between" align="center">
                <VStack space="xs" style={{ flex: 1 }}>
                  <Typography variant="body" style={{ fontWeight: '700' }}>
                    {t('protected.paywall.planMonthly')}
                  </Typography>
                  <Typography variant="caption" color={theme.colors.text.subtle}>
                    {t('protected.paywall.planMonthlyDetail')}
                  </Typography>
                </VStack>
                <Typography variant="h3" style={{ fontWeight: '800' }}>
                  {t('protected.paywall.planMonthlyPrice')}
                </Typography>
              </HStack>
            </Card>
          </VStack>
        </VStack>
      </Box>

      {/* Footer checkout actions */}
      <VStack
        space="md"
        style={{ paddingHorizontal: theme.spacing.xl, paddingBottom: theme.spacing.lg }}
      >
        <Button
          label={t('protected.paywall.subscribe')}
          onPress={handleSubscribe}
          isLoading={isBuying}
          leftIcon={<Sparkles size={20} color="white" />}
          style={{ height: 50 }}
        />

        <HStack space="sm" justify="center" align="center">
          <ShieldAlert size={16} color={theme.colors.text.subtle} />
          <Typography variant="caption" color={theme.colors.text.subtle}>
            {t('protected.paywall.secured')}
          </Typography>
        </HStack>
      </VStack>
    </Screen>
  );
}
