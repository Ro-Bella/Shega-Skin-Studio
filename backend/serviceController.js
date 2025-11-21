// backend/controllers/serviceController.js
const Service = require('../models/Service');

// ሁሉንም ልዩ የአገልግሎት አይነቶች ማምጣት
exports.getServiceTypes = async (req, res) => {
    try {
        // 'distinct'ን በመጠቀም በ'type' ፊልድ ላይ ያሉትን ልዩ τιሞች እናገኛለን
        const types = await Service.distinct('type');
        res.status(200).json(types);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ሁሉንም አገልግሎቶች ማምጣት
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// አገልግሎቶችን በአይነት ማምጣት
exports.getServicesByType = async (req, res) => {
    try {
        const services = await Service.find({ type: req.params.type });
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// አንድ አገልግሎት በ ID ማምጣት
exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ message: 'Service not found' });
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// አዲስ አገልግሎት መፍጠር
exports.createService = async (req, res) => {
    try {
        const newService = await Service.create(req.body);
        res.status(201).json(newService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// አገልግሎት ማዘመን
exports.updateService = async (req, res) => {
    try {
        const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedService) return res.status(404).json({ message: 'Service not found' });
        res.status(200).json(updatedService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// አገልግሎት መሰረዝ
exports.deleteService = async (req, res) => {
    try {
        const deletedService = await Service.findByIdAndDelete(req.params.id);
        if (!deletedService) return res.status(404).json({ message: 'Service not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};