import React, { useState, useMemo } from 'react';
import { TouchableOpacity, View, FlatList, InteractionManager } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Typography } from './Typography';
import { Box } from './Box';
import { Input } from './Input';
import { BottomSheet } from './BottomSheet';
import { SearchBar } from './SearchBar';
import { ChevronDown, Check, Search, X } from 'lucide-react-native';

interface SelectOption {
  label: string;
  value: string | number;
  [key: string]: any; // Allow extra data
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  value?: string | number | (string | number)[]; // Support array for multiple
  options: SelectOption[];
  onChange: (value: any) => void;
  error?: string;
  searchable?: boolean;
  disabled?: boolean;
  multiple?: boolean;
}

export const Select = ({
  label,
  placeholder = 'Select an option',
  value,
  options,
  onChange,
  error,
  searchable = false,
  disabled = false,
  multiple = false,
}: SelectProps) => {
  const { theme, isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Helper to check if selected
  const isValueSelected = (val: string | number) => {
    if (multiple && Array.isArray(value)) {
      return value.includes(val);
    }
    return value === val;
  };

  const getDisplayValue = () => {
    if (multiple && Array.isArray(value) && value.length > 0) {
      // For multiple, show "X selected" or join labels if few
      const selectedLabels = options
        .filter((opt) => value.includes(opt.value))
        .map((opt) => opt.label);

      if (selectedLabels.length === 0) return '';
      if (selectedLabels.length <= 2) return selectedLabels.join(', ');
      return `${selectedLabels.length} selected`;
    }
    const selected = options.find((opt) => opt.value === value);
    return selected ? selected.label : '';
  };

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    return options.filter((opt) => opt.label.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [options, searchQuery]);

  const handleSelect = (val: string | number) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? [...value] : [];
      if (currentValues.includes(val)) {
        // Remove
        onChange(currentValues.filter((v) => v !== val));
      } else {
        // Add
        onChange([...currentValues, val]);
      }
      // Do NOT close on select for multiple
    } else {
      onChange(val);
      // Slight delay to allow visual feedback interaction before closing
      setTimeout(() => {
        setIsOpen(false);
        setSearchQuery(''); // Reset search
      }, 150);
    }
  };

  const renderItem = ({ item }: { item: SelectOption }) => {
    const isSelected = isValueSelected(item.value);
    return (
      <TouchableOpacity
        onPress={() => handleSelect(item.value)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border.subtle,
          backgroundColor: isSelected
            ? isDark
              ? theme.colors.neutral[800]
              : theme.colors.neutral[50]
            : 'transparent',
        }}
      >
        <Typography
          variant="body"
          style={{
            fontWeight: isSelected ? '600' : '400',
            color: isSelected ? theme.colors.primary : theme.colors.text.default,
          }}
        >
          {item.label}
        </Typography>
        {isSelected && <Check size={20} color={theme.colors.primary} />}
      </TouchableOpacity>
    );
  };

  // Trigger Component
  const renderTrigger = () => {
    const displayRes = getDisplayValue();
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        <View pointerEvents="none">
          <Input
            label={label}
            placeholder={placeholder}
            value={displayRes}
            editable={false}
            error={error}
            rightIcon={<ChevronDown size={20} color={theme.colors.text.subtle} />}
            style={{
              color: !displayRes ? theme.colors.text.subtle : theme.colors.text.default,
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {renderTrigger()}

      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title={label || placeholder}>
        <View style={{ height: 400 }}>
          {searchable && (
            <Box mb="sm">
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                onClear={() => setSearchQuery('')}
                placeholder="Search options..."
              />
            </Box>
          )}

          <FlatList
            data={filteredOptions}
            renderItem={renderItem}
            keyExtractor={(item) => String(item.value)}
            contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
            showsVerticalScrollIndicator={true}
            ListEmptyComponent={
              <Box p="lg" style={{ alignItems: 'center' }}>
                <Typography color={theme.colors.text.subtle}>No options found.</Typography>
              </Box>
            }
          />

          {multiple && (
            <Box pt="sm" px="sm">
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                style={{
                  backgroundColor: theme.colors.primary,
                  paddingVertical: 12,
                  borderRadius: theme.radius.md,
                  alignItems: 'center',
                }}
              >
                <Typography color="white" style={{ fontWeight: '600' }}>
                  Done
                </Typography>
              </TouchableOpacity>
            </Box>
          )}
        </View>
      </BottomSheet>
    </>
  );
};
