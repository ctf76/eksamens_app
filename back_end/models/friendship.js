import DataTypes from "sequelize";
import sequelize from "../setup_db/db_conn.js";

const FriendShip = sequelize.define("friendship", {
    friendship_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id',
        },
    },
    friend_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id',
        },
    }
});

export default FriendShip;