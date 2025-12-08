import { useSelector, useDispatch } from "react-redux";
import { toggleTheme, setTheme } from "../redux/slices/ThemeSlice";

export function useTheme() {
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  return {
    theme,
    toggleTheme: () => dispatch(toggleTheme()),
    setTheme: (value) => dispatch(setTheme(value)),
  };
}
