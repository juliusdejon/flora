// useSnackbar.tsx
import React, { ReactNode, createContext, useContext, useState } from 'react';
import { Snackbar as PaperSnackbar } from 'react-native-paper';

interface SnackbarProviderProps {
  children: ReactNode;
}

interface SnackbarContextProps {
  showSnackbar: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextProps | undefined>(
  undefined,
);

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const showSnackbar = (msg: string) => {
    setMessage(msg);
    setVisible(true);
  };

  const hideSnackbar = () => {
    setVisible(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <PaperSnackbar
        visible={visible}
        onDismiss={hideSnackbar}
        action={{
          label: 'Dismiss',
          onPress: hideSnackbar,
        }}>
        {message}
      </PaperSnackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): ((message: string) => void) => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context.showSnackbar;
};
