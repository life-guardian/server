const mongoose = require("mongoose");

const rescueOperationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        hostAgency: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Agency",
            required: true,
        },

        agencyLocation: {
            latitude: {
                type: String,
                required: true
            },
            longitude: {
                type: String,
                required: true
            },
        },

        rescueTeamSize : {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const ROperation = new mongoose.model("ROperation", rescueOperationSchema);

module.exports = rescueOperation;
