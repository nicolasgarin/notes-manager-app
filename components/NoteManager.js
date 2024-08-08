import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

const NoteManager = () => {
  const [notes, setNotes] = useState([]);
  const [newNoteColor, setNewNoteColor] = useState('#9b59b6');
  const [newNoteText, setNewNoteText] = useState('');
  const [expandedNoteId, setExpandedNoteId] = useState(null);

  const colors = ['#9b59b6', '#3498db', '#2ecc71', '#e67e22', '#e74c3c'];

  const createNote = () => {
    if (newNoteText.trim() !== '') {
      setNotes([
        ...notes,
        { id: Date.now(), text: newNoteText, color: newNoteColor },
      ]);
      setNewNoteText('');
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
    setExpandedNoteId(null);
  };

  const toggleExpansion = (id) => {
    setExpandedNoteId(expandedNoteId === id ? null : id);
  };

  const updateNoteColor = (id, color) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, color } : note
      )
    );
  };

  const updateNoteText = (id, text) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, text } : note
      )
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Mis Notas</Text>
        <TouchableOpacity style={styles.addNoteButton} onPress={createNote}>
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu nueva nota..."
          value={newNoteText}
          onChangeText={setNewNoteText}
        />
        <View style={styles.colorPicker}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                newNoteColor === color && styles.selectedColor,
              ]}
              onPress={() => setNewNoteColor(color)}
            >
              <View style={[styles.colorPreview, { backgroundColor: color }]} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <ScrollView style={styles.notesContainer}>
        <View style={styles.notesGrid}>
          {notes.map((note) => (
            <TouchableOpacity
              key={note.id}
              style={[
                styles.noteCard,
                { backgroundColor: note.color },
                expandedNoteId === note.id && styles.expandedNote,
              ]}
              onPress={() => toggleExpansion(note.id)}
            >
              <Text style={styles.noteText}>{note.text}</Text>
              {expandedNoteId === note.id && (
                <View style={styles.expandedControls}>
                  <TextInput
                    style={styles.expandedInput}
                    value={note.text}
                    onChangeText={(text) => updateNoteText(note.id, text)}
                  />
                  <View style={styles.colorPicker}>
                    {colors.map((color) => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorOption,
                          note.color === color && styles.selectedColor,
                        ]}
                        onPress={() => updateNoteColor(note.id, color)}
                      >
                        <View
                          style={[styles.colorPreview, { backgroundColor: color }]}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteNote(note.id)}
                  >
                    <Feather name="trash-2" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addNoteButton: {
    backgroundColor: '#9b59b6',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  colorPicker: {
    flexDirection: 'row',
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: 'white',
  },
  notesContainer: {
    flex: 1,
  },
  notesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  noteCard: {
    width: '48%',
    backgroundColor: '#9b59b6',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  expandedNote: {
    width: '100%',
  },
  noteText: {
    fontSize: 16,
    color: 'white',
  },
  expandedControls: {
    marginTop: 12,
  },
  expandedInput: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
});

export default NoteManager;