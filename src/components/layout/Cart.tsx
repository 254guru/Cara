'use client';

import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { PRODUCT_SIZES, SHIPPING_OPTIONS, PAYMENT_METHODS } from '@/constants';
import { formatPrice } from '@/lib/utils';

export default function Cart() {
  const { state, removeItem, updateQuantity, updateSize, clearCart, closeCart, total } = useCart();

  function handleCheckout() {
    if (state.items.length === 0) {
      alert('Your cart is empty. Add a product before checkout.');
      return;
    }
    clearCart();
    alert('Order placed. Complete payment via M-Pesa or Airtel Money.');
  }

  return (
    <section className={`cart${state.isOpen ? ' showCart' : ''}`} id="cart-items" aria-label="Shopping cart">
      <div className="cart-title">
        <h2>Your cart</h2>
        <button className="icon-btn" id="close-cart" onClick={closeCart} aria-label="Close cart" type="button">
          <i className="fas fa-times" />
        </button>
      </div>
      <div className="cart-content" id="cartContent">
        {state.items.length === 0 && (
          <p className="empty-message">No items yet. Explore products and start building your kit.</p>
        )}
        {state.items.map((item) => (
          <div className="cart-box" key={item.id}>
            <Image src={item.image} alt={item.title} width={80} height={80} className="cart-img" />
            <div className="detail-box">
              <div className="cart-product-title">{item.title}</div>
              <div className="cart-price">{formatPrice(item.price)}</div>
              <div className="cart-size">
                <select
                  name="size"
                  value={item.size}
                  onChange={(e) => updateSize(item.id, e.target.value)}
                  aria-label={`Size for ${item.title}`}
                >
                  {PRODUCT_SIZES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <input
                type="number"
                value={item.quantity}
                min={1}
                className="cart-quantity"
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                aria-label={`Quantity for ${item.title}`}
              />
            </div>
            <button className="icon-btn remove-items" onClick={() => removeItem(item.id)} type="button" aria-label={`Remove ${item.title}`}>
              <i className="fas fa-trash" />
            </button>
          </div>
        ))}
      </div>
      <div className="item-summary">
        <div className="top">
          <div className="summary"><h2>Order summary</h2></div>
          <div className="details">
            <h2 id="itemB">Items ({state.items.length})</h2>
            <h2 className="totalA">{formatPrice(total)}</h2>
          </div>
          <div className="coupon">
            <h2>Shipping</h2>
            <select name="delivery" id="select-del">
              {SHIPPING_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <h2>Payment method</h2>
            <select name="payment-method" id="payment-method">
              {PAYMENT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <h2>Promo code</h2>
            <div className="promo-field">
              <input type="text" placeholder="Enter promo code" id="promoCode" />
              <button className="promo-btn" type="button">Apply</button>
            </div>
          </div>
          <div className="total">
            <h2>Total</h2>
            <h2 className="totalB">{formatPrice(total)}</h2>
          </div>
          <div className="checkout">
            <button className="checkOut" onClick={handleCheckout}>Secure checkout</button>
          </div>
        </div>
      </div>
    </section>
  );
}
