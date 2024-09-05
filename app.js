const express = require('express');
const userRoutes = require('./routes/userRoutes');
const connectDB = require('./database/db');

const app = express();


connectDB();


app.use(express.json());

app.use('/', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
