import { useCart } from "../context/CartContext";

const Header = () => {
  const { cartCount } = useCart();

  return (
    // ...
    <div className='cart-icon'>
      <span className='cart-count'>{cartCount}</span>
    </div>
    // ...
  );
};
