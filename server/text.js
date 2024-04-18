width = right - left + 1

// service 
deleteComments({
    commentId, productId
}) {
    // check product

    // 1. define left & right value of comment

    // 2. calc width

    // 3. delete sub comment
    await Comment.deleteMany({
        comment_productId: productId,
        comment_left { $gte: leftValue, $lte: rightValue }
    })

    // 4. update right & left
    await Comment.updateMany({
        comment_productId: productId,
        comment_right: { $gt: rightValue }

    }, { $inc: { coment_right: -width}})

    await Comment.updateMany({
        comment_productId: productId,
        comment_left: { $gt: rightValue }

    }, { $inc: { coment_left: -width}})
}