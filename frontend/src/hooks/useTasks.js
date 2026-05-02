// src/hooks/useTasks.js - Custom hook for all task operations
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all tasks from server
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_URL}/api/tasks`);
      setTasks(res.data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create a new task
  const addTask = async (title, description = '', priority = 'medium') => {
    const res = await axios.post(`${API_URL}/api/tasks`, { title, description, priority });
    setTasks(prev => [res.data.task, ...prev]); // Prepend new task
    return res.data.task;
  };

  // Toggle task completed/pending
  const toggleTask = async (taskId, completed) => {
    const res = await axios.put(`${API_URL}/api/tasks/${taskId}`, { completed: !completed });
    setTasks(prev =>
      prev.map(t => (t._id === taskId ? res.data.task : t))
    );
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    await axios.delete(`${API_URL}/api/tasks/${taskId}`);
    setTasks(prev => prev.filter(t => t._id !== taskId));
  };

  // Derived state: split tasks into pending and completed
  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return {
    tasks,
    pendingTasks,
    completedTasks,
    loading,
    error,
    addTask,
    toggleTask,
    deleteTask,
    refetch: fetchTasks,
  };
};
