export interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
}

export interface ColumnData {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

export const columns: ColumnData[] = [
  {
    id: 'todo',
    title: 'TO DO',
    color: '#3b82f6',
    tasks: [
      { id: '1', title: 'API integration', description: 'Connect frontend to REST API endpoints', priority: 'HIGH' },
      { id: '2', title: 'Unit tests', description: 'Write tests for utility functions and hooks', priority: 'LOW' },
      { id: '3', title: 'Performance audit', description: 'Lighthouse scores and bundle analysis', priority: 'LOW' },
      { id: '4', title: 'Notification system', description: 'Toast notifications and in-app alerts', priority: 'MEDIUM' },
      { id: '5', title: 'User settings page', description: 'Profile editing, preferences, and account management', priority: 'LOW' },
    ],
  },
  {
    id: 'in-progress',
    title: 'IN PROGRESS',
    color: '#f59e0b',
    tasks: [
      { id: '6', title: 'Authentication flow', description: 'Implement login, signup, and password reset screens', priority: 'HIGH' },
      { id: '7', title: 'File upload component', description: 'Drag and drop file upload with preview', priority: 'MEDIUM' },
    ],
  },
  {
    id: 'in-review',
    title: 'IN REVIEW',
    color: '#8b5cf6',
    tasks: [
      { id: '8', title: 'Dark mode support', description: 'Add theme toggle and CSS variable switching', priority: 'MEDIUM' },
      { id: '9', title: 'Dashboard layout', description: 'Build responsive sidebar and main content area', priority: 'MEDIUM' },
    ],
  },
  {
    id: 'done',
    title: 'DONE',
    color: '#10b981',
    tasks: [
      { id: '10', title: 'Design system tokens', description: 'Set up color palette, typography, and spacing scales', priority: 'HIGH' },
    ],
  },
];
