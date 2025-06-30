import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSubmissionContext } from "./SubmissionContext";
import { Submission as SubmissionType } from "./_layout";

export default function Submission() {
  const { submissions, deleteSubmission } = useSubmissionContext();

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
    justifyContent: "space-evenly",  // Changed to space-evenly for even distribution
    marginTop: 12,
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
});
