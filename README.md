## 📘 Project Source
This project was built as part of the [URL Shortening Service](https://roadmap.sh/projects/url-shortening-service) challenge on roadmap.sh.


# 🔗 URL Shortener API

A modern, scalable URL shortening service built with **Express**, **TypeScript**, and **PostgreSQL (Drizzle ORM)**.
Supports analytics tracking, customizable short codes, and OpenAPI (Swagger) documentation for easy integration.

https://roadmap.sh/projects/url-shortening-service

---

## ✨ Features

- **Shorten any long URL** into a compact, shareable link
- **Automatic UUID-based IDs** and short code generation
- **Analytics tracking:** total clicks, created & updated timestamps
- **RESTful CRUD operations** (`create`, `read`, `update`, `delete`)
- **Versioned API:** `/api/v1`
- **Swagger/OpenAPI documentation**
- **Dockerized** for easy local development and deployment

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **PostgreSQL** (local or remote instance)

---

### ⚙️ Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.sample .env
```

Example:
```env
DB_URL=postgresql://user:password@localhost:5432/url_shortener
PORT=5000
NODE_ENV=development
```

> 💡 See `src/config/env.ts` for the full list of environment variables.

---

### 🧩 Local Development

```bash
npm install
npm run dev
```

The API will start on the port defined in your `.env` (default: `5000`).

---

### 🏗️ Production Build

```bash
npm run build
npm start
```

---

### 🐳 Docker Setup

To run with Docker Compose (includes PostgreSQL):

```bash
docker-compose up --build
```

---

## 📘 API Documentation

- **Swagger UI:** [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- **Swagger JSON:** [http://localhost:5000/swagger.json](http://localhost:5000/swagger.json)

---

## 🔍 Example Usage

### 1️⃣ Shorten a URL
`POST /api/v1/shorten`

**Request Body:**
```json
{
  "url": "https://example.com/very/long/path"
}
```

**Response:**
```json
{
  "id": "6e1b77c4-9f8d-4e5b-b9a3-291db2f86d77",
  "shortCode": "ksjdf2",
  "url": "https://example.com/very/long/path",
  "createdAt": "2025-10-04T12:00:00.000Z",
  "updatedAt": "2025-10-04T12:00:00.000Z",
  "accessCount": 0
}
```

---

### 2️⃣ Retrieve or Redirect
`GET /api/v1/shorten/{shortUrl}`

If you visit `/api/v1/shorten/ksjdf2?redirect`, it will redirect you to the original long URL.

**Response (if not redirecting):**
```json
{
  "url": "https://example.com/very/long/path",
  "shortCode": "ksjdf2",
  "accessCount": 42
}
```

---

### 3️⃣ Get URL Stats
`GET /api/v1/shorten/{shortUrl}/stats`

**Response:**
```json
{
  "shortCode": "ksjdf2",
  "url": "https://example.com/very/long/path",
  "accessCount": 42,
  "createdAt": "2025-10-04T12:00:00.000Z",
  "updatedAt": "2025-10-04T12:10:00.000Z"
}
```

---

### 4️⃣ Update URL
`PUT /api/v1/shorten/{shortUrl}`

**Request Body:**
```json
{
  "url": "https://example.com/new-destination"
}
```

**Response:**
```json
{
  "shortCode": "ksjdf2",
  "url": "https://example.com/new-destination",
  "updatedAt": "2025-10-04T12:30:00.000Z"
}
```

---

### 5️⃣ Delete URL
`DELETE /api/v1/shorten/{shortUrl}`

**Response:**
```
204 No Content
```

---

## 🧪 Testing

```bash
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
```

---

## 🧱 Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL + Drizzle ORM
- **Docs:** Swagger / OpenAPI
- **Environment Management:** dotenv
- **Containerization:** Docker
