const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/hello', (req, res) => {
  res.send('Hello, World!');
});

app.post('/sendEmail', (req, res) => {
  const { email, firstName, lastName, subject, message, companyName } =
    req.body;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'ugurbukcuoglu@gmail.com',
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'ugurbukcuoglu@gmail.com',
    to: 'ugurbukcuoglu@gmail.com',
    subject: subject || 'Message from Express Server',
    text: `Hello ${firstName} ${lastName},\n\n${message}\n${companyName}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      res.send('Email sent successfully');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
