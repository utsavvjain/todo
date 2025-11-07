'use client'

import { useState, useEffect } from 'react'

interface Todo {
  id: number
  title: string
  completed: boolean
  createdAt: string
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')

  const fetchTodos = async () => {
    try {
      const res = await fetch('/api/todos')
      const data = await res.json()
      console.log(data, 'data from fetchTodos')
      
      // Check if the response is an error or if data is an array
      if (Array.isArray(data)) {
        setTodos(data)
      } else {
        console.error('API returned non-array:', data)
        setTodos([])
      }
    } catch (error) {
      console.error('Failed to fetch todos:', error)
      setTodos([])
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTodo })
    })
    if (res.ok) {
      setNewTodo('')
      fetchTodos()
    }
  }

  const toggleTodo = async (id: number, completed: boolean) => {
    await fetch(`/api/todos/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed })
    })
    fetchTodos()
  }

  const deleteTodo = async (id: number) => {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' })
    fetchTodos()
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">TODO App</h1>
        <form onSubmit={addTodo} className="mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Add Todo
          </button>
        </form>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center justify-between p-2 border-b">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id, todo.completed)}
                  className="mr-2"
                />
                <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                  {todo.title}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
