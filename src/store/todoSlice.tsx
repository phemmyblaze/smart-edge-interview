import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { Task, TasksState, CreateTaskData, UpdateTaskData } from '../../types'
const BaseUrl = "http://localhost:3500"


export const fetchTasks = createAsyncThunk<Task[]>(
    'tasks/fetchTasks',

    async () => {
        const response = await fetch(`${BaseUrl}/todos`);
        return response.json();
    }
)

export const createTask = createAsyncThunk<Task, CreateTaskData>(
    "tasks/createTask",
    async (taskData) => {
        const response = await fetch((`${BaseUrl}/todos`), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(taskData)
        })
        return response.json()
    }
)


export const updateTask = createAsyncThunk<Task, UpdateTaskData>(
    "tasks/updateTask",
    async ({id, updates}) => {
        const response = await fetch(`${BaseUrl}/todos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updates)
        })
        return response.json()
    }
)

export const deleteTask = createAsyncThunk<string, string>( 
    "tasks/deleteTask",
    async (id) => {
        await fetch(`${BaseUrl}/todos/${id}`, {
            method: "DELETE"
        });
        return id; 
    }
)

const initialState: TasksState = {
  items: [],
  status: 'idle',
  error: null,
  filter: 'all',
}

const taskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        taskAdded: (state, action: PayloadAction<Task>) => {
            state.items.push(action.payload)
        }, 
        taskUpdated: (state, action: PayloadAction<Task>) => {
            const index = state.items.findIndex(task => task.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = {...state.items[index], ...action.payload}
            }
        },
        taskDelete: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(task => task.id !== action.payload)
        }, 
        setFilter: (state, action: PayloadAction<'all' | 'completed' | 'pending'>) => {
            state.filter = action.payload;
        },


        taskUpdateRealTime: (state, action: PayloadAction<Task>) => {
            const index = state.items.findIndex(task => task.id = action.payload.id);
            if(index !== -1) {
                state.items[index] = action.payload
            } else {
                state.items.push(action.payload)
            }
        },
        taskDeleteRealTime: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(task => task.id !== action.payload)
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.status = "loading"
            })
            .addCase(fetchTasks.fulfilled, (state) => {
                state.status = "succeeded"
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.error.message || 'Failed to fetch tasks'
            })


            .addCase(createTask.pending, (state) => {
                state.status = "loading"
            })
            .addCase(createTask.fulfilled, (state, action) => {
               state.items.push(action.payload)
            })
            .addCase(createTask.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.error.message || 'Failed to create task'
            })


            .addCase(updateTask.pending, (state) => {
                state.status = "loading"
            })

            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state.items.findIndex(task => task.id === action.payload.id)
                if(index !== -1) {
                    state.items[index] = action.payload
                }
            })

            .addCase(deleteTask.fulfilled, (state, action) => {
                state.items = state.items.filter(task => task.id !== action.payload)
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to delete task'
            })



           
    }
})

export const  {
    taskAdded,
    taskUpdated,
    taskDelete,
    setFilter,
    taskUpdateRealTime,
    taskDeleteRealTime
} = taskSlice.actions;

export const selectAllTasks = (state: { tasks: TasksState }) => state.tasks.items
export const selectTasksStatus = (state: { tasks: TasksState }) => state.tasks.status
export const selectTasksError = (state: { tasks: TasksState }) => state.tasks.error
export const selectTasksFilter = (state: { tasks: TasksState }) => state.tasks.filter

export const selectFilteredTasks = (state: { tasks: TasksState }) => {
  const allTasks = selectAllTasks(state)
  const filter = selectTasksFilter(state)
  
  switch (filter) {
    case 'completed':
      return allTasks.filter(task => task.completed)
    case 'pending':
      return allTasks.filter(task => !task.completed)
    default:
      return allTasks
  }
}

export default taskSlice.reducer