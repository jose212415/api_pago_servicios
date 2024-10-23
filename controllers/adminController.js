//adminController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const RegistrationRequest = require('../models/registrationRequestModel');
const WEMeter = require('../models/weMetersModel');
const Invoice = require('../models/invoiceModel');
const Service = require('../models/serviceModel');

// Registrar Factura
exports.registerInvoice = async (req, res) => {
    const { userId, serviceIds, meterId, meterNumber, service, totalAmount } = req.body;
    console.log(req.body);

    try {
        // Verificar que el usuario existe
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        // Verificar que el contador (meter) existe y pertenece al usuario
        const meter = await WEMeter.findOne({ _id: meterId, userId: userId });
        if (!meter) return res.status(404).json({ message: 'Contador no encontrado o no asociado al usuario' });

        // Preparar los servicios como objetos embebidos
        const validServices = serviceIds.map(serviceId => ({ serviceId }));

        // Crear nueva factura
        const newInvoice = new Invoice({
            userId,
            services: validServices,   
            meterId,
            numberMeter: meterNumber,
            serviceType: service,
            totalAmount,               
            status: "pending",         
            dueDate: new Date()        
        });

        // Guardar la factura
        const savedInvoice = await newInvoice.save();

        res.status(201).json({ message: 'Factura registrada con éxito', invoice: savedInvoice });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
        console.log(error);
    }
};


// Obtener todas las solicitudes pendientes
exports.getPendingRequests = async (req, res) => {
    try {
        const pendingRequests = await RegistrationRequest.find({ status: 'pending' });
        res.status(200).json(pendingRequests);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};

// Obtener todos los servicios
exports.getServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};

// Obtener todas las facturas con sus relaciones (usuario, servicios y contador)
exports.getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate('userId', 'firstName lastName') 
            .populate('services.serviceId', 'serviceType')  
            .populate('meterId', 'meterNumber')
            .exec();

        res.status(200).json(invoices);
    } catch (error) {
        console.error('Error al obtener las facturas:', error);
        res.status(500).json({ message: 'Error al obtener las facturas', error });
    }
};

exports.getListMeters = async (req, res) => {
    try {
        const meters = await WEMeter.find().populate('userId', 'firstName lastName email').exec();
        res.status(200).json(meters);
    } catch (error) {
        console.error('Error al obtener los contadores:', error);
        res.status(500).json({ message: 'Error al obtener los contadores', error });
    } 
};

// Obtener todos los usuarios con sus contadores
exports.getListUsers = async (req, res) => {
    try {

        const listUsers = await User.find({ role: 'user' });

        const usersWithMeters = await Promise.all(listUsers.map(async (user) => {
            const meters = await WEMeter.find({ userId: user._id });
            return {
                ...user._doc,
                meters: meters,
            };
        }));

        res.status(200).json(usersWithMeters);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};

// Resolver Solicitud de Registro
exports.resolveRequest = async (req, res) => {
    const { requestId, meters } = req.body; 

    try {
        // Buscar la solicitud
        const request = await RegistrationRequest.findById(requestId);
        if (!request) return res.status(404).json({ message: 'Solicitud no encontrada' });

        // Verificar si el estado actual es 'pending'
        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'La solicitud no está en estado pendiente' });
        }

        // Asignar los contadores
        request.assignedMeters = meters;
        await request.save();

        // Crear el usuario en la colección "Users"
        const newUser = new User({
            firstName: request.firstName,
            lastName: request.lastName,
            email: request.email,
            passwordHash: request.passwordHash,
            address: request.address,
            phone: request.phone,
            role: request.role,
        });

        // Guardar el nuevo usuario
        const savedUser = await newUser.save();

        // Registrar los contadores asociados al usuario en la coleccion "WEMeters"
        const meterPromises = meters.map((meter) => {
            return new WEMeter({
                meterType: meter.type, 
                meterNumber: meter.number,
                userId: savedUser._id, 
            }).save();
        });

        await Promise.all(meterPromises);

        res.status(200).json({ message: 'Solicitud resuelta, usuario y contadores creados correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};


// Registro Aministrador
exports.registerAdmin = async (req, res) => {
    const { firstName, lastName, email, password, address, phone } = req.body;
    
    try {
      // Verificar si el administrador ya existe
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) return res.status(400).json({ message: 'El administrador ya existe' });
        
      // Hashear la contraseña
        const passwordHash = await bcrypt.hash(password, 10);
        
      // Crear nuevo administrador
        const newAdmin = new User({
            firstName,
            lastName,
            email,
            passwordHash,
            address,
            phone,
            role: "admin" 
        });

        await newAdmin.save();
        
      // Crear token JWT
        const token = jwt.sign({ userId: newAdmin._id, role: newAdmin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'Administrador registrado con éxito', token });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};
