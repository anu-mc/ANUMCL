import { isChakraColor } from "@/enums/misc";

const COLOR_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const COLOR_MIXES: Record<number, number> = {
  50: 0.92,
  100: 0.84,
  200: 0.68,
  300: 0.5,
  400: 0.24,
  500: 0,
  600: -0.12,
  700: -0.25,
  800: -0.4,
  900: -0.56,
};

const normalizeHexColor = (color: string) => {
  const normalized = color.replace("#", "");
  return /^[0-9a-f]{6}$/i.test(normalized) ? normalized : "3182ce";
};

const mixColor = (color: string, amount: number) => {
  const channels = [0, 2, 4].map((index) =>
    Number.parseInt(color.slice(index, index + 2), 16)
  );
  const target = amount < 0 ? 0 : 255;
  const factor = Math.abs(amount);
  return `#${channels
    .map((channel) =>
      Math.round(channel + (target - channel) * factor)
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`;
};

export const applyCustomPrimaryColor = (color: string) => {
  const normalized = normalizeHexColor(color);
  COLOR_STOPS.forEach((stop) => {
    document.documentElement.style.setProperty(
      `--ahnumcl-primary-${stop}`,
      mixColor(normalized, COLOR_MIXES[stop])
    );
  });
};

export const applyInterfaceBackgroundColor = (
  color: string,
  customColor: string,
  opacity: number,
  colorMode: "light" | "dark"
) => {
  const normalizedOpacity = Math.min(Math.max(opacity, 0), 100);
  const resolvedColor = color === "custom" ? customColor : "";

  if (/^#[0-9a-f]{6}$/i.test(resolvedColor)) {
    document.documentElement.style.setProperty(
      "--ahnumcl-interface-background",
      `color-mix(in srgb, ${resolvedColor} ${normalizedOpacity}%, transparent)`
    );
  } else if (isChakraColor(color)) {
    const shade = colorMode === "dark" ? 900 : 50;
    document.documentElement.style.setProperty(
      "--ahnumcl-interface-background",
      `color-mix(in srgb, ${
        colorMode === "dark"
          ? `color-mix(in srgb, var(--chakra-colors-${color}-${shade}) 65%, black)`
          : `var(--chakra-colors-${color}-${shade})`
      } ${normalizedOpacity}%, transparent)`
    );
  } else {
    document.documentElement.style.removeProperty(
      "--ahnumcl-interface-background"
    );
  }
};
