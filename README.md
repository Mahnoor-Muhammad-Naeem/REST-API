# REST-API
A REST API (Representational State Transfer) is a way for applications to communicate over HTTP by treating data as resources accessible through unique URLs. Clients interact with these resources using standard HTTP methods like GET, POST, PUT, and DELETE in a stateless manner.
# REST API with Express.js & Joi

A simple **REST API** built using **Node.js, Express.js, and Joi** for input validation.  
This demo covers all CRUD operations: **Create, Read, Update, Delete**.

---

CRUD Operations in REST API

CRUD stands for:
- C → Create  
- R → Read  
- U → Update  
- D → Delete  

---

CRUD with HTTP Methods

| Operation | Description                         | HTTP Method | Example Endpoint       |
|-----------|-------------------------------------|-------------|------------------------|
| Create    | Add new data to the server          | POST        | POST /api/courses      |
| Read      | Retrieve existing data              | GET         | GET /api/courses <br> GET /api/courses/:id |
| Update    | Modify existing data                | PUT         | PUT /api/courses/:id   |
| Delete    | Remove existing data from the server | DELETE     | DELETE /api/courses/:id |

---

# Examples

```http

Create (POST)

```http
POST /api/courses
Content-Type: application/json

{
  "name": "New Course"
}

Read (GET)

```http
GET /api/courses

Update (PUT)

```http
PUT /api/courses/1
Content-Type: application/json

{
  "name": "Updated Course"
}

Delete (DELETE)

```http
DELETE /api/courses/1

```

## Project Structure
rest-api-example/  
index.js       # Main server file  
package.json   # Dependencies and scripts  
README.md      # Documentation (this file)  

## Getting Started

### 1️⃣ Initialize npm project
```bash
npm init -y
```

### 2️⃣ Install dependencies
```bash
npm install express joi
# (Optional, for auto-restart during development)
npm install --save-dev nodemon
```

### 3️⃣ Update `package.json` scripts (optional, for nodemon)
```json
{
  "name": "rest-api-example",
  "version": "1.0.0",
  "description": "Simple REST API with Express and Joi",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "keywords": ["express", "node", "rest", "joi"],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "express": "^4.19.2",
    "joi": "^17.13.3"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
```
> **Note:** `type: "module"` lets you use modern `import` syntax. If you prefer `require`, remove `"type": "module"` and adjust the code accordingly.

### 4️⃣ Run the server
```bash
npm start
# or, with auto-reload
yarn dev
# or
npm run dev
```
By default, the server runs on: `http://localhost:3000`

---

## Validation Rules
- Every course must have a `name` field.
- `name` must be a **string** with **at least 3 characters**.
- On validation failure, the API returns:
```json
{ "error": "Name is required and should be at least 3 characters long" }
```

---

## API Endpoints

