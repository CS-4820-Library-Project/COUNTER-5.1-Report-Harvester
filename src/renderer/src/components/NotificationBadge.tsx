import { Alert, Slide, Snackbar, Typography, useTheme } from "@mui/material";
import React, { createContext, useContext, useState } from "react";

/**
 * Represents the status of a notification.
 */
type NotificationStatus = {
  type: "success" | "error" | "info" | "warning";
  message: string;
} | null;

/**
 * Hook for accessing the notification context.
 * @returns The a function that sets a Notification and displays it.
 * @example const setNotification = useNotification();
 * setNotification({ type: "success", message: "Hello, world!" });
 */
const NotificationContext = createContext<(status: NotificationStatus) => void>(
  /**
   * Context for managing notifications.
   */
  () => {}
);

/**
 * Provider component for managing notifications.
 * @param children - The child components that will use the notification context.
 */
const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notification, setNotification] = useState<NotificationStatus>(null);

  /**
   * Closes the notification.
   */
  const handleClose = () => setNotification(null);

  return (
    <NotificationContext.Provider value={setNotification}>
      {notification && (
        <Snackbar
          open={notification !== null}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={5000}
          TransitionComponent={Slide}
        >
          <Alert
            severity={notification?.type}
            sx={{
              boxShadow: "0 0 10px 0 rgba(0,0,0,0.2)",
              borderRadius: "25px",
              padding: "0.5rem 2rem",
              bgcolor: (theme) => theme.palette[notification.type].light,
              color: (theme) => theme.palette.text.main,
            }}
            onClose={handleClose}
          >
            <Typography variant="body1">{notification?.message}</Typography>
          </Alert>
        </Snackbar>
      )}

      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Hook for accessing the notification context.
 * @returns The a function that sets a Notification and displays it.
 * @example const setNotification = useNotification();
 * setNotification({ type: "success", message: "Hello, world!" });
 */
export const useNotification = () => useContext(NotificationContext);

export default NotificationProvider;
