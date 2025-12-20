import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Stack } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useStore } from "@/store/useStore";
import { Trash2, Plus } from "lucide-react-native";

export default function ListScreen() {
  const { items, addItem, removeItem } = useStore();

  const handleAddItem = () => {
    addItem(`New Item ${items.length + 1}`);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Todo List" }} />

      <View style={styles.header}>
        <Text style={styles.title}>My Tasks</Text>
        <Pressable onPress={handleAddItem} style={styles.addButton}>
          <Plus color="white" size={20} />
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      <View style={styles.listContainer}>
        <FlashList
          data={items}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{item.title}</Text>
              <Pressable onPress={() => removeItem(item.id)}>
                <Trash2 color="red" size={20} />
              </Pressable>
            </View>
          )}
          estimatedItemSize={50}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 5,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  listContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
  },
});
