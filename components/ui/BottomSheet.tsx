import React from 'react';
import {
  View,
  Modal as RNModal,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Typography } from './Typography';
import { Box } from './Box';
import { X } from 'lucide-react-native';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const BottomSheet = ({ isOpen, onClose, title, children }: BottomSheetProps) => {
  const { theme, isDark } = useTheme();

  return (
    <RNModal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />

          <Box
            bg="paper"
            style={{
              width: '100%',
              borderTopLeftRadius: theme.radius.xl,
              borderTopRightRadius: theme.radius.xl,
              paddingBottom: Platform.OS === 'ios' ? 34 : 16, // Safe area bottom approximation if not using SafeAreaView
              maxHeight: '90%',
            }}
          >
            {/* Handle Bar */}
            <View
              style={{
                alignSelf: 'center',
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: theme.colors.neutral[300],
                marginTop: 12,
                marginBottom: 8,
              }}
            />

            <Box
              px="md"
              pb="md"
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="h4">{title || ' '}</Typography>
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={24} color={theme.colors.text.subtle} />
              </TouchableOpacity>
            </Box>

            <View style={{ paddingHorizontal: theme.spacing.md, paddingBottom: theme.spacing.md }}>
              {children}
            </View>
          </Box>
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
};
