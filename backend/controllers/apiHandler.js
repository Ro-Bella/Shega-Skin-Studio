// backend/controllers/apiHandler.js

// አጠቃላይ የ getOne ተግባር
exports.getOne = Model => async (req, res) => {
    try {
        const doc = await Model.findById(req.params.id);
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(200).json(doc);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// አጠቃላይ የ getAll ተግባር
exports.getAll = Model => async (req, res) => {
    try {
        const docs = await Model.find();
        res.status(200).json(docs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// አጠቃላይ የ createOne ተግባር (አማራጭ)
exports.createOne = Model => async (req, res) => {
    try {
        const newDoc = await Model.create(req.body);
        res.status(201).json(newDoc);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// አጠቃላይ የ updateOne ተግባር
exports.updateOne = Model => async (req, res) => {
    try {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(200).json(doc);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// አጠቃላይ የ deleteOne ተግባር
exports.deleteOne = Model => async (req, res) => {
    try {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(204).json({ message: 'Document deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};