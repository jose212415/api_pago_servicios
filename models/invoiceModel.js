// invoiceModel.js
const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Referencia al usuario
    services: [{ 
        serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Services", required: true } 
    }], // Lista de servicios
    meterId: { type: mongoose.Schema.Types.ObjectId, ref: "WEMeters", required: true }, // Referencia al contador
    numberMeter: { type: String, required: true },
    serviceType: { type: String, required: true },
    totalAmount: { type: Number, required: true }, // Monto total de la factura
    status: { type: String, default: 'pending', required: true }, // Estado de la factura
    dueDate: { type: Date }, // Fecha límite de pago (opcional)
    createdAt: { type: Date, default: Date.now }, // Fecha de creación
    updatedAt: { type: Date, default: Date.now }, // Fecha de actualización
}, { collection: 'Invoices' });

module.exports = mongoose.model("Invoices", invoiceSchema);