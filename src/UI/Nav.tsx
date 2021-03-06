import feather from "feather-icons";
import { Dispatch, DOMElement, SetStateAction } from "react";
import MiniButton from "./MiniButton";

const darkIcon = feather.icons["moon"].toSvg({ "stroke-width": 1 });
const lightIcon = feather.icons["sun"].toSvg({ "stroke-width": 1 });

type Props = {
  setKey: Dispatch<SetStateAction<number>>;
};
const Nav = ({ setKey }: Props) => {
  // TODO store preference in cookies instead of local storage
  const element = document.getElementById("html");
  const isDark = element!.classList.contains("dark");

  const toggleDarkTheme = () => {
    window.localStorage.getItem("theme") === "dark"
      ? window.localStorage.setItem("theme", "light")
      : window.localStorage.setItem("theme", "dark");
    isDark ? element!.classList.remove("dark") : element!.classList.add("dark");
    setKey((prev) => prev + 1);
  };

  return (
    // width of 22.22% = 1/3 of 2/3
    <div className="absolute flex justify-end w-[22.22%] right-0 py-1.5 px-2">
      <MiniButton icon={isDark ? lightIcon : darkIcon} func={toggleDarkTheme} />
    </div>
  );
};

export default Nav;
