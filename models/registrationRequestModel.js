const mongoose = require("mongoose");

const registrationRequestSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String},
    passwordHash: { type: String, required: true },
    status: { type: String, default: 'pending' }, // pending, resolved
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { collection: 'RegistrationRequests' });

module.exports = mongoose.model("RegistrationRequest", registrationRequestSchema);