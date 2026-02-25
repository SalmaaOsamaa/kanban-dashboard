import { useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import type { Task } from '../types';

const PAGE_SIZE = 5;

export const useColumnTasks = (columnId: string, search: string) => {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['column-tasks', columnId, search],
    queryFn: ({ pageParam }) => taskService.getByColumn(columnId, pageParam, PAGE_SIZE),
    getNextPageParam: (lastPage) => lastPage.next,
    initialPageParam: 1,
    placeholderData: keepPreviousData,
  });

  let tasks: Task[] = data?.pages.flatMap(p => p.data) ?? [];

  if (search?.trim()) {
    const term = search.trim().toLowerCase();
    tasks = tasks.filter(t =>
      t.title.toLowerCase().includes(term) ||
      t.description.toLowerCase().includes(term)
    );
  }

  return {
    tasks: tasks.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    total: data?.pages[0]?.items ?? 0,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
  };
};
