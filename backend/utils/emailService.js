const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Ensure environment variables are loaded
dotenv.config();

// Create a transporter object with more explicit configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Test the connection at startup
transporter.verify(function(error, success) {
  if (error) {
    console.log('SMTP server connection error:', error);
  } else {
    console.log('SMTP server connection established');
  }
});

// Order status update email
const sendOrderStatusEmail = async (order, user) => {
  try {
    // Make sure we have the required data before proceeding
    if (!user || !user.email) {
      console.log('Cannot send email - missing user email address');
      return false;
    }
    
    if (!order || !order.orderNumber) {
      console.log('Cannot send email - missing order information');
      return false;
    }
    
    // Log that we're attempting to send an email
    console.log(`Attempting to send email for order ${order.orderNumber} to ${user.email}`);
    
    // Check if environment variables are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('Email credentials not properly configured in environment variables');
      return false;
    }

    // Construct item list HTML
    const itemsHtml = order.items.map(item => 
      `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    ).join('');

    // Get status-specific content
    const statusContent = getStatusSpecificContent(order.status);
    
    // Construct the email message
    const message = {
      from: `"E-Commerce" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Order #${order.orderNumber} ${statusContent.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #333;">Your Order Update</h1>
          </div>
          
          <div style="padding: 20px;">
            <p>Hello ${order.shippingAddress.fullName},</p>
            
            <p>${statusContent.message}</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p style="margin: 0; font-weight: bold;">Order Number: ${order.orderNumber}</p>
              <p style="margin: 5px 0;">Status: <span style="color: ${statusContent.color};">${order.status}</span></p>
            </div>
            
            <h3>Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f8f9fa;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Quantity</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Price</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Total Amount:</td>
                  <td style="padding: 10px; font-weight: bold;">$${order.totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
            
            <div style="margin-top: 20px;">
              <h3>Shipping Address</h3>
              <p>
                ${order.shippingAddress.fullName}<br>
                ${order.shippingAddress.address}<br>
                ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}<br>
                Phone: ${order.shippingAddress.phoneNumber}
              </p>
            </div>
            
            ${statusContent.additionalContent}
            
            <p style="margin-top: 30px;">Thank you for shopping with us!</p>
            
            <p>Best regards,<br>E-commerce Team</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #777;">
            <p>If you have any questions, please contact our customer support.</p>
            <p>© ${new Date().getFullYear()} Your Store Name. All rights reserved.</p>
          </div>
        </div>
      `
    };

    // Add a log right before sending the email
    console.log('Email prepared, attempting to send...');
    
    // Send the email
    const info = await transporter.sendMail(message);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    // Add more detailed error logging
    if (error.code === 'EAUTH') {
      console.error('Authentication error: Check your email credentials');
    }
    return false;
  }
};

// Helper function to get status-specific content
const getStatusSpecificContent = (status) => {
  switch (status) {
    case 'Processing':
      return {
        subject: 'is now being processed',
        message: 'We are pleased to inform you that your order is now being processed.',
        color: '#3b82f6', // blue
        additionalContent: '<p>Our team is preparing your items for shipment. You will receive another notification when your order ships.</p>'
      };
    case 'Shipped':
      return {
        subject: 'has been shipped',
        message: 'Great news! Your order has been shipped and is on its way to you.',
        color: '#8b5cf6', // purple
        additionalContent: `
          <p>Your order is expected to arrive within 3-5 business days.</p>
          <p>You can track your package using our delivery partner's website or app.</p>
        `
      };
    case 'Delivered':
      return {
        subject: 'has been delivered',
        message: 'Your order has been delivered successfully. We hope you enjoy your purchase!',
        color: '#10b981', // green
        additionalContent: `
          <p>If you have any issues with your order, please contact our customer service within 7 days.</p>
          <p>We would love to hear about your experience. Please consider leaving a review.</p>
        `
      };
    case 'Cancelled':
      return {
        subject: 'has been cancelled',
        message: 'Your order has been cancelled as requested.',
        color: '#ef4444', // red
        additionalContent: `
          <p>If you did not request this cancellation or if you have any questions, please contact our customer service immediately.</p>
          <p>Any payment made for this order will be refunded according to our refund policy.</p>
        `
      };
    default:
      return {
        subject: 'status update',
        message: `Your order status has been updated to: ${status}`,
        color: '#6b7280', // gray
        additionalContent: ''
      };
  }
};

module.exports = {
  sendOrderStatusEmail
};