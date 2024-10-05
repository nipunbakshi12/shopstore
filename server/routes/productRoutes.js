import express from 'express';
import { isAdmin, requireSignIn } from './../middlewares/authMiddleware.js';
import {
    braintreePaymentController,
    braintreeTokenController,
    // cashfreePayment,
    createProductController,
    deleteProductController,
    getProductController,
    getSessionId,
    getSingleProductController,
    productCategoryController,
    productCountController,
    productFiltersController,
    productListController,
    productPhotoController,
    relatedProductController,
    searchProductController,
    updateProductController
} from '../controllers/productController.js';
import formidable from 'express-formidable';
const router = express.Router()

//routes

//create-product
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController)

//get-prodcut
router.get('/get-product', getProductController)

//single-product
router.get('/get-product/:slug', getSingleProductController)

//get-photos
router.get('/product-photo/:pid', productPhotoController)

//delete-product
router.delete('/delete-product/:pid', deleteProductController)

//update-product
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController)

//filter product
router.post('/product-filters', productFiltersController)

//product-count
router.get('/product-count', productCountController)

//product-per-page
router.get('/product-list/:page', productListController)

//search product
router.get('/search/:keyword', searchProductController)

//similar-product
router.get('/related-product/:pid/:cid', relatedProductController)

//category wise product
router.get('/product-category/:slug', productCategoryController)

//payments routes
//token
router.get('/braintree/token', braintreeTokenController)

// //payment
router.post('/braintree/payment', requireSignIn, braintreePaymentController)

// Route for Cashfree payment
// router.post('/cashfree/payment', cashfreePayment);

router.post('/cashfree/payment-session', requireSignIn, getSessionId)

export default router