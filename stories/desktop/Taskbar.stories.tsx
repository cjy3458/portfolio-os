import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, expect } from "@storybook/test";
import { useOsStore } from "@/store/osStore";
import Taskbar from "@/components/desktop/Taskbar";

const meta: Meta<typeof Taskbar> = {
  title: "Desktop/Taskbar",
  component: Taskbar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="relative h-screen bg-[#e5e5e5]">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Taskbar>;

export const Empty: Story = {
  decorators: [
    (Story) => {
      useOsStore.setState({ isBooting: false, openWindows: [], startMenuOpen: false });
      return <Story />;
    },
  ],
};

export const WithOpenApps: Story = {
  name: "앱 탭 포함",
  decorators: [
    (Story) => {
      useOsStore.setState({
        isBooting: false,
        openWindows: [
          { id: "profile", zIndex: 10 },
          { id: "terminal", zIndex: 11 },
        ],
        focusedWindowId: "terminal",
        startMenuOpen: false,
      });
      return <Story />;
    },
  ],
};

export const StartMenuToggle: Story = {
  name: "START 버튼 토글",
  decorators: [
    (Story) => {
      useOsStore.setState({ isBooting: false, openWindows: [], startMenuOpen: false });
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const startBtn = canvas.getByRole("button", { name: /start/i });

    // 열기
    await userEvent.click(startBtn);
    await expect(useOsStore.getState().startMenuOpen).toBe(true);

    // 닫기
    await userEvent.click(startBtn);
    await expect(useOsStore.getState().startMenuOpen).toBe(false);
  },
};
