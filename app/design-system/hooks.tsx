import React, { useState, useEffect, useCallback } from 'react';
import { TextInput, View, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Box } from '@/components/ui/Box';
import { VStack, HStack } from '@/components/ui/Stack';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useTheme } from '@/theme/ThemeContext';
import {
  useDebounce,
  useThrottle,
  usePrevious,
  useStorage,
  useAsync,
  useInfiniteList,
  useKeyboard,
  useAppState,
  useNetworkStatus,
  useBottomSheetRef,
  useHeaderHeight,
  useScreenDimensions,
  useSafeArea,
  useTimeout,
  useInterval,
  useCountdown,
  useStopwatch,
  useDeviceInfo,
  useBattery,
  useClipboard,
  useShare,
} from '@/hooks';
import { toast } from '@/utils/toast';
import * as format from '@/utils/format';

export default function HooksTestScreen() {
  const { theme } = useTheme();

  // Format Helpers State
  const [formatNumInput, setFormatNumInput] = useState('1250000');
  const [formatPhoneInput, setFormatPhoneInput] = useState('5551234567');
  const [formatCardInput, setFormatCardInput] = useState('1234567812345678');
  const [formatBytesInput, setFormatBytesInput] = useState('10485760');
  const [formatTextInput, setFormatTextInput] = useState('react native expo starter kit');

  // 1. Debounce & Throttle
  const [inputText, setInputText] = useState('');
  const debouncedText = useDebounce(inputText, 800);
  const throttledText = useThrottle(inputText, 1500);

  // 2. Previous State
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);

  // 3. useStorage (Persisted React State)
  const [persistedString, setPersistedString] = useStorage('hooks_test_persisted_string', 'Initial');

  // 4. useAsync
  const mockAsyncFn = useCallback(() => {
    return new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.3) {
          resolve(`Success data at ${new Date().toLocaleTimeString()}`);
        } else {
          reject(new Error('Random promise rejection error'));
        }
      }, 1500);
    });
  }, []);
  const { data: asyncData, loading: asyncLoading, error: asyncError, execute: runAsync } = useAsync(mockAsyncFn, [mockAsyncFn]);

  // 5. useInfiniteList
  const mockFetchPage = useCallback(async (page: number) => {
    return new Promise<string[]>((resolve) => {
      setTimeout(() => {
        resolve([
          `Page ${page} - Item A`,
          `Page ${page} - Item B`,
          `Page ${page} - Item C`,
        ]);
      }, 800);
    });
  }, []);
  const {
    items: listItems,
    loading: listLoading,
    hasMore: listHasMore,
    loadMore: listLoadMore,
    refresh: listRefresh,
    isRefreshing: listIsRefreshing,
  } = useInfiniteList(mockFetchPage);

  // 6-13. System/UI/Layout hooks
  const { keyboardHeight, isKeyboardVisible } = useKeyboard();
  const appState = useAppState();
  const network = useNetworkStatus();
  const { ref: sheetRef, open: openSheet, close: closeSheet } = useBottomSheetRef();
  const headerHeight = useHeaderHeight();
  const dimensions = useScreenDimensions();
  const insets = useSafeArea();

  // 14. useTimeout
  const [timeoutTriggered, setTimeoutTriggered] = useState(false);
  const { reset: resetTimeout, clear: clearTimeoutHook } = useTimeout(() => {
    setTimeoutTriggered(true);
    toast.success('Timeout', 'Callback executed after 3 seconds!');
  }, 3000);

  // 15. useInterval
  const [intervalCounter, setIntervalCounter] = useState(0);
  const { pause: pauseInterval, resume: resumeInterval } = useInterval(() => {
    setIntervalCounter((prev) => prev + 1);
  }, 1000);

  // 16. useCountdown
  const { remaining: countdownRemaining, isRunning: countdownRunning, start: startCountdown, stop: stopCountdown, reset: resetCountdown } = useCountdown(30);

  // 17. useStopwatch
  const { elapsed: stopwatchElapsed, isRunning: stopwatchRunning, start: startStopwatch, stop: stopStopwatch, reset: resetStopwatch } = useStopwatch();

  // 18. useDeviceInfo
  const deviceInfo = useDeviceInfo();

  // 19. useBattery
  const battery = useBattery();

  // 20. useClipboard
  const { value: clipboardValue, copy: copyToClipboard, paste: pasteFromClipboard } = useClipboard();
  const [clipboardInput, setClipboardInput] = useState('');

  // 21. useShare
  const { shareText, shareUrl } = useShare();

  const handleCopy = () => {
    if (!clipboardInput.trim()) {
      toast.error('Error', 'Please type some text to copy');
      return;
    }
    copyToClipboard(clipboardInput);
    toast.success('Copied', 'Text copied to clipboard!');
  };

  const handlePaste = async () => {
    const text = await pasteFromClipboard();
    if (text) {
      toast.success('Pasted', `Pasted value: "${text}"`);
    } else {
      toast.info('Clipboard Empty', 'No text found in clipboard');
    }
  };

  return (
    <Screen preset="scroll" backgroundColor={theme.colors.background.default}>
      <Stack.Screen options={{ title: 'Hooks Playground', headerShown: true }} />

      <Box p="md">
        <Typography variant="h1" style={{ marginBottom: theme.spacing.xs }}>Hooks Playground</Typography>
        <Typography variant="body" color={theme.colors.text.subtle} style={{ marginBottom: theme.spacing.lg }}>
          Interactive playground to test and verify the custom hook library additions.
        </Typography>

        <VStack space="md">
          {/* 1. Debounce & Throttle */}
          <Card padding="md">
            <Typography variant="h3" style={{ marginBottom: theme.spacing.sm }}>1. Optimization (Debounce & Throttle)</Typography>
            <Input
              label="Interactive Typing Input"
              placeholder="Start typing..."
              value={inputText}
              onChangeText={setInputText}
            />
            <VStack space="xs" style={{ marginTop: theme.spacing.sm }}>
              <Typography variant="bodySmall">Instant: "{inputText}"</Typography>
              <Typography variant="bodySmall" color={theme.colors.primary}>Debounced (800ms): "{debouncedText}"</Typography>
              <Typography variant="bodySmall" color={theme.colors.success.main}>Throttled (1500ms): "{throttledText}"</Typography>
            </VStack>
          </Card>

          {/* 2. Previous State */}
          <Card padding="md">
            <Typography variant="h3" style={{ marginBottom: theme.spacing.sm }}>2. State (usePrevious)</Typography>
            <HStack space="md" align="center">
              <VStack style={{ flex: 1 }}>
                <Typography variant="bodySmall">Current Count: {count}</Typography>
                <Typography variant="bodySmall" color={theme.colors.text.subtle}>Previous Count: {previousCount !== undefined ? previousCount : 'N/A'}</Typography>
              </VStack>
              <Button label="Increment" size="sm" onPress={() => setCount(prev => prev + 1)} />
            </HStack>
          </Card>

          {/* 3. useStorage */}
          <Card padding="md">
            <Typography variant="h3" style={{ marginBottom: theme.spacing.sm }}>3. Storage (useStorage)</Typography>
            <Input
              label="Syncs automatically with AsyncStorage"
              value={persistedString}
              onChangeText={setPersistedString}
            />
            <Typography variant="caption" color={theme.colors.text.subtle} style={{ marginTop: theme.spacing.xs }}>
              This value persists even if you reload the application.
            </Typography>
          </Card>

          {/* 4. useAsync */}
          <Card padding="md">
            <Typography variant="h3" style={{ marginBottom: theme.spacing.sm }}>4. Async Operations (useAsync)</Typography>
            <Typography variant="bodySmall" style={{ marginBottom: theme.spacing.xs }}>
              Status: {asyncLoading ? 'Loading...' : asyncError ? 'Error occurred' : 'Idle / Loaded'}
            </Typography>
            {asyncData && <Typography variant="bodySmall" color={theme.colors.success.main}>{asyncData}</Typography>}
            {asyncError && <Typography variant="bodySmall" color={theme.colors.error.main}>{asyncError.message}</Typography>}
            <Button
              label="Execute Async Promise"
              size="sm"
              isLoading={asyncLoading}
              onPress={() => runAsync().catch(() => {})}
              style={{ marginTop: 8 }}
            />
          </Card>

          {/* 5. useInfiniteList */}
          <Card padding="md">
            <Typography variant="h3" style={{ marginBottom: theme.spacing.sm }}>5. Pagination (useInfiniteList)</Typography>
            <VStack space="xs" style={{ marginBottom: theme.spacing.sm }}>
              {listItems.map((item, idx) => (
                <Typography key={idx} variant="caption">• {item}</Typography>
              ))}
            </VStack>
            <HStack space="sm">
              <Button
                label="Load More"
                size="sm"
                isLoading={listLoading}
                disabled={!listHasMore}
                onPress={listLoadMore}
              />
              <Button
                label="Refresh"
                size="sm"
                variant="outline"
                isLoading={listIsRefreshing}
                onPress={listRefresh}
              />
            </HStack>
          </Card>

          {/* 6-13. System/UI hooks */}
          <Card padding="md">
            <Typography variant="h3" style={{ marginBottom: theme.spacing.sm }}>6-13. System, UI & Layout Hooks</Typography>
            <VStack space="xs">
              <Typography variant="bodySmall">Keyboard Visible: {isKeyboardVisible ? 'Yes' : 'No'} (Height: {keyboardHeight}px)</Typography>
              <Typography variant="bodySmall">AppState: "{appState}"</Typography>
              <Typography variant="bodySmall">Network status: {network.isConnected ? 'Online' : 'Offline'} ({network.type || 'N/A'})</Typography>
              <Typography variant="bodySmall">Header Height: {headerHeight}px</Typography>
              <Typography variant="bodySmall">Dimensions: {dimensions.width}x{dimensions.height} ({dimensions.isTablet ? 'Tablet' : 'Phone'})</Typography>
              <Typography variant="bodySmall">SafeArea Insets: T:{insets.top} B:{insets.bottom} L:{insets.left} R:{insets.right}</Typography>
            </VStack>
          </Card>

          {/* 14. useTimeout */}
          <Card padding="md">
            <Typography variant="h3" style={{ marginBottom: theme.spacing.sm }}>14. Timeouts (useTimeout)</Typography>
            <Typography variant="bodySmall" style={{ marginBottom: theme.spacing.xs }}>
              Status: {timeoutTriggered ? 'Triggered' : 'Waiting for 3s timer...'}
            </Typography>
            <HStack space="sm">
              <Button label="Reset Timer" size="sm" onPress={() => { setTimeoutTriggered(false); resetTimeout(); }} />
              <Button label="Cancel Timer" size="sm" variant="outline" onPress={clearTimeoutHook} />
            </HStack>
          </Card>

          {/* 15. useInterval */}
          <Card padding="md">
            <Typography variant="h3" style={{ marginBottom: theme.spacing.sm }}>15. Intervals (useInterval)</Typography>
            <Typography variant="bodySmall" style={{ marginBottom: theme.spacing.xs }}>
              Tick Count: {intervalCounter}
            </Typography>
            <HStack space="sm">
              <Button label="Pause" size="sm" onPress={pauseInterval} />
              <Button label="Resume" size="sm" variant="outline" onPress={resumeInterval} />
            </HStack>
          </Card>

          {/* 16. useCountdown */}
          <Card padding="md">
            <Typography variant="h3" style={{ marginBottom: theme.spacing.sm }}>16. Countdown (useCountdown)</Typography>
            <Typography variant="bodySmall" style={{ marginBottom: theme.spacing.xs }}>
              Time Remaining: {countdownRemaining}s {countdownRunning ? '(Running)' : '(Stopped)'}
            </Typography>
            <HStack space="sm">
              <Button label="Start" size="sm" onPress={startCountdown} />
              <Button label="Stop" size="sm" variant="outline" onPress={stopCountdown} />
              <Button label="Reset" size="sm" variant="outline" onPress={resetCountdown} />
            </HStack>
          </Card>

          {/* 17. useStopwatch */}
          <Card padding="md">
            <Typography variant="h3" style={{ marginBottom: theme.spacing.sm }}>17. Stopwatch (useStopwatch)</Typography>
            <Typography variant="bodySmall" style={{ marginBottom: theme.spacing.xs }}>
              Elapsed Time: {(stopwatchElapsed / 1000).toFixed(2)}s
            </Typography>
            <HStack space="sm">
              <Button label="Start" size="sm" onPress={startStopwatch} />
              <Button label="Stop" size="sm" variant="outline" onPress={stopStopwatch} />
              <Button label="Reset" size="sm" variant="outline" onPress={resetStopwatch} />
            </HStack>
          </Card>

          {/* 18. useDeviceInfo */}
          <Card padding="md">
            <Typography variant="h3" style={{ marginBottom: theme.spacing.sm }}>18. Device Info (useDeviceInfo)</Typography>
            <VStack space="xs">
              <Typography variant="caption">• Platform: {deviceInfo.platform} (OS Version: {deviceInfo.osVersion})</Typography>
              <Typography variant="caption">• App Version: {deviceInfo.appVersion} (Build: {deviceInfo.buildNumber})</Typography>
              <Typography variant="caption">• Device Name: {deviceInfo.deviceName || 'Simulator/Unknown'}</Typography>
              <Typography variant="caption">• Device ID: {deviceInfo.deviceId || 'N/A'}</Typography>
            </VStack>
          </Card>

          {/* 19. useBattery */}
          <Card padding="md">
            <Typography variant="h3" style={{ marginBottom: theme.spacing.sm }}>19. Battery (useBattery)</Typography>
            <Typography variant="bodySmall">
              Level: {battery.level !== null ? `${battery.level}%` : 'Loading...'} {battery.isCharging ? '(Charging)' : '(Not Charging)'}
            </Typography>
          </Card>

          {/* 20. useClipboard */}
          <Card padding="md">
            <Typography variant="h3" style={{ marginBottom: theme.spacing.sm }}>20. Clipboard (useClipboard)</Typography>
            <Input
              label="Type text to copy"
              placeholder="Hello world..."
              value={clipboardInput}
              onChangeText={setClipboardInput}
            />
            <HStack space="sm" style={{ marginTop: theme.spacing.xs }}>
              <Button label="Copy" size="sm" onPress={handleCopy} />
              <Button label="Paste" size="sm" variant="outline" onPress={handlePaste} />
            </HStack>
            {clipboardValue && (
              <Typography variant="caption" color={theme.colors.text.subtle} style={{ marginTop: theme.spacing.xs }}>
                Current Clipboard Value: "{clipboardValue}"
              </Typography>
            )}
          </Card>

          {/* 21. useShare */}
          <Card padding="md">
            <Typography variant="h3" style={{ marginBottom: theme.spacing.sm }}>21. Native Sharing (useShare)</Typography>
            <HStack space="sm">
              <Button
                label="Share Text"
                size="sm"
                onPress={() => shareText('Hello from Expo Starter Kit hooks test!', 'Test Share')}
              />
              <Button
                label="Share Link"
                size="sm"
                variant="outline"
                onPress={() => shareUrl('https://expo.dev', 'Check out Expo Starter Kit!', 'Expo Share')}
              />
            </HStack>
          </Card>

          {/* 22. Format Helpers */}
          <Card padding="md">
            <Typography variant="h3" style={{ marginBottom: theme.spacing.sm }}>22. Format Helpers (utils/format.ts)</Typography>
            <VStack space="md">
              <Box>
                <Typography variant="bodySmall" style={{ fontWeight: 'bold', marginBottom: 4 }}>Date & Relative Time</Typography>
                <Typography variant="caption">Date: {format.formatDate(new Date())}</Typography>
                <Typography variant="caption">Relative (5 mins ago): {format.formatRelativeTime(Date.now() - 1000 * 60 * 5)}</Typography>
                <Typography variant="caption">Relative (in 2 hours): {format.formatRelativeTime(Date.now() + 1000 * 60 * 60 * 2)}</Typography>
              </Box>

              <Box>
                <Input
                  label="Number Input (Currency & Compact)"
                  keyboardType="numeric"
                  value={formatNumInput}
                  onChangeText={setFormatNumInput}
                />
                <HStack space="md" style={{ marginTop: 4 }}>
                  <Typography variant="caption">Currency: {format.formatCurrency(Number(formatNumInput) || 0)}</Typography>
                  <Typography variant="caption">Compact: {format.formatCompactNumber(Number(formatNumInput) || 0)}</Typography>
                </HStack>
              </Box>

              <Box>
                <Input
                  label="Bytes Input (File Size)"
                  keyboardType="numeric"
                  value={formatBytesInput}
                  onChangeText={setFormatBytesInput}
                />
                <Typography variant="caption" style={{ marginTop: 4 }}>
                  Formatted Size: {format.formatBytes(Number(formatBytesInput) || 0)}
                </Typography>
              </Box>

              <Box>
                <Input
                  label="Phone Number Input"
                  keyboardType="numeric"
                  value={formatPhoneInput}
                  onChangeText={setFormatPhoneInput}
                />
                <Typography variant="caption" style={{ marginTop: 4 }}>
                  Formatted Phone: {format.formatPhoneNumber(formatPhoneInput)}
                </Typography>
              </Box>

              <Box>
                <Input
                  label="Card Number Input"
                  keyboardType="numeric"
                  value={formatCardInput}
                  onChangeText={setFormatCardInput}
                />
                <Typography variant="caption" style={{ marginTop: 4 }}>
                  Masked Card: {format.maskCard(formatCardInput)}
                </Typography>
              </Box>

              <Box>
                <Input
                  label="Text Input (Capitalize & Truncate)"
                  value={formatTextInput}
                  onChangeText={setFormatTextInput}
                />
                <HStack space="md" style={{ marginTop: 4 }}>
                  <Typography variant="caption">Capitalized: {format.capitalize(formatTextInput)}</Typography>
                  <Typography variant="caption">Truncated (10 chars): {format.truncate(formatTextInput, 10)}</Typography>
                </HStack>
              </Box>
            </VStack>
          </Card>
        </VStack>
      </Box>
    </Screen>
  );
}
