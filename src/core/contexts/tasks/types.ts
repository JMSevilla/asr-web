import { EngagementEventStatus } from '../../../api/mdp/types';

export interface ProcessedTask {
  taskId: string;
  taskDestination: string;
  taskDisplayText: string;
  status: EngagementEventStatus;
  isCompleted: boolean;
}

export interface TaskListDisplayValues {
  caption: string;
  captionIfZero: string;
  taskIconIfDone?: string;
  taskIconIfTodo?: string;
  iconIfZero?: string;
}
