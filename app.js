const express = require('express');
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./database/db');

const app = express();
app.use(express.json());

app.use('/', userRoutes);

sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
});
