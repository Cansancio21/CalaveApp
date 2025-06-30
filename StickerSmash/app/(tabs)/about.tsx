import { StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>CalaveApp</Text>
        <Text style={styles.tagline}>Grades made simple</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.description}>
          A clean tool for students and teachers to track grades and calculate averages without distractions.
        </Text>

        {/* Key Features */}
        <View style={styles.features}>
          <Text style={styles.feature}>• Automatic calculations</Text>
          <Text style={styles.feature}>• Clean interface</Text>
          <Text style={styles.feature}>• No unnecessary features</Text>
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>No copyrights Ryan Cansancio / John William Mayormita</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
  },
  tagline: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
  },
  content: {
    flex: 1,
  },
  description: {
    color: '#ccc',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 25,
  },
  features: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 16,
  },
  feature: {
    color: '#fff',
    fontSize: 15,
    marginVertical: 6,
  },
  footer: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },
});
