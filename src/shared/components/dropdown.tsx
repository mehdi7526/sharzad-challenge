'use client';
import { Dropdown as AntDropdown, type DropdownProps } from 'antd';
export type { DropdownProps };
export type MenuItems = NonNullable<NonNullable<DropdownProps['menu']>['items']>;
export function Dropdown(props: DropdownProps) {
  return <AntDropdown placement="bottomRight" trigger={['hover', 'click']} {...props} />;
}
