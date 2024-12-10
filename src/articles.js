// src/articles.js
import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';

const articlesPath = path.resolve('src/data/articles.json');

// Load Articles dari file JSON
const loadArticles = () => {
  if (!fs.existsSync(articlesPath)) {
    fs.writeFileSync(articlesPath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));
};

// Save Articles ke file JSON
const saveArticles = (articles) => {
  fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2));
};

// Menambahkan artikel baru
export const addArticleHandler = (request, h) => {
  const { author, title, description, url, urlToImage, publishedAt, content } = request.payload;
  const articles = loadArticles();
  const id = nanoid();
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newArticle = { 
    id, 
    author, 
    title, 
    description, 
    url, 
    urlToImage, 
    publishedAt, 
    content, 
    createdAt, 
    updatedAt 
  };

  articles.push(newArticle);
  saveArticles(articles);

  return h.response({ status: 'success', data: { id } }).code(201);
};

/// Mengupdate artikel berdasarkan ID
export const updateArticleHandler = (request, h) => {
  const { id } = request.params;
  const { author, title, description, url, urlToImage, publishedAt, content } = request.payload;
  const articles = loadArticles();

  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) {
    return h.response({ status: 'fail', message: 'Article not found' }).code(404);
  }

  const updatedAt = new Date().toISOString();
  articles[index] = { 
    ...articles[index], 
    author, 
    title, 
    description, 
    url, 
    urlToImage, 
    publishedAt, 
    content, 
    updatedAt 
  };

  saveArticles(articles);

  return h.response({ status: 'success', message: 'Article updated successfully' }).code(200);
};

export const deleteArticleByIdHandler = (request, h) => {
  const { id } = request.params;
  const articles = loadArticles();

  const filteredArticles = articles.filter((a) => a.id !== id);
  saveArticles(filteredArticles);

  return h.response({ status: 'success', message: 'Article deleted successfully' }).code(200);
};

export const getAllArticlesHandler = (_, h) => {
  const articles = loadArticles();
  return h.response({ status: 'success', data: { articles } }).code(200);
};

export const getArticleByIdHandler = (request, h) => {
  const { id } = request.params;
  const articles = loadArticles();
  const article = articles.find((a) => a.id === id);

  if (!article) {
    return h.response({ status: 'fail', message: 'Article not found' }).code(404);
  }

  return h.response({ status: 'success', data: { article } }).code(200);
};
