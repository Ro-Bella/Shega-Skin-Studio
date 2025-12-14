// backend/controllers/serviceController.js
const Service = require('../models/Service');

// @desc    ሁሉንም አገልግሎቶች ለማምጣት
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({});
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'ሰርቨር ላይ ስህተት ተፈጥሯል', error: error.message });
  }
};

// @desc    አዲስ አገልግሎት ለመፍጠር
// @route   POST /api/services
// @access  Private/Admin (ለወደፊት ጥበቃ ያስፈልገዋል)
exports.createService = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'የአገልግሎቱ ስም መሞላት አለበት።' });
    }

    try {
        const serviceExists = await Service.findOne({ name });

        if (serviceExists) {
            return res.status(400).json({ message: 'ይህ አገልግሎት አስቀድሞ ተመዝግቧል።' });
        }

        const service = await Service.create({ name });

        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ message: 'ሰርቨር ላይ ስህተት ተፈጥሯል', error: error.message });
    }
};

// @desc    አገልግሎትን ለማጥፋት
// @route   DELETE /api/services/:id
// @access  Private/Admin (ለወደፊት ጥበቃ ያስፈልገዋል)
exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ message: 'አገልግሎቱ አልተገኘም' });
        }

        await service.deleteOne();
        res.json({ message: 'አገልግሎቱ በተሳካ ሁኔታ ተሰርዟል' });
    } catch (error) {
        res.status(500).json({ message: 'ሰርቨር ላይ ስህተት ተፈጥሯል', error: error.message });
    }
};
