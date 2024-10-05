import slugify from "slugify"
import productModel from "../models/productModel.js"
import fs from 'fs'
import categoryModel from '../models/categoryModel.js'
import braintree from "braintree"
import orderModel from "../models/orderModel.js"
import dotenv from 'dotenv'
import { Cashfree } from "cashfree-pg";
// import Cashfree from 'cashfree-sdk'
// import { v4 as uuidv4 } from 'uuid'; // For generating version 4 (random) UUIDs

dotenv.config();

// payment gateway
export const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

//create product
export const createProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files

        //validations
        switch (true) {
            case !name:
                return res.status(400).send({
                    success: false,
                    message: 'Name is required'
                })
            case !description:
                return res.status(400).send({
                    success: false,
                    message: 'Description is required'
                })
            case !price:
                return res.status(400).send({
                    success: false,
                    message: 'Price is required'
                })
            case !category:
                return res.status(400).send({
                    success: false,
                    message: 'Category is required'
                })
            case !quantity:
                return res.status(400).send({
                    success: false,
                    message: 'Quantity is required'
                })
            case photo && photo.size > 1000000:
                return res.status(400).send({
                    success: false,
                    message: 'Photo size should be less than 1MB'
                })
            // case photo && !photo.type.startsWith('image/'):
            // case photo && !photo.type.startsWith('image/'):
        }

        const products = productModel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success: true,
            message: 'Product created successfully',
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in creating product',
            error
        })
    }
}

//update product
export const updateProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files

        //validations
        switch (true) {
            case !name:
                return res.status(400).send({
                    success: false,
                    message: 'Name is required'
                })
            case !description:
                return res.status(400).send({
                    success: false,
                    message: 'Description is required'
                })
            case !price:
                return res.status(400).send({
                    success: false,
                    message: 'Price is required'
                })
            case !category:
                return res.status(400).send({
                    success: false,
                    message: 'Category is required'
                })
            case !quantity:
                return res.status(400).send({
                    success: false,
                    message: 'Quantity is required'
                })
            case photo && photo.size > 1000000:
                return res.status(400).send({
                    success: false,
                    message: 'Photo size should be less than 1MB'
                })
            // case photo && !photo.type.startsWith('image/'):
            // case photo && !photo.type.startsWith('image/'):
        }

        const products = await productModel
            .findByIdAndUpdate(req.params.pid, {
                ...req.fields,
                slug: slugify(name)
            },
                {
                    new: true
                })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success: true,
            message: 'Product updated successfully',
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in updating product',
            error
        })
    }
}



//get-products
export const getProductController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const totalProducts = await productModel.countDocuments();
        const products = await productModel
            .find({})
            .populate("category")
            .select("-photo")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            totalCount: totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
            message: 'Products fetched successfully',
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in getting product',
            error
        })
    }
}

//get single product
export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug }).select("-photo").populate("category")
        res.status(200).send({
            success: true,
            message: 'Product fetched successfully',
            product
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in getting product',
            error
        })
    }
}

//get photo
export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo")
        if (product && product.photo && product.photo.data) {
            res.set("Content-Type", product.photo.contentType);
            return res.status(200).end(product.photo.data);
        } else {
            return res.status(404).send({
                success: false,
                message: "Photo not found",
            });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in getting product photo',
            error
        })
    }
}

//delete product
export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success: true,
            message: 'Product deleted successfully',
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in deleting product',
            error
        })
    }
}

//product-filter
export const productFiltersController = async (req, res) => {
    try {
        const { checked, radio } = req.body
        let args = {}
        if (checked.length > 0) args.category = checked
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }
        const products = await productModel.find(args)
        res.status(200).send({
            success: true,
            message: 'Products fetched successfully',
            products
        })

    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: 'Error in filtering products',
            error
        })

    }
}

//product-count 
export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success: true,
            total,
            message: 'Products count fetched successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: 'Error in counting products',
            error
        })
    }
}

//product list based on page
export const productListController = async (req, res) => {
    try {
        const perPage = 8
        const page = req.params.page ? req.params.page : 1
        const products = await productModel.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: 'Error in per page ctrl',
            error
        })
    }
}

//search product
export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params
        const result = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } }, //case insensetive
                { description: { $regex: keyword, $options: 'i' } } //case insensetive
            ]
        }).select("-photo")
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: 'Error in searching products',
            error
        })
    }
}

