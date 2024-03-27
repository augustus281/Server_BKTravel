const StatusTour = {
    WAITING: 'waiting',
    ONLINE: 'online',
    DELETED: 'deleted'
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

module.exports = {
    StatusTour,
    StatusOrder,
    RoleUser,
    TypeDiscount
}