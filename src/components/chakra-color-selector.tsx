import {
  Box,
  BoxProps,
  Flex,
  HStack,
  IconButton,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Spacer,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaCircleCheck, FaRegCircle } from "react-icons/fa6";
import { LuChevronDown, LuX } from "react-icons/lu";
import { ChakraColorEnums, ColorSelectorType } from "@/enums/misc";

interface ChakraColorSelectorProps extends BoxProps {
  current: string;
  onColorSelect: (color: string) => void;
  size?: string;
}

const ChakraColorSelector: React.FC<ChakraColorSelectorProps> = ({
  current,
  onColorSelect,
  size = "md",
  ...boxProps
}) => {
  const { t } = useTranslation();

  return (
    <Box w="100%" {...boxProps}>
      <Flex>
        {ChakraColorEnums.map((color: ColorSelectorType, index: number) => (
          <React.Fragment key={color}>
            <Tooltip label={t(`Enums.chakraColors.${color}`)}>
              <IconButton
                size={size}
                variant={current === color ? "solid" : "subtle"}
                colorScheme={color}
                aria-label={color}
                icon={
                  current === color ? (
                    <FaCircleCheck color="white" />
                  ) : (
                    <FaRegCircle />
                  )
                }
                onClick={() => onColorSelect(color)}
              />
            </Tooltip>
            {index < ChakraColorEnums.length - 1 && <Spacer />}
          </React.Fragment>
        ))}
      </Flex>
    </Box>
  );
};

interface ChakraColorSelectPopoverProps {
  current?: string;
  onColorSelect: (color: string) => void;
  size?: string;
  withUnselectButton?: boolean;
  onUnselect?: () => void;
  customColor?: string;
  onCustomColorChange?: (color: string) => void;
}

export const ChakraColorSelectPopover: React.FC<
  ChakraColorSelectPopoverProps
> = ({
  current = "",
  onColorSelect,
  size = "xs",
  withUnselectButton = false,
  onUnselect,
  customColor,
  onCustomColorChange,
}) => {
  const { t } = useTranslation();
  const hasSelectedColor = current !== "";

  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          size={size}
          colorScheme={current === "custom" ? "gray" : current || "gray"}
          variant={hasSelectedColor ? "solid" : "outline"}
          bg={current === "custom" ? customColor : undefined}
          aria-label="color"
          icon={<LuChevronDown />}
        />
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverBody>
            <HStack spacing={2}>
              <ChakraColorSelector
                current={current}
                onColorSelect={onColorSelect}
                size={size}
                flex={1}
              />
              {onCustomColorChange && (
                <Tooltip
                  label={t(
                    "AppearanceSettingsPage.theme.settings.primaryColor.custom"
                  )}
                >
                  <Input
                    type="color"
                    value={customColor || "#3182ce"}
                    onChange={(event) =>
                      onCustomColorChange(event.target.value)
                    }
                    w={size === "xs" ? 6 : 8}
                    h={size === "xs" ? 6 : 8}
                    minW={size === "xs" ? 6 : 8}
                    p={0}
                    border={0}
                    cursor="pointer"
                    aria-label={t(
                      "AppearanceSettingsPage.theme.settings.primaryColor.custom"
                    )}
                  />
                </Tooltip>
              )}
              {withUnselectButton && hasSelectedColor && (
                <IconButton
                  size={size}
                  colorScheme={current || "gray"}
                  variant="outline"
                  aria-label="unselect-color"
                  icon={<LuX />}
                  onClick={onUnselect}
                  isDisabled={!onUnselect}
                />
              )}
            </HStack>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default ChakraColorSelector;
