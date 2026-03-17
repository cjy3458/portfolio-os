import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import OsInput from "@/components/ui/OsInput";

const meta: Meta<typeof OsInput> = {
  title: "UI/OsInput",
  component: OsInput,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof OsInput>;

export const Default: Story = {
  args: { placeholder: "입력하세요..." },
};

export const WithValue: Story = {
  args: { value: "portfolio-os", onChange: fn() },
};

export const Disabled: Story = {
  args: { placeholder: "비활성화 입력", disabled: true },
};

export const URL: Story = {
  args: { type: "url", placeholder: "https://example.com", value: "https://github.com", onChange: fn() },
};
