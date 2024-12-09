import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';  // Pastikan nanoid diimpor untuk membuat id unik

const usersPath = path.resolve('src', 'users.json');

// Fungsi untuk memuat data pengguna dari file
const loadUsers = () => {
  const data = fs.readFileSync(usersPath, 'utf-8');
  return JSON.parse(data);
};

// Fungsi untuk menyimpan data pengguna ke file
const saveUsers = (users) => {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
};

// Menambahkan pengguna baru dengan age, gender, createdAt, updatedAt
export const addUserHandler = (request, h) => {
  const { name, age, gender } = request.payload;
  const users = loadUsers();
  const id = nanoid();  // Membuat ID unik menggunakan nanoid
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;  // Same value initially

  // Menambahkan pengguna baru ke array users
  const newUser = { id, name, age, gender, createdAt, updatedAt };

  users.push(newUser);
  saveUsers(users);  // Menyimpan data pengguna yang sudah diperbarui

  return h.response({
    status: 'success',
    data: { id },  // Mengembalikan ID pengguna yang baru ditambahkan
  }).code(201);
};

// Memperbarui data pengguna berdasarkan ID
export const updateUserHandler = (request, h) => {
  const { id } = request.params;
  const { name, age, gender } = request.payload;
  const users = loadUsers();

  // Mencari index pengguna berdasarkan ID
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'User not found',  // Jika pengguna tidak ditemukan
    }).code(404);
  }

  // Memperbarui data pengguna dan menambahkan updatedAt
  const updatedAt = new Date().toISOString();
  users[index] = { ...users[index], name, age, gender, updatedAt };

  saveUsers(users);  // Menyimpan data pengguna yang sudah diperbarui

  return h.response({
    status: 'success',
    message: 'User updated successfully',
  }).code(200);
};
