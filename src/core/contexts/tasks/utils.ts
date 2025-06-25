import { TaskListEntity, TasksElement } from '../../../api/content/types/globals';
import { PageContentValues } from '../../../api/content/types/page';
import { EngagementEventStatus, EngagementEvents } from '../../../api/mdp/types';
import { ProcessedTask, TaskListDisplayValues } from './types';

export const filterTasksListForDisplay = (
  contentData: PageContentValues['elements'],
  engagementEvents?: EngagementEvents['events'],
): ProcessedTask[] => {
  if (!contentData || !engagementEvents) return [];

  return (contentData?.tasks?.values
    ?.filter(task => !!task.elements && engagementEvents.find(event => event.event === task.elements.taskId?.value))
    .map(task => formatTask(engagementEvents)(task.elements))
    .sort(sortByStatus)
    .slice(0, contentData?.taskLimit?.value || 3) ?? []) as ProcessedTask[];
};

export const filterIncompleteTaskListItems = (
  taskListContainer: TaskListEntity[] | null | undefined,
  engagementEvents?: EngagementEvents['events'],
) => {
  if (!taskListContainer || !engagementEvents) return [];

  const container = findTaskContainer(taskListContainer);
  if (!container) return [];

  const tasksData = container.elements.tasks;
  const taskLimit = container.elements.taskLimit?.value || 3;
  const tasks = (tasksData?.values ?? (tasksData?.value ? [tasksData.value] : [])).map(task => task.elements);

  return tasks
    .map(formatTask(engagementEvents))
    .filter(task => !!task && task.status !== 'COMPLETE')
    .sort(sortByStatus)
    .slice(0, taskLimit) as ProcessedTask[];
};

export function extractTaskListDisplayValues(
  taskListContainer: TaskListEntity[] | null | undefined,
): TaskListDisplayValues | null {
  const container = findTaskContainer(taskListContainer, true);

  if (!container) return null;

  return {
    caption: container?.elements.caption?.value || '',
    captionIfZero: container?.elements.captionIfZero?.value || '',
    taskIconIfDone: container?.elements.taskIconIfDone?.value,
    taskIconIfTodo: container?.elements.taskIconIfToDo?.value,
    iconIfZero: container?.elements.taskIconIfZero?.value,
  };
}

const formatTask = (engagementEvents?: EngagementEvents['events']) => (task: TasksElement) => {
  const matchingEvent = engagementEvents?.find(event => event.event === task.taskId?.value);

  if (!matchingEvent) {
    return null;
  }

  const getDisplayText = (task: TasksElement, status?: EngagementEventStatus) => {
    if (status === 'COMPLETE' && task.taskTextIfComplete?.value) {
      return task.taskTextIfComplete.value;
    }
    if (status === 'REVIEW' && task.taskTextIfToReview?.value) {
      return task.taskTextIfToReview.value;
    }
    return task.taskText?.value;
  };

  return {
    taskId: task.taskId?.value,
    taskDestination: task.taskDestination?.value,
    taskDisplayText: getDisplayText(task, matchingEvent?.status),
    status: matchingEvent?.status || 'INCOMPLETE',
    isCompleted: matchingEvent?.status === 'COMPLETE',
  };
};

const findTaskContainer = (taskListContainer: TaskListEntity[] | null | undefined, withCaption = false) =>
  taskListContainer?.find(
    block =>
      block.elements.key?.value === 'navTaskContainer' &&
      (withCaption ? !!(block.elements.caption?.value || block.elements.captionIfZero?.value) : true),
  );

const sortByStatus = (a: ProcessedTask | null, b: ProcessedTask | null) => {
  if (!a || !b) return 0;

  const statusOrder = {
    INCOMPLETE: 1,
    REVIEW: 2,
    COMPLETE: 3,
  };
  return statusOrder[a.status] - statusOrder[b.status] || 0;
};
