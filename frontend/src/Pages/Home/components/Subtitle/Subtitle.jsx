import PropTypes from "prop-types";
import { useTheme } from "../../../../theme/Theme";

const Subtitle = ({ subtitle }) => {
  const { color } = useTheme();
  return (
    <h3
      className="section__subtitle l3"
      style={{ backgroundColor: color.secondary }}
    >
      {subtitle}
    </h3>
  );
};

Subtitle.propTypes = {
  subtitle: PropTypes.string.isRequired,
};

export default Subtitle;
