"use client";
import { ThemeProvider, createTheme, CssBaseline, PaletteMode, IconButton } from "@mui/material";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toggleThemeMode } from "@/store/slices/uiSlice";
import { useMemo } from "react";

export function MuiProvider({ children }: { children: React.ReactNode }) {
  const mode = useSelector((s: RootState) => s.ui.themeMode);
  const dispatch = useDispatch();
  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode: mode as PaletteMode },
      }),
    [mode]
  );
  return (
    <ThemeProvider theme={theme}> 
      <CssBaseline />
      <div style={{ position: "fixed", top: 8, right: 8, zIndex: 1300 }}>
        <IconButton color="inherit" onClick={() => dispatch(toggleThemeMode())} aria-label="toggle theme">
          {mode === "light" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
        </IconButton>
      </div>
      {children}
    </ThemeProvider>
  );
}


