import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { useTheme } from '@/context/ThemeContext';

interface InputProps<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  label: string;
  error?: string;
}

export default function Input<T extends FieldValues>({
  control,
  name,
  label,
  error,
  ...props
}: InputProps<T>) {
  const { activeTheme } = useTheme();
  const styles = getStyles(activeTheme);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholderTextColor={activeTheme === 'dark' ? '#666' : '#999'}
            style={[styles.input, error ? styles.inputError : null]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            {...props}
          />
        )}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const getStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      marginBottom: 15,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 5,
      color: theme === 'dark' ? '#ddd' : '#333',
    },
    input: {
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#333' : '#ddd',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: theme === 'dark' ? '#2a2a2a' : 'white',
      color: theme === 'dark' ? '#fff' : '#000',
    },
    inputError: {
      borderColor: 'red',
    },
    errorText: {
      color: 'red',
      fontSize: 12,
      marginTop: 5,
    },
  });
