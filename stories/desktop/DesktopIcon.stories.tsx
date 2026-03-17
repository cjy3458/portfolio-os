import type { Meta, StoryObj } from "@storybook/react";
import { Terminal, FileText, Briefcase, Phone } from "lucide-react";
import { fn, userEvent, within, expect } from "@storybook/test";
import { useOsStore } from "@/store/osStore";
import DesktopIcon from "@/components/desktop/DesktopIcon";
import type { AppConfig } from "@/types";

// Zustand store 초기화 decorator
const resetStore = () => {
  const story = (Story: React.FC) => {
    useOsStore.setState({
      isBooting: false,
      openWindows: [],
      focusedWindowId: null,
    });
    return <Story />;
  };
  return story;
};

const meta: Meta<typeof DesktopIcon> = {
  title: "Desktop/DesktopIcon",
  component: DesktopIcon,
  tags: ["autodocs"],
  decorators: [
    resetStore(),
    (Story) => (
      <div className="p-8 bg-[#e5e5e5]">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof DesktopIcon>;

const terminalApp: AppConfig = {
  id: "terminal",
  title: "Terminal.sh",
  icon: Terminal,
  component: () => <div>Terminal</div>,
  defaultPosition: { x: 100, y: 100 },
  width: 500,
  height: 350,
};

const readmeApp: AppConfig = {
  id: "profile",
  title: "README.md",
  icon: FileText,
  component: () => <div>Profile</div>,
  defaultPosition: { x: 40, y: 40 },
  width: 550,
  height: 450,
};

const projectsApp: AppConfig = {
  id: "projects",
  title: "Projects.exe",
  icon: Briefcase,
  component: () => <div>Projects</div>,
  defaultPosition: { x: 100, y: 80 },
  width: 600,
  height: 500,
};

export const Terminal_: Story = {
  name: "Terminal.sh",
  args: { app: terminalApp },
};

export const Readme: Story = {
  name: "README.md",
  args: { app: readmeApp },
};

export const Projects: Story = {
  name: "Projects.exe",
  args: { app: projectsApp },
};

export const ClickOpensApp: Story = {
  name: "클릭 시 앱 열기",
  args: { app: terminalApp },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = canvas.getByText("Terminal.sh");
    await userEvent.click(icon);

    // store에 창이 열렸는지 확인
    const { openWindows } = useOsStore.getState();
    await expect(openWindows.some((w) => w.id === "terminal")).toBe(true);
  },
};

export const AllIcons: Story = {
  render: () => (
    <div className="flex gap-2 p-4 bg-[#e5e5e5]">
      {[terminalApp, readmeApp, projectsApp, {
        id: "contact", title: "Contact.info", icon: Phone,
        component: () => <div />, defaultPosition: { x: 0, y: 0 }, width: 450, height: 480,
      }].map((app) => (
        <DesktopIcon key={app.id} app={app as AppConfig} />
      ))}
    </div>
  ),
};
