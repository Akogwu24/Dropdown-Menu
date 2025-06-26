import React, { useState, useRef, useEffect, useCallback } from "react";

interface DropdownMenuItem {
  label: string;
  value: string;
  onClick?: () => void;
}

interface DropdownMenuProps {
  trigger: React.ReactElement;
  items: DropdownMenuItem[];
  onSelect?: (value: string) => void;
  direction?: "up" | "down" | "left" | "right";
}

export const DropdownMenu = ({
  trigger,
  items,
  onSelect,
  direction = "down",
}: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  }, []);

  const handleMenuItemClick = useCallback(
    (item: DropdownMenuItem) => {
      item.onClick?.();
      onSelect?.(item.value);
      closeMenu();
    },
    [onSelect, closeMenu]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) return;

      const menuItems = Array.from(
        menuRef.current?.querySelectorAll('[role="menuitem"]') || []
      ) as HTMLElement[];
      const focusedIndex = menuItems.findIndex((item) => item === document.activeElement);

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          if (focusedIndex === -1 || focusedIndex === menuItems.length - 1) {
            menuItems[0]?.focus();
          } else {
            menuItems[focusedIndex + 1]?.focus();
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          if (focusedIndex === -1 || focusedIndex === 0) {
            menuItems[menuItems.length - 1]?.focus();
          } else {
            menuItems[focusedIndex - 1]?.focus();
          }
          break;
        case "Home":
          event.preventDefault();
          menuItems[0]?.focus();
          break;
        case "End":
          event.preventDefault();
          menuItems[menuItems.length - 1]?.focus();
          break;
        case "Escape":
          event.preventDefault();
          closeMenu();
          break;
        case "Tab":
          // Allow tabbing within the menu, but close if tabbing out
          if (event.shiftKey && focusedIndex === 0 && triggerRef.current) {
            closeMenu();
          } else if (
            !event.shiftKey &&
            focusedIndex === menuItems.length - 1 &&
            triggerRef.current
          ) {
            closeMenu();
          }
          break;
      }
    },
    [isOpen, closeMenu]
  );

  useEffect(() => {
    //close the dropdown menu when clicking outside of it
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key === "Tab" && isOpen) {
        const focusableElements = Array.from(
          menuRef.current?.querySelectorAll(
            'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
          ) || []
        ) as HTMLElement[];

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstFocusable) {
            event.preventDefault();
            triggerRef.current?.focus();
            closeMenu();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            event.preventDefault();
            triggerRef.current?.focus();
            closeMenu();
          }
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleTabKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleTabKey);
    };
  }, [isOpen, closeMenu, handleKeyDown]);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      // Focus the first menu item when the menu opens
      const firstMenuItem = menuRef.current.querySelector('[role="menuitem"]') as HTMLElement;
      firstMenuItem?.focus();
    }
  }, [isOpen]);

  const getMenuPositionClasses = () => {
    switch (direction) {
      case "up":
        return "bottom-full mb-2";
      case "left":
        return "right-full mr-2";
      case "right":
        return "left-full ml-2";
      case "down":
      default:
        return "top-full mt-2";
    }
  };

  return (
    <div className="relative inline-block text-left">
      {React.cloneElement(trigger, {
        ref: triggerRef,
        onClick: toggleMenu,
        "aria-haspopup": "true",
        "aria-expanded": isOpen,
        onKeyDown: (event: React.KeyboardEvent) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleMenu();
          }
          handleKeyDown(event as unknown as KeyboardEvent); // Pass keyboard events from trigger to handler
        },
        children: (
          <>
            {(trigger.props as { children?: React.ReactNode }).children}
            <span className={`ml-2`}>
              {/* Unicode for a down-pointing triangle (caret) */}
              &#9660;
            </span>
          </>
        ),
      } as React.HTMLProps<HTMLButtonElement> & { children?: React.ReactNode })}

      {isOpen && (
        <ul
          ref={menuRef}
          role="menu"
          className={`absolute w-full z-10 bg-white dark:bg-gray-800 shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none ${getMenuPositionClasses()} origin-top-right transition-all duration-400 ease-out transform opacity-0 scale-95 ${
            isOpen ? "opacity-100 scale-100" : ""
          }`}
          tabIndex={-1} // Ensure the menu itself is not tab-focusable
        >
          {items.map((item) => (
            <li key={item.value} role="none">
              <button
                onClick={() => handleMenuItemClick(item)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 transition-all duration-500"
                role="menuitem"
                tabIndex={0} // Make menu items focusable
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
