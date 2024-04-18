const StatusTour = {
    WAITING: 'waiting',
    ONLINE: 'online',
    DELETED: 'deleted',
    PENDING: 'pending',
    REJECT: 'reject',
    SUCCESS: 'success'
}

const StatusOrder = {
    CANCEL: 'Hủy',
    PENDING: 'Chưa thanh toán',
    COMPLETE: 'Đã thanh toán',
    FAILED: 'Thất bại'
}

const RoleUser = {
    ADMIN: 'admin',
    GUIDER: 'guider',
    CUSTOMER: 'customer'
}

const TypeDiscount = {
    FIXED: "fixed",
    PERCENTAGE: "percentage"
}

const TypeNotification = {
    ORDER_001: "order successfully",
    ORDER_002: "order failed",
    PROMOTION_001: "new PROMOTION",
    TOUR_001: "new tour by customer like"
}

module.exports = {
    StatusTour,
    StatusOrder,
    RoleUser,
    TypeDiscount,
    TypeNotification
}