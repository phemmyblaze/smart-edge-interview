import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

const BaseUrl = "http://localhost:3500"


export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',

    async () => {
        const response = await fetch(`${BaseUrl}/todos`);
        return response.json();
    }
)

export const createTask = createAsyncThunk(
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


export const updateTask = createAsyncThunk(
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

export const deleteTask = createAsyncThunk( 
    "tasks/deleteTask",
    async (id) => {
        await fetch(`${BaseUrl}/todos/${id}`, {
            method: "DELETE"
        });
        return id; 
    }
)

const initialState = {
    items: [],
    state: "idle",
    error: null,
    filter: "all"
}

const taskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        taskAdded: (state, action) => {
            state.items.push(action.payload)
        }, 
        taskUpdated: (state, action) => {
            const index = state.items.findIndex(task => task.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = {...state.items[index], ...action.payload}
            }
        },
        taskDelete: (state, action) => {
            state.items = state.items.filter(task => task.id !== action.payload)
        }, 
        setFilter: (state, action) => {
            state.filter = action.payload;
        },


        taskUpdateRealTime: (state, action) => {
            const index = state.items.findIndex(task => task.id = action.payload.id);
            if(index !== -1) {
                state.items[index] = action.payload
            } else {
                state.items.push(action.payload)
            }
        },
        taskDeleteRealTime: (state, action) => {
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
                state.error = action.error.message
            })


            .addCase(createTask.pending, (state) => {
                state.status = "loading"
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.items.push = (action.payload)
            })
            .addCase(createTask.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.error.message
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

            .addCase(deleteTask.pending, (state) => {
                state.items = state.items.filter(task => task.id !== action.payload)
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

export const selectAllTasks = (state) => state.tasks.items
export const selectTaskStatus = (state) => state.task.status
export const selectTaskError =  (state) => state.task.error