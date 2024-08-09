import { createContext } from "react";
import DefaultTheme from "../theme/DefaultTheme";

export const ThemeContext = createContext({ theme: DefaultTheme });

export const ThemeProvider = ({
  children
}: any) => {
  const currentTheme = DefaultTheme;

  return (
    <ThemeContext.Provider value={{ theme: currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
