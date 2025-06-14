import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
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
  const { submissions } = useSubmissionContext();

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
        <Text style={styles.gradesCount}>
          {item.grades.length} {item.grades.length === 1 ? 'grade' : 'grades'}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => {
          const gradesText = item.grades
            .map((g) => `${g.subject}: ${g.grade}`)
            .join("\n");
          Alert.alert(
            "Grades for " + item.name,
            gradesText || "No grades submitted yet."
          );
        }}
      >
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {submissions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No submissions yet.</Text>
          <Link href="/AddSubmission" asChild>
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
          <Link href="/AddSubmission" asChild>
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
    justifyContent: 'center',
    alignItems: 'center',
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
  gradesCount: {
    fontSize: 14,
    color: "#666",
  },
  viewButton: {
    backgroundColor: "#ffd33d",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: "#ffd33d",
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: "#ffd33d",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  list: {
    paddingBottom: 80,
    gap: 10,
  },
});