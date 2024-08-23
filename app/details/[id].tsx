import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { User } from '@/api/users.api';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/core';

export const UserDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const users = queryClient.getQueryData<User[]>(['users']) || [];
  const user = users.find((u) => u.id.toString() === id) || null;

  useIsFocused();

  const handleEdit = () => {
    router.push(`/edit/${id}`);
  };

  const handleDelete = (id?: number) => {
    queryClient.setQueryData(['users'], (users: User[]) => {
      return users.filter((u) => (u.id !== id));
    });
    router.back();
  }


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: 'Detail',
          headerRight: () => <MaterialIcons name="edit" size={24} color="blue" onPress={handleEdit} />
        }}
      />
      <View style={styles.card}>
        <Text style={styles.title}>{user?.name}</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Username:</Text>
          <Text style={styles.infoValue}>{user?.username}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={styles.infoValue}>{user?.phone}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Website:</Text>
          <Text style={styles.infoValue}>{user?.website}</Text>
        </View>
        <TouchableOpacity onPress={() => handleDelete(user?.id)} style={{ alignItems: 'center' }}>
          <MaterialIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 3,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoContainer: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default UserDetailScreen;
