import '@testing-library/jest-dom/extend-expect';
import { PageContentValues } from '../../../api/content/types/page';
import { TaskListContainerBlock } from '../../../components/blocks/taskList/TaskListContainerBlock';
import { useRouter } from '../../../core/router';
import { act, fireEvent, render, screen } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('eva-icons', () => ({
  replace: jest.fn(),
  icons: {
    'done-icon': {
      toSvg: jest.fn().mockReturnValue('<svg></svg>'),
    },
    'zero-icon': {
      toSvg: jest.fn().mockReturnValue('<svg></svg>'),
    },
    'test-todo-tasks': {
      toSvg: jest.fn().mockReturnValue('<svg></svg>'),
    },
  },
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../../components/EvaIcon', () => ({
  EvaIcon: ({
    name,
    primaryFill,
    width,
    height,
  }: {
    name: string;
    primaryFill?: boolean;
    width?: number;
    height?: number;
  }) => (
    <div data-testid={`eva-icon-${name}`} data-primary-fill={primaryFill} data-width={width} data-height={height}>
      {name}
    </div>
  ),
}));

jest.mock('../../../components/loaders', () => ({
  ListLoader: ({ id, 'data-testid': dataTestId }: { id?: string; 'data-testid'?: string }) => (
    <div data-testid={dataTestId || `${id}-loader`}>List Loader</div>
  ),
}));

jest.mock('../../../core/contexts/tasks/TaskListContext', () => ({
  useTaskListContext: jest.fn().mockReturnValue({
    filterTasksListForDisplay: jest.fn().mockImplementation(elements => {
      if (!elements) return [];
      if (elements.useMockTasks) {
        return [
          {
            taskId: 'task1',
            taskDestination: '/task1',
            taskDisplayText: 'Task 1',
            status: 'INCOMPLETE',
            isCompleted: false,
          },
          {
            taskId: 'task2',
            taskDestination: '/task2',
            taskDisplayText: 'Task 2',
            status: 'COMPLETE',
            isCompleted: true,
          },
        ];
      }
      if (elements.taskIconIfToDo?.value === 'test-todo-tasks') {
        return [
          {
            taskId: 'task1',
            taskDestination: '/task1',
            taskDisplayText: 'Task 1',
            status: 'INCOMPLETE',
            isCompleted: false,
          },
          {
            taskId: 'task2',
            taskDestination: '/task2',
            taskDisplayText: 'Task 2',
            status: 'COMPLETE',
            isCompleted: true,
          },
        ];
      }
      return [];
    }),
    loading: false,
  }),
}));

describe('TaskListContainerBlock', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('displays tasks when they are available', () => {
    render(
      <TaskListContainerBlock
        id="task-list-container"
        elements={
          {
            useMockTasks: true,
            taskIconIfDone: { value: 'done-icon' },
            taskIconIfToDo: { value: 'test-todo-tasks' },
          } as PageContentValues['elements']
        }
      />,
    );

    expect(screen.getByTestId('task-list-block')).toBeInTheDocument();
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();

    const todoIcons = screen.getAllByTestId('eva-icon-test-todo-tasks');
    expect(todoIcons.length).toBeGreaterThan(0);

    expect(todoIcons[0]).toHaveAttribute('data-width', '20');
    expect(todoIcons[0]).toHaveAttribute('data-height', '20');
    expect(todoIcons[0]).toHaveAttribute('data-primary-fill', 'true');
  });

  it('displays "no tasks" message when no tasks are available', () => {
    render(
      <TaskListContainerBlock
        id="task-list-container"
        elements={
          {
            useMockTasks: false,
            captionIfZero: { value: 'No tasks available' },
            iconIfZero: { value: 'zero-icon' },
          } as PageContentValues['elements']
        }
      />,
    );

    expect(screen.getByTestId('task-list-block-empty')).toBeInTheDocument();
    expect(screen.getByText('No tasks available')).toBeInTheDocument();
  });

  it('navigates to the task destination when a task is clicked', async () => {
    render(
      <TaskListContainerBlock
        id="task-list-container"
        elements={
          {
            useMockTasks: true,
            taskIconIfDone: { value: 'done-icon' },
            taskIconIfToDo: { value: 'test-todo-tasks' },
          } as PageContentValues['elements']
        }
      />,
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Task 1'));
    });

    expect(mockPush).toHaveBeenCalledWith('/task1');
  });

  it('shows ListLoader when loading is true and no tasks are available', () => {
    jest.requireMock('../../../core/contexts/tasks/TaskListContext').useTaskListContext.mockReturnValueOnce({
      filterTasksListForDisplay: jest.fn().mockReturnValue([]),
      loading: true,
    });

    render(
      <TaskListContainerBlock
        id="task-list-container"
        elements={
          {
            useMockTasks: true,
          } as PageContentValues['elements']
        }
      />,
    );

    expect(screen.getByTestId('task-list-block-loader')).toBeInTheDocument();
  });

  it('shows CircularProgress in task items when loading is true with tasks', () => {
    jest.requireMock('../../../core/contexts/tasks/TaskListContext').useTaskListContext.mockReturnValueOnce({
      filterTasksListForDisplay: jest.fn().mockReturnValue([
        {
          taskId: 'task1',
          taskDestination: '/task1',
          taskDisplayText: 'Task 1',
          status: 'INCOMPLETE',
          isCompleted: false,
        },
      ]),
      loading: true,
    });

    render(
      <TaskListContainerBlock
        id="task-list-container"
        elements={
          {
            useMockTasks: true,
            taskIconIfToDo: { value: 'test-todo-tasks' },
          } as PageContentValues['elements']
        }
      />,
    );

    expect(screen.queryByTestId('eva-icon-test-todo-tasks')).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('disables task item clicks when loading', async () => {
    jest.requireMock('../../../core/contexts/tasks/TaskListContext').useTaskListContext.mockReturnValueOnce({
      filterTasksListForDisplay: jest.fn().mockReturnValue([
        {
          taskId: 'task1',
          taskDestination: '/task1',
          taskDisplayText: 'Task 1',
          status: 'INCOMPLETE',
          isCompleted: false,
        },
      ]),
      loading: true,
    });

    render(
      <TaskListContainerBlock
        id="task-list-container"
        elements={
          {
            useMockTasks: true,
          } as PageContentValues['elements']
        }
      />,
    );

    const taskItem = screen.getByText('Task 1').closest('[role="button"]');
    expect(taskItem).toHaveAttribute('aria-disabled', 'true');
  });

  it('applies different styling for complete and incomplete tasks', () => {
    render(
      <TaskListContainerBlock
        id="task-list-container"
        elements={
          {
            useMockTasks: true,
            taskIconIfDone: { value: 'done-icon' },
            taskIconIfToDo: { value: 'test-todo-tasks' },
          } as PageContentValues['elements']
        }
      />,
    );

    const task1 = screen.getByText('Task 1');
    const task2 = screen.getByText('Task 2');

    expect(task1).toHaveStyle({ textDecoration: 'none' });
    expect(task2).toHaveStyle({ textDecoration: 'line-through' });
  });
});
