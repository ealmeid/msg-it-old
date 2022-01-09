import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "next-themes";

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="h-24 p-6">
      <div
        className="float-right cursor-pointer"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <FontAwesomeIcon
          icon={theme === "dark" ? faMoon : faSun}
          className="w-6"
        />
      </div>
    </div>
  );
};

export default Header;
