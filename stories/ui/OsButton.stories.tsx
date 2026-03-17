import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import OsButton from "@/components/ui/OsButton";

const meta: Meta<typeof OsButton> = {
  title: "UI/OsButton",
  component: OsButton,
  tags: ["autodocs"],
  args: { onClick: fn() },
};
export default meta;
type Story = StoryObj<typeof OsButton>;

export const Default: Story = {
  args: { children: "클릭하세요", size: "sm" },
};

export const Medium: Story = {
  args: { children: "Medium Button", size: "md" },
};

export const Icon: Story = {
  args: { children: "★", size: "icon" },
};

export const AsLink: Story = {
  args: {
    href: "https://github.com",
    children: "GitHub 방문",
    target: "_blank",
  },
};

export const Disabled: Story = {
  args: { children: "비활성화", disabled: true },
};
