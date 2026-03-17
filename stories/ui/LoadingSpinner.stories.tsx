import type { Meta, StoryObj } from "@storybook/react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const meta: Meta<typeof LoadingSpinner> = {
  title: "UI/LoadingSpinner",
  component: LoadingSpinner,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof LoadingSpinner>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { label: "데이터 로딩 중..." },
};

export const Large: Story = {
  args: { size: 48, label: "처리 중..." },
};

export const Overlay: Story = {
  decorators: [
    (Story) => (
      <div className="relative w-64 h-32 border-2 border-black">
        <div className="p-4 font-mono text-sm">배경 컨텐츠</div>
        <Story />
      </div>
    ),
  ],
  args: { overlay: true, label: "오버레이 로딩" },
};
