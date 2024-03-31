'use strict'

const { NotFoundError } = require("../core/error.response");
const Comment = require("../models/comment.model")

const createComment = async ({ tour_id, user_id, content, parent_comment_id }) => {
    const comment = await Comment.create({
        tour_id, content, user_id, parent_comment_id
    });

    let rightValue;
    if (parent_comment_id) {
        // reply comment
        const parent_comment = await Comment.findOne({ where: { comment_id: parent_comment_id }});
        if (!parent_comment) throw new NotFoundError("Not found parent_commeent");

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
    return comment;
}

module.exports = {
    createComment
}