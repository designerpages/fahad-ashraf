import React, { useEffect } from 'react';
import { Colors } from '@/constants/Colors';
import { FormField } from '@/components/FormField';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Button, Text, ActivityIndicator } from 'react-native';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as UsersApi from '@/api/users.api';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const userSchema = z.object({
  name: z.string().min(1, {message: 'Name is required'}),
  username: z.string().min(1, {message: 'Username is required'}),
  email: z.string().email({message: 'Invalid email address'}),
  phone: z.string().min(1, {message: 'Phone number is required'}),
  website: z.string().url({message: 'Invalid URL'}),
});

export default function EditUserScreen() {
  const {id} = useLocalSearchParams<{ id: string }>();

  const router = useRouter();
  const queryClient = useQueryClient();

  const users = queryClient.getQueryData<UsersApi.User[]>(['users']) || [];
  const user = users.find((u) => u.id.toString() === id) || null;

  const [modifiedUser, setModifiedUser] = React.useState<UsersApi.User | null>(null);

  const updateUsersMutation = useMutation({
    mutationFn: UsersApi.updateUser,
  })

  const {control, handleSubmit, formState: {errors}} = useForm<UsersApi.User>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || '',
      username: user?.username || '',
      email: user?.email || '',
      phone: user?.phone || '',
      website: user?.website || '',
    },
  });

  const updateUser = (modifiedUser: UsersApi.User) => {
    updateUsersMutation.mutate(modifiedUser);
    setModifiedUser(modifiedUser)
  }

  const createUser = (newUser: UsersApi.User) => queryClient.setQueryData(['users'], (users: UsersApi.User[]) => {
    return [...users, newUser];
  });

  const onSubmit = (data: UsersApi.User) => {
    if (id === '0') {
      createUser({...data, id: Date.now()});
    } else {
      updateUser({...user, ...data});
    }
  };

  useEffect(() => {
    if (updateUsersMutation.status === 'success') {
      queryClient.setQueryData(['users'], (users: UsersApi.User[]) => {
        return users.map((u) => (u.id === user?.id ? modifiedUser : u));
      });
      router.back();
    }
  }, [updateUsersMutation.status]);

  return (
    <KeyboardAwareScrollView style={{backgroundColor: Colors.background}}>
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Edit User',
          }}
        />
        <FormField control={control} name="name" label="Name" errors={errors.name}/>
        <FormField control={control} name="username" label="Username" errors={errors.username}/>
        <FormField control={control} name="email" label="Email" errors={errors.email}/>
        <FormField control={control} name="phone" label="Phone" errors={errors.phone}/>
        <FormField control={control} name="website" label="Website" errors={errors.website}/>
        {
          updateUsersMutation.isPending
            ? <ActivityIndicator/>
            : <Button title="Save" onPress={handleSubmit(onSubmit)}/>
        }
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background,
  },
});
