'use strict'

const { Sequelize, JSON } = require("sequelize")
const Comment = require("../models/comment.model")
const Tour = require("../models/tour.model")
const User = require("../models/user.model")
const { findTourById } = require("../services/tour.service")

const Op = Sequelize.Op

class CommentController {
    createComment = async (req, res, next) => {
        try {
            const { content, user_id, tour_id } = req.fields;
            const parent_comment_id  = req.fields.parent_comment_id

            const user = await User.findOne({ where: { user_id: user_id }})
            if (!user) return res.status(404).json({ message: "Not found user!" })

            const list_image = [];
            let i = 0;
            while(req.files[`image[${i}]`]) {
                const path_image = req.files[`image[${i}]`].path
                const image = await cloudinary.uploader.upload(path_image)
                list_image.push(image.secure_url)
                i++;
            }

            const comment = await Comment.create({
                tour_id, content, user_id, 
                parent_comment_id: parent_comment_id ? parent_comment_id : null , 
                user_name: user.firstname + " " + user.lastname,
                list_image: list_image.length > 0 ? JSON.stringify(list_image) : null
            });

            let rightValue;
            if (parent_comment_id) {
                // reply comment
                const parent_comment = await Comment.findOne({ where: { comment_id: parent_comment_id }});
                if (!parent_comment) return res.status(404).json({ message: "Not found parent comment!" });

                console.log(`parent_comment:::`, parent_comment)

                rightValue = parent_comment.comment_right;

                // update many comments
                await Comment.update({ 
                    comment_right: Sequelize.literal('comment_right + 2')
                },{ 
                    where: { 
                        tour_id: tour_id,
                        comment_right: { [Sequelize.Op.gte]: rightValue }
                    }
                });

                await Comment.update({ 
                        comment_left: Sequelize.literal('comment_left + 2')
                    },{ 
                        where: { 
                            tour_id: tour_id,
                            comment_left: { [Sequelize.Op.gt]: rightValue }
                        }
                });
            } else {
                const maxRightValue = await Comment.findOne({
                    where: {
                        tour_id: tour_id
                    },
                    attributes: [[Sequelize.fn('MAX', Sequelize.col('comment_right')), 'maxRight']]
                });

                rightValue = maxRightValue && maxRightValue.dataValues.maxRight !== null ? maxRightValue.dataValues.maxRight + 1 : 1;
            }

            // insert to comment
            comment.comment_left = rightValue;
            comment.comment_right = rightValue + 1;

            await comment.save();
            return res.status(200).json({
                message: "You comment tour successfully!",
                comment: comment
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };

    getCommentsByParentId = async (req, res, next) => {
        try {
            const { tour_id, parent_comment_id, limit = 50, offset = 0 } = req.body;
            let comments;
            
            if (parent_comment_id) {
                const parent = await Comment.findOne({ where: { comment_id: parent_comment_id }});
                if (!parent) return res.status(404).json({ message: "Not found comment for tour!"});

                console.log(`parent:::`, parent)

                comments = await Comment.findAll({
                    where: {
                        tour_id: tour_id,
                        comment_left: { [Op.gt]: parent.comment_left },
                        comment_right: { [Op.lte]: parent.comment_right }
                    },
                    order: [['comment_left', 'ASC']],
                    limit,
                    offset
                });
            } else {
                comments = await Comment.findAll({
                    where: {
                        tour_id: tour_id
                    }, 
                    attributes: ['comment_left', 'comment_right', 'content', 'parent_comment_id'],
                    order: [['comment_left', 'ASC']],
                    limit,
                    offset
                });
            }

            return res.status(200).json({
                message: "Get all comment by parent_comment_id successfully",
                comments: comments
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    deleteComment = async (req, res, next) => {
        try {
            const { tour_id, comment_id } = req.body;
            console.log(1);

            const tour = await findTourById(tour_id);
            if (!tour) return res.status(404).json({ message: "Not found tour for deleting comment!" });
    
            const comment = await Comment.findOne({ where: { comment_id: comment_id }})
            if (!comment) return res.status(404).json({ message: "Not found comment!" })
    
            // 1. Define left & right value of comment
            const leftValue = comment.comment_left
            const rightValue = comment.comment_right
    
            // 2. Calc width
            const width = rightValue - leftValue + 1
            console.log(leftValue, rightValue)
    
            // 3. Delete all child comments
            await Comment.destroy({
                where: {
                    tour_id: tour_id,
                    comment_left: { [Op.gte]: leftValue },
                    comment_left: { [Op.lte]: rightValue }
                }
            })
    
            // 4. Update right & left
            await Comment.update({ 
                comment_right: Sequelize.literal(`comment_right - ${width}`)}, {
                    where: {
                        tour_id: tour_id,
                        comment_right: { [Op.gt]: rightValue }
                    }
                }
            )
    
            await Comment.update({ 
                comment_left: Sequelize.literal(`comment_left - ${width}`)}, {
                    where: {
                        tour_id: tour_id,
                        comment_left: { [Op.gt]: rightValue }
                    }
                }
            )
    
            return res.status(200).json({
                message: "Delete comment successfully!",
                comment: await Comment.findOne({ where: { comment_id: comment_id }})
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new CommentController()