import '@testing-library/jest-dom/extend-expect';
import { TaskListContentItem } from '../../../../components/header/taskList/TaskListContentItem';
import { ProcessedTask } from '../../../../core/contexts/tasks/types';
import { useRouter } from '../../../../core/router';
import { act, fireEvent, render, screen } from '../../../common';

jest.mock('../../../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('eva-icons', () => ({
  replace: jest.fn(),
  icons: {
    'todo-icon': {
      toSvg: jest.fn().mockReturnValue('<svg></svg>'),
    },
  },
}));

jest.mock('../../../../components/EvaIcon', () => ({
  EvaIcon: ({ name, ...props }: { name: string }) => <div data-testid={`icon-${name}`}>{name}</div>,
}));

jest.mock('../../../../core/router', () => ({
  useRouter: jest.fn(),
}));

describe('TaskListContentItem', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  const task: ProcessedTask = {
    taskId: 'task1',
    taskDestination: '/task1',
    taskDisplayText: 'Task 1',
    status: 'INCOMPLETE',
    isCompleted: false,
  };

  it('renders the task item with correct text', () => {
    render(<TaskListContentItem task={task} todoIcon="todo-icon" />);

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByTestId('task-list-content-item-task1')).toBeInTheDocument();
  });

  it('renders the todo icon when provided', () => {
    render(<TaskListContentItem task={task} todoIcon="todo-icon" />);

    expect(screen.getByTestId('icon-todo-icon')).toBeInTheDocument();
  });

  it('navigates to task destination when clicked', async () => {
    render(<TaskListContentItem task={task} todoIcon="todo-icon" />);

    await act(async () => {
      fireEvent.click(screen.getByTestId('task-list-content-item-task1'));
    });

    expect(mockPush).toHaveBeenCalledWith('/task1');
  });
});
