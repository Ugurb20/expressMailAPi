const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

app.use(cors());

dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());

const apiKey = process.env.API_KEY;

// Middleware to check the API key
const apiKeyMiddleware = (req, res, next) => {
  const providedApiKey = req.header('x-api-key');

  if (providedApiKey !== apiKey) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
};

// Apply the API key middleware to your serverless function
app.use(apiKeyMiddleware);

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
