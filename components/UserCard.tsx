import React from 'react';
import { Colors } from '@/constants/Colors';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { User } from '@/api/users.api';
import { useRouter } from 'expo-router';

interface UserCardProps {
  item: User;
}

export function UserCard({ item }: UserCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push(`/details/${item.id}`)} style={styles.card}>
      <View style={styles.userInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>Username: {item.username}</Text>
        <Text style={styles.details}>Email: {item.email}</Text>
        <Text style={styles.details}>Phone: {item.phone}</Text>
        <Text style={styles.details}>Website: {item.website}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: Colors.text,
  },
  actions: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 16,
  },
});
