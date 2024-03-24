const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const UserModel = sequelize.define("users", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },

        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },

        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        is_verified: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    }, {
        timestamps: true,
        createdAt: 'account_created',
        updatedAt: 'account_updated',
        indexes:[
            {
                unique: true,
                fields:['username']
            }
        ]
    });

    return UserModel;
}