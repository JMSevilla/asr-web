import { Close } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from '../router';

interface PopupContextValue {
  show(text: string): void;
  hide: VoidFunction;
}

const PopupContext = createContext<PopupContextValue>({
  show: () => null,
  hide: () => null,
});

interface Props {}

export const usePopupContext = () => useContext(PopupContext);

export const PopupContextProvider: React.FC<React.PropsWithChildren<Props>> = ({ children }) => {
  const router = useRouter();
  const [popup, setPopup] = useState<string | null>(null);

  const hide = useCallback(() => setPopup(null), []);
  const show = useCallback((text: string) => setPopup(text), [scroll]);

  useEffect(() => {
    router.events.on('routeChangeComplete', hide);
    router.events.on('routeChangeError', hide);
    return () => {
      router.events.off('routeChangeComplete', hide);
      router.events.off('routeChangeError', hide);
    };
  }, []);

  return (
    <PopupContext.Provider value={{ show, hide }}>
      {popup && (
        <Box
          position="fixed"
          zIndex={1}
          bottom={theme => theme.spacing(12)}
          right={theme => theme.spacing(12)}
          maxWidth={448}
          py={4}
          px={6}
          borderRadius={4}
          bgcolor="appColors.primary"
          color="primary.contrastText"
          display="flex"
          gap={6}
          alignContent="center"
          justifyContent="space-between"
          aria-live="assertive"
        >
          <Typography variant="body2">{popup}</Typography>
          <IconButton onClick={hide} color="inherit" size="small" sx={{ cursor: 'pointer', my: -1 }}>
            <Close />
          </IconButton>
        </Box>
      )}
      {children}
    </PopupContext.Provider>
  );
};
