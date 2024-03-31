'use strict'

const cloudinary = require("../utils/cloudinary")
const { NotFoundError } = require("../core/error.response")
const Review = require("../models/review.model")
const { findTourById } = require("../services/tour.service")
const { findUserById } = require("../services/user.service")
const Comment = require("../models/comment.model")

class ReviewController {
    creatReview = async (req, res, next) => {
        try {
            const { 
                user_id, 
                tour_id,
                is_comment,
                content,
                parent_comment_id,
                number_rate
            } = req.fields;
            console.log(`:::`, req.fields)

            const user = await findUserById(user_id);
            if (!user) throw new NotFoundError("Not found user!");

            // check tour is ordered by user ?

            const tour = await findTourById(tour_id);
            if (!tour) throw new NotFoundError("Not found tour for reviewing!");

            const list_image = [];
            let i = 0;
            while(req.files[`image[${i}]`]) {
                const path_image = req.files[`image[${i}]`].path
                const image = await cloudinary.uploader.upload(path_image)
                list_image.push(image.secure_url)
                i++;
            }

            const new_comment = is_comment ? ( await Comment.create({
                content,
                parent_comment_id,
                image: list_image.length > 0 ? JSON.stringify(list_image) : null
            }) ) : null;

            const tour_review = await Review.findOne({ where: { tour_id: tour_id }});
            if (!tour_review) {
                const new_review = await Review.create({
                    user_id,
                    tour_id,
                    comment_id: new_comment ? new_comment.comment_id : null,
                    rating_1: number_rate == 1 ? 1 : 0,
                    rating_2: number_rate == 2 ? 1 : 0,
                    rating_3: number_rate == 3 ? 1 : 0,
                    rating_4: number_rate == 4 ? 1 : 0,
                    rating_5: number_rate == 5 ? 1 : 0,
                    count: 1,
                    average_rate: number_rate
                })

                return res.status(200).json({ 
                    message: "Review tour successfully!",
                    new_review: new_review
                })
            } else {
                tour_review.rating_1 = number_rate == 1 ? tour_review.rating_1++ : tour_review.rating_1;
                tour_review.rating_2 = number_rate == 2 ? tour_review.rating_2++ : tour_review.rating_2;
                tour_review.rating_3 = number_rate == 3 ? tour_review.rating_3++ : tour_review.rating_3;
                tour_review.rating_4 = number_rate == 4 ? tour_review.rating_4++ : tour_review.rating_4;
                tour_review.rating_5 = number_rate == 5 ? tour_review.rating_5++ : tour_review.rating_5;
                const av = (tour_review.average_rate * tour_review.count + number_rate) / (tour_review.count + 1);
                console.log(`av:::`, av)
                return res.status(200).json({ message: "OK"})
                tour_review.average_rate = (tour_review.average_rate * tour_review.count + number_rate) / (tour_review.count + 1);
                tour_review.count++;
                await tour_review.save();

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