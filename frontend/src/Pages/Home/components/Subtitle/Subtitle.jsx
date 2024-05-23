import React from "react";
import { useTheme } from "../../../../theme/Theme";

const Subtitle = ({ subtitle }) => {
  const { color } = useTheme()
  return <h3 className="section__subtitle l3" style={{ backgroundColor: color.secondary }}>{subtitle}</h3>;
};

export default Subtitle;
