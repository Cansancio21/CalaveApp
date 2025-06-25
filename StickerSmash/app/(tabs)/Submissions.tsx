import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSubmissionContext } from "./SubmissionContext";
import { Submission as SubmissionType } from "./_layout";

export default function Submission() {
  const { submissions, deleteSubmission, updateSubmission } = useSubmissionContext();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editItem, setEditItem] = useState<SubmissionType | null>(null);
  const [editName, setEditName] = useState("");
  const [editYear, setEditYear] = useState("");
  const [editCourse, setEditCourse] = useState("");
  const [editGrades, setEditGrades] = useState<{subject: string, grade: string}[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [newGrade, setNewGrade] = useState("");

  const openEditModal = (item: SubmissionType) => {
    setEditItem(item);
    setEditName(item.name);
    setEditYear(item.yearLevel);
    setEditCourse(item.course);
    setEditGrades([...item.grades]);
    setEditModalVisible(true);
  };

  const handleEditSubmit = () => {
    if (!editItem) return;

    const updated: SubmissionType = {
      ...editItem,
      name: editName,
      yearLevel: editYear,
      course: editCourse,
      grades: editGrades,
    };

    updateSubmission(updated);
    setEditModalVisible(false);
    Alert.alert("Updated", "Submission updated successfully.");
  };

  const addGrade = () => {
    if (newSubject && newGrade) {
      setEditGrades([...editGrades, {subject: newSubject, grade: newGrade}]);
      setNewSubject("");
      setNewGrade("");
    }
  };

  const removeGrade = (index: number) => {
    const updatedGrades = [...editGrades];
    updatedGrades.splice(index, 1);
    setEditGrades(updatedGrades);
  };

  const calculateAverageGrade = (grades: { subject: string; grade: string }[]): string => {
    const validGrades = grades
      .map((g) => parseFloat(g.grade))
      .filter((n) => !isNaN(n) && n >= 1.0 && n <= 4.0);

    return validGrades.length > 0
      ? `College Average: ${(validGrades.reduce((a, b) => a + b, 0) / validGrades.length).toFixed(2)}`
      : "No college grades available";
  };

  const renderSubmission = ({ item }: { item: SubmissionType }) => (
    <View style={styles.card}>
      <View style={styles.leftContent}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        <View style={styles.details}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.info}>Year Level: {item.yearLevel}</Text>
          <Text style={styles.info}>Course: {item.course}</Text>
          <Text style={styles.info}>
            {item.grades.length} {item.grades.length === 1 ? "grade" : "grades"}
          </Text>
          <Text style={styles.info}>
            {calculateAverageGrade(item.grades)}
          </Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#FFD700" }]}
          onPress={() => {
            const gradesText = item.grades
              .map((g) => `${g.subject}: ${g.grade}`)
              .join("\n");
            Alert.alert(`View ${item.name}`, gradesText || "No grades submitted.");
          }}
        >
          <Ionicons name="eye-outline" size={18} color="#000" />
          <Text style={[styles.buttonText, { color: "#000" }]}>View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#007AFF" }]}
          onPress={() => openEditModal(item)}
        >
          <Ionicons name="create-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#FF9500" }]}
          onPress={() => {
            const avg = calculateAverageGrade(item.grades);
            Alert.alert(`Average for ${item.name}`, avg);
          }}
        >
          <Ionicons name="calculator-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>Calc</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#FF3B30" }]}
          onPress={() => {
            Alert.alert("Confirm Delete", `Delete ${item.name}?`, [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => deleteSubmission(item.id),
              },
            ]);
          }}
        >
          <Ionicons name="trash-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {submissions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No submissions yet.</Text>
          <Link href="/(tabs)/AddSubmissions" asChild>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add" size={24} color="black" />
              <Text style={styles.addButtonText}>Add Submission</Text>
            </TouchableOpacity>
          </Link>
        </View>
      ) : (
        <>
          <FlatList
            data={submissions}
            renderItem={renderSubmission}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
          <Link href="/(tabs)/AddSubmissions" asChild>
            <TouchableOpacity style={styles.floatingButton}>
              <Ionicons name="add" size={28} color="white" />
            </TouchableOpacity>
          </Link>
        </>
      )}

      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Submission</Text>

            <TextInput
              style={styles.modalInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Name"
            />
            <TextInput
              style={styles.modalInput}
              value={editYear}
              onChangeText={setEditYear}
              placeholder="Year Level"
            />
            <TextInput
              style={styles.modalInput}
              value={editCourse}
              onChangeText={setEditCourse}
              placeholder="Course"
            />

            <Text style={styles.sectionTitle}>Grades</Text>
            {editGrades.map((grade, index) => (
              <View key={index} style={styles.gradeItem}>
                <Text style={styles.gradeText}>{grade.subject}: {grade.grade}</Text>
                <TouchableOpacity onPress={() => removeGrade(index)}>
                  <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.addGradeContainer}>
              <TextInput
                style={[styles.modalInput, {flex: 1}]}
                value={newSubject}
                onChangeText={setNewSubject}
                placeholder="Subject"
              />
              <TextInput
                style={[styles.modalInput, {width: 80}]}
                value={newGrade}
                onChangeText={setNewGrade}
                placeholder="Grade"
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={styles.addGradeButton}
                onPress={addGrade}
              >
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#007AFF" }]}
                onPress={handleEditSubmit}
              >
                <Text style={styles.modalButtonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: "#333" }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
  },
  list: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 5,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  placeholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  placeholderText: {
    color: "#666",
    fontSize: 12,
  },
  details: {
    flexShrink: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    flexWrap: "wrap",
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#ccc",
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#ffd33d",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#ffd33d",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    width: "85%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    color: "#000",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 8,
    color: "#000",
  },
  gradeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  gradeText: {
    fontSize: 14,
    color: "#333",
  },
  addGradeContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  addGradeButton: {
    backgroundColor: "#007AFF",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});