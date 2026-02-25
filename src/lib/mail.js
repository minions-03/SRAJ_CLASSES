import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendStudentIdEmail(toEmail, studentName, studentId) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Email credentials missing. Please set EMAIL_USER and EMAIL_PASS in .env.local');
        return;
    }

    const mailOptions = {
        from: `"SRAJ Competitive Classes" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Your Student ID and Registration Confirmation',
        html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                <div style="background-color: #0f172a; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">SRAJ Competitive Classes</h1>
                </div>
                <div style="padding: 30px;">
                    <p>Dear <strong>${studentName}</strong>,</p>
                    <p>Congratulations! Your admission request has been approved by the admin.</p>
                    <p>We are excited to welcome you to <strong>SRAJ Competitive Classes</strong>. Your registration is now complete, and your official Student ID has been generated.</p>
                    
                    <div style="background-color: #f8fafc; border: 2px dashed #0f172a; padding: 20px; text-align: center; margin: 25px 0; border-radius: 8px;">
                        <span style="font-size: 14px; text-transform: uppercase; color: #64748b; letter-spacing: 1px; display: block; margin-bottom: 5px;">Your Student ID</span>
                        <strong style="font-size: 28px; color: #0f172a; letter-spacing: 2px;">${studentId}</strong>
                    </div>

                    <p>Please keep this ID safe as it will be used for all future communications, fee payments, and access to class resources.</p>
                    
                    <p style="margin-top: 30px;">Wishing you all the best in your competitive journey!</p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="font-size: 12px; color: #64748b;">This is an automated message. Please do not reply to this email.</p>
                </div>
                <div style="background-color: #f1f5f9; color: #64748b; padding: 15px; text-align: center; font-size: 12px;">
                    &copy; ${new Date().getFullYear()} SRAJ Competitive Classes Management System
                </div>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

export async function sendContactEmail(senderName, senderEmail, message, senderPhone) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Email credentials missing.');
        return;
    }

    const mailOptions = {
        from: `"Contact Form - SRAJ Classes" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // Send to admin themselves
        replyTo: senderEmail,
        subject: `New Contact Form Submission from ${senderName}`,
        html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                <div style="background-color: #0f172a; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">New Inquiry Received</h1>
                </div>
                <div style="padding: 30px;">
                    <p>You have received a new message from the SRAJ Classes contact form.</p>
                    
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${senderName}</p>
                        <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${senderEmail}</p>
                        ${senderPhone ? `<p style="margin: 0 0 10px 0;"><strong>Phone:</strong> ${senderPhone}</p>` : ''}
                        <p style="margin: 0;"><strong>Message:</strong></p>
                        <p style="white-space: pre-wrap; margin-top: 10px; background: white; padding: 15px; border-radius: 4px; border: 1px solid #e2e8f0;">${message}</p>
                    </div>
                    
                    <p style="font-size: 12px; color: #64748b; margin-top: 30px;">
                        This email was sent from the landing page contact form. You can reply directly to this email to respond to the student.
                    </p>
                </div>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Contact email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending contact email:', error);
        throw error;
    }
}
