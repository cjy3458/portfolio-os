import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import OsCard from "@/components/ui/OsCard";

const meta: Meta<typeof OsCard> = {
  title: "UI/OsCard",
  component: OsCard,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof OsCard>;

export const Static: Story = {
  args: {
    children: (
      <div className="font-mono">
        <p className="font-bold">정적 카드</p>
        <p className="text-sm text-gray-500">클릭 불가 카드입니다.</p>
      </div>
    ),
  },
};

export const Clickable: Story = {
  args: {
    onClick: fn(),
    children: (
      <div className="font-mono">
        <p className="font-bold">클릭 가능 카드</p>
        <p className="text-sm text-gray-500">호버 시 그림자가 사라집니다.</p>
      </div>
    ),
  },
};

export const WithCustomClass: Story = {
  args: {
    className: "bg-gray-50",
    children: <p className="font-mono font-bold">커스텀 클래스 카드</p>,
  },
};
