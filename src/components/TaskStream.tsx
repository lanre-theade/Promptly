import type { Task } from '../App'
import TaskCard from './TaskCard'

interface TaskStreamProps {
  tasks: Task[]
  onToggleComplete: (id: string) => void
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
}

function TaskStream({ tasks, onToggleComplete, selectedIds, onToggleSelect }: TaskStreamProps) {
  if (tasks.length === 0) {
    return (
      <div className="task-stream">
        <p style={{ opacity: 0.35, textAlign: 'center', marginTop: 40, fontSize: 14 }}>
          No tasks yet
        </p>
      </div>
    )
  }

  return (
    <div className="task-stream">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          isSelected={selectedIds.has(task.id)}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </div>
  )
}

export default TaskStream
