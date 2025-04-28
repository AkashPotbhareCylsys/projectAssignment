const express = require('express');
require('dotenv').config();

const RegistrationRoute = require('./Src/Route/ragistrationRoute');

const app = express();
const port = process.env.PORT || 3000;
const path    = require('path');
// parse JSON bodies
app.use(express.json());
app.use('/Src/uploads/', express.static('./Src/uploads'));
app.use('/uploads', express.static(path.join(__dirname, '/Src/uploads')));

// mount our “/api” router
app.use('/api', RegistrationRoute);
console.log(__dirname, 'Src', 'uploads');

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal server error',
      data: null
    });
  });

app.listen(port, () => console.log(`Server running on ${port}`));
