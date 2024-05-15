'use strict'

const cloudinary = require("../utils/cloudinary")
const { NotFoundError, BadRequestError } = require("../core/error.response")
const Review = require("../models/review.model")
const { findTourById } = require("../services/tour.service")
const { findUserById } = require("../services/user.service")
const Comment = require("../models/comment.model")
const Order = require("../models/order.model")
const { StatusOrder } = require("../common/status")
const Tour = require("../models/tour.model")

class ReviewController {

    creatReview = async (req, res, next) => {
        try {
            const { 
                user_id, 
                tour_id,
                is_comment,
                content,
                parent_comment_id,
                payment_id,
                number_rate
            } = req.fields;

            const user = await findUserById(user_id);
            if (!user) throw new NotFoundError("Not found user!");

            const tour = await findTourById(tour_id);
            if (!tour) throw new NotFoundError("Not found tour for reviewing!");

            // check user is booked tour
            const order = await Order.findOne({
                where: {
                    user_id: user_id,
                    payment_id: payment_id,
                    status: StatusOrder.COMPLETE
                }
            })

            if (!order) throw new BadRequestError("Order is not completed, you can't review!")

            const list_image = [];
            let i = 0;
            while(req.files[`image[${i}]`]) {
                const path_image = req.files[`image[${i}]`].path
                const image = await cloudinary.uploader.upload(path_image)
                list_image.push(image.secure_url)
                i++;
            }

            let new_comment
            if (is_comment != "false") {
                new_comment = await Comment.create({
                    content: content,
                    parent_comment_id,
                    rating: number_rate,
                    user_id, tour_id,
                    user_name: user.firstname + " " + user.lastname,
                    image: list_image.length > 0 ? JSON.stringify(list_image) : null
                })
            }

            const tour_review = await Review.findOne({ where: { tour_id: tour_id }});
            if (!tour_review) {
                const new_review = await Review.create({
                    user_id,
                    tour_id,
                    comment_id: new_comment ? new_comment.comment_id : null,
                    rating_1: parseInt(number_rate) == 1 ? 1 : 0,
                    rating_2: parseInt(number_rate) == 2 ? 1 : 0,
                    rating_3: parseInt(number_rate) == 3 ? 1 : 0,
                    rating_4: parseInt(number_rate) == 4 ? 1 : 0,
                    rating_5: parseInt(number_rate) == 5 ? 1 : 0,
                    count: 1,
                    average_rate: number_rate
                })

                new_comment.review_id = new_review.review_id;
                await new_comment.save();

                tour.average_rate = parseInt(number_rate);
                tour.count_reviewer = 1;
                await tour.save()

                return res.status(200).json({ 
                    message: "Review tour successfully!",
                    new_review: new_review
                })
            } else {
                new_comment.review_id = tour_review.review_id;
                await new_comment.save();

                switch (parseInt(number_rate)) {
                    case 1:
                        tour_review.rating_1++;
                        break;
                    case 2:
                        tour_review.rating_2++;
                        break;
                    case 3:
                        tour_review.rating_3++;
                        break;
                    case 4:
                        tour_review.rating_4++;
                        break;
                    case 5:
                        tour_review.rating_5++;
                        break;
                    default:
                        throw new Error('Invalid rating'); 
                }
                const av = (parseFloat(tour_review.average_rate * tour_review.count) + parseFloat(number_rate)) 
                / (parseFloat(tour_review.count) + 1);
            
                tour_review.average_rate = av;
                tour_review.count++;
                await tour_review.save();

                // update averag_rate & count_reviewer of tour
                tour.average_rate = av;
                tour.count_reviewer++;
                await tour.save();

                return res.status(200).json({ 
                    message: "Review tour successfully!",
                    new_review: tour_review
                })
            }
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new ReviewController()