import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { useSubmissionContext } from "./SubmissionContext";
import { Submission as SubmissionType } from "./_layout";

export default function Submission() {
  const { submissions, deleteSubmission } = useSubmissionContext();

  const calculateAverageGrade = (grades: { subject: string; grade: string }[]): string => {
    if (!Array.isArray(grades) || grades.length === 0) {
      return "No college grades available";
    }

    const collegeGrades: number[] = [];

    grades.forEach((gradeObj) => {
      const grade = parseFloat(gradeObj.grade);
      if (!isNaN(grade) && grade >= 1.0 && grade <= 4.0) {
        collegeGrades.push(grade);
      }
    });

    const collegeAvg =
      collegeGrades.length > 0
        ? (collegeGrades.reduce((acc, curr) => acc + curr, 0) / collegeGrades.length).toFixed(2)
        : "No college grades";

    return `College Average: ${collegeAvg}`;
  };

  const renderSubmission = ({ item }: { item: SubmissionType }) => (
    <View style={styles.submissionContainer}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.detailsContainer}>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={styles.infoText}>Year Level: {item.yearLevel}</Text>
        <Text style={styles.infoText}>Course: {item.course}</Text>
        <Text style={styles.gradesCount}>
          {item.grades.length} {item.grades.length === 1 ? "grade" : "grades"}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => {
            const gradesText = item.grades
              .map((gradeObj) => `${gradeObj.subject}: ${gradeObj.grade}`)
              .join("\n");
            Alert.alert(
              `Details for ${item.name}`,
              `Year Level: ${item.yearLevel}\nCourse: ${item.course}\nGrades:\n${gradesText || "No grades submitted yet."}`
            );
          }}
        >
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            Alert.alert(
              "Delete Submission",
              `Are you sure you want to delete ${item.name}'s submission?`,
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => deleteSubmission(item.id),
                },
              ]
            );
          }}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.calculateButton}
          onPress={() => {
            const average = calculateAverageGrade(item.grades);
            Alert.alert(`Average Grades for ${item.name}`, average);
          }}
        >
          <Text style={styles.buttonText}>Calculate</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  submissionContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    gap: 12,
  },
  detailsContainer: {
    flex: 1,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: "#888",
    fontSize: 12,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  } as TextStyle,
  gradesCount: {
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "column",
    gap: 8,
    alignItems: "center",
  },
  viewButton: {
    backgroundColor: "#ffd33d",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    width: 80,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    width: 80,
    alignItems: "center",
  },
  calculateButton: {
    backgroundColor: "#007aff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    width: 80,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#ffd33d",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#ffd33d",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  list: {
    paddingBottom: 80,
    gap: 10,
  },
});