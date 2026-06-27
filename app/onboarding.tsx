import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useStore } from '@/store';
import { useTheme } from '@/theme/ThemeContext';
import { Screen } from '@/components/ui/Screen';
import { Box } from '@/components/ui/Box';
import { VStack, HStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { LayoutGrid, Cpu, Smartphone } from 'lucide-react-native';

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const setCompletedOnboarding = useStore((state) => state.setCompletedOnboarding);
  const flatListRef = useRef<FlatList>(null);

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: t('onboarding.slides.0.title'),
      description: t('onboarding.slides.0.description'),
      icon: <LayoutGrid size={48} color="white" />,
    },
    {
      title: t('onboarding.slides.1.title'),
      description: t('onboarding.slides.1.description'),
      icon: <Cpu size={48} color="white" />,
    },
    {
      title: t('onboarding.slides.2.title'),
      description: t('onboarding.slides.2.description'),
      icon: <Smartphone size={48} color="white" />,
    },
  ];

  const handleFinish = () => {
    setCompletedOnboarding(true);
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentSlide + 1, animated: true });
      setCurrentSlide(currentSlide + 1);
    } else {
      handleFinish();
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / windowWidth);
    if (index !== currentSlide && index >= 0 && index < slides.length) {
      setCurrentSlide(index);
    }
  };

  return (
    <Screen safeAreaEdges={['top', 'bottom']} backgroundColor={theme.colors.background.default}>
      {/* Top bar with Skip button */}
      <HStack
        justify="flex-end"
        style={{ paddingHorizontal: theme.spacing.lg, height: 48, alignItems: 'center' }}
      >
        {currentSlide < slides.length - 1 ? (
          <Button
            label={t('onboarding.buttons.skip')}
            variant="ghost"
            size="sm"
            onPress={handleFinish}
          />
        ) : (
          <Box style={{ height: 32 }} /> // Maintain alignment spacer
        )}
      </HStack>

      {/* Swipeable Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Box
            style={{
              width: windowWidth,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: theme.spacing.xl,
            }}
          >
            <VStack space="xl" style={{ alignItems: 'center' }}>
              {/* Icon Badge container */}
              <Box
                bg={theme.colors.primary}
                p="xl"
                style={{
                  borderRadius: theme.radius.xl,
                  ...theme.shadows.sm,
                  marginBottom: theme.spacing.lg,
                }}
              >
                {item.icon}
              </Box>

              <Typography variant="h2" align="center" style={{ fontWeight: '800' }}>
                {item.title}
              </Typography>

              <Typography
                variant="body"
                color={theme.colors.text.subtle}
                align="center"
                style={{ marginTop: theme.spacing.xs, lineHeight: 22 }}
              >
                {item.description}
              </Typography>
            </VStack>
          </Box>
        )}
      />

      {/* Bottom Footer Controls */}
      <VStack
        space="lg"
        style={{ paddingHorizontal: theme.spacing.xl, paddingBottom: theme.spacing.lg }}
      >
        {/* Pagination Dots */}
        <HStack space="sm" justify="center" align="center">
          {slides.map((_, index) => (
            <Box
              key={index}
              style={{
                width: currentSlide === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  currentSlide === index ? theme.colors.primary : theme.colors.border.default,
              }}
            />
          ))}
        </HStack>

        {/* Action Button */}
        <Button
          label={
            currentSlide === slides.length - 1
              ? t('onboarding.buttons.getStarted')
              : t('onboarding.buttons.next')
          }
          onPress={handleNext}
          style={{ width: '100%', height: 50 }}
        />
      </VStack>
    </Screen>
  );
}
