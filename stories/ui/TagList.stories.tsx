import type { Meta, StoryObj } from "@storybook/react";
import TagList from "@/components/ui/TagList";

const meta: Meta<typeof TagList> = {
  title: "UI/TagList",
  component: TagList,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof TagList>;

const techStack = ["React", "TypeScript", "Next.js", "Tailwind CSS", "Zustand", "Playwright"];

export const Wrap: Story = {
  args: { items: techStack, layout: "wrap" },
};

export const Grid: Story = {
  args: { items: techStack, layout: "grid" },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
};

export const Single: Story = {
  args: { items: ["TypeScript"] },
};
