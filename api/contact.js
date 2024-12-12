const nodemailer = require('nodemailer');
const formidable = require('formidable');

module.exports = (req, res) => {
    if (req.method === 'POST') {
        const form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            if (err) {
                res.status(500).json({ error: 'Something went wrong while processing the form.' });
                return;
            }

            // Extract values from the form fields
            const { 
                name, 
                email, 
                phone, 
                department, 
                service, 
                state, 
                challenges, 
                estimatedCollection, 
                message 
            } = fields;

            // Validate required fields
            if (!name || !email || !phone || !department || !service || !state || !challenges || !estimatedCollection || !message) {
                res.status(400).json({ error: 'All fields are required.' });
                return;
            }

            // Create the email content
            const emailContent = `
                <h1>New Appointment Request</h1>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Speciality:</strong> ${department}</p>
                <p><strong>Service:</strong> ${service}</p>
                <p><strong>State:</strong> ${state}</p>
                <p><strong>Challenges:</strong> ${challenges}</p>
                <p><strong>Estimated Monthly Collection:</strong> $${estimatedCollection}</p>
                <p><strong>Message:</strong> ${message}</p>
            `;

            // Set up nodemailer transport
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'your-email@gmail.com', // Use your email
                    pass: 'your-email-password'   // Use your email password or app password
                }
            });

            // Send the email
            const mailOptions = {
                from: email,
                to: 'recipient@example.com', // Recipient email
                subject: 'New Appointment Request',
                html: emailContent
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ error: 'Failed to send email' });
                    return;
                }

                res.status(200).json({ message: 'Appointment request sent successfully.' });
            });
        });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};


/*import nodemailer from 'nodemailer';
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
*/