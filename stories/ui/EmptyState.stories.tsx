import type { Meta, StoryObj } from "@storybook/react";
import EmptyState from "@/components/ui/EmptyState";

const meta: Meta<typeof EmptyState> = {
  title: "UI/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {};

export const CustomMessage: Story = {
  args: { message: "검색 결과가 없습니다." },
};
