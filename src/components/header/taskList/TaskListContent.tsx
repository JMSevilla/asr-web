import { Badge, Box, ClickAwayListener, Divider, Grow, List, Paper, Popper, Stack, Typography } from '@mui/material';
import { Fragment, useEffect } from 'react';
import { ProcessedTask, TaskListDisplayValues } from '../../../core/contexts/tasks/types';
import { useResolution } from '../../../core/hooks/useResolution';
import { useScroll } from '../../../core/hooks/useScroll';
import { EvaIcon } from '../../EvaIcon';
import { NotificationIcon } from '../../icons';
import { TaskListContentItem } from './TaskListContentItem';

interface Props {
  anchorEl: null | HTMLElement;
  displayValues: TaskListDisplayValues;
  tasks: ProcessedTask[];
  onClickAway: () => void;
}

export const TaskListContent: React.FC<Props> = ({ anchorEl, displayValues, tasks, onClickAway }) => {
  const { isSmallMobile } = useResolution();
  const scroll = useScroll();

  useEffect(() => {
    if (anchorEl && isSmallMobile) {
      scroll.disableScroll();
      return;
    }
    scroll.enableScroll();
  }, [anchorEl, isSmallMobile, scroll]);

  return (
    <Popper
      sx={{ zIndex: 1200, ...(isSmallMobile && { transform: 'unset !important' }) }}
      open={!!anchorEl}
      anchorEl={anchorEl}
      placement="bottom-end"
      popperOptions={{ strategy: 'fixed' }}
      transition
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps} timeout={350} style={{ transformOrigin: isSmallMobile ? 'bottom' : 'top right' }}>
          <Stack justifyContent="flex-end" height={{ xs: '100vh', sm: 'auto' }} width={{ xs: '100vw', sm: 'auto' }}>
            <Box
              position="absolute"
              top={0}
              left={0}
              display={{ xs: 'block', sm: 'none' }}
              bgcolor="appColors.essential.1000"
              height="100%"
              width="100%"
              sx={{ opacity: 0.1 }}
              zIndex={-1}
            />
            <ClickAwayListener onClickAway={onClickAway}>
              <Paper
                elevation={2}
                data-testid="task-list-content"
                sx={{
                  width: { xs: '100%', sm: 365 },
                  minHeight: { xs: '50%', sm: 'auto' },
                  maxHeight: { xs: '80%', sm: '50vh' },
                  borderRadius: '10px',
                  borderBottomRightRadius: { xs: 0, sm: '10px' },
                  borderBottomLeftRadius: { xs: 0, sm: '10px' },
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 4,
                  overflowY: 'auto',
                }}
              >
                <Box
                  display={{ xs: 'flex', sm: 'none' }}
                  width={32}
                  minWidth={32}
                  height={32}
                  minHeight={32}
                  alignItems="center"
                  justifyContent="center"
                  sx={{ svg: { height: 25, width: 25, mb: '-4px', fill: theme => theme.palette.primary.main } }}
                >
                  <Badge
                    showZero
                    badgeContent={tasks.length}
                    color="error"
                    overlap="circular"
                    sx={{
                      '& span': {
                        top: '34%',
                        right: '28%',
                        minWidth: 14,
                        minHeight: 14,
                        width: 14,
                        height: 14,
                        fontSize: 'caption.fontSize',
                      },
                    }}
                  >
                    <NotificationIcon aria-hidden="true" />
                  </Badge>
                </Box>
                <Typography
                  variant="body1"
                  sx={{ color: 'appColors.essential.100', px: 0, mb: 6, mt: 4 }}
                  fontSize={{
                    xs: 'body2.fontSize',
                    sm: 'body1.fontSize',
                  }}
                >
                  {displayValues?.caption}
                </Typography>
                <Divider />
                {!!tasks?.length ? (
                  <List disablePadding data-testid="task-container">
                    {tasks.map((task, idx) => (
                      <Fragment key={idx}>
                        <TaskListContentItem task={task} todoIcon={displayValues?.taskIconIfTodo} />
                        <Divider />
                      </Fragment>
                    ))}
                  </List>
                ) : (
                  <Stack
                    direction="row"
                    alignItems="center"
                    py={4}
                    gap={6}
                    sx={{ svg: { fill: theme => theme.palette.success.main } }}
                  >
                    {displayValues?.taskIconIfDone && (
                      <EvaIcon name={displayValues?.taskIconIfDone} width={32} height={32} />
                    )}
                    <Typography
                      flex={1}
                      fontSize={{ xs: 'body2.fontSize', sm: 'body1.fontSize' }}
                      sx={{ wordBreak: 'break-word' }}
                    >
                      {displayValues?.captionIfZero}
                    </Typography>
                  </Stack>
                )}
              </Paper>
            </ClickAwayListener>
          </Stack>
        </Grow>
      )}
    </Popper>
  );
};
