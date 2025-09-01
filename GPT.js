// index.js
// A simple REST API using Express.js and Joi for validation

const express = require('express');
const Joi = require('joi'); // For input validation
const app = express();

// Middleware to parse JSON body
app.use(express.json());

// Sample in-memory data (acts like a fake database)
let courses = [
  { id: 1, name: 'JavaScript Basics' },
  { id: 2, name: 'Node.js Fundamentals' },
  { id: 3, name: 'Express.js Crash Course' },
];

// -----------------------------
// ROUTES
// -----------------------------

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the REST API Example 🚀');
});

// GET all courses
app.get('/api/courses', (req, res) => {
  res.send(courses);
});

// GET a single course by ID
app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('Course not found ❌');
  res.send(course);
});

// POST (create a new course)
app.post('/api/courses', (req, res) => {
  // Validate input
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course); // Return newly created course
});

// PUT (update an existing course)
app.put('/api/courses/:id', (req, res) => {
  // Look up course
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('Course not found ❌');

  // Validate input
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Update course
  course.name = req.body.name;
  res.send(course); // Return updated course
});

// DELETE (remove a course)
app.delete('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('Course not found ❌');

  // Remove from array
  courses = courses.filter(c => c.id !== course.id);
  res.send(course); // Return deleted course
});

// -----------------------------
// VALIDATION FUNCTION
// -----------------------------
function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  });
  return schema.validate(course);
}

// -----------------------------
// START SERVER
// -----------------------------
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}...`));
