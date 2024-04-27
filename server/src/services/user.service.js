'use strict'

const Cart = require('../models/cart.model')
const Order = require('../models/order.model')
const User = require('../models/user.model')

const findUserByEmail = async (email) => {
    return await User.findOne({ where: { email }})
}

const findUserById = async (user_id) => {
    return await User.findOne({ where: { user_id: user_id }})
}

const uploadPicture = async (picture_url) => {
    const filePathOnCloudinary = "src/" + picture_url
            
    return cloudinary.uploader
        .upload(picture_url, { public_id: filePathOnCloudinary })
        .then((result) => {
                fs.unlinkSync(picture_url)
                return {
                    message: "Success",
                    url: result.url
                }
            })
        .catch((error) => {
            fs.unlinkSync(picture_url); 
            return { message: "Fail" }; 
        })
}

const checkOrderByUser = async (user_id) => {
    return await Order.findOne({ where: { user_id: user_id }})
}

const checkCartByUser = async (user_id) => {
    return await Cart.findOne({ where: { user_id: user_id }})
}

module.exports = {
    findUserByEmail,
    uploadPicture,
    findUserById,
    checkOrderByUser,
    checkCartByUser
}