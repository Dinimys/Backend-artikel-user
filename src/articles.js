import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';  // Pastikan nanoid diimpor untuk membuat id unik

const articlesPath = path.resolve('src', 'articles.json');

// Fungsi untuk memuat data artikel dari file
const loadArticles = () => {
  const data = fs.readFileSync(articlesPath, 'utf-8');
  return JSON.parse(data);
};

// Fungsi untuk menyimpan data artikel ke file
const saveArticles = (articles) => {
  fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2));
};

// Menambahkan artikel baru dengan title, body, author, createdAt, updatedAt
export const addArticleHandler = (request, h) => {
  const { title, body, author } = request.payload;
  const articles = loadArticles();
  const id = nanoid();  // Membuat ID unik menggunakan nanoid
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;  // Same value initially

  // Menambahkan artikel baru ke array articles
  const newArticle = { id, title, body, author, createdAt, updatedAt };

  articles.push(newArticle);
  saveArticles(articles);  // Menyimpan data artikel yang sudah diperbarui

  return h.response({
    status: 'success',
    data: { id },  // Mengembalikan ID artikel yang baru ditambahkan
  }).code(201);
};

// Memperbarui data artikel berdasarkan ID
export const updateArticleHandler = (request, h) => {
  const { id } = request.params;
  const { title, body, author } = request.payload;
  const articles = loadArticles();

  // Mencari index artikel berdasarkan ID
  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Article not found',  // Jika artikel tidak ditemukan
    }).code(404);
  }

  // Memperbarui data artikel dan menambahkan updatedAt
  const updatedAt = new Date().toISOString();
  articles[index] = { ...articles[index], title, body, author, updatedAt };

  saveArticles(articles);  // Menyimpan data artikel yang sudah diperbarui

  return h.response({
    status: 'success',
    message: 'Article updated successfully',
  }).code(200);
};
