import connectDB from '../../../../lib/db';
import Product from '../../../../models/Product';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const product = await Product.findById(params.id);
    
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Prepare update data ensuring image field is properly handled
    const updateData = { ...body };
    if (updateData.imageUrl) {
      // If the old field name is still being sent, convert it
      updateData.image = updateData.imageUrl;
      delete updateData.imageUrl;
    }
    
    const product = await Product.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    // Validate the ID format
    if (!params.id) {
      return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
    }

    await connectDB();
    
    // Check if the ID is a valid ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(params.id)) {
      return NextResponse.json({ message: 'Invalid Product ID format' }, { status: 400 });
    }
    
    const product = await Product.findByIdAndDelete(params.id);
    
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ message: 'Internal server error: ' + error.message }, { status: 500 });
  }
}