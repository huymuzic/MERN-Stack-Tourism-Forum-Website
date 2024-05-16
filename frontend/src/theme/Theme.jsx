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
          background-color: ${tinycolor(color.buttonHover).darken(10).toString()};
          border: none;
          color: ${color.white};
      }
      .btn-primary:hover {
        background-color: ${color.buttonHover};
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
          border-color: ${tinycolor(color.buttonHover).darken(10).toString()};
          color: ${tinycolor(color.buttonHover).darken(10).toString()};
      }
      .btn-outline-primary:hover {
        background-color: ${color.white};
        color: ${color.buttonHover} ;
        border-color: ${color.buttonHover} !important ;
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

function useThemeContext(userId) {
  const [isLoadingTheme, setIsLoadingTheme] = useState(false)
  const [color, setColor] = useState(_color)
  const fetchTheme = async () => {
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
      setColor({ ...color, ...data.theme })
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
  console.log("🚀 ~ useThemeContext ~ color:", color)
  return {
    theme,
    color,
    isLoadingTheme
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