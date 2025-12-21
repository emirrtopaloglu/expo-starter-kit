import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Typography } from './Typography';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTabId: string;
  onTabChange: (id: string) => void;
}

export const Tabs = ({ tabs, activeTabId, onTabChange }: TabsProps) => {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ borderBottomWidth: 1, borderBottomColor: theme.colors.border.subtle }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => {
            const isActive = activeTabId === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => onTabChange(tab.id)}
                style={{
                  paddingVertical: theme.spacing.md,
                  paddingHorizontal: theme.spacing.lg,
                  borderBottomWidth: 2,
                  borderBottomColor: isActive ? theme.colors.primary : 'transparent',
                }}
              >
                <Typography
                  variant="body"
                  style={{
                    fontWeight: isActive ? '700' : '500',
                    color: isActive ? theme.colors.primary : theme.colors.text.subtle,
                  }}
                >
                  {tab.label}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <View style={{ padding: theme.spacing.md, flex: 1 }}>
        {tabs.find((t) => t.id === activeTabId)?.content}
      </View>
    </View>
  );
};
