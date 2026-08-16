import {
  Box,
  Button,
  ButtonProps,
  Input,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuListProps,
  MenuOptionGroup,
  MenuProps,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

type OptionValue = string;
type OptionLabel = React.ReactNode | { title: string; desc: string };

type MenuSelectorOption =
  | OptionValue
  | {
      value: OptionValue;
      label: OptionLabel;
      disabled?: boolean;
      searchText?: string;
    };

export interface MenuSelectorProps extends Omit<MenuProps, "children"> {
  options: MenuSelectorOption[];
  value: OptionValue | OptionValue[] | null;
  onSelect: (value: OptionValue | OptionValue[] | null) => void;
  multiple?: boolean;
  placeholder?: string;
  disabled?: boolean;
  size?: string;
  fontSize?: string;
  buttonProps?: ButtonProps;
  menuListProps?: MenuListProps;
  isSearchable?: boolean;
  virtualized?: boolean;
}

export const MenuSelector: React.FC<MenuSelectorProps> = ({
  options,
  value,
  onSelect,
  multiple = false,
  placeholder = "",
  disabled = false,
  size = "xs",
  fontSize = "xs",
  buttonProps,
  menuListProps,
  isSearchable = false,
  virtualized = false,
  ...menuProps
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [scrollTop, setScrollTop] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const buildOptions = (opt: MenuSelectorOption) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt;

  const isTitleDescLabel = (
    label: OptionLabel
  ): label is { title: string; desc: string } =>
    typeof label === "object" &&
    label !== null &&
    "title" in label &&
    "desc" in label;

  const renderLabel = (label: OptionLabel) => {
    if (isTitleDescLabel(label)) {
      return (
        <VStack spacing={0} alignItems="flex-start">
          <Text fontSize={fontSize}>{label.title}</Text>
          {label.desc && (
            <Text fontSize="xs" className="secondary-text">
              {label.desc}
            </Text>
          )}
        </VStack>
      );
    }
    return label;
  };

  const renderButtonLabel = () => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return placeholder;
    }

    const getLabel = (val: OptionValue) => {
      const match = options.find((opt) => buildOptions(opt).value === val);
      const label = match ? buildOptions(match).label : val;
      return isTitleDescLabel(label) ? label.title : label;
    };

    if (multiple && Array.isArray(value)) {
      return value.length <= 3
        ? value.map(getLabel).join(", ")
        : t("MenuSelector.selectedCount", { count: value.length });
    }

    return getLabel(value as OptionValue);
  };

  const filteredOptions = options.filter((option) => {
    if (!isSearchable || !searchQuery) return true;
    const normalizedQuery = searchQuery.toLocaleLowerCase();
    const builtOption = buildOptions(option);
    const label = builtOption.label;
    const text =
      "searchText" in builtOption
        ? builtOption.searchText || builtOption.value
        : isTitleDescLabel(label)
          ? `${label.title} ${label.desc}`
          : typeof label === "string"
            ? label
            : builtOption.value;
    return text.toLocaleLowerCase().includes(normalizedQuery);
  });
  const optionHeight = 32;
  const visibleCount = 32;
  const startIndex = virtualized
    ? Math.max(0, Math.floor(scrollTop / optionHeight) - 4)
    : 0;
  const visibleOptions = virtualized
    ? filteredOptions.slice(startIndex, startIndex + visibleCount + 8)
    : filteredOptions;

  useEffect(() => {
    scrollContainerRef.current?.scrollTo({ top: 0 });
    setScrollTop(0);
  }, [searchQuery]);

  const handleMenuOpen = () => {
    setScrollTop(0);
    requestAnimationFrame(() =>
      scrollContainerRef.current?.scrollTo({ top: 0 })
    );
    menuProps.onOpen?.();
  };

  return (
    <Menu closeOnSelect={!multiple} {...menuProps} onOpen={handleMenuOpen}>
      <MenuButton
        as={Button}
        rightIcon={
          menuProps.placement === "top" ? <LuChevronUp /> : <LuChevronDown />
        }
        isDisabled={disabled}
        size={size}
        variant="outline"
        textAlign="left"
        w="auto"
        flexShrink={0}
        {...buttonProps}
      >
        {renderButtonLabel()}
      </MenuButton>
      <MenuList
        {...menuListProps}
        overflowY={virtualized ? "hidden" : undefined}
      >
        {isSearchable && (
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onClick={(event) => event.stopPropagation()}
            placeholder={t("General.search")}
            size="sm"
            mb={1}
          />
        )}
        <Box
          ref={virtualized ? scrollContainerRef : undefined}
          maxH={virtualized ? "40vh" : undefined}
          overflowY={virtualized ? "auto" : undefined}
          onScroll={
            virtualized
              ? (event) => setScrollTop(event.currentTarget.scrollTop)
              : undefined
          }
        >
          <Box
            {...(virtualized && {
              position: "relative",
              height: `${filteredOptions.length * optionHeight}px`,
            })}
          >
            <MenuOptionGroup
              type={multiple ? "checkbox" : "radio"}
              value={value ?? (multiple ? [] : "")}
              onChange={(val) => {
                if (multiple) {
                  onSelect(Array.isArray(val) ? val : []);
                } else {
                  onSelect(typeof val === "string" ? val : null);
                }
              }}
            >
              {visibleOptions.map((opt, i) => {
                const { value: v, label, disabled } = buildOptions(opt);
                return (
                  <MenuItemOption
                    key={v}
                    value={v}
                    fontSize={fontSize}
                    isDisabled={disabled}
                    {...(virtualized && {
                      position: "absolute",
                      top: `${(startIndex + i) * optionHeight}px`,
                      left: 0,
                      right: 0,
                      height: `${optionHeight}px`,
                    })}
                  >
                    {renderLabel(label)}
                  </MenuItemOption>
                );
              })}
            </MenuOptionGroup>
          </Box>
        </Box>
      </MenuList>
    </Menu>
  );
};
