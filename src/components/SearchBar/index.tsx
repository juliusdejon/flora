import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchBar = () => {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        autoCapitalize="none"
        style={styles.searchInput}
        placeholder="Search..."
        placeholderTextColor="#888"
      />
      <Ionicons name="ios-search" size={20} style={styles.searchIcon} />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    padding: 10,
  },
  searchIcon: {
    color: "#8A8A8F",
    paddingLeft: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
});

export default SearchBar;
