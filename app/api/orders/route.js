import connectDB from '../../../lib/db';
import Order from '../../../models/Order';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();
    const orders = await Order.find({}).sort({ orderDate: -1 });
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { productId, productName, customerName, phone, address, deliveryCharge } = body;
    
    if (!productId || !productName || !customerName || !phone || !address) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const order = new Order({
      productId,
      productName,
      customerName,
      phone,
      address,
      deliveryCharge: deliveryCharge || 0
    });

    await order.save();
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}