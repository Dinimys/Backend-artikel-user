import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";

// Paths to data files
const usersPath = path.resolve("src", "users.json");
const articlesPath = path.resolve("src", "articles.json");

// Helper functions to load and save data
const loadUsers = () => {
    try {
      if (!fs.existsSync(usersPath)) {
        // Jika file tidak ada, buat file kosong
        fs.writeFileSync(usersPath, JSON.stringify([]));
      }
      const data = fs.readFileSync(usersPath, 'utf-8');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error loading users:", error);
      return [];
    }
  };

const saveUsers = (users) => {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
};

const loadArticles = () => {
    try {
      if (!fs.existsSync(articlesPath)) {
        // Jika file tidak ada, buat file kosong
        fs.writeFileSync(articlesPath, JSON.stringify([]));
      }
      const data = fs.readFileSync(articlesPath, 'utf-8');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error loading articles:", error);
      return [];
    }
  };

const saveArticles = (articles) => {
  fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2));
};

// User Handlers

export const addUserHandler = (request, h) => {
  const { name, age, gender } = request.payload;

  // Validate gender
  if (gender !== "male" && gender !== "female") {
    return h.response({
      status: "fail",
      message: "Gender must be 'male' or 'female'.",
    }).code(400);
  }

  const users = loadUsers();
  const id = nanoid();
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;  // Same value initially

  const newUser = { id, name, age, gender, createdAt, updatedAt };

  users.push(newUser);
  saveUsers(users);

  return h.response({
    status: "success",
    data: { id },
  }).code(201);
};

export const getAllUsersHandler = (_, h) => {
  const users = loadUsers();
  return h.response({ status: "success", data: { users } }).code(200);
};

export const getUserByIdHandler = (request, h) => {
  const { id } = request.params;
  const users = loadUsers();
  const user = users.find((u) => u.id === id);

  if (!user) {
    return h.response({ status: "fail", message: "User not found" }).code(404);
  }

  return h.response({ status: "success", data: { user } }).code(200);
};

export const updateUserHandler = (request, h) => {
  const { id } = request.params;
  const { name, age, gender } = request.payload;

  // Validate gender
  if (gender !== "male" && gender !== "female") {
    return h.response({
      status: "fail",
      message: "Gender must be 'male' or 'female'.",
    }).code(400);
  }

  const users = loadUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    return h.response({
      status: "fail",
      message: "User not found",
    }).code(404);
  }

  const updatedAt = new Date().toISOString();
  users[index] = { ...users[index], name, age, gender, updatedAt };
  saveUsers(users);

  return h.response({
    status: "success",
    message: "User updated successfully",
  }).code(200);
};

export const deleteUserHandler = (request, h) => {
  const { id } = request.params;
  const users = loadUsers();

  const filteredUsers = users.filter((u) => u.id !== id);
  if (users.length === filteredUsers.length) {
    return h.response({ status: "fail", message: "User not found" }).code(404);
  }

  saveUsers(filteredUsers);
  return h.response({ status: "success", message: "User deleted successfully" }).code(200);
};

// Article Handlers

export const addArticleHandler = (request, h) => {
  const { title, body, author } = request.payload;
  const articles = loadArticles();
  const id = nanoid();
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newArticle = { id, title, body, author, createdAt, updatedAt };

  articles.push(newArticle);
  saveArticles(articles);

  return h.response({
    status: "success",
    data: { id },
  }).code(201);
};

export const getAllArticlesHandler = (_, h) => {
  const articles = loadArticles();
  return h.response({ status: "success", data: { articles } }).code(200);
};

export const getArticleByIdHandler = (request, h) => {
  const { id } = request.params;
  const articles = loadArticles();
  const article = articles.find((a) => a.id === id);

  if (!article) {
    return h.response({ status: "fail", message: "Article not found" }).code(404);
  }

  return h.response({ status: "success", data: { article } }).code(200);
};

export const updateArticleHandler = (request, h) => {
  const { id } = request.params;
  const { title, body, author } = request.payload;
  const articles = loadArticles();

  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) {
    return h.response({ status: "fail", message: "Article not found" }).code(404);
  }

  const updatedAt = new Date().toISOString();
  articles[index] = { ...articles[index], title, body, author, updatedAt };
  saveArticles(articles);

  return h.response({
    status: "success",
    message: "Article updated successfully",
  }).code(200);
};

export const deleteArticleByIdHandler = (request, h) => {
  const { id } = request.params;
  const articles = loadArticles();

  const filteredArticles = articles.filter((a) => a.id !== id);
  if (articles.length === filteredArticles.length) {
    return h.response({ status: "fail", message: "Article not found" }).code(404);
  }

  saveArticles(filteredArticles);
  return h.response({ status: "success", message: "Article deleted successfully" }).code(200);
};
