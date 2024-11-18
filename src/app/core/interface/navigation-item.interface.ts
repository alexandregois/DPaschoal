export interface NavigationItem {
  icon?: string;
  svgIcon?: string;
  title: string;
  path: string;
  isActive: boolean;
  external?: boolean;
  click?: Function;
}
