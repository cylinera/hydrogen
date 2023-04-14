import type {CartLineInput} from '@shopify/hydrogen/storefront-api-types';
import {useFetcher, useMatches, useNavigation} from '@remix-run/react';
import {Button} from '~/components';
import {CartAction} from '~/lib/type';
import {CartFormInputAction, CartLinesAdd} from '@shopify/hydrogen';
import {CartForm} from './CartForm';

export function AddToCartButton({
  children,
  lines,
  className = '',
  variant = 'primary',
  width = 'full',
  disabled,
  analytics,
  ...props
}: {
  children: React.ReactNode;
  lines: CartLineInput[];
  className?: string;
  variant?: 'primary' | 'secondary' | 'inline';
  width?: 'auto' | 'full';
  disabled?: boolean;
  analytics?: unknown;
  [key: string]: any;
}) {
  const formInput: CartLinesAdd = {
    action: CartFormInputAction.CartLinesAdd,
    lines,
  };

  return (
    <CartForm route="/cart" formInput={formInput}>
      {(fetcher) => (
        <>
          <input
            type="hidden"
            name="analytics"
            value={JSON.stringify(analytics)}
          />
          <Button
            as="button"
            type="submit"
            width={width}
            variant={variant}
            className={className}
            disabled={disabled ?? fetcher.state !== 'idle'}
            {...props}
          >
            {children}
          </Button>
        </>
      )}
    </CartForm>
  );
}
