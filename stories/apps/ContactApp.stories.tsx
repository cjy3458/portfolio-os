import type { Meta, StoryObj } from "@storybook/react";
import { within, expect } from "@storybook/test";
import ContactApp from "@/components/apps/ContactApp";

const meta: Meta<typeof ContactApp> = {
  title: "Apps/ContactApp",
  component: ContactApp,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="w-[450px] h-[480px] overflow-auto border-2 border-black">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof ContactApp>;

export const Default: Story = {};

export const VerifyContactLinks: Story = {
  name: "연락처 링크 확인",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 4개 연락처 항목 확인
    await expect(canvas.getByText("EMAIL")).toBeInTheDocument();
    await expect(canvas.getByText("GITHUB")).toBeInTheDocument();
    await expect(canvas.getByText("PHONE")).toBeInTheDocument();
    await expect(canvas.getByText("BLOG")).toBeInTheDocument();

    // 이력서 다운로드 버튼 확인
    const downloadBtn = canvas.getByText(/Download Resume/i);
    await expect(downloadBtn).toBeInTheDocument();
  },
};
