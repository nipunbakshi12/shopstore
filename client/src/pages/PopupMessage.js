// src/components/PopupMessage.js
import React from 'react';
import '../styles/PopupMessage.css'

const PopupMessage = ({ onClose }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="popup-close" onClick={onClose}>
                    &times;
                </button>
                <h2>💥 **Today's Exclusive E-Commerce Deals!** 💥</h2>
                <p>Welcome to our e-commerce platform! Check out these amazing deals available today:</p>
                <ul style={{
                    textAlign: 'justify'
                }}>
                    <li>🔹 **Fashion & Apparel**: Flat 40% off on all clothing and accessories!</li>
                    <li>🔹 **Electronics**: Get up to 50% off on smartphones, laptops, and smartwatches!</li>
                    <li>🔹 **Home Appliances**: Special combo offers on kitchen and home essentials!</li>
                    <li>🔹 **Beauty & Wellness**: Buy 2, get 1 free on skincare and beauty products!</li>
                    <li>🔹 **Footwear**: Flat 30% off on all branded shoes and sandals!</li>
                    <li>🔹 **Books & Stationery**: Enjoy up to 25% off on books, and stationery items!</li>
                </ul>
                <p>Hurry up and grab these deals before they're gone! Visit our store or shop online now.</p>
                <p><strong>Happy Shopping!</strong></p>
                <p>— Your Clarity Cart Team</p>
            </div>
        </div>
    );
};

export default PopupMessage;
