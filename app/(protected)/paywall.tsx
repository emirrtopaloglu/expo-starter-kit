import React, { useState, useEffect, useCallback } from 'react';
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
import { revenueCat, PurchasesPackage } from '@/utils/revenueCat';
import { ActivityIndicator } from 'react-native';

export default function PaywallScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();

  const [packages, setPackages] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null);
  const [isBuying, setIsBuying] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isRestoring, setIsRestoring] = useState(false);

  // Fallback mock packages for simulator or unconfigured environments
  const getMockPackages = useCallback(
    () => [
      {
        identifier: 'mock_annual',
        packageType: 'ANNUAL',
        product: {
          title: t('protected.paywall.planAnnual'),
          priceString: t('protected.paywall.planAnnualPrice'),
          description: t('protected.paywall.planAnnualDetail'),
        },
      },
      {
        identifier: 'mock_monthly',
        packageType: 'MONTHLY',
        product: {
          title: t('protected.paywall.planMonthly'),
          priceString: t('protected.paywall.planMonthlyPrice'),
          description: t('protected.paywall.planMonthlyDetail'),
        },
      },
    ],
    [t]
  );

  useEffect(() => {
    async function loadProducts() {
      try {
        const offering = await revenueCat.fetchActiveOfferings();
        if (offering && offering.availablePackages.length > 0) {
          setPackages(offering.availablePackages);
          // Set default selected package to Annual, else first available
          const annualPack = offering.availablePackages.find((p) => p.packageType === 'ANNUAL');
          setSelectedPackage(annualPack || offering.availablePackages[0]);
        } else {
          // Fallback to mocks if no live products configured
          const mocks = getMockPackages();
          setPackages(mocks);
          setSelectedPackage(mocks[0]);
        }
      } catch (error) {
        console.error('Failed to load offerings, loading fallback mock products:', error);
        const mocks = getMockPackages();
        setPackages(mocks);
        setSelectedPackage(mocks[0]);
      } finally {
        setIsLoadingProducts(false);
      }
    }
    loadProducts();
  }, [getMockPackages]);

  const features = [
    t('protected.paywall.feature1'),
    t('protected.paywall.feature2'),
    t('protected.paywall.feature3'),
    t('protected.paywall.feature4'),
    t('protected.paywall.feature5'),
  ];

  const handleSubscribe = async () => {
    if (!selectedPackage) return;
    setIsBuying(true);
    haptics.impact();

    try {
      if (selectedPackage.identifier.startsWith('mock_')) {
        // Simulate mockup purchase flow
        await new Promise((resolve) => setTimeout(resolve, 1500));
        haptics.notification(haptics.Notification.Success);
        toast.success(
          t('protected.paywall.subscribeSuccessTitle'),
          t('protected.paywall.subscribeSuccessMessage') + ' (Mock Success)'
        );
        router.back();
      } else {
        // Real RevenueCat subscription flow
        const success = await revenueCat.purchasePackage(selectedPackage as PurchasesPackage);
        if (success) {
          haptics.notification(haptics.Notification.Success);
          toast.success(
            t('protected.paywall.subscribeSuccessTitle'),
            t('protected.paywall.subscribeSuccessMessage')
          );
          router.back();
        }
      }
    } catch (error: any) {
      haptics.notification(haptics.Notification.Error);
      if (!error.userCancelled) {
        toast.error('Payment Error', error.message || 'Purchase transaction failed.');
      }
    } finally {
      setIsBuying(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    haptics.impact();

    try {
      if (selectedPackage?.identifier.startsWith('mock_')) {
        // Simulate mockup restore
        await new Promise((resolve) => setTimeout(resolve, 1200));
        haptics.notification(haptics.Notification.Success);
        toast.success(
          t('protected.paywall.restoreSuccessTitle'),
          t('protected.paywall.restoreSuccessMessage') + ' (Mock Success)'
        );
      } else {
        // Real RevenueCat restore
        const success = await revenueCat.restorePurchases();
        if (success) {
          haptics.notification(haptics.Notification.Success);
          toast.success(
            t('protected.paywall.restoreSuccessTitle'),
            t('protected.paywall.restoreSuccessMessage')
          );
        } else {
          haptics.notification(haptics.Notification.Warning);
          toast.error('Restore Failed', 'No active subscription entitlements found.');
        }
      }
    } catch {
      haptics.notification(haptics.Notification.Error);
      toast.error('Restore Failed', 'Error communicating with app stores.');
    } finally {
      setIsRestoring(false);
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
            {isLoadingProducts ? (
              <Box style={{ padding: theme.spacing.xl, alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
              </Box>
            ) : (
              packages.map((pack) => {
                const isSelected = selectedPackage?.identifier === pack.identifier;
                const isAnnual = pack.packageType === 'ANNUAL';
                return (
                  <Card
                    key={pack.identifier}
                    onPress={() => setSelectedPackage(pack)}
                    style={{
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border.default,
                      borderWidth: isSelected ? 2 : 1,
                      padding: theme.spacing.md,
                      backgroundColor: isSelected
                        ? theme.colors.background.paper
                        : theme.colors.background.card,
                    }}
                  >
                    <HStack justify="space-between" align="center">
                      <VStack space="xs" style={{ flex: 1 }}>
                        <HStack space="xs" align="center">
                          <Typography variant="body" style={{ fontWeight: '700' }}>
                            {isAnnual
                              ? t('protected.paywall.planAnnual')
                              : t('protected.paywall.planMonthly')}
                          </Typography>
                          {isAnnual && (
                            <Badge
                              label={t('protected.paywall.popular')}
                              variant="solid"
                              colorScheme="success"
                              size="sm"
                            />
                          )}
                        </HStack>
                        <Typography variant="caption" color={theme.colors.text.subtle}>
                          {isAnnual
                            ? t('protected.paywall.planAnnualDetail')
                            : t('protected.paywall.planMonthlyDetail')}
                        </Typography>
                      </VStack>
                      <Typography variant="h3" style={{ fontWeight: '800' }}>
                        {pack.product.priceString}
                      </Typography>
                    </HStack>
                  </Card>
                );
              })
            )}
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
          disabled={isLoadingProducts}
          leftIcon={<Sparkles size={20} color="white" />}
          style={{ height: 50 }}
        />

        <Button
          label={t('protected.paywall.restore')}
          onPress={handleRestore}
          isLoading={isRestoring}
          disabled={isLoadingProducts}
          variant="ghost"
          size="sm"
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
