export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
}

export interface TasksState {
  items: Task[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  filter: 'all' | 'completed' | 'pending'
}

export interface CreateTaskData {
  title: string
  description?: string
  priority?: 'low' | 'medium' | 'high'
}

export interface UpdateTaskData {
  id: string
  updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}