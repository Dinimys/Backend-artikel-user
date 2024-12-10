// src/users.js
import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';

const usersPath = path.resolve('src/data/users.json');

const loadUsers = () => {
  if (!fs.existsSync(usersPath)) {
    fs.writeFileSync(usersPath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
};

const saveUsers = (users) => {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
};

export const addUserHandler = (request, h) => {
  const { name, age, gender } = request.payload;

  if (gender !== "male" && gender !== "female") {
    return h.response({ status: 'fail', message: "Gender must be 'male' or 'female'." }).code(400);
  }

  const users = loadUsers();
  const id = nanoid();
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newUser = { id, name, age, gender, createdAt, updatedAt };
  users.push(newUser);
  saveUsers(users);

  return h.response({ status: 'success', data: { id } }).code(201);
};

export const getAllUsersHandler = (_, h) => {
  const users = loadUsers();
  return h.response({ status: 'success', data: { users } }).code(200);
};

export const getUserByIdHandler = (request, h) => {
  const { id } = request.params;
  const users = loadUsers();
  const user = users.find((u) => u.id === id);

  if (!user) {
    return h.response({ status: 'fail', message: 'User not found' }).code(404);
  }

  return h.response({ status: 'success', data: { user } }).code(200);
};

export const updateUserHandler = (request, h) => {
  const { id } = request.params;
  const { name, age, gender } = request.payload;
  const users = loadUsers();

  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    return h.response({ status: 'fail', message: 'User not found' }).code(404);
  }

  const updatedAt = new Date().toISOString();
  users[index] = { ...users[index], name, age, gender, updatedAt };
  saveUsers(users);

  return h.response({ status: 'success', message: 'User updated successfully' }).code(200);
};

export const deleteUserHandler = (request, h) => {
  const { id } = request.params;
  const users = loadUsers();

  const filteredUsers = users.filter((u) => u.id !== id);
  saveUsers(filteredUsers);

  return h.response({ status: 'success', message: 'User deleted successfully' }).code(200);
};
