import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StickyNote from "./StickyNote";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const NoteManager = () => {
  const [notes, setNotes] = useState([]);
  const [newNoteColor, setNewNoteColor] = useState("#9b59b6");
  const [newNoteText, setNewNoteText] = useState("");
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const colors = [
    "#9b59b6",
    "#3498db",
    "#2ecc71",
    "#e67e22",
    "#e74c3c",
    "#454545",
  ];

  const saveNotes = async (notesToSave) => {
    try {
      await AsyncStorage.setItem("notes", JSON.stringify(notesToSave));
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  };

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem("notes");
      if (savedNotes !== null) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const savedMode = await AsyncStorage.getItem("isDarkMode");
      if (savedMode !== null) {
        setIsDarkMode(JSON.parse(savedMode));
      }
      await loadNotes();
    };
    loadData();
  }, []);

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem("isDarkMode", JSON.stringify(newMode));
  };

  const createNote = () => {
    if (newNoteText.trim() !== "") {
      const updatedNotes = [
        ...notes,
        { id: Date.now(), text: newNoteText, color: newNoteColor },
      ];
      setNotes(updatedNotes);
      saveNotes(updatedNotes);
      setNewNoteText("");
    }
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    setExpandedNoteId(null);
  };

  const toggleExpansion = (id) => {
    setExpandedNoteId(expandedNoteId === id ? null : id);
  };

  const updateNoteColor = (id, color) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, color } : note
    );
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const updateNoteText = (id, text) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, text } : note
    );
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, isDarkMode && styles.darkText]}>
          Mis Notas
        </Text>
        <TouchableOpacity
          style={styles.darkModeButton}
          onPress={toggleDarkMode}
        >
          <Feather
            name={isDarkMode ? "sun" : "moon"}
            size={24}
            color={isDarkMode ? "white" : "black"}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, isDarkMode && styles.darkInput]}
          placeholder="Escribe tu nueva nota..."
          placeholderTextColor={isDarkMode ? "#999" : "#666"}
          value={newNoteText}
          onChangeText={setNewNoteText}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </View>
      {isInputFocused && (
        <Animated.View 
          style={[
            styles.colorPickerContainer,
            {
              opacity: fadeAnim,
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0]
                })
              }]
            }
          ]}
        >
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
          <TouchableOpacity style={styles.addNoteButton} onPress={createNote}>
            <Feather name="plus" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>
      )}
      <ScrollView style={styles.notesContainer}>
        <View style={styles.notesGrid}>
          {notes.map((note) => (
            <TouchableOpacity
              key={note.id}
              style={[
                styles.noteCard,
                { backgroundColor: note.color },
                expandedNoteId === note.id && styles.expandedNoteCard,
              ]}
              onPress={() => toggleExpansion(note.id)}
            >
              <Text style={styles.noteText}>{note.text}</Text>
              {expandedNoteId === note.id && (
                <View style={styles.expandedControls}>
                  <TextInput
                    style={[
                      styles.expandedInput,
                      isDarkMode && styles.darkExpandedInput,
                    ]}
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
                          style={[
                            styles.colorPreview,
                            { backgroundColor: color },
                          ]}
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
    backgroundColor: "#faf2f2",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontFamily: "amaticSCBold",
    fontSize: 30,
    fontWeight: "regular",
    color: "#000",
  },
  darkText: {
    color: "#fff",
  },
  addNoteButton: {
    backgroundColor: "#9b59b6",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  darkModeButton: {
    padding: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    fontFamily: "amaticSCBold",
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 12,
    color: "#000",
    fontSize: 20,
  },
  darkInput: {
    backgroundColor: "#333",
    color: "#fff",
  },
  colorPickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  colorPicker: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: "white",
  },
  notesContainer: {
    flex: 1,
  },
  notesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  noteCard: {
    width: '100%',
    backgroundColor: '#9b59b6',
    borderRadius: 2,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  expandedNoteCard: {
    transform: [{ scale: 1.02 }],
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    marginBottom: 24,
  },
  noteText: {
    fontFamily: "amaticSCBold",
    fontSize: 24,
    color: "white",
    marginBottom: 8,
  },
  expandedControls: {
    marginTop: 12,
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
  },
  expandedInput: {
    fontFamily: "amaticSCBold",
    fontSize: 16,
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
    color: "#000",
    minHeight: 100,
    textAlignVertical: "top",
  },
  darkExpandedInput: {
    backgroundColor: "#333",
    color: "#fff",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-end",
    marginTop: 8,
  },
});

export default NoteManager;
