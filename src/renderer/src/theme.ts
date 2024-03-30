import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import { tokens } from "./assets/colorTokens";

declare module "@mui/material/styles" {
  interface TypeBackground {
    main?: string;
    light?: string;
    dark?: string;
    hover?: string;
    contrastText?: string;
  }

  interface TypeText {
    main?: string;
    light?: string;
    dark?: string;
    hover?: string;
    contrastText?: string;
  }

  interface PaletteColor {
    hover?: string;
  }

  interface SimplePaletteColorOptions {
    hover?: string;
  }

  interface Palette {
    text: TypeText;
    neutral: PaletteColor;
    disabled: PaletteColor;
    background: TypeBackground;
  }

  interface PaletteOptions {
    neutral?: Partial<PaletteColor>;
    disabled?: Partial<PaletteColor>;
    background?: Partial<TypeBackground>;
    text?: Partial<TypeText>;
  }

  interface TypographyVariants {
    label1: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    label2?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    label1: true;
    label2: true;
  }
}

type Mode = "light" | "dark";

// MUI theme Settings
export const themeSettings = (mode: Mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "light" && "ocean" in colors
        ? {
            text: {
              main: colors.blackBlue[500],
              light: colors.white[500],
              dark: colors.blackBlue[500],
              hover: colors.sky[400],
              contrastText: colors.white[500],
              // Extras
              disabled: colors.gray[500],
              primary: colors.teal[500],
            },
            background: {
              main: colors.white[500],
              light: colors.white[100],
              hover: colors.babyBlue[500],
              dark: colors.ocean[500],
              contrastText: colors.blackBlue[500],
            },
            primary: {
              main: colors.teal[500],
              hover: colors.teal[400],
              light: colors.navy[500],
              dark: colors.ocean[500],
              contrastText: colors.white[500],
              warning: colors.red[700],
            },
            secondary: {
              main: colors.tea[500],
              hover: colors.tea[400],
              light: colors.greenPastel[500],
              dark: colors.yellow[500],
              contrastText: colors.blackBlue[500],
              warning: colors.red[400],
            },
            warning: {
              main: colors.yellow[600],
              hover: colors.tea[400],
              light: colors.yellow[100],
              dark: colors.yellow[500],
              contrastText: colors.blackBlue[500],
              warning: colors.red[400],
            },
            error: {
              main: colors.red[500],
              hover: colors.red[400],
              light: colors.redPastel[500],
              dark: colors.crimson[500],
              contrastText: colors.white[500],
            },
            info: {
              main: colors.gray[600],
              hover: colors.gray[400],
              light: colors.white[100],
              dark: colors.gray[500],
              contrastText: colors.blackBlue[500],
            },
            success: {
              main: colors.green[500],
              hover: colors.green[400],
              light: colors.green[100],
              dark: colors.forest[500],
              contrastText: colors.white[500],
            },
          }
        : // -------------------------- Dark Mode ------------------------------------
          "deepBlack" in colors && {
            text: {
              main: colors.white[500],
              hover: colors.sky[400],
              light: colors.white[500],
              dark: colors.blackBlue[500],
              contrastText: colors.blackBlue[500],
              // Extras
              disabled: colors.gray[500],
              primary: colors.sky[500],
            },
            background: {
              main: colors.washedBlack[600],
              light: colors.deepBlack[500],
              dark: colors.blackBlue[500],
              hover: colors.washedBlack[500],
              contrastText: colors.white[500],
            },
            primary: {
              main: colors.sky[500],
              hover: colors.sky[400],
              light: colors.gray[500],
              dark: colors.teal[500],
              contrastText: colors.blackBlue[500],
            },
            secondary: {
              main: colors.radioactive[500],
              hover: colors.radioactive[400],
              light: colors.limeRock[500],
              dark: colors.yellow[500],
              contrastText: colors.blackBlue[500],
            },
            warning: {
              main: colors.yellow[500],
              hover: colors.tea[400],
              light: colors.amber[600],
              dark: colors.orange[500],
              contrastText: colors.white[500],
            },
            error: {
              main: colors.red[500],
              hover: colors.red[400],
              light: colors.wine[500],
              dark: colors.crimson[500],
              contrastText: colors.white[500],
            },
            info: {
              main: colors.white[500],
              hover: colors.gray[400],
              light: colors.washedBlack[500],
              dark: colors.white[100],
              contrastText: colors.white[100],
            },
            success: {
              main: colors.green[500],
              hover: colors.green[400],
              light: colors.greenRock[500],
              dark: colors.forest[500],
              contrastText: colors.white[500],
            },
          }),
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 26,
        fontWeight: 500,
      },
      h2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 24,
        fontWeight: 700,
      },
      h3: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 20,
        fontWeight: 700,
      },
      h4: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 16,
        fontWeight: 700,
      },
      h5: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 14,
        fontWeight: 600,
      },
      h6: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 12,
        fontWeight: 500,
      },
      subtitle1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 24,
        fontWeight: 500,
      },
      subtitle2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 20,
        fontWeight: 500,
      },
      body1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 14,
        fontWeight: 400,
      },
      body2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 12,
        fontWeight: 400,
      },
      button: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 14,
        fontWeight: 500,
      },
      caption: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 12,
        fontWeight: 500,
      },
      overline: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 12,
        fontWeight: 300,
      },
    },
  };
};

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState<Mode>("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return { theme, colorMode };
};
