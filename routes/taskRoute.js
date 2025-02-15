const express = require('express');
const Task = require('../models/tasks'); // Ensure correct model file
const authMiddleware = require('../middleware/authMidleware'); // Import auth middleware
const router = express.Router();
const mongoose = require('mongoose');


// ✅ Add a new task (Protected Route)
router.post('/task', authMiddleware, async (req, res) => {
    try {
        const { task,date,category,priority,status} = req.body;
        const userId = req.user.id; // Get userId from token
         
        if (!task) return res.status(400).json({ message: 'Task cannot be empty' });
        if (!date) return res.status(400).json({ message: "Date is required" });
        const newTask = new Task({ userId, task, date ,category,priority,status});
        await newTask.save();

         res.status(201).json({
      _id: newTask._id,
      userId: newTask.userId,
      task: newTask.task,
      date: newTask.date,
      category : newTask.category,
      priority : newTask.priority,
      status: newTask.status
    });
    } catch (error) {
        res.status(500).json({ message: 'Error adding task', error: error.message });
    }
});

// ✅ Get all tasks for logged-in user (Protected Route)
router.get('/tasks', authMiddleware, async (req, res) => {
    try {
      const tasks = await Task.find({ userId: req.user.id }).sort({ date: 1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
});

router.delete('/task/:taskId', authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id; // User ID from the token (set in authMiddleware)

    // Find the task by taskId and ensure it belongs to the logged-in user
    const task = await Task.findOne({ _id: taskId, userId: userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or you do not have permission to delete this task' });
    }

    // Delete the task
    await task.deleteOne();
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
});

router.put('/taskUpdateStatus/:taskId', authMiddleware, async (req, res) => {
  try {
      const { taskId } = req.params;
      const { status } = req.body;
      const userId = req.user.id;

      // // Check if taskId is valid
      if (!mongoose.Types.ObjectId.isValid(taskId)) {
          return res.status(400).json({ message: 'Invalid task ID' });
      }

      // Find the task and ensure it belongs to the logged-in user
      const task = await Task.findOne({ _id: taskId, userId });
      if (!task) {
          return res.status(404).json({ message: 'Task not found or unauthorized' });
      }

      // Update only the status field
      task.status = status;
      await task.save();

      res.status(200).json({ message: 'Task status updated successfully', updatedTask: task });
  } catch (error) {
      res.status(500).json({ message: 'Error updating task status', error: error.message });
  }
});

module.exports = router;
