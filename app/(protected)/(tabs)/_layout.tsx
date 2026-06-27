import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '@/theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Home, Settings } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function TabsLayout() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.subtle,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 28 : 20,
          left: 20,
          right: 20,
          height: 64,
          borderRadius: 24,
          backgroundColor:
            theme.mode === 'dark' ? 'rgba(28, 28, 30, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          borderWidth: 1,
          borderColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
          elevation: 8,
          paddingBottom: Platform.OS === 'ios' ? 0 : 4,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.families.medium,
          fontSize: 10,
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: Platform.OS === 'ios' ? 4 : 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('protected.tabs.home'),
          tabBarIcon: ({ color }) => <Home size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('protected.tabs.settings'),
          tabBarIcon: ({ color }) => <Settings size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
