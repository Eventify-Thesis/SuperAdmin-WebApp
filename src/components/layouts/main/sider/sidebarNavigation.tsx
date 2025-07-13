import React from 'react';
import { DashboardOutlined, HomeOutlined } from '@ant-design/icons';
import { Icon } from '@iconify/react/dist/iconify.js';

export interface SidebarNavigationItem {
  title: string;
  key: string;
  url?: string;
  children?: SidebarNavigationItem[];
  icon?: React.ReactNode;
}

export const sidebarNavigation: SidebarNavigationItem[] = [
  {
    title: 'common.event-dashboard',
    key: 'events',
    // TODO use path variable
    url: '/events',
    icon: <Icon icon="mdi:event-star" width="24" height="24" />,
  },
  {
    title: 'events.upload.title',
    key: 'event-upload',
    url: '/events/upload',
    icon: <Icon icon="mdi:upload" width="24" height="24" />,
  },
  {
    title: 'common.export',
    key: 'category',
    url: '/category',
    icon: <Icon icon="material-symbols:category" width="24" height="24" />,
  },
  {
    title: 'common.issueReports',
    key: 'issue-reports',
    url: '/issue-reports',
    icon: <Icon icon="mdi:bug-report" width="24" height="24" />,
  },
  {
    title: 'common.legal',
    key: 'legal-document',
    icon: <Icon icon="bx:file" width="24" height="24" />,
    url: '/legal-document',
  },
];
