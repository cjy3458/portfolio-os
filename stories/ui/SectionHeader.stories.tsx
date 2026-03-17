import type { Meta, StoryObj } from "@storybook/react";
import SectionHeader from "@/components/ui/SectionHeader";

const meta: Meta<typeof SectionHeader> = {
  title: "UI/SectionHeader",
  component: SectionHeader,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
        <p className="font-mono text-sm mt-2">섹션 내용...</p>
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof SectionHeader>;

export const Default: Story = {
  args: { title: "TECH STACK" },
};

export const WithCustomClass: Story = {
  args: { title: "PROJECTS", className: "text-black" },
};
