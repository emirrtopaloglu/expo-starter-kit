import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Box } from './Box';
import { Search, X } from 'lucide-react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export const SearchBar = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
}: SearchBarProps) => {
  const { theme } = useTheme();

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <Box
      bg="paper"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        height: 48,
        borderRadius: theme.radius.full,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
      }}
    >
      <Search
        size={20}
        color={theme.colors.text.subtle}
        style={{ marginRight: theme.spacing.sm }}
      />

      <TextInput
        style={{
          flex: 1,
          color: theme.colors.text.default,
          fontSize: theme.typography.sizes.md,
          fontFamily: theme.typography.families.regular,
          height: '100%',
        }}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.subtle}
        value={value}
        onChangeText={onChangeText}
      />

      {value.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={18} color={theme.colors.text.subtle} />
        </TouchableOpacity>
      )}
    </Box>
  );
};
