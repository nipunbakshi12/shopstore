import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        products: [
            {
                type: mongoose.ObjectId,
                ref: 'Products',
                required: true,
            },
        ],
        payment: {
            orderId: { type: String, required: true }, // Cashfree order ID
            paymentSessionId: { type: String, required: true }, // Cashfree session ID
            amount: { type: Number, required: true }, // Total amount
            status: {
                type: String,
                default: 'Pending',
                enum: ['Pending', 'Success', 'Failed']
            }, // Payment status
            date: { type: Date, default: Date.now } // Payment date
        },
        buyer: {
            type: mongoose.ObjectId,
            ref: 'Users',
            required: true
        },
        status: {
            type: String,
            default: 'Pending',
            enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
        }
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
