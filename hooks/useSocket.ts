import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import io, { Socket } from 'socket.io-client'
import { taskUpdateRealTime, taskDeleteRealTime } from '../src/store/todoSlice'
import type { Task } from '../types'

export const useSocket = (): void => {
  const dispatch = useDispatch()

  useEffect(() => {
    const socket: Socket = io('http://localhost:3000')

    socket.on('connect', () => {
      console.log('Connected to server')
    })

    socket.on('taskUpdated', (task: Task) => {
      dispatch(taskUpdateRealTime(task))
    })

    socket.on('taskDeleted', (taskId: string) => {
      dispatch(taskDeleteRealTime(taskId))
    })


    socket.on('disconnect', () => {
      console.log('Disconnected from server')
    })

    return () => {
      socket.disconnect()
    }
  }, [dispatch])
}