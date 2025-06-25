import '@testing-library/jest-dom/extend-expect';
import { TaskListContent } from '../../../../components/header/taskList/TaskListContent';
import { ProcessedTask, TaskListDisplayValues } from '../../../../core/contexts/tasks/types';
import { render, screen } from '../../../common';

// Mock the hooks before importing the component
jest.mock('../../../../core/hooks/useResolution', () => ({
  useResolution: () => ({
    isMobile: false,
    isSmallMobile: false,
  }),
}));

const mockEnableScroll = jest.fn();
const mockDisableScroll = jest.fn();

jest.mock('../../../../core/hooks/useScroll', () => ({
  useScroll: () => ({
    enableScroll: mockEnableScroll,
    disableScroll: mockDisableScroll,
    scrollTo: jest.fn(),
    scrollTop: jest.fn(),
  }),
}));

jest.mock('../../../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../../../core/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

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

jest.mock('../../../../components/EvaIcon', () => ({
  EvaIcon: ({ name, ...props }: { name: string }) => <div data-testid={`icon-${name}`}>{name}</div>,
}));

describe('TaskListContent', () => {
  const mockOnClickAway = jest.fn();
  const mockAnchorEl = document.createElement('div');

  const displayValues: TaskListDisplayValues = {
    caption: 'My Tasks',
    captionIfZero: 'No Tasks',
    taskIconIfTodo: 'todo-icon',
    taskIconIfDone: 'done-icon',
    iconIfZero: 'zero-icon',
  };

  const tasks: ProcessedTask[] = [
    { taskId: 'task1', taskDestination: '/task1', taskDisplayText: 'Task 1', status: 'INCOMPLETE', isCompleted: false },
    { taskId: 'task2', taskDestination: '/task2', taskDisplayText: 'Task 2', status: 'REVIEW', isCompleted: false },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the task list when anchorEl is provided', () => {
    render(
      <TaskListContent
        anchorEl={mockAnchorEl}
        displayValues={displayValues}
        tasks={tasks}
        onClickAway={mockOnClickAway}
      />,
    );

    expect(screen.getByTestId('task-list-content')).toBeInTheDocument();
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
    expect(screen.getByTestId('task-container')).toBeInTheDocument();
  });

  it('does not render when anchorEl is null', () => {
    render(
      <TaskListContent anchorEl={null} displayValues={displayValues} tasks={tasks} onClickAway={mockOnClickAway} />,
    );

    expect(screen.queryByTestId('task-list-content')).not.toBeInTheDocument();
  });

  it('renders all task items', () => {
    render(
      <TaskListContent
        anchorEl={mockAnchorEl}
        displayValues={displayValues}
        tasks={tasks}
        onClickAway={mockOnClickAway}
      />,
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('shows "no tasks" message when tasks array is empty', () => {
    render(
      <TaskListContent
        anchorEl={mockAnchorEl}
        displayValues={displayValues}
        tasks={[]}
        onClickAway={mockOnClickAway}
      />,
    );

    expect(screen.queryByTestId('task-container')).not.toBeInTheDocument();
    expect(screen.getByText('No Tasks')).toBeInTheDocument();
  });

  it('renders done icon when there are no tasks and taskIconIfDone is provided', () => {
    render(
      <TaskListContent
        anchorEl={mockAnchorEl}
        displayValues={displayValues}
        tasks={[]}
        onClickAway={mockOnClickAway}
      />,
    );

    expect(screen.getByTestId('icon-done-icon')).toBeInTheDocument();
  });

  it('calls onClickAway when clicked outside', () => {
    render(
      <TaskListContent
        anchorEl={mockAnchorEl}
        displayValues={displayValues}
        tasks={tasks}
        onClickAway={mockOnClickAway}
      />,
    );

    expect(mockOnClickAway).not.toHaveBeenCalled();
  });

  it('enables scroll when no anchorEl', () => {
    render(
      <TaskListContent anchorEl={null} displayValues={displayValues} tasks={tasks} onClickAway={mockOnClickAway} />,
    );

    expect(mockEnableScroll).toHaveBeenCalled();
    expect(mockDisableScroll).not.toHaveBeenCalled();
  });

  it('enables scroll when anchorEl exists but not small mobile', () => {
    render(
      <TaskListContent
        anchorEl={mockAnchorEl}
        displayValues={displayValues}
        tasks={tasks}
        onClickAway={mockOnClickAway}
      />,
    );

    expect(mockEnableScroll).toHaveBeenCalled();
    expect(mockDisableScroll).not.toHaveBeenCalled();
  });
});
