import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  Alert,
} from "react-native";
import { Stack } from "expo-router"; // Correct import for Stack
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Input from "@/components/ui/Input";
import { useTheme } from "@/context/ThemeContext";

const schema = z.object({
  fullName: z.string().min(3, { message: "Required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type FormData = z.infer<typeof schema>;

export default function FormScreen() {
  const { activeTheme } = useTheme();
  const styles = getStyles(activeTheme);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: FormData) => {
    Alert.alert("Form Submitted", JSON.stringify(data, null, 2));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: "Form Demo" }} />

      <Text style={styles.title}>Registration</Text>
      <Text style={styles.subtitle}>Powered by React Hook Form & Zod</Text>

      <View style={styles.form}>
        <Input
          control={control}
          name="fullName"
          label="Full Name"
          placeholder="John Doe"
          error={errors.fullName?.message}
        />

        <Input
          control={control}
          name="email"
          label="Email"
          placeholder="john@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email?.message}
        />

        <Input
          control={control}
          name="password"
          label="Password"
          placeholder="******"
          secureTextEntry
          error={errors.password?.message}
        />

        <View style={styles.buttonContainer}>
          <Button title="Register" onPress={handleSubmit(onSubmit)} />
        </View>
      </View>
    </ScrollView>
  );
}

const getStyles = (theme: "light" | "dark") =>
  StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: theme === "dark" ? "#121212" : "#f5f5f5",
      flexGrow: 1,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme === "dark" ? "#fff" : "#333",
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 16,
      color: theme === "dark" ? "#aaa" : "#666",
      marginBottom: 30,
    },
    form: {
      backgroundColor: theme === "dark" ? "#1e1e1e" : "white",
      padding: 20,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    buttonContainer: {
      marginTop: 10,
    },
  });
