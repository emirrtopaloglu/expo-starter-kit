import React from 'react';
import { ScrollView, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Design System Imports
import { Box } from '@/components/ui/Box';
import { VStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { Checkbox } from '@/components/ui/Checkbox';
import { Radio } from '@/components/ui/Radio';
import { Divider } from '@/components/ui/Divider';
import { useTheme } from '@/theme/ThemeContext';

// Schema Definition
const schema = z.object({
  fullName: z.string().min(3, { message: 'Full name is required (min 3 chars)' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  notifications: z.boolean().optional(),
  gender: z.enum(['male', 'female', 'other'], { message: 'Please select a gender' }),
  acceptedTerms: z
    .boolean()
    .refine((val) => val === true, { message: 'You must accept the terms' }),
});

type FormData = z.infer<typeof schema>;

export default function FormScreen() {
  const { theme } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      notifications: true,
      gender: undefined,
      acceptedTerms: false, // Must be false initially
    },
    mode: 'onBlur',
  });

  const onSubmit = (data: FormData) => {
    Alert.alert('Form Submitted', JSON.stringify(data, null, 2));
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Form Demo' }} />
      <ScrollView
        contentContainerStyle={{ padding: theme.spacing.md, flexGrow: 1 }}
        style={{ backgroundColor: theme.colors.background.default }}
      >
        <VStack space="xl">
          <Box>
            <Typography variant="h2">Registration</Typography>
            <Typography variant="body" color={theme.colors.text.subtle}>
              Powered by React Hook Form & Zod
            </Typography>
          </Box>

          <Box bg="paper" p="md" rounded="lg" shadow="sm">
            <VStack space="lg">
              {/* Text Fields */}
              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Full Name"
                    placeholder="John Doe"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.fullName?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email"
                    placeholder="john@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Password"
                    placeholder="******"
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.password?.message}
                  />
                )}
              />

              <Divider />

              {/* Switches & Checks */}
              <Controller
                control={control}
                name="notifications"
                render={({ field: { onChange, value } }) => (
                  <Switch
                    label="Enable Push Notifications"
                    value={value}
                    onValueChange={onChange}
                  />
                )}
              />

              {/* Radio Group */}
              <Box>
                <Typography variant="bodySmall" style={{ marginBottom: 8, fontWeight: '500' }}>
                  Gender
                </Typography>
                <Controller
                  control={control}
                  name="gender"
                  render={({ field: { onChange, value } }) => (
                    <Radio.Group value={value} onChange={onChange}>
                      <Radio value="male" label="Male" />
                      <Radio value="female" label="Female" />
                      <Radio value="other" label="Other" />
                    </Radio.Group>
                  )}
                />
                {errors.gender && (
                  <Typography
                    variant="caption"
                    color={theme.colors.error.main}
                    style={{ marginTop: 4 }}
                  >
                    {errors.gender.message}
                  </Typography>
                )}
              </Box>

              <Divider />

              {/* Terms Checkbox */}
              <Box>
                <Controller
                  control={control}
                  name="acceptedTerms"
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      label="I agree to the Terms of Service"
                      checked={value}
                      onCheckedChange={onChange}
                    />
                  )}
                />
                {errors.acceptedTerms && (
                  <Typography
                    variant="caption"
                    color={theme.colors.error.main}
                    style={{ marginTop: 4, marginLeft: 32 }}
                  >
                    {errors.acceptedTerms.message}
                  </Typography>
                )}
              </Box>

              {/* Submit Button */}
              <Button label="Register Account" onPress={handleSubmit(onSubmit)} />
            </VStack>
          </Box>
        </VStack>
      </ScrollView>
    </>
  );
}
