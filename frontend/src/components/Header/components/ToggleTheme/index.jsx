// import { useEffect, useState } from "react";
import { FaRegSun } from "react-icons/fa";
import { FaMoon } from "react-icons/fa";
import { useTheme } from "../../../../theme/Theme";
import "./index.css";

export default function ToggleTheme() {
  const { themeMode, toggleLightDarkMode, color } = useTheme();
  // const [audio, setAudio] = useState(null);

  // useEffect(() => {
  //   const audioFile = new Audio("./src/assets/audio/bigshaq.mp3");
  //   setAudio(audioFile);
  // }, []);

  // const handleClick = () => {
  //   if (themeMode === "light") {
  //     audio.play();
  //   } else {
  //     audio.pause();
  //     audio.currentTime = 0;
  //   }
  // };

  return (
    <>
      <style>
        {`
        .toggle-label:after {
          background: linear-gradient(180deg, ${color.lightPrimary}, ${color.primary});
        }
        `}
      </style>
      <input
        type="checkbox"
        id="darkmode-toggle"
        className="toggle-input"
        checked={themeMode != "light"}
        onChange={toggleLightDarkMode}
        // onClick={handleClick}
      />
      <label
        className="toggle-label"
        htmlFor="darkmode-toggle"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            toggleLightDarkMode();
          }
        }}
      >
        <FaRegSun className="sun" />
        <FaMoon className="moon" />
      </label>
    </>
  );
}
