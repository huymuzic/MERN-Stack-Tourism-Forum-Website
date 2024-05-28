import React from 'react'
import { FaRegSun } from "react-icons/fa";
import { FaMoon } from "react-icons/fa";
import { useTheme } from '../../../../theme/Theme';
import './index.css'

export default function ToggleTheme() {
  const { themeMode, toggleLightDarkMode, color } = useTheme();

  return (
    <>
      <style>
        {
          `
        .toggle-label:after {
          background: linear-gradient(180deg, ${color.lightPrimary}, ${color.primary});
        }
        `
        }
      </style>
      <input type="checkbox" id='darkmode-toggle' className='toggle-input' checked={(themeMode != "light")} onChange={toggleLightDarkMode}
      />
      <label className='toggle-label' htmlFor="darkmode-toggle" tabIndex={0} onKeyDown={(event) => {
        if (event.key === 'Enter') {
          toggleLightDarkMode();
        }
      }}>
        <FaRegSun className='sun' />
        <FaMoon className='moon' />
      </label>
    </>
  )
}
