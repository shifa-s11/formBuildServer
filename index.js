const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const PORT = process.env.PORT || 4000;
const formRoutes = require('./routes/formRoutes');
const questionRoutes = require('./routes/questionRoutes');
const responseRoutes = require('./routes/responseRoutes');
const app = express();


app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use('/api/forms', formRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/responses', responseRoutes);

connectDB().then(()=>{
    console.log('Database connected successfully')
    app.listen(4000,()=>{
    console.log(`Server is running on port ${PORT}`)
})
}).catch((error)=>{
    console.log(error)
})