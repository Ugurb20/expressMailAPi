const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Middleware to allow traffic only from a specific IP address and domain name
app.use((req, res, next) => {
  const allowedIP = '176.33.67.140';
  const allowedDomain = 'apppillow.com';

  const origin = req.get('Origin');
  if (!(req.ip == allowedIP || origin.includes(allowedDomain))) {
    return res.status(403).send(`${(origin, req.ip)}`);
  }

  next();
});

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
