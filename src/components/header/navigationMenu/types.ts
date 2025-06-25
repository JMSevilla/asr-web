export interface HeaderMenu {
  name: string;
  items?: MenuItem[] | null;
}

export interface MenuItem {
  name: string;
  link: string;
  relatedLinks?: string;
  position: 'left' | 'right';
  items?: MenuSubItem[] | null;
}

export interface MenuSubItem {
  name: string;
  link: string;
  relatedLinks?: string;
}
