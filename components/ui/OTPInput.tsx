import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';

interface OTPInputProps {
  length?: number;
  onCodeChanged: (code: string) => void;
  error?: boolean;
}

export const OTPInput = ({ length = 4, onCodeChanged, error }: OTPInputProps) => {
  const { theme } = useTheme();
  const [code, setCode] = useState<string[]>(new Array(length).fill(''));
  const inputs = useRef<TextInput[]>([]);

  const processCode = (val: string[]) => {
    const str = val.join('');
    onCodeChanged(str);
  };

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    processCode(newCode);

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
      {code.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            if (ref) inputs.current[index] = ref;
          }}
          style={{
            width: 50,
            height: 50,
            borderRadius: theme.radius.md,
            borderWidth: 1,
            borderColor: error
              ? theme.colors.error.main
              : digit
                ? theme.colors.primary
                : theme.colors.border.default,
            backgroundColor: theme.colors.background.paper,
            color: theme.colors.text.default,
            fontSize: 20,
            fontWeight: '600',
            textAlign: 'center',
          }}
          keyboardType="number-pad"
          maxLength={1}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          selectTextOnFocus
        />
      ))}
    </View>
  );
};
