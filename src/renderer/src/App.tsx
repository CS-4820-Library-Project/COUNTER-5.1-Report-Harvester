import { ColorModeContext, useMode } from "./theme";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import Navbar from "./pages/navbar";
import { Routes, Route } from "react-router-dom";
import VendorsPage from "./pages/vendors";
import FetchReportsPage from "./pages/fetch_reports";
import SearchReportsPage from "./pages/search_reports";
import SettingsPage from "./pages/settings";
import NotificationProvider from "./components/NotificationBadge";
import RequireAuth from "./hooks/RequireAuth";
import { AuthProvider } from "./hooks/AuthProvider";

function App() {
  const { theme, colorMode } = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          display="flex"
          width="100vw"
          height="100dvh"
          color={theme.palette.text.main}
          bgcolor={theme.palette.background.light}
        >
          <NotificationProvider>
            <AuthProvider>
              <Navbar />
              <Box component="main" flex={1} overflow="auto">
                <Routes>
                  {/* Require Auth */}
                  <Route element={<RequireAuth />}>
                    <Route path="/" element={<FetchReportsPage />} />
                    <Route path="/fetch" element={<FetchReportsPage />} />
                    <Route path="/vendors" element={<VendorsPage />} />
                  </Route>

                  {/* No Auth */}
                  <Route path="/search" element={<SearchReportsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </Box>
            </AuthProvider>
          </NotificationProvider>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
