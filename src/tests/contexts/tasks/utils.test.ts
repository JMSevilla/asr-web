import { TaskListEntity } from '../../../api/content/types/globals';
import { PageContentValues } from '../../../api/content/types/page';
import { EngagementEventStatus } from '../../../api/mdp/types';
import {
  extractTaskListDisplayValues,
  filterIncompleteTaskListItems,
  filterTasksListForDisplay,
} from '../../../core/contexts/tasks/utils';

const createString = (value: string) => ({ value });
const createNumber = (value: number) => ({ value });

describe('filterTasksListForDisplay', () => {
  it('returns empty array when no content data or engagement events', () => {
    expect(filterTasksListForDisplay({} as PageContentValues['elements'], [])).toEqual([]);
    expect(filterTasksListForDisplay({} as PageContentValues['elements'], undefined)).toEqual([]);
  });

  it('filters and formats tasks from content data', () => {
    const contentData = {
      tasks: {
        values: [
          {
            elements: {
              taskId: createString('T1'),
              taskDestination: createString('/t1'),
              taskText: createString('Task 1'),
              taskTextIfComplete: createString('Task 1 Complete'),
              taskTextIfToReview: createString('Task 1 Review'),
            } as any,
            type: 'Task',
          },
          {
            elements: {
              taskId: createString('T2'),
              taskDestination: createString('/t2'),
              taskText: createString('Task 2'),
              taskTextIfComplete: createString('Task 2 Complete'),
              taskTextIfToReview: createString('Task 2 Review'),
            } as any,
            type: 'Task',
          },
          {
            elements: {
              taskId: createString('T3'),
              taskDestination: createString('/t3'),
              taskText: createString('Task 3'),
              taskTextIfComplete: createString('Task 3 Complete'),
              taskTextIfToReview: createString('Task 3 Review'),
            } as any,
            type: 'Task',
          },
        ],
      },
      taskLimit: { value: 2 },
    } as PageContentValues['elements'];

    const engagementEvents = [
      { event: 'T1', status: 'INCOMPLETE' as EngagementEventStatus },
      { event: 'T2', status: 'COMPLETE' as EngagementEventStatus },
      { event: 'T3', status: 'REVIEW' as EngagementEventStatus },
    ];

    const result = filterTasksListForDisplay(contentData, engagementEvents);

    // Should only return 2 tasks due to taskLimit
    expect(result.length).toBe(2);

    // Should be ordered by status (INCOMPLETE, REVIEW, COMPLETE)
    expect(result[0].taskId).toBe('T1');
    expect(result[0].taskDisplayText).toBe('Task 1');
    expect(result[0].status).toBe('INCOMPLETE');
    expect(result[0].isCompleted).toBe(false);

    expect(result[1].taskId).toBe('T3');
    expect(result[1].taskDisplayText).toBe('Task 3 Review');
    expect(result[1].status).toBe('REVIEW');
    expect(result[1].isCompleted).toBe(false);
  });

  it('filters out tasks that do not have matching engagement events', () => {
    const contentData = {
      tasks: {
        values: [
          {
            elements: {
              taskId: createString('T1'),
              taskDestination: createString('/t1'),
              taskText: createString('Task 1'),
            } as any,
            type: 'Task',
          },
          {
            elements: {
              taskId: createString('T2'),
              taskDestination: createString('/t2'),
              taskText: createString('Task 2'),
            } as any,
            type: 'Task',
          },
          {
            elements: {
              taskId: createString('T3'),
              taskDestination: createString('/t3'),
              taskText: createString('Task 3'),
            } as any,
            type: 'Task',
          },
        ],
      },
      taskLimit: { value: 5 },
    } as PageContentValues['elements'];

    // Only T1 and T3 have matching engagement events, T2 should be filtered out
    const engagementEvents = [
      { event: 'T1', status: 'INCOMPLETE' as EngagementEventStatus },
      { event: 'T3', status: 'COMPLETE' as EngagementEventStatus },
    ];

    const result = filterTasksListForDisplay(contentData, engagementEvents);

    expect(result.length).toBe(2);
    expect(result.find(task => task.taskId === 'T1')).toBeDefined();
    expect(result.find(task => task.taskId === 'T3')).toBeDefined();
    expect(result.find(task => task.taskId === 'T2')).toBeUndefined();
  });

  it('returns empty array when no tasks have matching engagement events', () => {
    const contentData = {
      tasks: {
        values: [
          {
            elements: {
              taskId: createString('T1'),
              taskDestination: createString('/t1'),
              taskText: createString('Task 1'),
            } as any,
            type: 'Task',
          },
          {
            elements: {
              taskId: createString('T2'),
              taskDestination: createString('/t2'),
              taskText: createString('Task 2'),
            } as any,
            type: 'Task',
          },
        ],
      },
      taskLimit: { value: 5 },
    } as PageContentValues['elements'];

    // No matching engagement events
    const engagementEvents = [{ event: 'T99', status: 'INCOMPLETE' as EngagementEventStatus }];

    const result = filterTasksListForDisplay(contentData, engagementEvents);
    expect(result).toEqual([]);
  });

  it('handles tasks with missing elements', () => {
    // Create a modified content data structure with one item that will be filtered out
    const contentData = {
      tasks: {
        values: [
          {
            elements: {
              taskId: createString('T1'),
              taskDestination: createString('/t1'),
              taskText: createString('Task 1'),
            } as any,
            type: 'Task',
          },
          // This item will be filtered out by the ?.filter(task => !!task.elements) check
          { type: 'Task' } as any,
          {
            elements: {
              taskId: createString('T3'),
              taskDestination: createString('/t3'),
              taskText: createString('Task 3'),
            } as any,
            type: 'Task',
          },
        ],
      },
      taskLimit: { value: 3 },
    } as PageContentValues['elements'];

    const engagementEvents = [
      { event: 'T1', status: 'INCOMPLETE' as EngagementEventStatus },
      { event: 'T3', status: 'INCOMPLETE' as EngagementEventStatus },
    ];

    const result = filterTasksListForDisplay(contentData, engagementEvents);
    expect(result.length).toBe(2); // Should filter out the item without elements
  });
});

