// Ambient module declaration for @tabler/icons v1.x
// NOTE: No top-level imports here — that would make this a module file
// and break the ambient declare module below.
declare module '@tabler/icons' {
  import type { FC, SVGProps, CSSProperties } from 'react';

  export interface TablerIconProps extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: string | number;
    stroke?: string | number;
    strokeWidth?: string | number;
    className?: string;
    style?: CSSProperties;
  }

  export type TablerIcon = FC<TablerIconProps>;

  export const IconBold: TablerIcon;
  export const IconBuildingCommunity: TablerIcon;
  export const IconCheck: TablerIcon;
  export const IconChevronDown: TablerIcon;
  export const IconChevronRight: TablerIcon;
  export const IconClipboardList: TablerIcon;
  export const IconFileText: TablerIcon;
  export const IconH1: TablerIcon;
  export const IconH2: TablerIcon;
  export const IconH3: TablerIcon;
  export const IconH4: TablerIcon;
  export const IconHome: TablerIcon;
  export const IconItalic: TablerIcon;
  export const IconListDetails: TablerIcon;
  export const IconLogout: TablerIcon;
  export const IconMenu2: TablerIcon;
  export const IconMessages: TablerIcon;
  export const IconMoon: TablerIcon;
  export const IconPlayerPlay: TablerIcon;
  export const IconSettings: TablerIcon;
  export const IconSpeakerphone: TablerIcon;
  export const IconUser: TablerIcon;
  export const IconUsers: TablerIcon;
  export const IconWalk: TablerIcon;
  export const IconWall: TablerIcon;
}