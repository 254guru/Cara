'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { SHIPPING_OPTIONS, PAYMENT_METHODS } from '@/constants';
import { formatPrice } from '@/lib/utils';
import { getProductUnitConfig } from '@/lib/productUnits';

export default function Cart() {
  const { state, removeItem, updateQuantity, updateSize, clearCart, closeCart, total } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [shipping, setShipping] = useState<string>(SHIPPING_OPTIONS[0].value);
  const [payment, setPayment] = useState<string>(PAYMENT_METHODS[0].value);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState('');

  async function handleCheckout() {
    if (state.items.length === 0) {
      setMessage('Your cart is empty. Add a product before checkout.');
      return;
    }

    if (!session?.user) {
      closeCart();
      router.push('/login');
      return;
    }

    if (payment === 'mpesa' && !phone) {
      setMessage('Enter your M-Pesa phone number to proceed.');
      return;
    }

    setChecking(true);
    setMessage('');

    try {
      // 1. Create the order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingOption: shipping,
          paymentMethod: payment,
          phone: phone || undefined,
        }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        setMessage(err.error || 'Failed to create order');
        setChecking(false);
        return;
      }

      const { order } = await orderRes.json();

      // 2. Initiate M-Pesa STK Push
      if (payment === 'mpesa' && phone) {
        // Normalize phone: 0712... → 254712...
        let mpesaPhone = phone.replace(/\s/g, '');
        if (mpesaPhone.startsWith('0')) {
          mpesaPhone = '254' + mpesaPhone.slice(1);
        } else if (mpesaPhone.startsWith('+')) {
          mpesaPhone = mpesaPhone.slice(1);
        }

        const payRes = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order.id, phone: mpesaPhone }),
        });

        const payData = await payRes.json();
        if (payRes.ok) {
          setMessage(payData.message || 'Check your phone to complete payment.');
        } else {
          setMessage(`Order created (#${order.id.slice(-8)}). ${payData.error || 'M-Pesa push failed — pay manually.'}`);
        }
      } else {
        setMessage(`Order #${order.id.slice(-8)} placed. Complete payment via ${payment}.`);
      }

      clearCart();
    } catch {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setChecking(false);
    }
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
          (() => {
            const unitConfig = getProductUnitConfig(item);

            return (
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
                      aria-label={`${unitConfig.label} for ${item.title}`}
                    >
                      {unitConfig.options.map((option) => (
                        <option key={option} value={option}>{option}</option>
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
            );
          })()
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
            <select name="delivery" id="select-del" value={shipping} onChange={(e) => setShipping(e.target.value)}>
              {SHIPPING_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <h2>Payment method</h2>
            <select name="payment-method" id="payment-method" value={payment} onChange={(e) => setPayment(e.target.value)}>
              {PAYMENT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            {payment === 'mpesa' && (
              <>
                <h2>M-Pesa phone</h2>
                <input
                  type="tel"
                  placeholder="e.g. 0712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mpesa-phone-input"
                />
              </>
            )}
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
          {message && <p className="checkout-message">{message}</p>}
          <div className="checkout">
            <button className="checkOut" onClick={handleCheckout} disabled={checking}>
              {checking ? 'Processing...' : session?.user ? 'Secure checkout' : 'Sign in to checkout'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