describe('filterIncompleteTaskListItems', () => {
  it('returns empty array when no task list container or engagement events', () => {
    expect(filterIncompleteTaskListItems(null, [])).toEqual([]);
    expect(filterIncompleteTaskListItems([], undefined)).toEqual([]);
  });

  it('returns empty array when no matching task container found', () => {
    const taskListContainer = [
      {
        type: 'TaskList',
        elements: {
          key: createString('not-nav-container'), // Different key, won't match
          tasks: { values: [] },
        },
      },
    ] as TaskListEntity[];

    expect(filterIncompleteTaskListItems(taskListContainer, [])).toEqual([]);
  });

  it('filters incomplete tasks and applies limit', () => {
    const taskListContainer = [
      {
        type: 'TaskList',
        elements: {
          key: createString('navTaskContainer'),
          taskLimit: createNumber(2),
          tasks: {
            values: [
              {
                elements: {
                  taskId: createString('N1'),
                  taskDestination: createString('/n1'),
                  taskText: createString('Notification 1'),
                  taskTextIfComplete: createString('Complete 1'),
                  taskTextIfToReview: createString('Review 1'),
                } as any,
                type: 'Task',
              },
              {
                elements: {
                  taskId: createString('N2'),
                  taskDestination: createString('/n2'),
                  taskText: createString('Notification 2'),
                  taskTextIfComplete: createString('Complete 2'),
                  taskTextIfToReview: createString('Review 2'),
                } as any,
                type: 'Task',
              },
              {
                elements: {
                  taskId: createString('N3'),
                  taskDestination: createString('/n3'),
                  taskText: createString('Notification 3'),
                  taskTextIfComplete: createString('Complete 3'),
                  taskTextIfToReview: createString('Review 3'),
                } as any,
                type: 'Task',
              },
            ],
          },
        },
      },
    ] as TaskListEntity[];

    const engagementEvents = [
      { event: 'N1', status: 'INCOMPLETE' as EngagementEventStatus },
      { event: 'N2', status: 'COMPLETE' as EngagementEventStatus },
      { event: 'N3', status: 'REVIEW' as EngagementEventStatus },
    ];

    const result = filterIncompleteTaskListItems(taskListContainer, engagementEvents);

    // Should only return 2 items due to taskLimit, and filter out COMPLETE tasks
    expect(result.length).toBe(2);
    expect(result[0].taskId).toBe('N1');
    expect(result[0].status).toBe('INCOMPLETE');
    expect(result[0].isCompleted).toBe(false);
    expect(result[1].taskId).toBe('N3');
    expect(result[1].status).toBe('REVIEW');
    expect(result[1].isCompleted).toBe(false);
  });

  it('filters out tasks without matching engagement events', () => {
    const taskListContainer = [
      {
        type: 'TaskList',
        elements: {
          key: createString('navTaskContainer'),
          taskLimit: createNumber(5),
          tasks: {
            values: [
              {
                elements: {
                  taskId: createString('N1'),
                  taskDestination: createString('/n1'),
                  taskText: createString('Notification 1'),
                } as any,
                type: 'Task',
              },
              {
                elements: {
                  taskId: createString('N2'),
                  taskDestination: createString('/n2'),
                  taskText: createString('Notification 2'),
                } as any,
                type: 'Task',
              },
              {
                elements: {
                  taskId: createString('N3'),
                  taskDestination: createString('/n3'),
                  taskText: createString('Notification 3'),
                } as any,
                type: 'Task',
              },
            ],
          },
        },
      },
    ] as TaskListEntity[];

    // Only N1 and N3 have matching engagement events
    const engagementEvents = [
      { event: 'N1', status: 'INCOMPLETE' as EngagementEventStatus },
      { event: 'N3', status: 'REVIEW' as EngagementEventStatus },
    ];

    const result = filterIncompleteTaskListItems(taskListContainer, engagementEvents);

    expect(result.length).toBe(2);
    expect(result.find(task => task.taskId === 'N1')).toBeDefined();
    expect(result.find(task => task.taskId === 'N3')).toBeDefined();
    expect(result.find(task => task.taskId === 'N2')).toBeUndefined();
  });

  it('returns empty array when no tasks have matching engagement events', () => {
    const taskListContainer = [
      {
        type: 'TaskList',
        elements: {
          key: createString('navTaskContainer'),
          taskLimit: createNumber(5),
          tasks: {
            values: [
              {
                elements: {
                  taskId: createString('N1'),
                  taskDestination: createString('/n1'),
                  taskText: createString('Notification 1'),
                } as any,
                type: 'Task',
              },
            ],
          },
        },
      },
    ] as TaskListEntity[];

    // No matching engagement events
    const engagementEvents = [{ event: 'N99', status: 'INCOMPLETE' as EngagementEventStatus }];

    const result = filterIncompleteTaskListItems(taskListContainer, engagementEvents);
    expect(result).toEqual([]);
  });

  it('handles the case when tasks is a single value not in an array', () => {
    const taskListContainer = [
      {
        type: 'TaskList',
        elements: {
          key: createString('navTaskContainer'),
          taskLimit: createNumber(1),
          tasks: {
            value: {
              elements: {
                taskId: createString('N1'),
                taskDestination: createString('/n1'),
                taskText: createString('Notification 1'),
              } as any,
              type: 'Task',
            },
          },
        },
      },
    ] as TaskListEntity[];

    const engagementEvents = [{ event: 'N1', status: 'INCOMPLETE' as EngagementEventStatus }];

    const result = filterIncompleteTaskListItems(taskListContainer, engagementEvents);
    expect(result.length).toBe(1);
    expect(result[0].taskId).toBe('N1');
  });

  it('handles single value task without matching engagement event', () => {
    const taskListContainer = [
      {
        type: 'TaskList',
        elements: {
          key: createString('navTaskContainer'),
          taskLimit: createNumber(1),
          tasks: {
            value: {
              elements: {
                taskId: createString('N1'),
                taskDestination: createString('/n1'),
                taskText: createString('Notification 1'),
              } as any,
              type: 'Task',
            },
          },
        },
      },
    ] as TaskListEntity[];

    // No matching engagement event
    const engagementEvents = [{ event: 'N99', status: 'INCOMPLETE' as EngagementEventStatus }];

    const result = filterIncompleteTaskListItems(taskListContainer, engagementEvents);
    expect(result).toEqual([]);
  });
});

