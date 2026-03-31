import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, expect } from "@storybook/test";
import { useOsStore } from "@/store/osStore";
import StartMenu from "@/components/desktop/StartMenu";

const meta: Meta<typeof StartMenu> = {
  title: "Desktop/StartMenu",
  component: StartMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      // Zustand store 초기화
      useOsStore.setState({
        isBooting: false,
        openWindows: [],
        focusedWindowId: null,
        startMenuOpen: true,
      });
      return (
        <div className="relative h-screen w-64 bg-[#e5e5e5]">
          <Story />
        </div>
      );
    },
  ],
};
export default meta;
type Story = StoryObj<typeof StartMenu>;

export const Default: Story = {};

export const OpenAppFromMenu: Story = {
  name: "메뉴에서 앱 열기",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // README.md 항목 클릭
    const menuItem = canvas.getByText("README.md");
    await userEvent.click(menuItem);

    const { openWindows } = useOsStore.getState();
    await expect(openWindows.some((w) => w.id === "profile")).toBe(true);
  },
};
