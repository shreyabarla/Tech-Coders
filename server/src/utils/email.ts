import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendWelcomeEmail = async (email: string, name: string) => {
    try {
        const info = await transporter.sendMail({
            from: `"FinVault Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Welcome to FinVault! 🚀",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">Welcome to FinVault, ${name}!</h2>
          <p>We're thrilled to have you on board. FinVault is your all-in-one platform to track expenses, manage investments, and plan your financial future.</p>
          <p>Here's what you can do next:</p>
          <ul>
            <li>Complete your profile</li>
            <li>Add your first transaction</li>
            <li>Set up a financial goal</li>
          </ul>
          <p>If you have any questions, feel free to reply to this email.</p>
          <p>Best regards,<br>The FinVault Team</p>
        </div>
      `,
        });
        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};
