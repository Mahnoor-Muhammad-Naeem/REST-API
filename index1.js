const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

let courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' },
];

// GET all
app.get('/api/courses', (req, res) => {
  res.send(courses);
});

// GET by ID
app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('Course not found.');
  res.send(course);
});

// POST (create)
app.post('/api/courses', (req, res) => {
  const schema = Joi.object({ name: Joi.string().min(3).required() });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = { id: courses.length + 1, name: req.body.name };
  courses.push(course);
  res.send(course);
});

// PUT (update)
app.put('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('Course not found.');

  const schema = Joi.object({ name: Joi.string().min(3).required() });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  course.name = req.body.name;
  res.send(course);
});

// DELETE
app.delete('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('Course not found.');

  courses = courses.filter(c => c.id !== course.id);
  res.send(course);
});

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
