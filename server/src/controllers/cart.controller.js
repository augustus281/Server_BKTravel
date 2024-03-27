'use strict'

const Cart = require("../models/cart.model");
const OrderItem = require("../models/order_item.model");
const User = require("../models/user.model")
const { findOrderItem } = require("../services/order.service");
const { findTourById } = require("../services/tour.service");
const { findUserById, checkOrderByUser, checkCartByUser} = require("../services/user.service");

class CartController {
    /**
     * @body {
     *      user_id,
     *      tour: {
     *          tour_id,
     *          adult_quantity,
     *          child_quantity
     *      }
     * }
     * @returns(200)
     */
    addTourToCart = async (req, res, next) => {
        try {
            const user_id = req.body.user_id;
            const user = await findUserById(user_id)
            if (!user) return res.status(404).json({ message: "Not found user!" })
    
            // create cart if user doesn't have
            const [cart, cart_created] = await Cart.findOrCreate({
                where: { user_id: user_id },
                defaults: { user_id: user_id }
            })
            
            // check order_item in cart if it isn't, create order_item
            const { tour_id, adult_quantity, child_quantity } = req.body.tour
            const tour = await findTourById(tour_id)
            if (!tour) return res.status(404).json({ message: "Not found tour!" })
    
            const order_item = await OrderItem.findOne({
                where: { cart_id: cart.cart_id, tour_id: tour_id }
            })

            // console.log(`new_total:::`, parseFloat(adult_quantity * (tour.price)) + parseFloat(0.75 * child_quantity * (tour.price)))
            // return res.status(200).json({ message: "OK"})
            const total_price = parseFloat(adult_quantity * (tour.price)) + parseFloat(0.75 * child_quantity * (tour.price));
            let orderItem
            if (!order_item) {
                orderItem = await OrderItem.create({
                    tour_id: tour_id,
                    price: tour.price,
                    quantity: adult_quantity + child_quantity,
                    adult_quantity: adult_quantity,
                    child_quantity: child_quantity,
                    cart_id: cart.cart_id,
                    total_price: parseFloat(total_price)
                })
            } else {
                order_item.adult_quantity += adult_quantity,
                order_item.child_quantity += child_quantity
                order_item.quantity += (adult_quantity + child_quantity)
                order_item.total_price = parseFloat(order_item.total_price) + parseFloat(total_price)
                await order_item.save()
            }

            // calculate total price of order item
            const child_order = orderItem ? orderItem.child_quantity : order_item.child_quantity;
            const adult_order = orderItem ? orderItem.adult_quantity : order_item.adult_quantity;
            const new_total = parseFloat(adult_order * (tour.price)) + parseFloat(0.75 * child_order * (tour.price));
            
            // update total of cart
            cart.total = parseFloat(cart.total) + parseFloat(new_total);
            cart.amount_items = order_item ? cart.amount_items : cart.amount_items++;
            await cart.save()

            return res.status(200).json({
                message: "Add tour to cart successfully!",
                cart: cart
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    /**
     * 
     * @param {user_id} req 
     */
    getCartByUser = async (req, res, next) => {
        const user_id = req.params.user_id;

        const cart = await User.findByPk(user_id, {
            include: [{
              model: Cart,
              include: OrderItem 
            }]
        })
        return res.status(200).json({
            message: "Get cart successfully!",
            data: cart
        })
    }

    /**
     * 
     * @body {
     *      user_id,
     *      tour_id
     * } 
     * @returns 
     */
    incrementAdultQuantityOrderItem = async (req, res, next) => {
        try {
            const { user_id, tour_id } = req.body
            const cart = await checkCartByUser(user_id)

            const order_item = await findOrderItem(cart.cart_id, tour_id)
            if (!order_item) return res.status(404).json({ message: "Not found order_item!"})

            const tour = await findTourById(tour_id)
            if (!tour) return res.status(404).json({ message: "Not found tour for increment! "})
            
            order_item.adult_quantity++;
            order_item.quantity++;
            order_item.total_price = parseFloat(order_item.total_price) + parseFloat(tour.price)
            await order_item.save()
            
            const new_total = parseFloat(cart.total) + parseFloat(order_item.price)
            cart.total = parseFloat(cart.total) + parseFloat(new_total);
            await cart.save()

            return res.status(200).json({ 
                message: "Increase quantity of order item successfully!",
                cart: cart
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    decrementAdultQuantityOrderItem = async (req, res, next) => {
        try {
            const { user_id, tour_id } = req.body
            const cart = await checkCartByUser(user_id)
    
            const order_item = await findOrderItem(cart.cart_id, tour_id)
            if (!order_item) return res.status(404).json({ message: "Not found order_item!"})

            const tour = await findTourById(tour_id)
            if (!tour) return res.status(404).json({ message: "Not found tour for increment! "})

            order_item.adult_quantity--;
            order_item.quantity--;
            order_item.total_price = parseFloat(order_item.total_price) - parseFloat(tour.price)

            await order_item.save()

            if (order_item.quantity == 0) {
                await order_item.destroy()
                cart.amount_items--;
            }
            
            const new_total = parseFloat(cart.total) - parseFloat(order_item.price)
            cart.total = new_total <= 0 ? 0 : new_total;
            await cart.save()

            return res.status(200).json({ 
                message: "Decrease quantity of order_item successfully!",
                cart: cart
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    incrementChildQuantityOrderItem = async (req, res, next) => {
        try {
            const { user_id, tour_id } = req.body
            const cart = await checkCartByUser(user_id)
    
            const order_item = await findOrderItem(cart.cart_id, tour_id)
            if (!order_item) return res.status(404).json({ message: "Not found order_item!"})

            const tour = await findTourById(tour_id)
            if (!tour) return res.status(404).json({ message: "Not found tour for increment! "})

            order_item.child_quantity++;
            order_item.quantity++;
            order_item.total_price = parseFloat(order_item.total_price) + parseFloat(tour.price)

            await order_item.save()
            
            const new_total = parseFloat(cart.total) + parseFloat(0.75 * order_item.price)
            cart.total = new_total;
            await cart.save()

            return res.status(200).json({ 
                message: "Increase quantity of order item successfully!",
                cart: cart
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    decrementChildQuantityOrderItem = async (req, res, next) => {
        try {
            const { user_id, tour_id } = req.body
            const cart = await checkCartByUser(user_id)
    
            const order_item = await findOrderItem(cart.cart_id, tour_id)
            if (!order_item) return res.status(404).json({ message: "Not found order_item!"})

            const tour = await findTourById(tour_id)
            if (!tour) return res.status(404).json({ message: "Not found tour for increment! "})

            order_item.child_quantity--;
            order_item.quantity--;
            order_item.total_price = parseFloat(order_item.total_price) - parseFloat(tour.price)
            await order_item.save()

            if (order_item.quantity == 0) {
                await order_item.destroy()
                cart.amount_items--;
            }
            
            const new_total = parseFloat(cart.total) - parseFloat(0.75 * order_item.price)
            cart.total = new_total <= 0 ? 0 : new_total;
            cart.amount_items = new_total <= 0 ? 0 : new_total;
            await cart.save()

            return res.status(200).json({ 
                message: "Decrease quantity of order_item successfully!",
                cart: cart
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    deleteOrderItem = async (req, res, next) => {
        try {
            const cart_id = req.params.cart_id
            const tour_id = req.body.tour_id
            const cart = await Cart.findOne({ where: { cart_id: cart_id }})
            const order_item = await OrderItem.findOne({
                where: {
                    cart_id: cart_id,
                    tour_id: tour_id
                }
            })
            if (!order_item) return res.status(404).json({ message: "Not found order_item!" })
            
            // update total of order
            cart.total = parseFloat(cart.total) - parseFloat(order_item.quantity * order_item.price);
            await cart.save()
            
            await order_item.destroy()
            return res.status(200).json({ 
                message: "Remove order_item from order successfully!",
                cart: cart
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new CartController()