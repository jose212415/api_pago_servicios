//userController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const RegistrationRequest = require('../models/registrationRequestModel')
const Invoice = require('../models/invoiceModel');
const mongoose = require('mongoose');

// Solicitud de registro de usuario
exports.registerRequestUser = async (req, res) => {
  const { firstName, lastName, email, password, address, phone } = req.body;

  try {
    const existingRequest = await RegistrationRequest.findOne({ email });
    const existingUser = await User.findOne({ email });
    if (existingUser || existingRequest) return res.status(400).json({ message: 'El usuario o la solicitud ya existe' });

    const passwordHash = await bcrypt.hash(password, 10);

    const newRequestUser = new RegistrationRequest({
      firstName,
      lastName,
      email,
      passwordHash,
      address,
      phone,
      role: "user" ,
    });

    await newRequestUser.save();

    res.status(201).json({ message: 'Solicitud de Registro Enviada Con Exito' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

// Inicio de sesión
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Credenciales incorrectas' });

    // Crear token JWT incluyendo el rol
    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Inicio de sesión exitoso', token, role: user.role, id: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
    console.log(error);
  }
};

// Búsqueda de facturas por usuario, contador y estado
exports.searchInvoice = async (req, res) => {
  const { userId, numberMeter, serviceType, status } = req.body;

  const objectIdUser = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : null;

  if (!objectIdUser) {
      return res.status(400).json({ message: 'El userId proporcionado no es válido' });
  }

  try {
    const facturas = await Invoice.find({
      userId: objectIdUser,
      numberMeter,
      serviceType,
      status,
    });

    if (facturas.length === 0) {
      return res.status(404).json({ message: 'No se encontraron facturas con los criterios proporcionados' });
    }

    res.status(200).json(facturas);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
    console.log(error);
  }
};

// Actualizar el estado de una factura
exports.updateInvoiceStatus = async (req, res) => {
  const { invoiceId } = req.body;

  try {
    // Buscar la factura por ID y actualizar el estado
    const factura = await Invoice.findByIdAndUpdate(invoiceId, { status: 'paid' }, { new: true });

    if (!factura) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }

    res.status(200).json({ message: 'Estado de la factura actualizado a "paid"', factura });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la factura', error });
  }
};

// Busqueda de facturas pagadas
exports.searchPaidInvoices = async (req, res) => {
  const { userId } = req.body;

  const objectIdUser = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : null;

  if (!objectIdUser) {
    return res.status(400).json({ message: 'El userId proporcionado no es válido' });
  }

  try {
    const facturasPagadas = await Invoice.find({
      userId: objectIdUser,
      status: 'paid',
    }).populate('userId', 'firstName lastName email address phone')
      .populate('services.serviceId', 'serviceType description baseCost'); 

    if (facturasPagadas.length === 0) {
      return res.status(404).json({ message: 'No se encontraron facturas pagadas para este usuario' });
    }

    res.status(200).json(facturasPagadas);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
    console.log(error);
  }
};
