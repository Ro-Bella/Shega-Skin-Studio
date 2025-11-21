// backend/controllers/serviceController.js
const Service = require('../models/Service');
const {
    getAll,
    getOne,
    createOne,
    updateOne,
    deleteOne
} = require('./apiHandler');

// ሁሉንም አገልግሎቶች ማምጣት
exports.getAllServices = getAll(Service);

// አገልግሎቶችን በአይነት ማምጣት
const getServicesByType = async (req, res) => {
    try {
        const services = await Service.find({ type: req.params.type });
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getServicesByType = getServicesByType;

// አንድ አገልግሎት በ ID ማምጣት
exports.getServiceById = getOne(Service);

// አዲስ አገልግሎት መፍጠር
exports.createService = createOne(Service);

// አገልግሎት ማዘመን
exports.updateService = updateOne(Service);

// አገልግሎት መሰረዝ
exports.deleteService = deleteOne(Service);
