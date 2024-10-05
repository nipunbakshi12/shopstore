import JWT from 'jsonwebtoken';
import userModel from '../models/userModel.js';

//Protected Routes
export const requireSignIn = async (req, res, next) => {
    try {
        const decode = JWT.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        )
        req.user = decode
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

//admin access
export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id)
        if (user.role !== 1) {
            return res.status(401).send({
                message: 'You are not an admin'
            })
        }
        else {
            next()
        }
    } catch (error) {
        console.log(error)
    }
}