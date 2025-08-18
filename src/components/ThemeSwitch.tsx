import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const ThemeSwitch = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
      <Switch
        id="theme-switch"
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle dark mode"
        title="Toggle dark mode"
        className="border-border h-8 w-[44px] sm:h-9 sm:w-[48px] rounded-full"
      />
      <Label htmlFor="theme-switch" className="hidden sm:inline-block text-xs sm:text-sm text-muted-foreground select-none">
        Dark mode
      </Label>
    </div>
  );
};


