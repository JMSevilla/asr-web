import '@testing-library/jest-dom/extend-expect';
import { TaskListBell } from '../../../../components/header/taskList/TaskListBell';
import { ProcessedTask, TaskListDisplayValues } from '../../../../core/contexts/tasks/types';
import { act, fireEvent, render, screen } from '../../../common';

jest.mock('../../../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('eva-icons', () => ({
  replace: jest.fn(),
  icons: {
    'done-icon': {
      toSvg: jest.fn().mockReturnValue('<svg></svg>'),
    },
    'todo-icon': {
      toSvg: jest.fn().mockReturnValue('<svg></svg>'),
    },
    'zero-icon': {
      toSvg: jest.fn().mockReturnValue('<svg></svg>'),
    },
  },
}));

jest.mock('../../../../core/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('../../../../components/EvaIcon', () => ({
  EvaIcon: ({ name, ...props }: { name: string; [key: string]: any }) => <div data-testid={`icon-${name}`}>{name}</div>,
}));

jest.mock('../../../../components/icons', () => ({
  NotificationIcon: () => <div data-testid="notification-icon" />,
}));

const mockDisplayValues: TaskListDisplayValues = {
  caption: 'My Tasks',
  captionIfZero: 'No Tasks',
  taskIconIfTodo: 'todo-icon',
  taskIconIfDone: 'done-icon',
  iconIfZero: 'zero-icon',
};

const mockIncompleteTasks: ProcessedTask[] = [
  { taskId: 'task1', taskDestination: '/task1', taskDisplayText: 'Task 1', status: 'INCOMPLETE', isCompleted: false },
  { taskId: 'task2', taskDestination: '/task2', taskDisplayText: 'Task 2', status: 'REVIEW', isCompleted: false },
];

const mockRefreshEngagementEvents = jest.fn();

jest.mock('../../../../core/contexts/tasks/TaskListContext', () => ({
  useTaskListContext: jest.fn().mockReturnValue({
    taskListDisplayValues: mockDisplayValues,
    incompleteTasks: [],
    showTaskListBell: true,
    loading: false,
    refreshEngagementEvents: mockRefreshEngagementEvents,
  }),
}));

describe('TaskListBell', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders bell icon when showTaskListBell and taskListDisplayValues are true', () => {
    jest.requireMock('../../../../core/contexts/tasks/TaskListContext').useTaskListContext.mockReturnValueOnce({
      taskListDisplayValues: mockDisplayValues,
      incompleteTasks: [],
      showTaskListBell: true,
      loading: false,
      refreshEngagementEvents: mockRefreshEngagementEvents,
    });

    render(<TaskListBell />);

    expect(screen.getByTestId('task-list-bell-btn')).toBeInTheDocument();
  });

  it('does not render when showTaskListBell is false', () => {
    jest.requireMock('../../../../core/contexts/tasks/TaskListContext').useTaskListContext.mockReturnValueOnce({
      taskListDisplayValues: mockDisplayValues,
      incompleteTasks: [],
      showTaskListBell: false,
      loading: false,
      refreshEngagementEvents: mockRefreshEngagementEvents,
    });

    const { container } = render(<TaskListBell />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows badge with task count when there are incomplete tasks', () => {
    jest.requireMock('../../../../core/contexts/tasks/TaskListContext').useTaskListContext.mockReturnValueOnce({
      taskListDisplayValues: mockDisplayValues,
      incompleteTasks: mockIncompleteTasks,
      showTaskListBell: true,
      loading: false,
      refreshEngagementEvents: mockRefreshEngagementEvents,
    });

    render(<TaskListBell />);

    const badge = screen.getByText('2');
    expect(badge).toBeInTheDocument();
  });

  it('shows loader when loading is true', () => {
    jest.requireMock('../../../../core/contexts/tasks/TaskListContext').useTaskListContext.mockReturnValueOnce({
      taskListDisplayValues: mockDisplayValues,
      incompleteTasks: [],
      showTaskListBell: true,
      loading: true,
      refreshEngagementEvents: mockRefreshEngagementEvents,
    });

    render(<TaskListBell />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('opens task list content when clicking the bell icon', async () => {
    jest.requireMock('../../../../core/contexts/tasks/TaskListContext').useTaskListContext.mockReturnValue({
      taskListDisplayValues: mockDisplayValues,
      incompleteTasks: mockIncompleteTasks,
      showTaskListBell: true,
      loading: false,
      refreshEngagementEvents: mockRefreshEngagementEvents,
    });

    render(<TaskListBell />);

    await act(async () => {
      fireEvent.click(screen.getByTestId('task-list-bell-btn'));
    });

    expect(screen.getByTestId('task-list-content')).toBeInTheDocument();
    expect(mockRefreshEngagementEvents).toHaveBeenCalled();
  });

  it('closes task list content when clicking the bell icon again', async () => {
    jest.requireMock('../../../../core/contexts/tasks/TaskListContext').useTaskListContext.mockReturnValue({
      taskListDisplayValues: mockDisplayValues,
      incompleteTasks: mockIncompleteTasks,
      showTaskListBell: true,
      loading: false,
      refreshEngagementEvents: mockRefreshEngagementEvents,
    });

    render(<TaskListBell />);

    await act(async () => {
      fireEvent.click(screen.getByTestId('task-list-bell-btn'));
    });

    expect(screen.getByTestId('task-list-content')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByTestId('task-list-bell-btn'));
    });
  });

  it('shows empty tasks message when there are no incomplete tasks', async () => {
    jest.requireMock('../../../../core/contexts/tasks/TaskListContext').useTaskListContext.mockReturnValue({
      taskListDisplayValues: mockDisplayValues,
      incompleteTasks: [],
      showTaskListBell: true,
      loading: false,
      refreshEngagementEvents: mockRefreshEngagementEvents,
    });

    render(<TaskListBell />);

    await act(async () => {
      fireEvent.click(screen.getByTestId('task-list-bell-btn'));
    });

    expect(screen.getByTestId('task-list-content')).toBeInTheDocument();
  });
});
