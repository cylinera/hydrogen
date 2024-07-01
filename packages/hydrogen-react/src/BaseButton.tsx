import {ReactNode, Ref, useCallback} from 'react';

export interface CustomBaseButtonProps<AsType> {
  /** Provide a React element or component to render as the underlying button. Note: for accessibility compliance, almost always you should use a `button` element, or a component that renders an underlying button. */
  as?: AsType;
  /** Any ReactNode elements. */
  children: ReactNode;
  /** Click event handler. Default behaviour triggers unless prevented */
  onClick?: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void | boolean | Promise<void | boolean>;
  /** A default `onClick` behavior */
  defaultOnClick?: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void | boolean | Promise<void | boolean>;
  /** A `ref` to the underlying button */
  buttonRef?: Ref<HTMLButtonElement>;
}

export type BaseButtonProps<AsType extends React.ElementType> =
  CustomBaseButtonProps<AsType> &
    (AsType extends keyof React.JSX.IntrinsicElements
      ? Omit<
          React.ComponentPropsWithoutRef<AsType>,
          keyof CustomBaseButtonProps<AsType>
        >
      : React.ComponentPropsWithoutRef<AsType>);

export function BaseButton<AsType extends React.ElementType = 'button'>(
  props: BaseButtonProps<AsType>,
): JSX.Element {
  const {
    as,
    onClick,
    defaultOnClick,
    children,
    buttonRef,
    ...passthroughProps
  } = props;

  const handleOnClick = useCallback(
    async (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (onClick) {
        let clickShouldContinue = onClick(event);
        if (clickShouldContinue instanceof Promise) {
          clickShouldContinue = await clickShouldContinue;
        }
        if (
          (typeof clickShouldContinue === 'boolean' &&
            clickShouldContinue === false) ||
          event?.defaultPrevented
        )
          return;
      }

      void defaultOnClick?.(event);
    },
    [defaultOnClick, onClick],
  );

  const Component = as || 'button';

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <Component ref={buttonRef} onClick={handleOnClick} {...passthroughProps}>
      {children}
    </Component>
  );
}
