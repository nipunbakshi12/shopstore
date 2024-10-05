import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import morgan from 'morgan'
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js'
import cors from 'cors'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'

// import Razorpay from 'razorpay';

dotenv.config()

//database config
connectDB()

//rest object
const app = express();

//middleware
app.use(cors({
    origin: 'http://localhost:3000', // Adjust this based on your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Adjust allowed methods as needed
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
    credentials: true // Allow cookies to be sent across domains
}));

// app.options('*', cors({
//     origin: 'https://shopstore-frontend.vercel.app',
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true
// }));


app.use(bodyParser.json()); // Ensure this line is present

app.use(express.json())
app.use(morgan('dev'))

//routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/category', categoryRoutes)
app.use('/api/v1/product', productRoutes)



//rest api
app.get('/', (req, res) => {
    res.send('<h1>Welcome to eCommerce App</h1>');
});

//razorpay
// middlewares
// app.use(express.json({ extended: false }));
// app.post("/orders", async (req, res) => {
//     try {
//         const { amount, currency, receipt } = req.body;
//         const instance = new Razorpay({
//             key_id: process.env.RAZORPAY_KEY_ID,
//             key_secret: process.env.RAZORPAY_SECRET,
//         });

//         const options = {
//             amount,
//             currency,
//             receipt,
//         };

//         const order = await instance.orders.create(options);

//         if (!order) return res.status(500).send("Some error occured");

//         res.json(order);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });


//PORT
const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on ${process.env.MODE} port ${PORT}`);
});
