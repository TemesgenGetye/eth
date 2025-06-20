import { useEffect, useState, useMemo } from 'react';
import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_yisa8q9';
const TEMPLATE_ID = 'template_i4gvu2p';
const PUBLIC_KEY = 'PYWGDIz29yfZTOOLN';

// Define the type for an order item
interface OrderItem {
  name: string;
  units: number;
  price: number;
  image?: string;
}

interface Cost {
  shipping: number;
  tax: number;
}

interface OrderConfirmationEmailProps {
  orderId: string;
  orders: OrderItem[];
  cost: Cost;
  customerEmail: string;
}

export default function OrderConfirmationEmail({
  orderId,
  orders,
  cost,
  customerEmail,
}: OrderConfirmationEmailProps) {
  const [sent, setSent] = useState(false);

  // Memoize subtotal and orderTotal to prevent unnecessary recalculations
  const subtotal = useMemo(
    () =>
      orders.reduce(
        (sum: number, item: OrderItem) => sum + item.price * item.units,
        0
      ),
    [orders]
  );
  const orderTotal = useMemo(
    () => subtotal + cost.shipping + cost.tax,
    [subtotal, cost.shipping, cost.tax]
  );

  useEffect(() => {
    if (!sent && orderId && orders?.length > 0 && customerEmail) {
      const templateParams = {
        order_id: orderId,
        email: customerEmail,
        cost: {
          shipping: cost.shipping,
          tax: cost.tax,
          total: orderTotal,
        },
        orders: orders.map((item: OrderItem) => ({
          name: item.name,
          units: item.units,
          price: item.price,
          image_url: item.image || '',
        })),
      };

      emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY).then(
        () => {
          // console.log('Email sent!', result.status, result.text);
          setSent(true);
        },
        (error) => {
          console.error('Failed to send:', error.text);
        }
      );
    }
  }, [
    orderId,
    customerEmail,
    sent,
    orderTotal,
    orders.length,
    cost.shipping,
    cost.tax,
    orders,
  ]);

  return null; // No need to render anything
}
