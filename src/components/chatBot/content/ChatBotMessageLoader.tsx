import { Theme } from '@material-ui/core';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const ChatBotMessageLoader: React.FC = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root} data-testid="chatbot-message-loader" aria-hidden="true">
      <div className={`${classes.dot} ${classes.dot1}`} />
      <div className={`${classes.dot} ${classes.dot2}`} />
      <div className={`${classes.dot} ${classes.dot3}`} />
    </Box>
  );
};

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    height: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '4px',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: theme.palette.grey[500],
    marginLeft: '4px',
    animation: '$jumpingDots 1.8s infinite both',
  },
  dot1: {
    animationDelay: '0.2s',
  },
  dot2: {
    animationDelay: '0.4s',
  },
  dot3: {
    animationDelay: '0.6s',
  },
  '@keyframes jumpingDots': {
    '0%': {
      transform: 'translateY(0)',
    },
    '25%': {
      transform: 'translateY(-6px)',
    },
    '50%': {
      transform: 'translateY(0)',
    },
    '100%': {
      transform: 'translateY(0)',
    },
  },
}));
