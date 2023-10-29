const mongoose = require("mongoose");
const Agency = require("../models/agencyModel.js");
const Event = require("../models/eventModel.js");
const ROperation = require("../models/rescueOperationModel.js");

const findAgency = async (req, res) => {
  let query = {};
  const searchText = req.query.searchText.trim() || "";
  if (searchText) {
    query = {
      $or: [
        { name: { $regex: searchText, $options: "i" } },
        { representativeName: { $regex: searchText, $options: "i" } },
        { email: { $regex: searchText, $options: "i" } },
      ],
    };
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;
  const skip = (page - 1) * limit;

  try {
    const count = await Agency.countDocuments(query);
    const totalPages = Math.ceil(count / limit);

    const agencies = await Agency.find(query)
      .select("_id name representativeName")
      .skip(skip)
      .limit(limit);

    res.status(200).json({ totalPages, currentPage: page, agencies });
  } catch (error) {
    console.error(`Error finding agency: ${error}`);
    return res.status(500).json({ message: "Error finding agency" });
  }
};

const agencyDetails = async (req, res) => {
  const { agencyId } = req.params;

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
