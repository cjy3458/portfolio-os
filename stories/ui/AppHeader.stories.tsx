import type { Meta, StoryObj } from "@storybook/react";
import { Terminal } from "lucide-react";
import AppHeader from "@/components/ui/AppHeader";
import OsButton from "@/components/ui/OsButton";

const meta: Meta<typeof AppHeader> = {
  title: "UI/AppHeader",
  component: AppHeader,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-96 p-4 border border-gray-200">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof AppHeader>;

export const TitleOnly: Story = {
  args: { title: "PORTFOLIO_OS" },
};

export const WithIcon: Story = {
  args: {
    title: "TERMINAL",
    icon: <Terminal size={16} />,
  },
};

export const WithAction: Story = {
  args: {
    title: "PROJECTS",
    action: <OsButton size="sm">+ 새 항목</OsButton>,
  },
};

export const Full: Story = {
  args: {
    title: "README.md",
    icon: <Terminal size={16} />,
    action: <OsButton size="sm">편집</OsButton>,
  },
};
