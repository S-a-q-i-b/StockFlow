import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("stockflow-theme") || "light";
  });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingTheme, setPendingTheme] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");

    document.documentElement.setAttribute("data-theme", theme);

    localStorage.setItem("stockflow-theme", theme);
  }, [theme]);

  const changeTheme = (newTheme) => {
    if (newTheme === theme || isTransitioning) return;

    setPendingTheme(newTheme);
    setIsTransitioning(true);

    setTimeout(() => {
      setTheme(newTheme);

      setTimeout(() => {
        setIsTransitioning(false);
        setPendingTheme(null);
      }, 450);
    }, 550);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        changeTheme,
        isTransitioning,
      }}
    >
      {children}

      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{
              y: "100%",
            }}
            animate={{
              y: 0,
            }}
            exit={{
              y: "-100%",
            }}
            transition={{
              duration: 0.55,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.25,
                duration: 0.3,
              }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative">
                <LoaderCircle
                  size={34}
                  strokeWidth={2}
                  className="animate-spin text-white"
                />

                <div className="absolute inset-0 rounded-full bg-white/10 blur-xl" />
              </div>

              <div className="text-center">
                <p className="text-sm font-semibold tracking-wide text-white">
                  Changing theme
                </p>

                <p className="mt-1 text-xs text-white/40">
                  {pendingTheme === "dark"
                    ? "Switching to dark mode..."
                    : "Switching to light mode..."}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
};
