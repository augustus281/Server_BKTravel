'use strict'

const { TypeNotification } = require("../common/status");
const Notification = require("../models/notification.model");

const pushNotiToSystem = async ({
    type = TypeNotification.TOUR_001,
    receivedId = 1,
    senderId = 1,
    options = '{}'
}) => {
    let noti_cotent

    if (type === TypeNotification.TOUR_001) {
        noti_cotent = "@@@ Just added a tour: @@@";
    } else if (type === TypeNotification.PROMOTION_001) {
        noti_cotent = "@@@ Just added a voucher: @@@";
    }

    const newNoti = await Notification.create({
        content: noti_cotent,
        noti_type: type,
        receiver_id: receivedId,
        sender_id: senderId,
        options: "{}"
    })

    return newNoti
}

module.exports = {
    pushNotiToSystem
}