import { createContext, useContext, useState } from "react";
import color from './Color'
import PropTypes from 'prop-types';
import tinycolor from "tinycolor2";

function createCustomTheme(color) {
  const theme = `
      .btn-primary {
        background-color: ${color.primary} !important;
        border: none !important;
        color: ${color.white} !important;
      }
      .btn-primary:hover {
        background-color: ${color.darkPrimary} !important;
      }
      .btn-secondary {
        background-color: ${color.grey300} !important;
        border: none !important;
        color: ${color.textPrimary} !important;
      }
      .btn-secondary:hover {
        background-color: ${color.grey400} !important;
      }
      .btn-danger {
        background-color: ${color.danger} !important;
        border: none !important;
        color: ${color.white} !important;
      }
      .btn-danger:hover {
        background-color: ${color.darkDanger} !important;
      }
      .btn-outline-primary {
        border-color: ${color.primary} !important;
        color: ${color.primary} !important;
      }
      .btn-outline-primary:hover {
        background-color: ${color.primary} !important;
        color: ${color.white} !important
      }
      .btn-outline-danger {
        border-color: ${color.danger} !important;
        color: ${color.danger} !important;
      }
      .btn-outline-danger:hover {
        background-color: ${color.danger} !important;
        color: ${color.white} !important
      }
      .form-control:focus {
        border-color: ${color.primary} !important;
        box-shadow: 0 0 0 0.25rem ${tinycolor(color.primary).lighten(30).toString()} !important;
      }
      
      .form-select:focus {
        border-color: ${color.primary} !important;
        box-shadow: 0 0 0 0.25rem ${tinycolor(color.primary).lighten(30).toString()} !important;
      }
      
      `;
  return theme;
}

function useThemeContext() {
  const [isLoadingTheme, setIsLoadingTheme] = useState(false)
  // let newColor
  // const fetchTheme = async () => {
  //   return fetch("")
  //     .then((response) => {
  //       // if (!response.ok) {
  //       //   pushError('Failed to get theme');
  //       // }
  //       return;
  //     })
  //     .then((data) => {
  //       newColor = { ...color, ...data }
  //     })
  //     .catch(() => {
  //       setIsLoadingTheme(false)
  //     }).finally(() => setIsLoadingTheme(false))
  // }
  const theme = createCustomTheme(color);
  return {
    theme,
    color,
    isLoadingTheme
  };
}
const ThemeContext = createContext({});

export const useTheme = () => useContext(ThemeContext);


export const ThemeProvider = (props) => {
  const { children, customTheme } = props;
  const themeContext = useThemeContext(customTheme);
  console.log("🚀 ~ ThemeProvider ~ themeContext:", themeContext)

  return (
    <ThemeContext.Provider value={themeContext}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  customTheme: PropTypes.object,
  children: PropTypes.node.isRequired,
};