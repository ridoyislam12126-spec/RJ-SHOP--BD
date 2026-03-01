import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  helpNumber: { type: String, default: '+880-1XXX-XXXXXX' },
  helpEmail: { type: String, default: 'info@rjshopbd.com' },
  tiktokPixelId: { type: String, default: '' },
  metaPixelId: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema);