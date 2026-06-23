import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetworkStore } from '@/store/useNetworkStore';
import { useTheme } from '@/theme/ThemeContext';
import { WifiOff } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Typography } from './ui/Typography';
import { HStack } from './ui/Stack';

export const NetworkBanner = () => {
  const { isConnected } = useNetworkStore();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  
  // Animation value
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (!isConnected) {
      // Slide Down
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide Up
      Animated.timing(slideAnim, {
        toValue: -150,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isConnected, slideAnim]);

  // Height and Padding settings
  const statusBarHeight = Platform.OS === 'ios' ? insets.top : 24;
  const bannerHeight = 44;

  return (
    <Animated.View
      style={[
        styles.bannerContainer,
        {
          transform: [{ translateY: slideAnim }],
          backgroundColor: theme.colors.error.main,
          paddingTop: statusBarHeight,
          height: bannerHeight + statusBarHeight,
        },
      ]}
    >
      <HStack space="sm" align="center" justify="center" style={{ flex: 1 }}>
        <WifiOff size={18} color="white" />
        <Typography
          variant="bodySmall"
          style={{ color: 'white', fontWeight: '600' }}
        >
          {t('network.offline')}
        </Typography>
      </HStack>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
