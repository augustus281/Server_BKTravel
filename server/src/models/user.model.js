'use strict'

const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database/index");

const Comment = require("./comment.model")
const Order = require("./order.model");
const Wishlist = require("./wishlist.model");
const Message = require("./message.model");
const GroupMember = require("./group_member.model");
const Cart = require("./cart.model");

const role_user = {
    ADMIN: 'admin',
    GUIDER: 'guider',
    CUSTOMER: 'customer'
}

class User extends Model {}

User.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        dob: {
            type: DataTypes.DATE,
            allowNull: true
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [10-12]
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        code: {
            type: DataTypes.STRING,
            allowNull: true
        },
        expired_time_code: {
            type: DataTypes.DATE,
            allowNull: true
        },
        role_user: {
            type: DataTypes.ENUM(role_user.ADMIN, role_user.GUIDER, role_user.CUSTOMER),
            allowNull: false
        },
        access_token: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        refresh_token: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, { sequelize, modelName: 'user'}
)

User.hasOne(Wishlist, { foreignKey: 'user_id'})
User.hasMany(Message, { foreignKey: "user_id" })
User.hasMany(GroupMember, { foreignKey: "user_id"})
User.hasOne(Cart, { foreignKey: "user_id"})
User.hasMany(Order, { foreignKey: 'user_id' });
User.hasMany(Comment, { foreignKey: "user_id"})

module.exports = User;