//similar product
export const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params
        const products = await productModel.find({
            category: cid,
            _id: { $ne: pid }//not include = $ne
        }).select("-photo").limit(3).populate("category")
        res.status(200).send({
            success: true,
            products,
            message: 'Related products fetched successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: 'Error in getting related products',
            error
        })
    }
}

//get product by category
export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug })
        const products = await productModel.find({ category }).populate('category')
        res.status(200).send({
            success: true,
            products,
            category,
            message: 'Products fetched successfully by category'
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: 'Error in getting product by category',
            error
        })
    }
}


//Payment Gateway API
//token
export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err)
            }
            else {
                res.send(response)
            }
        })
    } catch (error) {
        console.log(error)
    }
}

//payment
export const braintreePaymentController = async (req, res) => {
    try {
        const { cart, nonce } = req.body
        let total = 0
        cart.forEach((item) => {
            total += item.price * item.quantity; // Include quantity in total calculation
        });

        const formattedTotal = (total / 100).toFixed(2); // If total is in paisa/cent

        // Process payment
        const result = await new Promise((resolve, reject) => {
            gateway.transaction.sale({
                amount: formattedTotal, // Total amount to charge
                paymentMethodNonce: nonce, // Use `paymentMethodNonce` instead of `paymentMethod`
                options: {
                    submitForSettlement: true
                }
            }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });

        if (result.success) {
            // Save order using async/await
            const order = new orderModel({
                products: cart,
                payment: result,
                buyer: req.user._id
            });

            await order.save(); // No callback needed, use async/await

            res.json({ ok: true });
        } else {
            res.status(500).json({ error: result.message || 'Transaction failed' });
        }

    } catch (error) {
        console.error('Payment Controller Error:', error);
        res.status(500).json({ error: 'An error occurred while processing payment' });
    }
}

// export const cashfreePayment = async (req, res) => {
//     console.log("Request Body:", req.body); // Log the request body

//     const { order_id, order_amount, order_currency, customer_details } = req.body;

//     const cashfreeParams = {
//         orderId: order_id,
//         orderAmount: order_amount,
//         orderCurrency: order_currency,
//         customerDetails: customer_details,
//     };

//     try {
//         const response = await axios.post('https://test.cashfree.com/api/v1/order/create', cashfreeParams, {
//             headers: {
//                 'x-client-id': process.env.APP_ID,
//                 'x-client-secret': process.env.SECRET_KEY,
//                 'Content-Type': 'application/json',
//             },
//         });

//         console.log("Cashfree Response:", response.data); // Log the response from Cashfree

//         const { paymentLink } = response.data;
//         res.json({ paymentLink });
//     } catch (error) {
//         console.error('Cashfree Payment Error:', error);
//         res.status(500).send('Payment processing error');
//     }
// };

// console.log(Cashfree, "Cashfree")

export const getSessionId = async (req, res) => {
    try {
        console.log(req.body)
        // Destructure the required fields from the request body
        const { order_amount, username, customer_phone } = req.body;

        // Validate the required fields
        if (!order_amount || !username || !customer_phone) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const customerId = username.replace(/\s+/g, '-');

        // Set up the environment and credentials correctly
        // Cashfree.XClientId = "TEST10315397bb2415133900e18ad5d479351301";
        Cashfree.XClientId = process.env.APP_ID;
        // Cashfree.XClientSecret = "cfsk_ma_test_e3a9099cce2f393e31ad569258290342_244c513e";
        Cashfree.XClientSecret = process.env.SECRET_KEY;
        Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

        // Create a unique order ID
        const order_id = `order_${Date.now()}`;

        // Prepare the request body
        const request = {
            order_id,
            order_amount,
            order_currency: "INR",
            customer_details: {
                customer_id: customerId,
                customer_phone: customer_phone,
            },
            order_meta: {
                return_url: `http://localhost:3000/dashboard/user/orders`,
            },
        };

        // Call the Cashfree API to create the order
        Cashfree.PGCreateOrder("2023-08-01", request).then((response) => {
            console.log('Order created successfully:', response.data);
            res.json({
                sessionId: response.data.payment_session_id,
                orderId: order_id,
            });
        }).catch((error) => {
            console.error('Error:', error.response.data.message);
        });


    } catch (error) {
        console.error('Server Error:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};