import React, { ReactElement } from 'react';
import { View, ScrollView, StyleProp, ViewStyle, RefreshControl } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Box } from './Box';

interface MasonryListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => ReactElement;
  numColumns?: number; // Currently simplified to 2-column primarily
  contentContainerStyle?: StyleProp<ViewStyle>;
  keyExtractor?: (item: T) => string;
  refreshing?: boolean;
  onRefresh?: () => void;
  ListHeaderComponent?: ReactElement;
  ListEmptyComponent?: ReactElement;
}

export function MasonryList<T>({
  data,
  renderItem,
  numColumns = 2,
  contentContainerStyle,
  keyExtractor,
  refreshing = false,
  onRefresh,
  ListHeaderComponent,
  ListEmptyComponent,
}: MasonryListProps<T>) {
  const { theme } = useTheme();

  // Split data into columns
  const columns: T[][] = Array.from({ length: numColumns }, () => []);

  data.forEach((item, index) => {
    columns[index % numColumns].push(item);
  });

  if (data.length === 0 && ListEmptyComponent) {
    return (
      <ScrollView
        contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
        refreshControl={
          onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined
        }
      >
        {ListHeaderComponent}
        {ListEmptyComponent}
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined
      }
    >
      {ListHeaderComponent}

      <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
        {columns.map((col, colIndex) => (
          <View key={colIndex} style={{ flex: 1, gap: theme.spacing.md }}>
            {col.map((item, indexInCol) => {
              // Calculate original index if needed (approximate for 2 cols: indexInCol * 2 + colIndex)
              // But usually irrelevant for renderItem logic unless passing absolute index.
              // We'll pass the list index of the item.
              const originalIndex = data.indexOf(item);
              return (
                <View key={keyExtractor ? keyExtractor(item) : originalIndex}>
                  {renderItem(item, originalIndex)}
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
