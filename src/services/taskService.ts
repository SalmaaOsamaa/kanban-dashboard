// this file will be interacting with the apis to get the task data and also perform all the CRUD operations on the task

import {config} from '../config'
import type {Task, TaskFormState} from '../types'

export type TaskUpdate = Partial<TaskFormState> & { order?: number };

export const taskService = {
    getAll: async (): Promise<Task[]> => {
        const res = await fetch(`${config.apiURL}/tasks`);
        if (!res.ok) throw new Error('Failed to fetch tasks');
        return res.json();
      },
      create: async (task: Omit<Task, 'id'>): Promise<Task> => {
        const res = await fetch(`${config.apiURL}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task),
        });
        if (!res.ok) throw new Error('Failed to create task');
        return res.json();
      },
      update: async (id: string, data: TaskUpdate): Promise<Task> => {
        const res = await fetch(`${config.apiURL}/tasks/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update task');
        return res.json();
      },
      delete: async (id: string): Promise<void> => {
        const res = await fetch(`${config.apiURL}/tasks/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete task');
      },
}