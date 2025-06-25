import { Box, CircularProgress, List, ListItemButton, ListItemIcon, Stack, Typography } from '@mui/material';
import { PageContentValues } from '../../../api/content/types/page';
import { useTaskListContext } from '../../../core/contexts/tasks/TaskListContext';
import { ProcessedTask } from '../../../core/contexts/tasks/types';
import { useRouter } from '../../../core/router';
import { EvaIcon } from '../../EvaIcon';
import { ListLoader } from '../../loaders';

interface Props {
  id: string;
  elements: PageContentValues['elements'];
}

export const TaskListContainerBlock: React.FC<Props> = ({ id, elements }) => {
  const { filterTasksListForDisplay, loading } = useTaskListContext();
  const router = useRouter();
  const tasks = filterTasksListForDisplay(elements);
  const zeroIcon = elements.iconIfZero?.value;
  const doneIcon = elements.taskIconIfDone?.value;
  const todoIcon = elements.taskIconIfToDo?.value;

  if (loading && !tasks.length) return <ListLoader id={id} data-testid="task-list-block-loader" />;

  if (!tasks.length) {
    return (
      <Stack
        id={id}
        data-testid="task-list-block-empty"
        direction="row"
        alignItems="center"
        gap={2}
        sx={{ svg: { minWidth: 24 } }}
      >
        {zeroIcon && (
          <EvaIcon ariaHidden name={zeroIcon} fill={theme => theme.palette.grey[400]} width={24} height={24} />
        )}
        <Typography variant="body1" color="text.secondary">
          {elements.captionIfZero?.value}
        </Typography>
      </Stack>
    );
  }

  return (
    <List
      id={id}
      data-testid="task-list-block"
      disablePadding
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      {tasks.map((task, idx) => (
        <ListItemButton
          key={idx}
          disabled={loading}
          onClick={handleTaskClick(task)}
          disableGutters
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderRadius: '8px',
            padding: theme => theme.sizes.parentListPadding,
            cursor: 'pointer',
            bgcolor: task.isCompleted ? 'appColors.grey050' : 'appColors.secondary.transparentLight',
            transition: 'background-color 0.2s ease-in-out',
            '&:hover': { bgcolor: 'appColors.tertiary.transparentLight' },
          }}
        >
          {task.isCompleted && !!doneIcon && (
            <ListItemIcon sx={{ minWidth: 24, svg: { fill: theme => theme.palette.success.main } }}>
              <EvaIcon name={doneIcon} />
            </ListItemIcon>
          )}
          <Typography
            flex={1}
            fontSize="h6.fontSize"
            color={task.isCompleted ? 'appColors.essential.100' : 'text.primary'}
            sx={{ textDecoration: task.isCompleted ? 'line-through' : 'none' }}
          >
            {task.taskDisplayText}
          </Typography>
          {!!todoIcon && !loading && (
            <Box width={20} height={20}>
              <EvaIcon ariaHidden primaryFill name={todoIcon} width={20} height={20} />
            </Box>
          )}
          {loading && <CircularProgress size={18} />}
        </ListItemButton>
      ))}
    </List>
  );

  function handleTaskClick(task: ProcessedTask) {
    return () => router.push(task.taskDestination);
  }
};
