import DataTypes from "sequelize";
import sequelize from "../setup_db/db_conn.js";

const User = sequelize.define("user", {
    // User model attributes
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false // surname is required
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false // name is required
    },
    age: {
        type: DataTypes.INTEGER,
        validate: {
            isInt: {
                msg: 'Age must be an integer.',
            },
            min: {
                args: [18],
                msg: 'Age must be at least 18.',
            },
            max: {
                args: [120],
                msg: 'Age must be at most 120.',
            },
        },
    },
    sub_date: {
        type: DataTypes.INTEGER, // Subscription date in Unix time
        defaultValue: () => Math.floor(Date.now() / 1000),
        get() {
            const timestamp = this.getDataValue('sub_date');
            return timestamp ? new Date(timestamp * 1000) : null;
        }
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1
    }
},
{
    // Defining index
    indexes: [
        {
            unique: false,
            fields: ['surname']
        }
    ]
});
User.associate = function (models) {
    User.hasMany(models.reaction, {
        foreignKey: 'user_id',
        onDelete: "CASCADE",
        hooks: true
    });

    User.hasMany(models.post, {
        foreignKey: 'user_id',
        onDelete: "CASCADE",
        hooks: true
    });

    User.belongsToMany(User, {
        through: models.friendship,
        as: 'friends',
        foreignKey: 'user_id',
        otherKey: 'friend_id',
        onDelete: "CASCADE",
        hooks: true
    });

};

export default User