### 1) Home
**GET /**
```text
Welcome to the REST API Example 
```

### 2) Get all courses
**GET /api/courses**
```json
[
  { "id": 1, "name": "JavaScript Basics" },
  { "id": 2, "name": "Node.js Fundamentals" },
  { "id": 3, "name": "Express.js Crash Course" }
]
```

### 3) Get course by ID
**GET /api/courses/:id**
```json
{ "id": 2, "name": "Node.js Fundamentals" }
```

### 4) Create a new course
**POST /api/courses**
```http
Content-Type: application/json
```
Request Body:
```json
{ "name": "REST API with Express" }
```
Response:
```json
{ "id": 4, "name": "REST API with Express" }
```

### 5) Update a course
**PUT /api/courses/:id**
```http
Content-Type: application/json
```
Request Body:
```json
{ "name": "JavaScript Advanced" }
```
Response:
```json
{ "id": 1, "name": "JavaScript Advanced" }
```

### 6) Delete a course
**DELETE /api/courses/:id**
Response:
```json
{ "id": 3, "name": "Express.js Crash Course" }
```

---

## `index.js`

> **ESM version (with `type: "module"` in package.json).** If you prefer CommonJS, a variant is included below.

```js
import express from 'express';
import Joi from 'joi';

const app = express();
app.use(express.json());

// In-memory data store
let courses = [
  { id: 1, name: 'JavaScript Basics' },
  { id: 2, name: 'Node.js Fundamentals' },
  { id: 3, name: 'Express.js Crash Course' }
];

// Joi schema for validation
const courseSchema = Joi.object({
  name: Joi.string().min(3).required()
});

// Utility: validate request body
function validateCourse(payload) {
  const { error } = courseSchema.validate(payload, { abortEarly: true });
  if (!error) return null;
  return 'Name is required and should be at least 3 characters long';
}

// Home
app.get('/', (req, res) => {
  res.type('text').send('Welcome to the REST API Example');
});

// Get all courses
app.get('/api/courses', (req, res) => {
  res.json(courses);
});

// Get course by ID
app.get('/api/courses/:id', (req, res) => {
  const id = Number(req.params.id);
  const course = courses.find(c => c.id === id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course);
});

// Create course
app.post('/api/courses', (req, res) => {
  const validationError = validateCourse(req.body);
  if (validationError) return res.status(400).json({ error: validationError });

  const course = {
    id: courses.length ? Math.max(...courses.map(c => c.id)) + 1 : 1,
    name: req.body.name.trim()
  };
  courses.push(course);
  res.status(201).json(course);
});

// Update course
app.put('/api/courses/:id', (req, res) => {
  const id = Number(req.params.id);
  const course = courses.find(c => c.id === id);
  if (!course) return res.status(404).json({ error: 'Course not found' });

  const validationError = validateCourse(req.body);
  if (validationError) return res.status(400).json({ error: validationError });

  course.name = req.body.name.trim();
  res.json(course);
});

// Delete course
app.delete('/api/courses/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = courses.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Course not found' });

  const [deleted] = courses.splice(idx, 1);
  res.json(deleted);
});

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
```

### CommonJS variant (`require`) — optional
Remove `"type": "module"` from `package.json` if you use this.
```js
const express = require('express');
const Joi = require('joi');

const app = express();
app.use(express.json());

let courses = [
  { id: 1, name: 'JavaScript Basics' },
  { id: 2, name: 'Node.js Fundamentals' },
  { id: 3, name: 'Express.js Crash Course' }
];

const courseSchema = Joi.object({
  name: Joi.string().min(3).required()
});

function validateCourse(payload) {
  const { error } = courseSchema.validate(payload, { abortEarly: true });
  return error ? 'Name is required and should be at least 3 characters long' : null;
}

app.get('/', (req, res) => {
  res.type('text').send('Welcome to the REST API Example');
});

app.get('/api/courses', (req, res) => {
  res.json(courses);
});

app.get('/api/courses/:id', (req, res) => {
  const id = Number(req.params.id);
  const course = courses.find(c => c.id === id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course);
});

app.post('/api/courses', (req, res) => {
  const validationError = validateCourse(req.body);
  if (validationError) return res.status(400).json({ error: validationError });
  const course = {
    id: courses.length ? Math.max(...courses.map(c => c.id)) + 1 : 1,
    name: req.body.name.trim()
  };
  courses.push(course);
  res.status(201).json(course);
});

app.put('/api/courses/:id', (req, res) => {
  const id = Number(req.params.id);
  const course = courses.find(c => c.id === id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  const validationError = validateCourse(req.body);
  if (validationError) return res.status(400).json({ error: validationError });
  course.name = req.body.name.trim();
  res.json(course);
});

app.delete('/api/courses/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = courses.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Course not found' });
  const [deleted] = courses.splice(idx, 1);
  res.json(deleted);
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
```

---

## Quick cURL Tests
```bash
# List all courses
curl -s http://localhost:3000/api/courses | jq

# Get one course
curl -s http://localhost:3000/api/courses/2 | jq

# Create (valid)
curl -s -X POST http://localhost:3000/api/courses \
  -H 'Content-Type: application/json' \
  -d '{"name":"REST API with Express"}' | jq

# Create (invalid: too short)
curl -s -X POST http://localhost:3000/api/courses \
  -H 'Content-Type: application/json' \
  -d '{"name":"Hi"}' | jq

# Update
curl -s -X PUT http://localhost:3000/api/courses/1 \
  -H 'Content-Type: application/json' \
  -d '{"name":"JavaScript Advanced"}' | jq

# Delete
curl -s -X DELETE http://localhost:3000/api/courses/3 | jq
```

---

## Notes & Tips
- This demo uses an **in-memory array**; data resets on restart. Swap with a DB (e.g., MongoDB, Postgres) for persistence.
- Prefer **201 Created** for successful POSTs.
- Always return **JSON** for API responses (including errors) for consistency.
- Add CORS (`cors` package) if you’ll call this from a browser app.
- Use environment variables for config (ports, DB URLs) via `dotenv`.

---
