import '@testing-library/jest-dom/extend-expect';
import { TaskListContent } from '../../../../components/header/taskList/TaskListContent';
import { ProcessedTask, TaskListDisplayValues } from '../../../../core/contexts/tasks/types';
import { render } from '../../../common';

jest.mock('../../../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../../../core/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
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

// Mock for small mobile devices
jest.mock('../../../../core/hooks/useResolution', () => ({
  useResolution: () => ({
    isMobile: true,
    isSmallMobile: true,
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

describe('TaskListContent in small mobile view', () => {
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

  it('disables scroll when anchorEl exists and is small mobile', () => {
    render(
      <TaskListContent
        anchorEl={mockAnchorEl}
        displayValues={displayValues}
        tasks={tasks}
        onClickAway={mockOnClickAway}
      />,
    );

    expect(mockDisableScroll).toHaveBeenCalled();
    expect(mockEnableScroll).not.toHaveBeenCalled();
  });
});
