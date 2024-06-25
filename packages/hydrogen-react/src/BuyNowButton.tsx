import {useEffect, useState, useCallback} from 'react';
import {useCart} from './CartProvider.js';
import {
  BaseButton,
  type BaseButtonProps,
  type CustomBaseButtonProps,
} from './BaseButton.js';

interface BuyNowButtonPropsBase {
  /** The item quantity. Defaults to 1. */
  quantity?: number;
  /** The ID of the variant. */
  variantId: string;
  /** An array of cart line attributes that belong to the item being added to the cart. */
  attributes?: {
    key: string;
    value: string;
  }[];
  /** An array of cart attributes. */
  cartAttributes?: {
    key: string;
    value: string;
  }[];
}

type BuyNowButtonProps<AsType extends React.ElementType = 'button'> =
  BuyNowButtonPropsBase & BaseButtonProps<AsType>;

/**
 * The `BuyNowButton` component renders a button that adds an item to the cart and redirects the customer to checkout.
 * Must be a child of a `CartProvider` component.
 */
export function BuyNowButton<AsType extends React.ElementType = 'button'>(
  props: BuyNowButtonProps<AsType>,
): JSX.Element {
  const {cartCreate, checkoutUrl, status} = useCart();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    quantity,
    variantId,
    onClick,
    attributes,
    cartAttributes,
    children,
    ...passthroughProps
  } = props;

  useEffect(() => {
    if (loading && checkoutUrl && status === 'idle') {
      window.location.href = checkoutUrl;
    }
  }, [loading, checkoutUrl, status]);

  const handleBuyNow = useCallback(() => {
    setLoading(true);
    cartCreate({
      lines: [
        {
          quantity: quantity ?? 1,
          merchandiseId: variantId,
          attributes,
        },
      ],
      attributes: cartAttributes,
    });
  }, [cartCreate, quantity, variantId, attributes, cartAttributes]);

  return (
    <BaseButton
      // Only certain 'as' types such as 'button' contain `disabled`
      disabled={loading ?? (passthroughProps as {disabled?: boolean}).disabled}
      {...passthroughProps}
      loading={loading}
      onClick={onClick}
      defaultOnClick={handleBuyNow}
    >
      {children}
    </BaseButton>
  );
}

// This is only for documenation purposes, and it is not used in the code.
export interface BuyNowButtonPropsForDocs<
  AsType extends React.ElementType = 'button',
> extends BuyNowButtonPropsBase,
    CustomBaseButtonProps<AsType> {}
