export interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  image: string;
  details?: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number; // Subtotal
  tax: number;
  shipping: number;
  grandTotal: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Return Requested';
  trackingNumber: string;
  expectedDelivery: string;
  carrier: string;
  carrierUrl: string;
  shippingAddress: {
    name: string;
    line1: string;
    line2: string;
    country: string;
  };
  paymentMethod: string;
}

export const SEED_ORDERS: Order[] = [
  {
    id: "#LM-20241203",
    date: "Dec 03, 2024",
    total: 1240.00,
    shipping: 0,
    tax: 102.30,
    grandTotal: 1342.30,
    status: "Shipped", // Will display as IN TRANSIT in the UI
    trackingNumber: "DHL-92847194",
    expectedDelivery: "Mon, Dec 16 – Wed, Dec 18",
    carrier: "DHL.com",
    carrierUrl: "https://www.dhl.com",
    shippingAddress: {
      name: "Alexander Sterling",
      line1: "1200 Avenue of the Americas, Ste 4200",
      line2: "New York, NY 10036",
      country: "United States"
    },
    paymentMethod: "Visa ending in •••• 4242",
    items: [
      {
        productName: "Heritage Cashmere Sweater",
        quantity: 1,
        price: 450.00,
        details: "Midnight Navy | Large",
        image: "https://images.unsplash.com/photo-1574164904299-3a102b110380?auto=format&fit=crop&w=500&q=80"
      },
      {
        productName: "Artisan Leather Oxfords",
        quantity: 1,
        price: 680.00,
        details: "Mahogany | EU 44",
        image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=500&q=80"
      },
      {
        productName: "Silk Geometric Tie",
        quantity: 1,
        price: 110.00,
        details: "Silver Navy | O/S",
        image: "https://images.unsplash.com/photo-1589756823851-ede1be67418a?auto=format&fit=crop&w=500&q=80"
      }
    ]
  },
  {
    id: "#LM-20241115",
    date: "Nov 15, 2024",
    total: 890.00,
    shipping: 0,
    tax: 73.42,
    grandTotal: 963.42,
    status: "Delivered",
    trackingNumber: "FEDEX-83749281",
    expectedDelivery: "Delivered on Nov 18, 2024",
    carrier: "FedEx.com",
    carrierUrl: "https://www.fedex.com",
    shippingAddress: {
      name: "Alexander Sterling",
      line1: "1200 Avenue of the Americas, Ste 4200",
      line2: "New York, NY 10036",
      country: "United States"
    },
    paymentMethod: "Visa ending in •••• 4242",
    items: [
      {
        productName: "Wireless Noise-Cancelling Headphones",
        quantity: 1,
        price: 350.00,
        details: "Matte Black | Standard",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80"
      },
      {
        productName: "Walnut Desk Organizer",
        quantity: 1,
        price: 120.00,
        details: "Natural Walnut",
        image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=500&q=80"
      },
      {
        productName: "Minimalist Brass Desk Lamp",
        quantity: 1,
        price: 420.00,
        details: "Brushed Brass",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=80"
      }
    ]
  },
  {
    id: "#LM-20241028",
    date: "Oct 28, 2024",
    total: 3150.00,
    shipping: 0,
    tax: 259.87,
    grandTotal: 3409.87,
    status: "Processing",
    trackingNumber: "UPS-92847162",
    expectedDelivery: "Fri, Nov 01 – Mon, Nov 04",
    carrier: "UPS.com",
    carrierUrl: "https://www.ups.com",
    shippingAddress: {
      name: "Alexander Sterling",
      line1: "1200 Avenue of the Americas, Ste 4200",
      line2: "New York, NY 10036",
      country: "United States"
    },
    paymentMethod: "Visa ending in •••• 4242",
    items: [
      {
        productName: "Carbon Fiber Road Bike",
        quantity: 1,
        price: 3150.00,
        details: "Stealth Black | 56cm",
        image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=500&q=80"
      }
    ]
  },
  {
    id: "#LM-20240912",
    date: "Sep 12, 2024",
    total: 245.00,
    shipping: 0,
    tax: 20.21,
    grandTotal: 265.21,
    status: "Return Requested",
    trackingNumber: "DHL-28374921",
    expectedDelivery: "Returned on Sep 18, 2024",
    carrier: "DHL.com",
    carrierUrl: "https://www.dhl.com",
    shippingAddress: {
      name: "Alexander Sterling",
      line1: "1200 Avenue of the Americas, Ste 4200",
      line2: "New York, NY 10036",
      country: "United States"
    },
    paymentMethod: "Visa ending in •••• 4242",
    items: [
      {
        productName: "Cashmere Scarf",
        quantity: 1,
        price: 245.00,
        details: "Heather Grey | One Size",
        image: "https://images.unsplash.com/photo-1520903074185-8ec362b009ce?auto=format&fit=crop&w=500&q=80"
      }
    ]
  }
];
