const mongoose = require("mongoose");
const Event = require("../models/eventModel");
const ROperation = require("../models/rescueOperationModel");
const Alert = require("../models/alertModel");

const fetchHistory = async (Model, req, res, modelName) => {
  try {
    const data = await Model.find({ agencyId: req.user.id });
    res.status(200).json(data.reverse());
  } catch (error) {
    console.error(`Error fetching ${modelName} history: ${error}`);
    return res.status(500).json({ message: `Error fetching ${modelName} history` });
  }
};

// Agency
const alertsHistory = async (req, res) => {
  await fetchHistory(Alert, req, res, "alerts");
};

// Agency
const eventsHistory = async (req, res) => {
  await fetchHistory(Event, req, res, "events");
};

// Agency
const rescueOperationsHistory = async (req, res) => {
  await fetchHistory(ROperation, req, res, "operations");
};

module.exports = { alertsHistory, eventsHistory, rescueOperationsHistory };
