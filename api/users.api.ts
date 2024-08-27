import axios, { AxiosResponse } from 'axios';

const BASE_URL = 'https://jsonplaceholder.typicode.com/users';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

export const getUsers = async (): Promise<User[]> => {
  try {
    const response: AxiosResponse<User[]> = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching Users:', error);
    throw error;
  }
};

export const updateUser = async (user: User): Promise<User> => {
  try {
    const response: AxiosResponse<User> = await axios.put(`${BASE_URL}/${user.id}`, user);
    return response.data;
  } catch (error) {
    console.error('Error updating User:', error);
    throw error;
  }
};
