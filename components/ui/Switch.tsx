import React from 'react';
import {
  Switch as NativeSwitch,
  SwitchProps as NativeSwitchProps,
  View,
  Platform,
} from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Typography } from './Typography';

interface SwitchProps extends NativeSwitchProps {
  label?: string;
  error?: string;
}

export const Switch = ({ value, onValueChange, label, error, ...props }: SwitchProps) => {
  const { theme } = useTheme();

  const switchControl = (
    <NativeSwitch
      value={value}
      onValueChange={onValueChange}
      trackColor={{
        false: theme.colors.neutral[300],
        true: theme.colors.primary,
      }}
      thumbColor={Platform.OS === 'android' ? theme.colors.neutral.white : undefined}
      ios_backgroundColor={theme.colors.neutral[300]}
      {...props}
    />
  );

  if (label) {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: error ? theme.spacing.xs : 0,
          }}
        >
          <Typography variant="body">{label}</Typography>
          {switchControl}
        </View>
        {error && (
          <Typography variant="caption" color={theme.colors.error.main}>
            {error}
          </Typography>
        )}
      </View>
    );
  }

  return (
    <View>
      {switchControl}
      {error && (
        <Typography
          variant="caption"
          color={theme.colors.error.main}
          style={{ marginTop: theme.spacing.xs }}
        >
          {error}
        </Typography>
      )}
    </View>
  );
};
