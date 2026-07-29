import { useCart } from "../../Context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

export default function Cart() {
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.productCount,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="cart">
        <h2>Shopping Cart</h2>
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <button className="continue-shopping" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      <div className="cart-header">
        <span>Item</span>
        <span>Price</span>
        <span>Quantity</span>
        <span>Subtotal</span>
        <span>Action</span>
      </div>
      <ul className="cart-list">
        {cartItems.map((item) => (
          <li key={item.id} className="cart-item">
            <div className="cart-item-info">
              <img src={item.image} alt={item.title} className="cart-item-image" />
              <span className="cart-item-title">{item.title}</span>
            </div>
            <span className="cart-item-price">${item.price.toFixed(2)}</span>
            <div className="cart-item-quantity">
              <button
                className="quantity-btn"
                onClick={() => removeFromCart(item)}
              >
                -
              </button>
              <span className="quantity-value">{item.productCount}</span>
              <button
                className="quantity-btn"
                onClick={() => addToCart(item)}
              >
                +
              </button>
            </div>
            <span className="cart-item-subtotal">
              ${(item.price * item.productCount).toFixed(2)}
            </span>
            <button
              className="remove-item"
              onClick={() => updateQuantity(item, 0)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="cart-footer">
        <div className="cart-total">
          <strong>Total: ${totalPrice.toFixed(2)}</strong>
        </div>
        <div className="cart-actions">
          <button className="clear-cart" onClick={clearCart}>
            Clear Cart
          </button>
          <button className="continue-shopping" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}