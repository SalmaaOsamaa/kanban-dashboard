import {config} from '../config'
import type {Task, TaskFormState, PaginatedResponse} from '../types'

export type TaskUpdate = Partial<TaskFormState> & { order?: number };

export const taskService = {
    getAll: async (search?: string): Promise<Task[]> => {
        const res = await fetch(`${config.apiURL}/tasks`);
        if (!res.ok) throw new Error('Failed to fetch tasks');
        const tasks: Task[] = await res.json();

        if (!search?.trim()) return tasks;
        const term = search.trim().toLowerCase();
        return tasks.filter(
          t => t.title.toLowerCase().includes(term) || t.description.toLowerCase().includes(term)
        );
      },

    getByColumn: async (column: string, page: number, limit: number): Promise<PaginatedResponse> => {
        const params = new URLSearchParams({
          column,
          _sort: 'order',
          _page: String(page),
          _per_page: String(limit),
        });
        const res = await fetch(`${config.apiURL}/tasks?${params}`);
        if (!res.ok) throw new Error('Failed to fetch tasks');
        return res.json();
      },

    getCount: async (): Promise<number> => {
        const params = new URLSearchParams({ _page: '1', _per_page: '1' });
        const res = await fetch(`${config.apiURL}/tasks?${params}`);
        if (!res.ok) return 0;
        const json = await res.json();
        return json.items ?? 0;
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