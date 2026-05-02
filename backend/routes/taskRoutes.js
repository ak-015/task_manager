// routes/taskRoutes.js - Task CRUD routes (all protected)
const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// All task routes require authentication
router.use(protect);

router.route('/')
  .get(getTasks)    // GET  /api/tasks       — fetch all tasks
  .post(createTask); // POST /api/tasks       — create a task

router.route('/:id')
  .put(updateTask)     // PUT    /api/tasks/:id — update task
  .delete(deleteTask); // DELETE /api/tasks/:id — delete task

module.exports = router;
