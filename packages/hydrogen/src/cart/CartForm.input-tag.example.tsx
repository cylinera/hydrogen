import {type ActionFunctionArgs, json} from '@remix-run/server-runtime';
import {
  type CartQueryData,
  type HydrogenCart,
  CartForm,
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';

export default function Note() {
  return (
    <CartForm action={CartForm.ACTIONS.NoteUpdate}>
      <input type="text" name="note" />
      <button>Update Note</button>
    </CartForm>
  );
}

export async function action({request, context}: ActionFunctionArgs) {
  const cart = context.cart as HydrogenCart;
  // cart is type HydrogenCart or HydrogenCartCustom
  // Declare cart type in remix.env.d.ts for interface AppLoadContext to avoid type casting
  // const {cart} = context;

  const formData = await request.formData();
  const {action, inputs} = CartForm.getFormInput(formData);

  let status = 200;
  let result: CartQueryData;

  if (action === CartForm.ACTIONS.NoteUpdate) {
    result = await cart.updateNote(inputs.note);
  } else {
    invariant(false, `${action} cart action is not defined`);
  }

  const headers = cart.setCartId(result.cart.id);

  return json(result, {status, headers});
}
