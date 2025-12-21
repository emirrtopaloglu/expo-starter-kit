import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Text } from 'react-native';
import { CameraView, CameraType, FlashMode, useCameraPermissions } from 'expo-camera';
import { Stack, useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/theme/ThemeContext';

import { X, Zap, ZapOff, RefreshCcw, Camera } from 'lucide-react-native';

export default function CameraScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    return (
      <Screen
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <Typography variant="h3" style={{ textAlign: 'center', marginBottom: 16 }}>
          We need your permission to show the camera
        </Typography>
        <Button label="Grant Permission" onPress={requestPermission} />
      </Screen>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash((current) => (current === 'off' ? 'on' : 'off'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        Alert.alert('Photo Taken', `Uri: ${photo?.uri}`);
      } catch (e) {
        console.error(e);
        Alert.alert('Error', 'Failed to take photo');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <CameraView style={styles.camera} facing={facing} flash={flash} ref={cameraRef}>
        <Box style={styles.overlay}>
          {/* Top Bar */}
          <Box style={styles.topBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
              <X color="white" size={28} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleFlash} style={styles.iconButton}>
              {flash === 'on' ? (
                <Zap color="#FFD700" size={28} />
              ) : (
                <ZapOff color="white" size={28} />
              )}
            </TouchableOpacity>
          </Box>

          {/* Bottom Bar */}
          <Box style={styles.bottomBar}>
            <TouchableOpacity onPress={toggleCameraFacing} style={styles.iconButton}>
              <RefreshCcw color="white" size={28} />
            </TouchableOpacity>

            <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
              <View style={styles.captureInner} />
            </TouchableOpacity>

            {/* Spacer for layout balance */}
            <View style={{ width: 40 }} />
          </Box>
        </Box>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 60, // Safe area approx
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
  },
  iconButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 50,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
});
