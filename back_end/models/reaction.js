import DataTypes from "sequelize";
import sequelize from "../setup_db/db_conn.js";

// Model for reactions to posts
// A user can have many reactions to different posts (1:n)
// A post can have many reactions (1:n)

const Reaction = sequelize.define("reaction", {
    // Too lazy to update the filestructure to match a more sane order of columns
    reaction_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    type: {
        type: DataTypes.ENUM,
        values: ['Comment', 'Emoticon', 'Like'],
        allowNull: false // reaction type is required
    },
    react_date: {
        type: DataTypes.INTEGER, // Subscription date in Unix time
        defaultValue: () => Math.floor(Date.now() / 1000),
        get() {
            const timestamp = this.getDataValue('sub_date');
            return timestamp ? new Date(timestamp * 1000) : null;
        }
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'posts',
            key: 'post_id'
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

Reaction.associate = function (models) {
    Reaction.belongsTo(models.user, { foreignKey: 'user_id' });
    Reaction.belongsTo(models.post, { foreignKey: 'post_id' });
};

export default Reaction;