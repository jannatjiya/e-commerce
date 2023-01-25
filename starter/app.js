require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

//rest of packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const notFounMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const fileupload = require('express-fileupload');

//database

const connectDB = require('./db/connect');


//routers
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const orderRouter = require('./routes/orderRoutes');
//middleware
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('./public'));

app.use(fileupload(''))


// app.use(notFounMiddleware);
// app.use(errorHandlerMiddleware);

//routes
app.get('/',(req,res)=>{
    res.send('e-commerce api');
    console.log(req.signedCookies);
});
// app.get('/api/v1/pro',(req,res)=>{
//     res.send('e-commerce api');
//     console.log(req.signedCookies);
// });
app.use('/api/v1/auths',authRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/products',productRouter);
app.use('/api/v1/reviews',reviewRouter);
app.use('/api/v1/orders',orderRouter);

const port = process.env.PORT || 4000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, console.log(`Server is listening on port ${port}..`));

    } catch (error) {
        console.log(error);
    }
};
start();