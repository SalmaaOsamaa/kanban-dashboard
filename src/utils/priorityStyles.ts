export const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return { bgcolor: '#fee2e2', color: '#ef4444' };
      case 'MEDIUM':
        return { bgcolor: '#ffedd5', color: '#f97316' };
      case 'LOW':
        return { bgcolor: '#f3f4f6', color: '#6b7280' };
      default:
        return { bgcolor: '#f3f4f6', color: '#6b7280' };
    }
  };