describe('extractTaskListDisplayValues', () => {
  it('extracts display values from task list container', () => {
    const taskListContainer = [
      {
        type: 'TaskList',
        elements: {
          key: createString('navTaskContainer'),
          caption: createString('My Tasks'),
          captionIfZero: createString('No Tasks'),
          taskIconIfDone: createString('doneTick'),
          taskIconIfToDo: createString('todoCircle'),
          taskIconIfZero: createString('zeroIcon'),
          tasks: { values: [] },
        },
      },
    ] as TaskListEntity[];

    const result = extractTaskListDisplayValues(taskListContainer);
    expect(result?.caption).toBe('My Tasks');
    expect(result?.captionIfZero).toBe('No Tasks');
    expect(result?.taskIconIfDone).toBe('doneTick');
    expect(result?.taskIconIfTodo).toBe('todoCircle');
    expect(result?.iconIfZero).toBe('zeroIcon');
  });

  it('returns default values when container not found', () => {
    const result = extractTaskListDisplayValues([]);
    expect(result).toBeNull();
  });

  it('only finds containers with captions when withCaption is true', () => {
    const taskListContainer = [
      {
        type: 'TaskList',
        elements: {
          key: createString('navTaskContainer'),
          // No caption or captionIfZero
          taskIconIfDone: createString('doneTick'),
          tasks: { values: [] },
        },
      },
      {
        type: 'TaskList',
        elements: {
          key: createString('navTaskContainer'),
          caption: createString('With Caption'),
          captionIfZero: createString('No Items'),
          taskIconIfDone: createString('otherTick'),
          tasks: { values: [] },
        },
      },
    ] as TaskListEntity[];

    // The internal findTaskContainer is called with withCaption=true
    const result = extractTaskListDisplayValues(taskListContainer);
    // Should get values from the second container since it has captions
    expect(result?.caption).toBe('With Caption');
    expect(result?.taskIconIfDone).toBe('otherTick');
  });
});
