const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const EmailModel = sequelize.define("emails", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },

        token: {
            type: DataTypes.STRING,
            allowNull: false
        },

        link: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        to: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },

        expiry_date: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        timestamps: true,
        createdAt: 'email_created',
        updatedAt: 'email_updated',
        indexes:[
            {
                unique: false,
                fields:['token']
            }
        ]
    });

    return EmailModel;
}