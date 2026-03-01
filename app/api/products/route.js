import connectDB from '../../../lib/db';
import Product from '../../../models/Product';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();
    const products = await Product.find({});
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { name, price, description, image, category, stock } = body;
    
    if (!name || !price || !description || !image || !category) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const product = new Product({
      name,
      price,
      description,
      image,
      category,
      stock: stock || 0
    });

    await product.save();
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}