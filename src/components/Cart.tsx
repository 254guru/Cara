'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function Cart() {
  const { state, removeItem, updateQuantity, updateSize, clearCart, closeCart, total } = useCart();

  function handleCheckout() {
    if (state.items.length === 0) {
      alert("Your Cart Is Empty! 'add products to cart'");
      return;
    }
    clearCart();
    alert('Successfully Checked Out!');
  }

  return (
    <section className={`scrollbar-y cart${state.isOpen ? ' showCart' : ''}`} id="cart-items">
      <div className="cart-title">
        <h2>your cart</h2>
        <i
          className="fas fa-times"
          id="close-cart"
          onClick={closeCart}
          style={{ cursor: 'pointer' }}
          role="button"
          aria-label="Close cart"
        />
      </div>
      <div className="cart-content" id="cartContent">
        {state.items.map((item) => (
          <div className="cart-box" key={item.id}>
            <Image src={item.image} alt={item.title} width={80} height={80} className="cart-img" />
            <div className="detail-box">
              <div className="cart-product-title">{item.title}</div>
              <div className="cart-price">${item.price.toFixed(2)}</div>
              <div className="cart-size">
                <select
                  name="size"
                  value={item.size}
                  onChange={(e) => updateSize(item.id, e.target.value)}
                >
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>
              <input
                type="number"
                value={item.quantity}
                min={1}
                className="cart-quantity"
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
              />
            </div>
            <i
              className="fas fa-trash remove-items"
              onClick={() => removeItem(item.id)}
              style={{ cursor: 'pointer' }}
              role="button"
              aria-label={`Remove ${item.title}`}
            />
          </div>
        ))}
      </div>
      <div className="item-summary">
        <div className="top">
          <div className="summary"><h2>items summary</h2></div>
          <div className="details">
            <h2 id="itemB">item(s)</h2>
            <h2 className="totalA">${total.toFixed(2)}</h2>
          </div>
          <div className="coupon">
            <h2>shipping</h2>
            <select name="delivery" id="select-del">
              <option value="dd">door delivery</option>
              <option value="ps">pickUp station</option>
              <option value="md">merchant delivery</option>
            </select>
            <h2>promo code</h2>
            <input type="text" placeholder="enter your promo code" id="promoCode" />
            <button className="promo-btn">apply</button>
          </div>
          <div className="total">
            <h2>total</h2>
            <h2 className="totalB">${total.toFixed(2)}</h2>
          </div>
          <div className="checkout">
            <button className="checkOut" onClick={handleCheckout}>check out</button>
          </div>
        </div>
      </div>
    </section>
  );
}
