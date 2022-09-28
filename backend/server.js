const express = require('express');
const colors = require('colors');
const dotenv= require('dotenv').config();
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db');
const cors = require('cors');
const PORT = process.env.PORT || 8000

// connect to database
connectDB();

const app = express();
app.get('/', (req, res)=>{
    res.status(200).json({message: 'Welcome to supportdesk api'});
})
app.use(cors());
 app.use(express.json());
 app.use(express.urlencoded({extended: false}));
// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tickets', require('./routes/ticketsRoute'));
app.use(errorHandler);

app.listen(PORT, ()=>{
    console.log(`Server started on PORT ${PORT}`)   
})    