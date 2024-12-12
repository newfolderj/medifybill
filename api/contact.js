import nodemailer from 'nodemailer';
import { IncomingForm } from 'formidable';

// Disable automatic body parsing for Formidable to work
export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (req.method === 'POST') {
    const form = new IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: 'Error parsing form data' });
        return;
      }

      // Extract the fields from the parsed data
      const { name, email, phone, department, message } = fields;

      // Basic validation for required fields
      if (!name || !email || !phone || !department || !message) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Create a Nodemailer transporter using SMTP
      const transporter = nodemailer.createTransport({
        service: 'gmail', // You can use other email services too
        auth: {
          user: 'medifybill@gmail.com',  // Your email (replace with your own)
          pass: 'wevn ctmd sndn spoe', // Your Gmail app password
        },
      });

      // Mail options
      const mailOptions = {
        from: 'medifybill@gmail.com',
        to: 'info@medifybill.com', // The recipient's email address
        subject: 'New Appointment Request',
        text: `
          New appointment request received:
          
          Name: ${name}
          Email: ${email}
          Phone: ${phone}
          Department: ${department}
          Message: ${message}
        `,
      };

      try {
        // Send the email
        await transporter.sendMail(mailOptions);

        // Redirect to a confirmation page or send a success response
        return res.redirect(303, 'https://www.medifybill.com/confirmation.html');
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error sending email' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
