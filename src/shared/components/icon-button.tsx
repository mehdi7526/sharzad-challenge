import { ActionButton, type ActionButtonProps } from './action-button';

export type IconButtonProps = ActionButtonProps & { 'aria-label': string };

export function IconButton(props: IconButtonProps) {
  return <ActionButton {...props} />;
}
