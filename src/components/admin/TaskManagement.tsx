"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  AlertCircle,
  Clock,
  CheckSquare
} from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const res = await fetch('/api/admin/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  }

  async function addTask() {
    if (!newTask.trim()) return;
    try {
      const res = await fetch('/api/admin/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTask, priority })
      });
      if (res.ok) {
        const data = await res.json();
        setTasks([data, ...tasks]);
        setNewTask("");
        toast.success("Task added");
      }
    } catch {
      toast.error("Failed to add task");
    }
  }

  async function toggleTask(task: Task) {
    try {
      const res = await fetch(`/api/admin/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      });
      if (res.ok) {
        setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
      }
    } catch {
      toast.error("Failed to update task");
    }
  }

  async function deleteTask(id: number) {
    try {
      const res = await fetch(`/api/admin/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTasks(tasks.filter(t => t.id !== id));
        toast.success("Task deleted");
      }
    } catch {
      toast.error("Failed to delete task");
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Add Task */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="What needs to be done today?"
              className="w-full pl-6 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button 
              onClick={addTask}
              className="px-6 py-3 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2"
            >
              <Plus size={16} /> Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <motion.div
              layout
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`group p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                task.completed ? "bg-gray-50/50 border-gray-100 opacity-60" : "bg-white border-gray-100 shadow-sm"
              }`}
            >
              <button 
                onClick={() => toggleTask(task)}
                className={`transition-colors ${task.completed ? "text-green-500" : "text-gray-300 hover:text-gray-400"}`}
              >
                {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </button>
              
              <div className="flex-1">
                <p className={`text-sm font-bold ${task.completed ? "line-through text-gray-400" : "text-gray-900"}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${
                    task.priority === 'high' ? 'text-red-500' : 
                    task.priority === 'medium' ? 'text-orange-500' : 
                    'text-blue-500'
                  }`}>
                    <AlertCircle size={10} /> {task.priority} Priority
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Clock size={10} /> {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => deleteTask(task.id)}
                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {!loading && tasks.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <CheckSquare size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">All caught up!</h3>
            <p className="text-sm text-gray-500 font-medium">No pending tasks for today.</p>
          </div>
        )}
      </div>
    </div>
  );
}
