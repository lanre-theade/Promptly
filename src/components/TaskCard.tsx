import { useState } from 'react'
import type { Task } from '../App'

interface TaskCardProps {
  task: Task
  onToggleComplete: (id: string) => void
  isSelected: boolean
  onToggleSelect: (id: string) => void
}

function TaskCard({ task, onToggleComplete, isSelected, onToggleSelect }: TaskCardProps) {
  const [isCompleting, setIsCompleting] = useState(false)

  const handleToggle = () => {
    if (isCompleting) return
    setIsCompleting(true)
    setTimeout(() => {
      onToggleComplete(task.id)
      setIsCompleting(false)
    }, 500)
  }

  const showRightCheck = task.completed || isCompleting

  return (
    <div className={`task-card ${isCompleting ? 'completing' : ''}`}>
      <div
        className={`task-checkbox-left ${isSelected ? 'checked' : ''}`}
        onClick={() => onToggleSelect(task.id)}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggleSelect(task.id)
          }
        }}
        aria-label={isSelected ? 'Deselect task' : 'Select task'}
      >
        {isSelected && (
          <svg className="task-checkmark-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>

      <span className="task-text">{task.text}</span>

      <div
        className={`task-circle-right ${showRightCheck ? 'checked' : ''}`}
        onClick={handleToggle}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') handleToggle()
        }}
        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        <svg className="circle-checkmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    </div>
  )
}

export default TaskCard
