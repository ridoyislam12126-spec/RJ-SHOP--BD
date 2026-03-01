import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  customerName: { type: String, required: true },
  phone: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^(\+88|88)?(01[3-9]\d{8})$/.test(v);
      },
      message: 'Please enter a valid Bangladesh phone number'
    }
  },
  address: { type: String, required: true },
  status: { type: String, default: 'pending' },
  orderDate: { type: Date, default: Date.now },
  deliveryCharge: { type: Number, default: 0 }
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);