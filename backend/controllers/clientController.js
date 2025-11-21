// backend/controllers/clientController.js
const Client = require('../models/Client');
const { getAll } = require('./apiHandler');

// ደንበኛን በኢሜል መፈለግ
exports.findClientByEmail = async (req, res) => {
    try {
        const client = await Client.findOne({ email: req.params.email });
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// አዲስ ደንበኛ መፍጠር
exports.createClient = async (req, res) => {
    try {
        const newClient = await Client.create(req.body);
        res.status(201).json(newClient);
    } catch (error) {
        // የኢሜል ልዩነት ጥሰት (duplicate email) ከሆነ
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Client with this email already exists.' });
        }
        res.status(400).json({ message: error.message });
    }
};

// ሌሎች የደንበኛ ተግባራት (አማራጭ)
exports.getAllClients = getAll(Client);
