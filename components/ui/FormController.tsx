import React from 'react';
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { View } from 'react-native';

interface FormControllerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T>;
  render: (props: {
    field: { onChange: (value: any) => void; onBlur: () => void; value: any };
    fieldState: { error?: { message?: string } };
  }) => React.ReactElement;
}

export const FormController = <T extends FieldValues>({
  control,
  name,
  rules,
  render,
}: FormControllerProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState }) => (
        <View style={{ marginBottom: 0 }}>
          {render({
            field: { onChange, onBlur, value },
            fieldState,
          })}
        </View>
      )}
    />
  );
};
