import { ClientOnly } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { Moon, Sun } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import { store } from "@/lib/store";
import { useEffect } from "react";

const ToggleTheme = () => {
  const theme = useStore(store, (state) => state.settings.theme);

  const toggleTheme = () => {
    store.setState((state) => {
      const newTheme = state.settings.theme === "light" ? "dark" : "light";
      // 2. Use the "theme" key, not "count"
      localStorage.setItem("theme", newTheme);
      return {
        ...state,
        settings: { theme: newTheme },
      };
    });
  };

  // 1. Initialize store from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme && savedTheme !== theme) {
      store.setState((s) => ({ ...s, settings: { theme: savedTheme } }));
    }
  }, []);

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Submit"
      onClick={toggleTheme}
    >
      {theme === "light" ? <Moon /> : <Sun />}
    </Button>
  );
};

const ToggleThemeButton = () => {
  return (
    <ClientOnly
      fallback={
        <Button variant={"outline"} size={"sm"}>
          <Spinner className="size-4" />
        </Button>
      }
    >
      <ToggleTheme />
    </ClientOnly>
  );
};

export default ToggleThemeButton;
