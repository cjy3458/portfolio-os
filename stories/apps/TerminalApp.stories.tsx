import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, expect } from "@storybook/test";
import TerminalApp from "@/components/apps/TerminalApp";

const meta: Meta<typeof TerminalApp> = {
  title: "Apps/TerminalApp",
  component: TerminalApp,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="w-[500px] h-[350px] border-2 border-black overflow-hidden">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof TerminalApp>;

export const Default: Story = {};

export const VerifyInitialMessages: Story = {
  name: "초기 메시지 확인",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 시스템 초기 메시지 확인
    await expect(canvas.getByText("PORTFOLIO_OS v1.0.0")).toBeInTheDocument();
    await expect(
      canvas.getByText(/AI 어시스턴트에 연결되었습니다/)
    ).toBeInTheDocument();

    // 입력 프롬프트 확인
    await expect(canvas.getByText("guest@os:~$")).toBeInTheDocument();
  },
};

export const TypeCommand: Story = {
  name: "명령어 입력",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 입력 필드 찾기
    const input = canvas.getByRole("textbox");
    await userEvent.click(input);
    await userEvent.type(input, "안녕하세요");

    // 타이핑된 값 확인
    await expect(input).toHaveValue("안녕하세요");
  },
};

export const ClearCommand: Story = {
  name: "clear 명령어",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole("textbox");
    await userEvent.click(input);
    await userEvent.type(input, "clear");
    await userEvent.keyboard("{Enter}");

    // 히스토리가 지워졌는지 확인 (초기 메시지 없음)
    const messages = canvas.queryByText("PORTFOLIO_OS v1.0.0");
    await expect(messages).not.toBeInTheDocument();
  },
};
