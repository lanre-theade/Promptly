import { useState, useCallback, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import BottomInputBar from './components/BottomInputBar'
import TaskStream from './components/TaskStream'
import './App.css'

export interface Task {
  id: string
  text: string
  completed: boolean
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('promptly-tasks')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return []
      }
    }
    return []
  })
  const [activeTab, setActiveTab] = useState<'all' | 'completed'>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem('promptly-tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  const addTask = useCallback((text: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
    }
    setTasks(prev => [...prev, newTask])
  }, [])

  const toggleCompleteTask = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }, [])

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const deleteSelected = useCallback(() => {
    const count = selectedIds.size
    setTasks(prev => prev.filter(t => !selectedIds.has(t.id)))
    setSelectedIds(new Set())
    setToastMessage(`Deleted ${count} ${count === 1 ? 'task' : 'tasks'}`)
  }, [selectedIds])

  const isEmpty = tasks.length === 0
  const allTasks = tasks.filter(t => !t.completed)
  const completedTasks = tasks.filter(t => t.completed)
  const visibleTasks = activeTab === 'all' ? allTasks : completedTasks
  const hasSelection = selectedIds.size > 0

  return (
    <div className="app-container">
      <div className="app-inner">
        {isEmpty ? (
          <header className="app-header">
            <h1 className="app-title">Promptly</h1>
          </header>
        ) : (
          <header className="app-header">
            <div className="app-header-top">
              <h1 className="app-title">Tasks</h1>
              {hasSelection && (
                <div className="header-actions">
                  <button className="cancel-button" onClick={() => setSelectedIds(new Set())}>
                    Cancel
                  </button>
                  <button className="delete-button" onClick={deleteSelected}>
                    Delete
                  </button>
                </div>
              )}
            </div>
            <p className="task-counter">
              {activeTab === 'all'
                ? `Showing ${visibleTasks.length} ${visibleTasks.length === 1 ? 'task' : 'tasks'}`
                : `Showing ${completedTasks.length}/${tasks.length} tasks`
              }
            </p>
            <nav className="tab-bar">
              <button
                className={`tab-item ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button
                className={`tab-item ${activeTab === 'completed' ? 'active' : ''}`}
                onClick={() => setActiveTab('completed')}
              >
                Completed
              </button>
            </nav>
          </header>
        )}
        {isEmpty ? (
          <div className="empty-state">
            <img className="empty-art" src="/empty-illustration.svg" alt="" />
            <p className="greeting">Hello Lanre,</p>
            <p className="greeting-sub">Let's set up your tasks for today!</p>
          </div>
        ) : (
          <TaskStream
            tasks={visibleTasks}
            onToggleComplete={toggleCompleteTask}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
          />
        )}
      </div>
      <BottomInputBar onAdd={addTask} />
      {toastMessage && <div className="toast">{toastMessage}</div>}
      <Analytics />
    </div>
  )
}

export default App
