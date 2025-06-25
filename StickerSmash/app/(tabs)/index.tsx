import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSubmissionContext } from "./SubmissionContext";

export default function Index() {
  const { addOrUpdateSubmission } = useSubmissionContext();
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [yearLevel, setYearLevel] = useState("Select");
  const [course, setCourse] = useState("Select");
  const [nameError, setNameError] = useState("");
  const [subjectError, setSubjectError] = useState("");

  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.name) {
      setName(params.name as string);
    }
  }, [params.name]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "We need access to your gallery to upload photos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    let hasError = false;
    setNameError("");
    setSubjectError("");

    if (!name) {
      setNameError("Name is required.");
      hasError = true;
    } else if (/\d/.test(name)) {
      setNameError("Name must not contain numbers.");
      hasError = true;
    }

    if (!subject) {
      setSubjectError("Subject is required.");
      hasError = true;
    } else if (!/^[A-Z]/.test(subject)) {
      setSubjectError("Subject must start with a capital letter.");
      hasError = true;
    } else if (/\d/.test(subject)) {
      setSubjectError("Subject must not contain numbers.");
      hasError = true;
    }

    if (!grade || yearLevel === "Select" || course === "Select") {
      Alert.alert("Please fill in all fields, including Year Level and Course.");
      hasError = true;
    }

    if (hasError) return;

    addOrUpdateSubmission({ image, name, subject, grade, yearLevel, course });

    Alert.alert(
      "Submission Successful",
      `Name: ${name}\nSubject: ${subject}\nCollege Grade: ${grade}\nYear Level: ${yearLevel}\nCourse: ${course}`,
      [
        {
          text: "OK",
          onPress: () => {
            setName("");
            setSubject("");
            setGrade("");
            setYearLevel("Select");
            setCourse("Select");
            setImage(null);
            router.push("/(tabs)/Submissions");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.glassContainer}>
          <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={styles.placeholder}>
                <Ionicons name="camera" size={32} color="#555" />
                <Text style={styles.placeholderText}>Tap to upload photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>Enter Name:</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={24} color="#FFD700" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
            />
          </View>
          <Text style={styles.errorText}>{nameError}</Text>

          <Text style={styles.label}>Select Year Level:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={yearLevel}
              onValueChange={(value) => setYearLevel(value)}
              style={styles.picker}
              dropdownIconColor="#FFD700"
            >
              <Picker.Item label="Select Year Level" value="Select" />
              <Picker.Item label="1st Year" value="1st Year" />
              <Picker.Item label="2nd Year" value="2nd Year" />
              <Picker.Item label="3rd Year" value="3rd Year" />
              <Picker.Item label="4th Year" value="4th Year" />
            </Picker>
          </View>

          <Text style={styles.label}>Select Course:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={course}
              onValueChange={(value) => setCourse(value)}
              style={styles.picker}
              dropdownIconColor="#FFD700"
            >
              <Picker.Item label="Select Course" value="Select" />
              <Picker.Item label="BS Criminology" value="BS Criminology" />
              <Picker.Item label="BS Information Technology" value="BS Information Technology" />
              <Picker.Item label="BS Hospitality Management" value="BS Hospitality Management" />
              <Picker.Item label="BS Tourism Management" value="BS Tourism Management" />
              <Picker.Item label="BS Education" value="BS Education" />
              <Picker.Item label="BS Accounting Management" value="BS Accounting Management" />
            </Picker>
          </View>

          <Text style={styles.label}>Enter Subject:</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="book-outline" size={24} color="#FFD700" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Subject"
              placeholderTextColor="#888"
              value={subject}
              onChangeText={setSubject}
            />
          </View>
          <Text style={styles.errorText}>{subjectError}</Text>

          <Text style={styles.label}>Enter College Grade:</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="school-outline" size={24} color="#FFD700" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="College Grade (1.0-5.0)"
              placeholderTextColor="#888"
              value={grade}
              onChangeText={setGrade}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  glassContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 25,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  photoContainer: {
    alignSelf: 'center',
    marginBottom: 25,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  placeholderText: {
    color: '#555',
    fontSize: 12,
    marginTop: 8,
  },
  label: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 8,
    marginBottom: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 8,
  },
  inputIcon: {
    marginRight: 10,
  },
  pickerContainer: {
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 16,
  },
  picker: {
    color: '#000',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 12,
    marginTop: -6,
  },
  submitButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
});