// serviceModel.js
const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    serviceType: { type: String, required: true }, 
    descripcion: { type: String, required: true },
    baseCost: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
}, { collection: 'Services' });

module.exports = mongoose.model("Services", serviceSchema);