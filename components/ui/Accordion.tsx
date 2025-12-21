import React, { useState } from 'react';
import { View, LayoutAnimation, TouchableOpacity, Platform, UIManager } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Typography } from './Typography';
import { Box } from './Box';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export const Accordion = ({ title, children, defaultExpanded = false }: AccordionProps) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.subtle,
        overflow: 'hidden',
      }}
    >
      <TouchableOpacity
        onPress={toggle}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.sm,
        }}
      >
        <Typography variant="body" style={{ fontWeight: '600' }}>
          {title}
        </Typography>
        {expanded ? (
          <ChevronUp size={20} color={theme.colors.text.default} />
        ) : (
          <ChevronDown size={20} color={theme.colors.text.default} />
        )}
      </TouchableOpacity>

      {/* Content wrapper for animation */}
      {expanded && (
        <Box p="sm" pb="md">
          {children}
        </Box>
      )}
    </View>
  );
};
