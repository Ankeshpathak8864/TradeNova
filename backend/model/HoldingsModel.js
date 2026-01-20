

const { model } = require("mongoose");
const HoldingsSchema = require("../schemas/HoldingsSchema"); // now works correctly

const HoldingsModel = model("Holding", HoldingsSchema);

module.exports = HoldingsModel;
