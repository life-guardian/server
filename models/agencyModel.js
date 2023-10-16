const mongoose = require("mongoose");

const agencySchema = new mongoose.Schema(
    {
        agencyName: {
            type: String,
            required: true,
        },

        agencyEmail: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        agencyPhNo: {
            type: Number,
            required: true,
            unique: true,
        },

        address: {
            type: String,
            required: true,
        },

        agencyRepresentative: {
            name: {
                type: String,
                required: true,
            },
            phoneNumber: {
                type: Number,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
            designation: {
                type: String,
                required: true
            }
        },

    },
    {
        timestamps: true,
    }
);

const User = new mongoose.model("User", agencySchema);

module.exports = User;
