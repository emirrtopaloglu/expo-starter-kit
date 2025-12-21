import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Box } from '@/components/ui/Box';
import { VStack } from '@/components/ui/Stack';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/theme/ThemeContext';
import { useRunPermission } from '@/hooks/useRunPermission';
import { PermissionManager, PermissionType } from '@/utils/PermissionManager';
import * as DocumentPicker from 'expo-document-picker';

export default function PermissionsScreen() {
  const { theme } = useTheme();
  const { executeWithPermission } = useRunPermission();
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  // Function to refresh statuses
  const checkStatuses = async () => {
    const camera = await PermissionManager.check('camera');
    const gallery = await PermissionManager.check('gallery');
    const location = await PermissionManager.check('locationForeground');
    const notifs = await PermissionManager.check('notifications');
    const audio = await PermissionManager.check('audio');

    setStatuses({
      camera: camera.status,
      gallery: gallery.status,
      location: location.status,
      notifications: notifs.status,
      audio: audio.status,
    });
  };

  useEffect(() => {
    checkStatuses();
  }, []);

  const handleTest = (type: PermissionType, label: string) => {
    executeWithPermission(
      type,
      () => {
        Alert.alert('Success', `${label} permission granted and action executed!`);
        checkStatuses();
      },
      () => {
        // Optional denied callback
        checkStatuses();
      }
    );
  };

  const PermissionRow = ({ type, label }: { type: PermissionType; label: string }) => (
    <Card style={{ marginBottom: 12 }}>
      <Box style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4">{label}</Typography>
          <Typography variant="caption" style={{ color: theme.colors.text.subtle, marginTop: 4 }}>
            Status: {statuses[type] || 'loading...'}
          </Typography>
        </Box>
        <Button
          label="Test"
          size="sm"
          onPress={() => handleTest(type, label)}
          style={{ width: 80 }}
        />
      </Box>
    </Card>
  );

  return (
    <Screen preset="scroll" safeAreaEdges={['bottom']}>
      <Stack.Screen options={{ title: 'Permission Manager' }} />

      <Box p="md">
        <Typography variant="body" style={{ marginBottom: 24 }}>
          This screen demonstrates the unified PermissionManager. The buttons below utilize the
          `useRunPermission` hook to handle the full Check &rarr; Request &rarr; Alert flow.
        </Typography>

        <VStack style={{ gap: 16 }}>
          <PermissionRow type="camera" label="Camera" />
          <PermissionRow type="gallery" label="Media Library" />
          <PermissionRow type="locationForeground" label="Location" />
          <PermissionRow type="notifications" label="Notifications" />
          <PermissionRow type="audio" label="Microphone" />
        </VStack>

        <Box mt="xl">
          <Button label="Refresh Statuses" variant="outline" onPress={checkStatuses} />
          <Typography
            variant="caption"
            style={{ textAlign: 'center', marginTop: 16, color: theme.colors.text.subtle }}
          >
            Toggle permissions in system settings to test the "Settings Alert" flow.
          </Typography>
        </Box>

        <Box mt="2xl">
          <Typography variant="h3" style={{ marginBottom: 16 }}>
            System Pickers
          </Typography>
          <Card>
            <Box
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="h4">Document Picker</Typography>
                <Typography
                  variant="caption"
                  style={{ color: theme.colors.text.subtle, marginTop: 4 }}
                >
                  No explicit permission required
                </Typography>
              </Box>
              <Button
                label="Pick File"
                size="sm"
                onPress={async () => {
                  try {
                    const result = await DocumentPicker.getDocumentAsync({
                      type: '*/*',
                      copyToCacheDirectory: true,
                    });
                    if (result.canceled) {
                      Alert.alert('Canceled', 'User canceled document picker');
                    } else {
                      Alert.alert(
                        'Picked',
                        `File: ${result.assets[0].name}\nSize: ${result.assets[0].size} bytes`
                      );
                    }
                  } catch (err) {
                    Alert.alert('Error', 'Failed to pick document');
                  }
                }}
                style={{ width: 100 }}
              />
            </Box>
          </Card>
        </Box>
      </Box>
    </Screen>
  );
}
