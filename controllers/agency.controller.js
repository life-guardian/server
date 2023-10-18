const Agency = require("../models/agencyModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const agencyRegister = async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        console.log(validationErrors);
        res.status(403).json({ message: validationErrors.errors[0].msg });
        return;
    }

    try {
        let { agencyName, agencyEmail, password, agencyPhNo, address, representativeName, representativePhNo, representativeEmail, representativeDesignation } =
            req.body;

        const mobNum = Number(agencyPhNo);
        const hashedPassword = await bcrypt.hash(password, 10);

        const alreadyPresent = await User.findOne({
            $or: [{ agencyEmail }, { agencyPhNo: mobNum }],
        });

        if (alreadyPresent) {
            return res.status(400).json({
                message: "Agency already present with the mobile number or email",
            });
        }

        const agency = await Agency.create({
            agencyName: agencyName,
            agencyEmail: agencyEmail.toLowerCase(),
            password: hashedPassword,
            agencyPhNo: mobNum,
            agencyRepresentative: {
                name: representativeName,
                phoneNumber: Number(representativePhNo),
                email: representativeEmail.toLowerCase(),
                designation: representativeDesignation.toLowerCase()
            },
            address: address,
        });

        res.status(200).json({ message: "Agency created" });
    } catch (error) {
        console.error(`Error in registering agency : ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
};

const agencyLogin = async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        console.log(validationErrors);
        res.status(403).json({ message: validationErrors.errors[0].msg });
        return;
    }
    const { email, password } = req.body;

    try {
        const agency = await Agency.findOne({ email: email });
        if (!user)
            return res.status(404).json({ message: "Agency not registered" });

        const match = await bcrypt.compare(password, agency.password);

        if (match) {
            const token = jwt.sign(
                { email: agency.email, id: agency._id, isAgency: true },
                process.env.JWT_SECRET_KEY,
                {
                    expiresIn: process.env.JWT_TOKEN_EXPIRATION,
                }
            );

            const cookieExpiration = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days in milliseconds

            res.cookie("token", token, {
                httpOnly: true,
                expires: cookieExpiration,
                secure: process.env.NODE_ENV === "development" ? false : true,
            });

            return res.status(200).json({ message: "Login successful!" });
        } else {
            return res.status(400).json({ message: "Incorrect password" });
        }
    } catch (error) {
        console.error(`Error in Login : ${error}`);
        return res.status(500).json({ message: "Login failed" });
    }
};

const agencyLogout = async (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true });

        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error(`Error in Logout : ${error}`);
        return res.status(500).json({ message: "Logout failed" });
    }
};


module.exports = {
    agencyRegister,
    agencyLogin,
    agencyLogout
};
