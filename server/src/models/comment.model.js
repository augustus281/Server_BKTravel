'use strict'

const { Model, DataTypes } = require("sequelize")
const sequelize = require("../database/index")

class Comment extends Model {}
Comment.init({
    comment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    comment_left: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    comment_right: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    parent_comment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Comment,
            key: "comment_id"
        }
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, { sequelize, modelName: "comment" })

Comment.hasMany(Comment, { as: 'children', foreignKey: 'parent_comment_id' });
Comment.belongsTo(Comment, { as: 'parent', foreignKey: 'parent_comment_id' });

module.exports = Comment