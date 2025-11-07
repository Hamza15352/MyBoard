import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import '../styles/TaskOverview.scss';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  assignedTo?: string;
  userId: string;
}

interface UserStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  overdueTasks: number;
  highPriorityTasks: number;
}

const TaskOverview: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
    overdueTasks: 0,
    highPriorityTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all');
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    status: 'todo' as 'todo' | 'in-progress' | 'done'
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchUserTasks(user.uid);
      } else {
        setUser(null);
        setTasks([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserTasks = async (userId: string) => {
    try {
      setLoading(true);
      const tasksQuery = query(
        collection(db, 'tasks'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(tasksQuery);
      const userTasks: Task[] = [];
      
      querySnapshot.forEach((doc) => {
        userTasks.push({ id: doc.id, ...doc.data() } as Task);
      });
      
      setTasks(userTasks);
      calculateStats(userTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (taskList: Task[]) => {
    const now = new Date();
    const newStats: UserStats = {
      totalTasks: taskList.length,
      completedTasks: taskList.filter(task => task.status === 'done').length,
      inProgressTasks: taskList.filter(task => task.status === 'in-progress').length,
      todoTasks: taskList.filter(task => task.status === 'todo').length,
      overdueTasks: taskList.filter(task => 
        task.dueDate && new Date(task.dueDate) < now && task.status !== 'done'
      ).length,
      highPriorityTasks: taskList.filter(task => task.priority === 'high').length
    };
    setStats(newStats);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const taskData = {
        ...newTask,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'tasks'), taskData);
      setShowAddTask(false);
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        status: 'todo'
      });
      fetchUserTasks(user.uid);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, updates);
      fetchUserTasks(user.uid);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      fetchUserTasks(user.uid);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const filteredTasks = tasks.filter(task => 
    activeFilter === 'all' || task.status === activeFilter
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#44ff44';
      default: return '#cccccc';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return '#ffaa00';
      case 'in-progress': return '#4488ff';
      case 'done': return '#44ff44';
      default: return '#cccccc';
    }
  };

  if (loading) {
    return (
      <div className="task-overview-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="task-overview">
      <header className="overview-header">
        <div className="header-content">
          <h1>Task Overview</h1>
          <div className="user-info">
            <span>Welcome, {user?.displayName || user?.email}</span>
            <button onClick={handleSignOut} className="sign-out-btn">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card total-tasks">
            <h3>Total Tasks</h3>
            <div className="stat-number">{stats.totalTasks}</div>
          </div>
          <div className="stat-card completed">
            <h3>Completed</h3>
            <div className="stat-number">{stats.completedTasks}</div>
          </div>
          <div className="stat-card in-progress">
            <h3>In Progress</h3>
            <div className="stat-number">{stats.inProgressTasks}</div>
          </div>
          <div className="stat-card todo">
            <h3>To Do</h3>
            <div className="stat-number">{stats.todoTasks}</div>
          </div>
          <div className="stat-card overdue">
            <h3>Overdue</h3>
            <div className="stat-number">{stats.overdueTasks}</div>
          </div>
          <div className="stat-card high-priority">
            <h3>High Priority</h3>
            <div className="stat-number">{stats.highPriorityTasks}</div>
          </div>
        </div>
      </section>

      <section className="controls-section">
        <div className="controls-left">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Tasks
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'todo' ? 'active' : ''}`}
              onClick={() => setActiveFilter('todo')}
            >
              To Do
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'in-progress' ? 'active' : ''}`}
              onClick={() => setActiveFilter('in-progress')}
            >
              In Progress
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'done' ? 'active' : ''}`}
              onClick={() => setActiveFilter('done')}
            >
              Completed
            </button>
          </div>
        </div>
        <div className="controls-right">
          <button 
            className="add-task-btn"
            onClick={() => setShowAddTask(true)}
          >
            + Add New Task
          </button>
        </div>
      </section>

      <section className="tasks-section">
        {filteredTasks.length === 0 ? (
          <div className="no-tasks">
            <h3>No tasks found</h3>
            <p>Create your first task to get started!</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {filteredTasks.map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-header">
                  <h4 className="task-title">{task.title}</h4>
                  <div className="task-actions">
                    <button 
                      className="action-btn edit"
                      onClick={() => setEditingTask(task)}
                    >
                      Edit
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <p className="task-description">{task.description}</p>
                
                <div className="task-meta">
                  <div className="task-priority">
                    <span 
                      className="priority-dot"
                      style={{ backgroundColor: getPriorityColor(task.priority) }}
                    ></span>
                    {task.priority.toUpperCase()}
                  </div>
                  <div className="task-status">
                    <span 
                      className="status-dot"
                      style={{ backgroundColor: getStatusColor(task.status) }}
                    ></span>
                    {task.status.replace('-', ' ').toUpperCase()}
                  </div>
                </div>

                {task.dueDate && (
                  <div className="task-due-date">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                )}

                <div className="task-footer">
                  <select 
                    value={task.status}
                    onChange={(e) => handleUpdateTask(task.id, { 
                      status: e.target.value as 'todo' | 'in-progress' | 'done' 
                    })}
                    className="status-select"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {showAddTask && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Task</h3>
            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  required
                  placeholder="Enter task title"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value as 'low' | 'medium' | 'high'})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask({...newTask, status: e.target.value as 'todo' | 'in-progress' | 'done'})}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Add Task</button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowAddTask(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskOverview;