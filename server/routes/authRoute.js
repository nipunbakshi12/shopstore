import express from "express";
import {
  forgotPasswordController,
  getAllOrdersController,
  getOrdersController,
  loginController,
  orderStatusController,
  registerController,
  testController,
  updateProfileController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routing
//Register || POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

//Forgot Password || POST
router.post("/forgot-password", forgotPasswordController);

//test Routes
router.get("/test", requireSignIn, isAdmin, testController);

//User protected routes auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).json({
    ok: true,
    message: "User Authenticated",
  });
});

//admin protected routes auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).json({
    ok: true,
    message: "User Authenticated",
  });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

// //all-orders
// router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController)

// //order-status-update
// router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController)

export default router;
