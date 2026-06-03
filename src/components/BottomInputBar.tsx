import { useState, type FormEvent } from 'react'

interface BottomInputBarProps {
  onAdd: (text: string) => void
}

function BottomInputBar({ onAdd }: BottomInputBarProps) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setValue('')
  }

  return (
    <form className="bottom-input-bar" onSubmit={handleSubmit}>
      <div className="bottom-input-bar-inner">
        <input
          className="bottom-input"
          type="text"
          placeholder="Got something to do? Type it here..."
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <button type="submit" className="add-button">
          Add new
        </button>
      </div>
    </form>
  )
}

export default BottomInputBar
