const mongoose = require("mongoose");
const Agency = require("../models/alertModel.js");
const Event = require("../models/eventModel.js");
const ROperation = require("../models/rescueOperationModel.js");

const findAgency = async (req, res) => {
  const searchText = req.body.searchText;

  try {
    const agencies = await Agency.find({
      $or: [
        { name: { $regex: searchText, $options: "i" } }, // using $options: "i" for Case-insensitive search
        { representativeName: { $regex: searchText, $options: "i" } },
        { email: { $regex: searchText, $options: "i" } },
      ],
    }).select("_id name representativeName");

    res.status(200).json(agencies);
  } catch (error) {
    console.error(`Error finding agency: ${error}`);
    return res.status(500).json({ message: "Error finding agency" });
  }
};

const agencyDetails = async (req, res) => {
  const { agencyId } = req.body;

  try {
    const agency = await Agency.findById(agencyId);

    const rescueOperations = await ROperation.countDocuments({ agencyId });
    const eventsOrganized = await Event.countDocuments({ agencyId });

    const response = {
      agencyName: agency.name,
      agencyEmail: agency.email,
      representativeName: agency.representativeName,
      agencyAddress: agency.address,
      rescueOperations,
      eventsOrganized,
      agencyPhone: agency.phone,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(`Error fetching agency details: ${error}`);
    return res.status(500).json({ message: "Error fetching agency details" });
  }
};

module.exports = { findAgency, agencyDetails };
