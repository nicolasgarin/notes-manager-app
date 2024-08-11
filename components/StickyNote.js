import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const StickyNote = ({ note, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.note, { backgroundColor: note.color }]}>
        <Text style={styles.noteText} numberOfLines={4}>
          {note.text}
        </Text>
        <View style={styles.foldedCorner} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 16,
  },
  note: {
    flex: 1,
    padding: 16,
    borderRadius: 2,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  noteText: {
    fontFamily: 'amaticSCBold',
    fontSize: 20,
    color: 'white',
  },
  foldedCorner: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    transform: [{ rotate: '45deg' }],
  },
});
