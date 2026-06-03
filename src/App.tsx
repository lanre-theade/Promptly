import { useState, useCallback } from 'react'
import BottomInputBar from './components/BottomInputBar'
import TaskStream from './components/TaskStream'
import './App.css'

export interface Task {
  id: string
  text: string
  completed: boolean
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'completed'>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const addTask = useCallback((text: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
    }
    setTasks(prev => [...prev, newTask])
  }, [])

  const completeTask = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: true } : t))
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
    setTasks(prev => prev.filter(t => !selectedIds.has(t.id)))
    setSelectedIds(new Set())
  }, [selectedIds])

  const isEmpty = tasks.length === 0
  const allTasks = tasks.filter(t => !t.completed)
  const completedTasks = tasks.filter(t => t.completed)
  const visibleTasks = activeTab === 'all' ? allTasks : completedTasks
  const hasSelection = selectedIds.size > 0

  return (
    <div className="app-container">
      {!isEmpty && (
        <header className="app-header">
          <div className="app-header-top">
            <h1 className="app-title">Tasks</h1>
            {hasSelection && (
              <button className="delete-button" onClick={deleteSelected}>
                Delete
              </button>
            )}
          </div>
          <p className="task-counter">
            Showing {visibleTasks.length} {visibleTasks.length === 1 ? 'task' : 'tasks'}
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
          <p className="greeting">Hello Lanre, let's set up your goals for today.</p>
        </div>
      ) : (
        <TaskStream
          tasks={visibleTasks}
          onComplete={completeTask}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
        />
      )}
      <BottomInputBar onAdd={addTask} />
    </div>
  )
}

export default App
