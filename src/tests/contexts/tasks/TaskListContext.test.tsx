import '@testing-library/jest-dom/extend-expect';
import { TaskListEntity } from '../../../api/content/types/globals';
import { TaskListProvider, useTaskListContext } from '../../../core/contexts/tasks/TaskListContext';
import { ProcessedTask } from '../../../core/contexts/tasks/types';
import { act, fireEvent, render, screen } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../../core/contexts/auth/AuthContext', () => ({
  useAuthContext: () => ({
    isAuthenticated: true,
  }),
}));

jest.mock('../../../core/hooks/useApi', () => ({
  useApiCallback: jest.fn(callback => {
    return {
      status: 'not-requested',
      loading: false,
      execute: jest.fn(async () => {
        const result = await callback({
          mdp: {
            engagementEvents: () => ({
              data: {
                events: [
                  { event: 'TASK1', status: 'INCOMPLETE' },
                  { event: 'TASK2', status: 'COMPLETE' },
                ],
              },
            }),
          },
        });
        return result;
      }),
    };
  }),
}));

const createString = (value: string) => ({ value });

const mockTaskListContainer: TaskListEntity[] = [
  {
    type: 'TaskList',
    elements: {
      key: createString('navTaskContainer'),
      caption: createString('My Tasks'),
      captionIfZero: createString('No Tasks'),
      taskIconIfDone: createString('doneTick'),
      taskIconIfToDo: createString('todoCircle'),
      taskLimit: { value: 3 },
      tasks: {
        values: [
          {
            elements: {
              taskId: createString('TASK1'),
              taskDestination: createString('/task1'),
              taskText: createString('Task 1 Incomplete'),
              taskTextIfComplete: createString('Task 1 Complete'),
              taskTextIfToReview: createString('Task 1 Review'),
              taskIconIfDone: createString('doneTick'),
              taskIconIfToDo: createString('todoCircle'),
              taskIconIfZero: createString('zeroIcon'),
            },
            type: 'Task',
          },
          {
            elements: {
              taskId: createString('TASK2'),
              taskDestination: createString('/task2'),
              taskText: createString('Task 2 Incomplete'),
              taskTextIfComplete: createString('Task 2 Complete'),
              taskTextIfToReview: createString('Task 2 Review'),
              taskIconIfDone: createString('doneTick'),
              taskIconIfToDo: createString('todoCircle'),
              taskIconIfZero: createString('zeroIcon'),
            },
            type: 'Task',
          },
        ],
      },
    },
  },
];

const TestConsumer = () => {
  const { incompleteTasks, showTaskListBell, refreshEngagementEvents } = useTaskListContext();
  return (
    <div>
      <button onClick={refreshEngagementEvents}>Refresh Tasks</button>
      {showTaskListBell && <span>Bell is visible</span>}
      <ul>
        {incompleteTasks.map((task: ProcessedTask) => (
          <li key={task.taskId}>{task.taskDisplayText}</li>
        ))}
      </ul>
    </div>
  );
};

describe('TaskListProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', async () => {
    await act(async () => {
      render(
        <TaskListProvider>
          <>Test Child</>
        </TaskListProvider>,
      );
    });
  });

  it('provides context values', async () => {
    await act(async () => {
      render(
        <TaskListProvider taskListContainer={mockTaskListContainer}>
          <TestConsumer />
        </TaskListProvider>,
      );
    });

    expect(screen.getByText('Bell is visible')).toBeInTheDocument();
    expect(screen.getByText('Task 1 Incomplete')).toBeInTheDocument();
  });

  it('filters incomplete tasks correctly', async () => {
    await act(async () => {
      render(
        <TaskListProvider taskListContainer={mockTaskListContainer}>
          <TestConsumer />
        </TaskListProvider>,
      );
    });

    // After API call, only TASK1 should be in the incomplete tasks list
    expect(screen.getByText('Task 1 Incomplete')).toBeInTheDocument();
    expect(screen.queryByText('Task 2 Incomplete')).not.toBeInTheDocument();
  });

  it('refreshes engagement events when triggered', async () => {
    await act(async () => {
      render(
        <TaskListProvider taskListContainer={mockTaskListContainer}>
          <TestConsumer />
        </TaskListProvider>,
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Refresh Tasks'));
    });

    // Verify tasks are still correctly displayed after refresh
    expect(screen.getByText('Task 1 Incomplete')).toBeInTheDocument();
  });

  it('handles empty task list container', async () => {
    await act(async () => {
      render(
        <TaskListProvider taskListContainer={[]}>
          <TestConsumer />
        </TaskListProvider>,
      );
    });

    expect(screen.queryByText('Bell is visible')).not.toBeInTheDocument();
    expect(screen.queryByText('Task 1 Incomplete')).not.toBeInTheDocument();
  });

  it('handles null task list container', async () => {
    await act(async () => {
      render(
        <TaskListProvider taskListContainer={null}>
          <TestConsumer />
        </TaskListProvider>,
      );
    });

    expect(screen.queryByText('Bell is visible')).not.toBeInTheDocument();
    expect(screen.queryByText('Task 1 Incomplete')).not.toBeInTheDocument();
  });
});
