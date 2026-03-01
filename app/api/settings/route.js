import connectDB from '../../../lib/db';
import Settings from '../../../models/Settings';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create default settings if they don't exist
      settings = new Settings();
      await settings.save();
    }
    
    return NextResponse.json({ settings }, { status: 200 });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    let settings = await Settings.findOne();
    
    if (settings) {
      // Update existing settings
      settings = await Settings.findByIdAndUpdate(
        settings._id,
        body,
        { new: true, runValidators: true }
      );
    } else {
      // Create new settings
      settings = new Settings(body);
      await settings.save();
    }
    
    return NextResponse.json({ settings }, { status: 200 });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}