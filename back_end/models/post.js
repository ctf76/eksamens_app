import DataTypes from "sequelize";
import sequelize from "../setup_db/db_conn.js";

const Post = sequelize.define("post", {
    // User model attributes
    post_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    post_type: {
        type: DataTypes.ENUM,
        values: ['Gif', 'Image', 'Status_Change', 'Text', 'Video'],
        allowNull: false // reaction type is required
    },
    post_date: {
        type: DataTypes.INTEGER, // Subscription date in Unix time
        allowNull: false, // required
        get() {
            const timestamp = this.getDataValue('post_date');
            return timestamp ? new Date(timestamp * 1000) : null;
        },
        set(value) {
            if (value != null) {
                this.setDataValue('post_date', value);
            } else if (value == null) {
                this.setDataValue('post_date', Math.floor(new Date().getTime() / 1000));
            }
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', 
            key: 'user_id'
        }
    }
});
Post.associate = function (models) {
    Post.belongsTo(models.user, { foreignKey: 'user_id' });
};


export default Post;