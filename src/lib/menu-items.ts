import {
  IconArchiveFilled,
  IconHome,
  IconSettings,
  IconWriting,
  type Icon,
} from "@tabler/icons-react";

export interface MenuItem {
  title: string;
  url: string;
  icon?: Icon;
  fastAction?: boolean;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    title: "Home",
    url: "/",
    icon: IconHome,
  },
  {
    title: "Summarize",
    url: "/summarize",
    icon: IconWriting,
  },
  {
    title: "Archive",
    url: "/archive",
    icon: IconArchiveFilled,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: IconSettings,
  },
];
