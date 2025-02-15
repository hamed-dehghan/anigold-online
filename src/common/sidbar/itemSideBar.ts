type SubMenuItem = {
  title: string;
  url: string;
  icon: string;
};

type SidebarItem = {
  title: string;
  url: string;
  icon: string;
  subMenu?: SubMenuItem[];
  separator?: boolean; // Corrected property name and moved to SidebarItem
};

export const itemsSidBar: SidebarItem[] = [
  {
    title: 'کاربران',
    url: '/users',
    icon: 'tag',
  },
  {
    title: 'خروج',
    url: '/Login',
    icon: 'tag',
   
  },
  
];