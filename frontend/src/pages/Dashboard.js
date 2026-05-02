// src/pages/Dashboard.js - Main task management page
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';

// Format date nicely
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Single task card component
const TaskCard = ({ task, onToggle, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    await onToggle(task._id, task.completed);
    setToggling(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(task._id);
    // If component unmounts during delete, state update is skipped
  };

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      {/* Checkbox to toggle complete */}
      <button
        className="task-check"
        onClick={handleToggle}
        disabled={toggling}
        title={task.completed ? 'Mark as pending' : 'Mark as complete'}
        aria-label="Toggle task completion"
      >
        {task.completed || toggling ? '✓' : ''}
      </button>

      <div className="task-body">
        <div className="task-title">{task.title}</div>
        {task.description && (
          <div className="task-desc">{task.description}</div>
        )}
        <div className="task-meta">
          <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
          <span className="task-date">{formatDate(task.createdAt)}</span>
        </div>
      </div>

      <div className="task-actions">
        <button
          className="btn-icon"
          onClick={handleDelete}
          disabled={deleting}
          title="Delete task"
          aria-label="Delete task"
        >
          {deleting ? '⏳' : '🗑'}
        </button>
      </div>
    </div>
  );
};

// Add task form component
const AddTaskForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await onAdd(title.trim(), description.trim(), priority);
      setTitle('');
      setDescription('');
      setPriority('medium');
      // Flash success state
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-task-card">
      <div className="add-task-title">New Task</div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">Task added! ✓</div>}

      <form onSubmit={handleSubmit}>
        <div className="add-task-row">
          <input
            type="text"
            className="form-input"
            placeholder="What needs to be done?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={200}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="spinner spinner-sm" /> : '+ Add'}
          </button>
        </div>

        <div className="add-task-extras">
          <input
            type="text"
            className="form-input"
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={500}
          />
          <select
            className="form-input"
            value={priority}
            onChange={e => setPriority(e.target.value)}
          >
            <option value="low">🔵 Low Priority</option>
            <option value="medium">🟠 Medium Priority</option>
            <option value="high">🔴 High Priority</option>
          </select>
        </div>
      </form>
    </div>
  );
};

// Main Dashboard
function Dashboard() {
  const { user, logout } = useAuth();
  const { pendingTasks, completedTasks, loading, error, addTask, toggleTask, deleteTask, tasks } = useTasks();

  // Get initials for avatar
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          <div className="header-brand">
            <span className="header-logo">Task<span>flow</span></span>
          </div>
          <div className="header-user">
            <span className="user-name">Hi, {user?.name?.split(' ')[0]}</span>
            <div className="user-avatar">{initials}</div>
            <button className="btn btn-ghost" onClick={logout} style={{ fontSize: '13px', padding: '6px 14px' }}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="dashboard-main">
        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card total">
            <div className="stat-number">{tasks.length}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-number">{pendingTasks.length}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card done">
            <div className="stat-number">{completedTasks.length}</div>
            <div className="stat-label">Done</div>
          </div>
        </div>

        {/* Add Task */}
        <AddTaskForm onAdd={addTask} />

        {/* Loading state */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <div className="spinner" />
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="alert alert-error">{error}</div>
        )}

        {/* Task lists */}
        {!loading && !error && (
          <>
            {/* Pending tasks */}
            <div className="section-header">
              <span className="section-title">Pending</span>
              <span className="section-count">{pendingTasks.length}</span>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎉</div>
                <p>All caught up! Add a task above.</p>
              </div>
            ) : (
              <div className="tasks-list">
                {pendingTasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            )}

            {/* Completed tasks — only show if there are any */}
            {completedTasks.length > 0 && (
              <>
                <div className="section-header">
                  <span className="section-title">Completed</span>
                  <span className="section-count">{completedTasks.length}</span>
                </div>
                <div className="tasks-list">
                  {completedTasks.map(task => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
