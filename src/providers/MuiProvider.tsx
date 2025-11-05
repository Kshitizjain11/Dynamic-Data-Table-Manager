"use client";
import { ThemeProvider, createTheme, CssBaseline, PaletteMode, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useMemo } from "react";
import { toggleThemeMode } from "@/store/slices/uiSlice";
import {DarkModeO} from '@'
export function MuiProvider({ children }: { children: React.ReactNode }) {
  const mode = useSelector((state:RootState)=>state.ui.themeMode)
  const dispatch = useDispatch()
  const theme = useMemo(
    ()=> createTheme({
      palette: {mode: mode as PaletteMode},
    }),[mode]
  )
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ position: "fixed", top: 8, right: 8, zIndex: 1300 }}>
        <IconButton color="inherit" onClick={()=>dispatch(toggleThemeMode())} aria-label="toggle theme" ></IconButton>
        {mode === "light" ? <DarkModeOutlinedIcon  }
      </div>
      {children}
    </ThemeProvider>
  );
}


