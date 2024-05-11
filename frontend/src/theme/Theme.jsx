import { createContext, useContext, useState } from "react";
import color from './Color'
import PropTypes from 'prop-types';
import tinycolor from "tinycolor2";

function createCustomTheme(color) {
  const theme = `
      .btn {
        padding: 8px 32px;
        text-wrap: nowrap
      }
      .btn-primary {
        background-color: ${color.primary};
        border: none;
        color: ${color.white};
      }
      .btn-primary:hover {
        background-color: ${color.darkPrimary};
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
      .btn-outline-primary:hover {
        background-color: ${color.primary} ;
        color: ${color.white} ;
        border-color: ${color.primary} !important ;
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