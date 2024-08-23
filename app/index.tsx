import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Href, Stack, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as UsersApi from '@/api/users.api';
import { User } from '@/api/users.api';
import { Colors } from '@/constants/Colors';

export default function Index() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortedUsers, setSortedUsers] = useState<User[]>([]);
  const [sortType, setSortType] = useState<'name' | 'email'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: UsersApi.getUsers,
  });

  const handleEdit = (id: number) => {
    router.push(`/edit/${id}`);
  };

  const handleSortToggle = (type: 'name' | 'email') => {
    if (sortType === type) {
      // Toggle sort order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Change sort type and reset to ascending order
      setSortType(type);
      setSortOrder('asc');
    }
  };

  const deleteUser = (id: number) => queryClient.setQueryData(['users'], (users: User[]) => {
    return users.filter((u) => (u.id !== id));
  });

  const handleDelete = (id: number) => {
    deleteUser(id);
  };

  const filteredUsers = (users: User[]) => {
    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sorting users
    return filteredUsers.sort((a, b) => {
      const fieldA = sortType === 'name' ? a.name : a.email;
      const fieldB = sortType === 'name' ? b.name : b.email;

      if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  if (isLoading) return <Text>Loading...</Text>;

  const renderUserCard = ({ item }: { item: User }) => (
    <View style={styles.card}>
      <View style={styles.userInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>Username: {item.username}</Text>
        <Text style={styles.details}>Email: {item.email}</Text>
        <Text style={styles.details}>Phone: {item.phone}</Text>
        <Text style={styles.details}>Website: {item.website}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleEdit(item.id)} style={styles.icon}>
          <MaterialIcons name="edit" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.icon}>
          <MaterialIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => <MaterialIcons name="add" size={24} color="blue" onPress={() => router.push('/edit/0' as Href)} />,
        }}
      />
      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or username"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      {/* Sorting Controls */}
      <View style={styles.sortContainer}>
        <TouchableOpacity onPress={() => handleSortToggle('name')}>
          <Text style={styles.sortButton}>
            Sort by Name {sortType === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleSortToggle('email')}>
          <Text style={styles.sortButton}>
            Sort by Email {sortType === 'email' && (sortOrder === 'asc' ? '▲' : '▼')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* User List */}
      <FlatList
        data={filteredUsers(users)}
        renderItem={renderUserCard}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={{ textAlign: 'center' }}>No users found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 20,
    paddingBottom: 20,
  },
  searchInput: {
    height: 50,
    borderColor: Colors.grey,
    borderWidth: 1,
    marginHorizontal: 16,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  sortButton: {
    fontSize: 16,
    fontWeight: 'bold',
    borderWidth: .5,
    borderRadius: 8,
    padding: 8,
    borderColor: Colors.grey,
    backgroundColor: 'white',
  },
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
