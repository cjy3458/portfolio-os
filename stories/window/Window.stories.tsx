import type { Meta, StoryObj } from "@storybook/react";
import { fn, userEvent, within, expect } from "@storybook/test";
import { Terminal, FileText } from "lucide-react";
import Window from "@/components/window/Window";
import type { AppConfig } from "@/types";

const MockContent = () => (
  <div className="p-6 font-mono">
    <p className="font-bold mb-2">앱 컨텐츠 영역</p>
    <p className="text-sm text-gray-500">스크롤 가능한 내용입니다.</p>
    {Array.from({ length: 20 }, (_, i) => (
      <p key={i} className="text-xs text-gray-400">라인 {i + 1}</p>
    ))}
  </div>
);

const terminalApp: AppConfig = {
  id: "terminal",
  title: "Terminal.sh",
  icon: Terminal,
  component: MockContent,
  defaultPosition: { x: 50, y: 50 },
  width: 500,
  height: 350,
};

const readmeApp: AppConfig = {
  id: "profile",
  title: "README.md",
  icon: FileText,
  component: MockContent,
  defaultPosition: { x: 80, y: 80 },
  width: 550,
  height: 450,
};

const meta: Meta<typeof Window> = {
  title: "Window/Window",
  component: Window,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="relative w-screen h-screen bg-[#e5e5e5] overflow-hidden">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Window>;

export const Default: Story = {
  args: {
    app: terminalApp,
    zIndex: 10,
    isFocused: true,
    onClose: fn(),
    onFocus: fn(),
  },
};

export const Unfocused: Story = {
  args: {
    app: readmeApp,
    zIndex: 9,
    isFocused: false,
    onClose: fn(),
    onFocus: fn(),
  },
};

export const CloseButton: Story = {
  name: "닫기 버튼 클릭",
  args: {
    app: terminalApp,
    zIndex: 10,
    isFocused: true,
    onClose: fn(),
    onFocus: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const closeBtn = canvas.getByRole("button", { name: "닫기" });
    await userEvent.click(closeBtn);
    await expect(args.onClose).toHaveBeenCalledWith("terminal");
  },
};

export const MaximizeToggle: Story = {
  name: "최대화 토글",
  args: {
    app: terminalApp,
    zIndex: 10,
    isFocused: true,
    onClose: fn(),
    onFocus: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const maximizeBtn = canvas.getByRole("button", { name: "최대화" });

    // 최대화
    await userEvent.click(maximizeBtn);
    // 최대화 해제
    await userEvent.click(maximizeBtn);
  },
};

export const MultipleWindows: Story = {
  name: "여러 윈도우",
  render: (args) => (
    <div className="relative w-screen h-screen bg-[#e5e5e5] overflow-hidden">
      <Window {...args} app={terminalApp} zIndex={10} isFocused={false} />
      <Window {...args} app={readmeApp} zIndex={11} isFocused={true} />
    </div>
  ),
  args: {
    onClose: fn(),
    onFocus: fn(),
    zIndex: 10,
    isFocused: false,
    app: terminalApp,
  },
};
