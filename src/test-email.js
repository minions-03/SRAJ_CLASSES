// Test script to verify nodemailer configuration
// Run this with: node src/test-email.js
require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log('--- Email Configuration Test ---');
    console.log('EMAIL_USER:', process.env.EMAIL_USER || 'Not set');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '********' : 'Not set');

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Error: EMAIL_USER or EMAIL_PASS environment variables are missing in .env.local');
        process.exit(1);
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"SRAJ Test" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // Send to yourself
        subject: 'Nodemailer Configuration Test',
        text: 'If you are reading this, your email configuration for SRAJ Competitive Classes is working correctly!',
        html: '<b>If you are reading this, your email configuration for SRAJ Competitive Classes is working correctly!</b>',
    };

    try {
        console.log('Sending test email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('Success! Email sent:', info.messageId);
        console.log('Check your inbox at:', process.env.EMAIL_USER);
    } catch (error) {
        console.error('Failed to send email:', error);
    }
}

testEmail();
