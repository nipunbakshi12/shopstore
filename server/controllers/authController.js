import { comparePassword, hashPassword } from "../helpers/authHelper.js"
import userModel from "../models/userModel.js"
import orderModel from "../models/orderModel.js"
import JWT from 'jsonwebtoken'


export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer, role } = req.body

        //validations
        if (!name || !email || !password || !phone || !address || !answer) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            })
        }

        //check user
        const existingUser = await userModel.findOne({ email })

        //existing user
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        //Registration User
        const hashedPassword = await hashPassword(password)

        //save
        const user = await new userModel({
            name,
            email,
            phone,
            address,
            password: hashedPassword,
            answer,
            role
        })
        await user.save()
        res.status(200).json({
            success: true,
            message: "User registered successfully",
            user
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

//POST LOGIN
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body

        //validations
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            })
        }

        //check user
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            })
        }

        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Password"
            })
        }


        //token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error in Login"
        })
    }
}

//Forgot Password
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body
        if (!email) {
            res.status(400).send({
                message: "Email is required"
            })
        }

        if (!answer) {
            res.status(400).send({
                message: "Answer is required"
            })
        }

        if (!newPassword) {
            res.status(400).send({
                message: "New Password is required"
            })
        }

        //check email and answer
        const user = await userModel.findOne({ email, answer })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            })
        }
        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id, { password: hashed })
        res.status(200).send({
            success: true,
            message: "Password reset successfully"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error
        })
    }
}

//test Controller
export const testController = (req, res) => {
    console.log("Protected Routes")
    res.status(200).send({
        message: "You are an Admin"
    })
}

//Update Profile
export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body
        const user = await userModel.findById(req.user._id)
        //password

        if (password && password.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            })
        }
        const hashedPassword = password ? await hashPassword(password) : undefined
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            email: email || user.email,
            phone: phone || user.phone,
            address: address || user.address,
            password: hashedPassword || user.password
        }, { new: true })
        res.status(200).send({
            success: true,
            message: "Profile updated successfully",
            updatedUser
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            message: "Error while updating profile",
            error
        })
    }
}

//orders
export const getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({ buyer: req.user._id }).populate("products", "-photo").populate("buyer", "name").sort({ createdAt: -1 });
        res.status(200).json(orders)
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in retrieving orders',
            error
        })
    }
}

//all-orders
export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate("products", "-photo")
            .populate("buyer", "name")
            .sort({ createdAt: -1 })
        res.json(orders)
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in retrieving orders',
            error
        })
    }
}

//order-status-update
export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params
        const { status } = req.body

        console.log("Updating order:", orderId, "with status:", status);

        // Validate input
        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true })

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        res.json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        console.log("Error updating order status:", error);
        res.status(500).json({
            success: false,
            message: 'Error in updating order status',
            error
        })
    }
}