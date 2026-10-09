import type { CSSProperties } from 'react';

// Raw colors belong here; semantic names below describe their UI role.
const base = {
  white: '#fff',
  black: '#000',
  ink: '#111',
  inkStrong: '#111319',
  text: '#171a20',
  primary: '#377fdb',
  link: '#307fe2',
  action: '#347bd2',
  header: '#3277ce',
  whiteBorder: '#fff3',
  whiteOverlay: '#ffffff1a',
  shadowSoft: '#0002',
  shadow: '#0003',
  divider: '#f0f0f0',
  tile: '#f7f7f7',
  badge: '#528cd0',
  scanner: '#eaf2fc',
  bodyMuted: '#687385',
  modalTile: '#f7f7f8',
  modalIcon: '#edf4ff',
  errorBackground: '#f4f6f9',
} as const;

export const palette = {
  white: base.white,
  black: base.black,
  ink: base.ink,
  inkStrong: base.inkStrong,
  text: base.text,
  primary: base.primary,
  link: base.link,
  action: base.action,
  header: base.header,
  whiteBorder: base.whiteBorder,
  whiteOverlay: base.whiteOverlay,
  shadowSoft: base.shadowSoft,
  shadow: base.shadow,
  divider: base.divider,
  tile: base.tile,
  badge: base.badge,
  scanner: base.scanner,
  bodyMuted: base.bodyMuted,
  modalTile: base.modalTile,
  modalIcon: base.modalIcon,
  errorBackground: base.errorBackground,
} as const;

// Written into the server-rendered html element so CSS Modules and Ant Design share these values.
export const paletteStyle = Object.fromEntries(
  Object.entries(palette).map(([name, value]) => [`--color-${name.toLowerCase()}`, value]),
) as CSSProperties;
