import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { TaskListEntity } from '../../../api/content/types/globals';
import { PageContentValues } from '../../../api/content/types/page';
import { EngagementEvents } from '../../../api/mdp/types';
import { useApiCallback } from '../../hooks/useApi';
import { useAuthContext } from '../auth/AuthContext';
import { ProcessedTask, TaskListDisplayValues } from './types';
import { extractTaskListDisplayValues, filterIncompleteTaskListItems, filterTasksListForDisplay } from './utils';

interface NotificationTask {
  taskListContainer?: TaskListEntity[] | null | undefined;
}

const context = createContext<{
  loading: boolean;
  incompleteTasks: ProcessedTask[];
  showTaskListBell: boolean;
  taskListDisplayValues: TaskListDisplayValues | null;
  filterTasksListForDisplay: (data: PageContentValues['elements']) => ProcessedTask[];
  refreshEngagementEvents: () => Promise<void>;
}>(undefined as any);

export const useTaskListContext = () => {
  if (!context) {
    throw new Error('useTaskListContext should be used');
  }
  return useContext(context);
};

let preservedEvents: EngagementEvents['events'] | null | undefined = null;

export const TaskListProvider: React.FC<React.PropsWithChildren<NotificationTask>> = ({
  children,
  taskListContainer,
}) => {
  const { isAuthenticated } = useAuthContext();
  const engagementEvents = useApiCallback(async api => {
    const result = await api.mdp.engagementEvents();
    preservedEvents = result.data.events;
    return result;
  });

  useEffect(() => {
    if (isAuthenticated && engagementEvents.status === 'not-requested' && !preservedEvents) {
      engagementEvents.execute();
    }
  }, [isAuthenticated, engagementEvents.status]);

  return (
    <context.Provider
      value={useMemo(
        () => ({
          loading: engagementEvents.loading,
          incompleteTasks: filterIncompleteTaskListItems(taskListContainer, preservedEvents ?? []),
          taskListDisplayValues: extractTaskListDisplayValues(taskListContainer),
          showTaskListBell: !!taskListContainer?.length,
          filterTasksListForDisplay: (data: PageContentValues['elements']) =>
            filterTasksListForDisplay(data, preservedEvents ?? []),
          refreshEngagementEvents: async () => {
            if (engagementEvents.loading) {
              return;
            }
            await engagementEvents.execute();
          },
        }),
        [taskListContainer, engagementEvents.result?.data.events, engagementEvents.loading],
      )}
    >
      {children}
    </context.Provider>
  );
};
