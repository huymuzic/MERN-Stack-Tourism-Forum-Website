import { createContext, useContext, useEffect, useState } from "react";
import _color from './Color'
import PropTypes from 'prop-types';
import tinycolor from "tinycolor2";
import { pushError } from "../components/Toast";

function createCustomTheme(color) {
  const theme = `
      .btn {
        padding: 8px 32px;
        text-wrap: nowrap
      }
      .btn.disabled, .btn:disabled, fieldset:disabled .btn {
        background-color: ${color.grey300};
        border-color: ${color.grey300};
      }
      .btn-primary {
        background-color: ${color.primary};
        border: none;
        color: ${color.buttonTextColor};
      }
      .btn-check:checked + .btn,
      .btn.btn-primary.active,
      .btn.btn-primary.show,
      .btn.btn-primary:first-child:active,
      :not(.btn-check) + .btn.btn-primary:active {
          background-color: ${tinycolor(color.buttonHoverColor).darken(10).toString()};
          border: none;
          color: ${color.white};
      }
      .btn-primary:hover {
        background-color: ${color.buttonHoverColor};
      }
      .btn-secondary {
        background-color: ${color.grey300};
        border: none ;
        color: ${color.textPrimary};
      }
      .btn-secondary:hover {
        background-color: ${color.grey400};
      }
      .btn-danger {
        background-color: ${color.danger};
        border: none ;
        color: ${color.white};
      }
      .btn-danger:hover {
        background-color: ${color.darkDanger} ;
      }
      .btn-outline-primary {
        border-color: ${color.primary} ;
        color: ${color.primary} ;
      }
      .btn-check:checked + .btn,
      .btn.btn-outline-primary.active,
      .btn.btn-outline-primary.show,
      .btn.btn-outline-primary:first-child:active,
      :not(.btn-check) + .btn.btn-outline-primary:active {
          background-color: ${color.white};
          border-color: ${tinycolor(color.buttonHoverColor).darken(10).toString()};
          color: ${tinycolor(color.buttonHoverColor).darken(10).toString()};
      }
      .btn-outline-primary:hover {
        background-color: ${color.white};
        color: ${color.buttonHoverColor} ;
        border-color: ${color.buttonHoverColor} !important ;
      }
      .btn-outline-danger {
        border-color: ${color.danger} ;
        color: ${color.danger} ;
      }
      .btn-outline-danger:hover {
        background-color: ${color.danger} ;
        color: ${color.white} ;
        border-color: ${color.danger} 
      }
      .form-control:focus {
        border-color: ${color.primary} ;
        box-shadow: 0 0 0 0.25rem ${tinycolor(color.primary).lighten(30).toString()} ;
      }
      
      .form-select:focus {
        border-color: ${color.primary} ;
        box-shadow: 0 0 0 0.25rem ${tinycolor(color.primary).lighten(30).toString()} ;
      }
      .form-check-input:checked {
        background-color:${color.primary};
        border-color: ${color.primary};
      }
      .form-check-input:focus {
        box-shadow: 0 0 0 0.25rem ${tinycolor(color.primary).lighten(30).toString()} ;
      }

      .form-check-input:focus{
        border-color: ${color.primary}
      }
      `;
  return theme;
}

function generatePrimaryColor(primaryColor) {
  // const primary = new tinycolor(primaryColor);
  const lightness = tinycolor(primaryColor).toHsl().l;
  console.log("🚀 ~ generatePrimaryColor ~ lightness:", lightness)
  let palette;

  if (lightness < 0.2) {
    palette = {
      lightPrimary: tinycolor(primaryColor).lighten(60).toString(),
      primary: tinycolor(primaryColor).lighten(30).toString(),
      darkPrimary: tinycolor(primaryColor).toString(),
    };
  } else if (lightness >= 0.2 && lightness < 0.4) {
    palette = {
      lightPrimary: tinycolor(primaryColor).lighten(45).toString(),
      primary: tinycolor(primaryColor).lighten(20).toString(),
      darkPrimary: tinycolor(primaryColor).toString(),
    };
  } else if (lightness >= 0.4 && lightness < 0.6) {
    palette = {
      lightPrimary: tinycolor(primaryColor).lighten(30).toString(),
      primary: tinycolor(primaryColor).toString(),
      darkPrimary: tinycolor(primaryColor).darken(30).toString(),
    };
  } else if (lightness >= 0.6 && lightness < 0.8) {
    palette = {
      lightPrimary: tinycolor(primaryColor).toString(),
      primary: tinycolor(primaryColor).darken(20).toString(),
      darkPrimary: tinycolor(primaryColor).darken(45).toString(),
    };
  } else if (lightness >= 0.8) {
    palette = {
      lightPrimary: tinycolor(primaryColor).toString(),
      primary: tinycolor(primaryColor).darken(30).toString(),
      darkPrimary: tinycolor(primaryColor).darken(45).toString(),
    };
  }

  console.log("palette: " + palette.lightPrimary);
  console.log("palette: " + palette.primary);
  return palette;

}

function useThemeContext(userId) {
  const [isLoadingTheme, setIsLoadingTheme] = useState(false)
  const [color, setColor] = useState(_color)

  const fetchTheme = async () => {
    if (!userId) {
      setColor(_color)
    }
    setIsLoadingTheme(true);
    const url = new URL(`${import.meta.env.VITE_BASE_URL}/api/v1/users/theme/${userId}`);

    try {
      let data
      if (!userId) return;
      const response = await fetch(url, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        // pushError('Failed to get theme');
        setIsLoadingTheme(false);
        return;
      }

      data = await response.json();
      const primaryPalette = generatePrimaryColor(data.theme.primary)
      setColor({ ...color, ...data.theme, ...primaryPalette })
    } catch (error) {
      console.log("🚀 ~ fetchUser ~ error:", error);
    } finally {
      setIsLoadingTheme(false);
    }
  }
  useEffect(() => {
    fetchTheme();
  }, [userId]);
  const theme = createCustomTheme(color);
  return {
    theme,
    color,
    isLoadingTheme,
    fetchTheme
  };
}
const ThemeContext = createContext({});

export const useTheme = () => useContext(ThemeContext);


export const ThemeProvider = (props) => {
  const { children, userId } = props;
  const themeContext = useThemeContext(userId);

  return (
    <ThemeContext.Provider value={themeContext}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  userId: PropTypes.string,
  children: PropTypes.node.isRequired,
};