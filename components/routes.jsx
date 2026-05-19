import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Navbar = ({ onSelectScreen }) => {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => onSelectScreen('Home')} style={styles.navItem}>
        <Text>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onSelectScreen('New Arrivals')} style={styles.navItem}>
        <Text>New Arrivals</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onSelectScreen('Most Expensive')} style={styles.navItem}>
        <Text>Most Expensive</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onSelectScreen('Budget')} style={styles.navItem}>
        <Text>Budget</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onSelectScreen('Shop Location')} style={styles.navItem}>
        <Text>Shop Location</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  navItem: {
    padding: 5,
  },
});

export default Navbar;