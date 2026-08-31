"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/Primitives";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const label = isDark ? "Helles Erscheinungsbild" : "Dunkles Erscheinungsbild";

  return (
    <Button
      onClick={() => mounted && setTheme(isDark ? "light" : "dark")}
      variant="quiet"
      size="icon"
      aria-label={label}
      title={label}
      disabled={!mounted}
    >
      {mounted ? (
        isDark ? <Moon size={17} /> : <Sun size={17} />
      ) : (
        <span className="h-[17px] w-[17px]" aria-hidden="true" />
      )}
    </Button>
  );
}
