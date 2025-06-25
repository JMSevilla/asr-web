import { Badge, CircularProgress, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { useTaskListContext } from '../../../core/contexts/tasks/TaskListContext';
import { NotificationIcon } from '../../icons';
import { TaskListContent } from './TaskListContent';
interface Props {}

export const TaskListBell: React.FC<Props> = () => {
  const { taskListDisplayValues, incompleteTasks, showTaskListBell, loading, refreshEngagementEvents } =
    useTaskListContext();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  if (!showTaskListBell || !taskListDisplayValues) return null;

  const taskCount = incompleteTasks?.length ?? 0;

  return (
    <>
      <IconButton
        data-testid="task-list-bell-btn"
        onClick={handleToggle}
        sx={{ svg: { fill: theme => theme.palette.primary.main } }}
        disabled={loading}
      >
        <Badge
          invisible={taskCount === 0 && !loading}
          badgeContent={loading ? <CircularProgress size={8} sx={{ color: 'error.contrastText' }} /> : taskCount}
          color="error"
          overlap="circular"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{
            '& span': {
              top: '24%',
              right: '28%',
              minWidth: 18,
              minHeight: 18,
              width: 18,
              height: 18,
              fontSize: 'body2.fontSize',

              // for the circular progress
              '& > span': {
                minWidth: 12,
                minHeight: 12,
                width: 12,
                height: 12,
              },
            },
          }}
        >
          <NotificationIcon aria-hidden="true" />
        </Badge>
      </IconButton>
      <TaskListContent
        onClickAway={handleClose}
        anchorEl={loading ? null : menuAnchorEl}
        tasks={incompleteTasks}
        displayValues={taskListDisplayValues!}
      />
    </>
  );

  function handleToggle(event: React.MouseEvent<HTMLElement>) {
    if (!loading && !menuAnchorEl) {
      refreshEngagementEvents();
      setMenuAnchorEl(event.currentTarget);
      return;
    }
    setMenuAnchorEl(null);
  }

  function handleClose() {
    setMenuAnchorEl(null);
  }
};
