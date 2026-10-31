
import CartItemsList from '@/components/cart/CartItemsList';
import CartTotals from '@/components/cart/CartTotals';
import SectionTitle from '@/components/global/SectionTitle';
import { fetchUserCart } from '@/utils/actions';

async function CartPage() {
  const { currentCart, cartItems } = await fetchUserCart();
  
  if (cartItems.length === 0) return <SectionTitle text='Empty Cart' />;

  return (
    <>
      <SectionTitle text='Shopping Cart' />

      <div className='mt-8 grid gap-4 lg:grid-cols-12'>
        <div className='lg:col-span-8'>
          <CartItemsList cartItems={cartItems} />
        </div>

        <div className='lg:col-span-4'>
          <CartTotals cart={currentCart} />
        </div>

      </div>
    </>
  );
}
export default CartPage;
