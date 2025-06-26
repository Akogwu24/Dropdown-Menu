import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DropdownMenu } from "@/components/DropdownMenu";

describe("DropdownMenu", () => {
  const mockItems = [
    { label: "Option 1", value: "1", onClick: jest.fn() },
    { label: "Option 2", value: "2", onClick: jest.fn() },
    { label: "Option 3", value: "3", onClick: jest.fn() },
  ];

  const mockTrigger = <button>Toggle Menu</button>;

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("renders the trigger button", () => {
    render(<DropdownMenu trigger={mockTrigger} items={mockItems} />);
    expect(screen.getByRole("button", { name: /toggle menu/i })).toBeInTheDocument();
  });

  it("does not display the menu items by default", () => {
    render(<DropdownMenu trigger={mockTrigger} items={mockItems} />);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("displays the menu items when the trigger button is clicked", () => {
    render(<DropdownMenu trigger={mockTrigger} items={mockItems} />);
    fireEvent.click(screen.getByRole("button", { name: /toggle menu/i }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /option 1/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /option 2/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /option 3/i })).toBeInTheDocument();
  });

  it("closes the menu when a menu item is clicked", () => {
    render(<DropdownMenu trigger={mockTrigger} items={mockItems} />);
    fireEvent.click(screen.getByRole("button", { name: /toggle menu/i }));
    fireEvent.click(screen.getByRole("menuitem", { name: /option 1/i }));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(mockItems[0].onClick).toHaveBeenCalledTimes(1);
  });

  it("calls onSelect when a menu item is clicked", () => {
    const handleSelect = jest.fn();
    render(<DropdownMenu trigger={mockTrigger} items={mockItems} onSelect={handleSelect} />);
    fireEvent.click(screen.getByRole("button", { name: /toggle menu/i }));
    fireEvent.click(screen.getByRole("menuitem", { name: /option 2/i }));
    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith("2");
  });

  it("closes the menu when clicking outside", () => {
    render(<DropdownMenu trigger={mockTrigger} items={mockItems} />);
    fireEvent.click(screen.getByRole("button", { name: /toggle menu/i }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  // Accessibility (ARIA) tests
  it("applies correct ARIA attributes to the trigger button", () => {
    render(<DropdownMenu trigger={mockTrigger} items={mockItems} />);
    const triggerButton = screen.getByRole("button", { name: /toggle menu/i });
    expect(triggerButton).toHaveAttribute("aria-haspopup", "true");
    expect(triggerButton).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(triggerButton);
    expect(triggerButton).toHaveAttribute("aria-expanded", "true");
  });

  it("applies correct ARIA role to the menu", () => {
    render(<DropdownMenu trigger={mockTrigger} items={mockItems} />);
    fireEvent.click(screen.getByRole("button", { name: /toggle menu/i }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("applies correct ARIA role to menu items", () => {
    render(<DropdownMenu trigger={mockTrigger} items={mockItems} />);
    fireEvent.click(screen.getByRole("button", { name: /toggle menu/i }));
    mockItems.forEach((item) => {
      expect(screen.getByRole("menuitem", { name: item.label })).toBeInTheDocument();
    });
  });

  // Keyboard navigation tests
  it("focuses the first menu item when the menu opens", () => {
    render(<DropdownMenu trigger={mockTrigger} items={mockItems} />);
    fireEvent.click(screen.getByRole("button", { name: /toggle menu/i }));
    expect(screen.getByRole("menuitem", { name: /option 1/i })).toHaveFocus();
  });

  it("moves focus down with ArrowDown key", () => {
    render(<DropdownMenu trigger={mockTrigger} items={mockItems} />);
    fireEvent.click(screen.getByRole("button", { name: /toggle menu/i }));
    fireEvent.keyDown(screen.getByRole("menuitem", { name: /option 1/i }), { key: "ArrowDown" });
    expect(screen.getByRole("menuitem", { name: /option 2/i })).toHaveFocus();
  });

  it("moves focus up with ArrowUp key", () => {
    render(<DropdownMenu trigger={mockTrigger} items={mockItems} />);
    fireEvent.click(screen.getByRole("button", { name: /toggle menu/i }));
    fireEvent.keyDown(screen.getByRole("menuitem", { name: /option 1/i }), { key: "ArrowDown" }); // Move to item 2
    fireEvent.keyDown(screen.getByRole("menuitem", { name: /option 2/i }), { key: "ArrowUp" });
    expect(screen.getByRole("menuitem", { name: /option 1/i })).toHaveFocus();
  });

  it("moves focus to the last item with End key", () => {
    render(<DropdownMenu trigger={mockTrigger} items={mockItems} />);
    fireEvent.click(screen.getByRole("button", { name: /toggle menu/i }));
    fireEvent.keyDown(screen.getByRole("menuitem", { name: /option 1/i }), { key: "End" });
    expect(screen.getByRole("menuitem", { name: /option 3/i })).toHaveFocus();
  });

  it("moves focus to the first item with Home key", () => {
    render(<DropdownMenu trigger={mockTrigger} items={mockItems} />);
    fireEvent.click(screen.getByRole("button", { name: /toggle menu/i }));
    fireEvent.keyDown(screen.getByRole("menuitem", { name: /option 1/i }), { key: "ArrowDown" }); // Move to item 2
    fireEvent.keyDown(screen.getByRole("menuitem", { name: /option 2/i }), { key: "Home" });
    expect(screen.getByRole("menuitem", { name: /option 1/i })).toHaveFocus();
  });

  it("closes the menu and returns focus to trigger on Escape key", () => {
    render(<DropdownMenu trigger={mockTrigger} items={mockItems} />);
    const triggerButton = screen.getByRole("button", { name: /toggle menu/i });
    fireEvent.click(triggerButton);
    expect(screen.getByRole("menu")).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("menuitem", { name: /option 1/i }), { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(triggerButton).toHaveFocus();
  });

  it("closes the menu when tabbing out from the last item", () => {
    render(<DropdownMenu trigger={mockTrigger} items={mockItems} />);
    const triggerButton = screen.getByRole("button", { name: /toggle menu/i });
    fireEvent.click(triggerButton);
    const option3 = screen.getByRole("menuitem", { name: /option 3/i });
    option3.focus();
    fireEvent.keyDown(option3, { key: "Tab" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(triggerButton).toHaveFocus();
  });

  it("closes the menu when shift-tabbing out from the first item", () => {
    render(<DropdownMenu trigger={mockTrigger} items={mockItems} />);
    const triggerButton = screen.getByRole("button", { name: /toggle menu/i });
    fireEvent.click(triggerButton);
    const option1 = screen.getByRole("menuitem", { name: /option 1/i });
    option1.focus();
    fireEvent.keyDown(option1, { key: "Tab", shiftKey: true });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(triggerButton).toHaveFocus();
  });

  it("handles Enter key on trigger to open/close menu", () => {
    render(<DropdownMenu trigger={mockTrigger} items={mockItems} />);
    const triggerButton = screen.getByRole("button", { name: /toggle menu/i });
    fireEvent.keyDown(triggerButton, { key: "Enter" });
    expect(screen.getByRole("menu")).toBeInTheDocument();
    fireEvent.keyDown(triggerButton, { key: "Enter" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("handles Space key on trigger to open/close menu", () => {
    render(<DropdownMenu trigger={mockTrigger} items={mockItems} />);
    const triggerButton = screen.getByRole("button", { name: /toggle menu/i });
    fireEvent.keyDown(triggerButton, { key: " " });
    expect(screen.getByRole("menu")).toBeInTheDocument();
    fireEvent.keyDown(triggerButton, { key: " " });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  // Direction prop tests
  it('applies correct classes for "up" direction', () => {
    render(<DropdownMenu trigger={mockTrigger} items={mockItems} direction="up" />);
    fireEvent.click(screen.getByRole("button", { name: /toggle menu/i }));
    expect(screen.getByRole("menu")).toHaveClass("bottom-full mb-2");
  });

  it('applies correct classes for "left" direction', () => {
    render(<DropdownMenu trigger={mockTrigger} items={mockItems} direction="left" />);
    fireEvent.click(screen.getByRole("button", { name: /toggle menu/i }));
    expect(screen.getByRole("menu")).toHaveClass("right-full mr-2");
  });

  it('applies correct classes for "right" direction', () => {
    render(<DropdownMenu trigger={mockTrigger} items={mockItems} direction="right" />);
    fireEvent.click(screen.getByRole("button", { name: /toggle menu/i }));
    expect(screen.getByRole("menu")).toHaveClass("left-full ml-2");
  });

  it('applies correct classes for "down" direction (default)', () => {
    render(<DropdownMenu trigger={mockTrigger} items={mockItems} />); // Default direction
    fireEvent.click(screen.getByRole("button", { name: /toggle menu/i }));
    expect(screen.getByRole("menu")).toHaveClass("top-full mt-2");
  });
});
