import React, { createContext, useContext, useState, ReactNode } from "react";
import { useColorScheme as _useColorScheme } from "react-native";

// Create a context for the theme
interface ThemeContextProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
    isDarkMode: false,
    toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const systemColorScheme = _useColorScheme(); // Detect system theme (light/dark)
    const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === "dark");

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
