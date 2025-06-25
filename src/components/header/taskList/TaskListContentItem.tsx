import { IconButton, ListItemButton, ListItemText } from '@mui/material';
import React from 'react';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { ProcessedTask } from '../../../core/contexts/tasks/types';
import { useRouter } from '../../../core/router';
import { EvaIcon } from '../../EvaIcon';

interface Props {
  task: ProcessedTask;
  todoIcon?: string;
}

export const TaskListContentItem: React.FC<Props> = ({ task, todoIcon }) => {
  const router = useRouter();
  const { labelByKey } = useGlobalsContext();

  return (
    <ListItemButton
      data-testid={`task-list-content-item-${task.taskId}`}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 3,
        px: 2,
        gap: 2,
      }}
    >
      <ListItemText
        sx={{ span: { fontSize: { xs: 'body2.fontSize', sm: 'button.fontSize' } } }}
        primary={task.taskDisplayText}
      />
      <IconButton
        edge="end"
        sx={{ p: 0 }}
        size="small"
        aria-label={`${labelByKey('task_list_item_action_aria')}${task.taskDisplayText}`}
      >
        {todoIcon && <EvaIcon ariaHidden name={todoIcon} primaryFill width={20} height={20} />}
      </IconButton>
    </ListItemButton>
  );

  function handleClick() {
    router.push(task.taskDestination);
  }
};
