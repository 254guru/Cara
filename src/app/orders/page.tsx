'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
  id: string;
  quantity: number;
  size: string;
  price: number;
  product: {
    id: number;
    title: string;
    brand: string;
    image: string;
  };
}

interface Order {
  id: string;
  status: string;
  total: number;
  shippingOption: string;
  paymentMethod: string;
  mpesaReceiptNo: string | null;
  createdAt: string;
  items: OrderItem[];
}

const statusLabels: Record<string, string> = {
  PENDING: 'Pending payment',
  PAID: 'Paid',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetch('/api/orders')
        .then((r) => r.json())
        .then((data) => {
          setOrders(data.orders || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status, router]);

  if (status === 'loading' || loading) {
    return (
      <section className="orders-page">
        <div className="section-heading">
          <h2>Loading orders...</h2>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="auth-banner">
        <div className="banner">
          <div className="content">
            <span className="pill">Orders</span>
            <h1>Your orders</h1>
            <p>Track and manage all your Cara Stores purchases.</p>
          </div>
        </div>
      </section>

      <section className="orders-page">
        {orders.length === 0 ? (
          <div className="section-heading">
            <h2>No orders yet</h2>
            <p>Start shopping to see your orders here.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order.id.slice(-8)}</h3>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-KE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="order-status-group">
                    <span className={`order-status status-${order.status.toLowerCase()}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                    <span className="order-total">{formatPrice(order.total)}</span>
                  </div>
                </div>
                {order.mpesaReceiptNo && (
                  <p className="receipt-no">M-Pesa receipt: {order.mpesaReceiptNo}</p>
                )}
                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item.id} className="order-item">
                      <Image
                        src={item.product.image}
                        alt={item.product.title}
                        width={60}
                        height={60}
                        className="order-item-img"
                      />
                      <div className="order-item-info">
                        <p className="order-item-title">{item.product.title}</p>
                        <p className="order-item-meta">
                          {item.product.brand} &middot; Option {item.size} &middot; Qty {item.quantity}
                        </p>
                        <p className="order-item-price">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
