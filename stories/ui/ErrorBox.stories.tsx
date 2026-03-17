import type { Meta, StoryObj } from "@storybook/react";
import { fn, userEvent, within, expect } from "@storybook/test";
import ErrorBox from "@/components/ui/ErrorBox";

const meta: Meta<typeof ErrorBox> = {
  title: "UI/ErrorBox",
  component: ErrorBox,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof ErrorBox>;

export const WithoutRetry: Story = {
  args: { message: "데이터를 불러올 수 없습니다." },
};

export const WithRetry: Story = {
  args: {
    message: "네트워크 오류가 발생했습니다.",
    onRetry: fn(),
  },
};

export const RetryButtonClick: Story = {
  args: {
    message: "서버 오류 (500)",
    onRetry: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const retryBtn = canvas.getByRole("button", { name: "재시도" });
    await userEvent.click(retryBtn);
    await expect(args.onRetry).toHaveBeenCalledOnce();
  },
};
