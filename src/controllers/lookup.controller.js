const lookupService = require('../services/lookup.service');

const getLookups = async (req, res, next) => {
    try {
        const { type } = req.query;
        const data = await lookupService.getLookups(req.user.id, type);
        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const createLookup = async (req, res, next) => {
    try {
        const data = await lookupService.createLookup(req.user.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Lookup created successfully',
            data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const updateLookup = async (req, res, next) => {
    try {
        const data = await lookupService.updateLookup(req.user.id, req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Lookup updated successfully',
            data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const deleteLookup = async (req, res, next) => {
    try {
        const data = await lookupService.deleteLookup(req.user.id, req.params.id);
        res.status(200).json({
            success: true,
            message: 'Lookup deleted successfully',
            data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getLookups,
    createLookup,
    updateLookup,
    deleteLookup
};