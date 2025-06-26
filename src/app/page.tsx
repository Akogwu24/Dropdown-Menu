"use client";

import { DropdownMenu } from "../components/DropdownMenu";

const dropdownMenuItems = [
  { label: "Profile", value: "profile", onClick: () => alert("profile clicked") },
  { label: "Settings", value: "settings", onClick: () => alert("Settings clicked") },
  { label: "Item 1", value: "item1", onClick: () => alert("Item 1 clicked") },
  { label: "Item 2", value: "item2", onClick: () => alert("Item 2 clicked") },
  { label: "Item 3", value: "item3", onClick: () => alert("Item 3 clicked") },
];

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <h1 className="text-4xl font-bold">ARIA Compliant Dropdown Menu</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto text-center">
          A fully accessible dropdown menu with ARIA attributes, keyboard navigation, focus
          management, and smooth animations.
        </p>
        <small className="text-base text-gray-500 max-w-xl mx-auto text-center">
          Arrow keys, Enter, Space, Escape, and Tab keys are supported for navigation and
          interaction.
        </small>
        <DropdownMenu
          trigger={
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Open Menu</button>
          }
          items={dropdownMenuItems}
          onSelect={(value) => console.log("Selected:", value)}
        />
      </main>
    </div>
  );
}
