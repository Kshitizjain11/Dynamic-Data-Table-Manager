"use client";
import * as React from "react";
import { ThemeProvider, createTheme, CssBaseline, PaletteMode, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";

export function MuiProvider({ children }: { children: React.ReactNode }) {
//   const mode = useSelector((s: RootState) => s.ui.themeMode);
//   const dispatch = useDispatch();
//   const theme = React.useMemo(
//     () =>
//       createTheme({
//         palette: { mode: mode as PaletteMode },
//       }),
//     [mode]
//   );
  return (
    // <ThemeProvider theme={theme}>
    //   <CssBaseline />
    //   <div style={{ position: "fixed", top: 8, right: 8, zIndex: 1300 }}>
    //   </div>
      {children}
    // </ThemeProvider>
  );
}


