import connectDB from '../../../../lib/db';
import Order from '../../../../models/Order';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    // Find order by ID
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Only allow status updates for pending orders
    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return NextResponse.json({ message: 'Cannot update status of completed or cancelled orders' }, { status: 400 });
    }

    // Update status
    order.status = status;
    await order.save();

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}