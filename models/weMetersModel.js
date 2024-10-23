// wemetersModel.js
const mongoose = require("mongoose");

const weMeterSchema = new mongoose.Schema({
    meterType: { type: String, required: true }, // "electricity" o "water"
    meterNumber: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Referencia al usuario
    createdAt: { type: Date, default: Date.now },
}, { collection: 'WEMeters' });

module.exports = mongoose.model("WEMeters", weMeterSchema);