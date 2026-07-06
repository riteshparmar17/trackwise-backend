const Lookup = require('../models/lookup.model');

const DEFAULT_LOOKUP = {
    purpose: [
        'Business',
        'Meeting',
        'Training',
        'Client Visit',
        'Other'
    ],
    category: [
        'Fuel',
        'Parking',
        'Maintenance',
        'Insurance',
        'Registration',
        'Car Wash',
        'Toll',
        'Supplies',
        'Meals',
        'Accommodation',
        'Other'
    ],

    vendor: [
        'Shell',
        'Petro Canada',
        'Costco',
        'Esso'
    ]
};

const seedDefaults = async (userId, type) => {
    const existing = await Lookup.countDocuments({
        user: userId,
        type
    });

    if (existing > 0) {
        return;
    }

    const defaults = DEFAULT_LOOKUP[type] || [];

    if (!defaults.length) {
        return;
    }

    const documents = defaults.map((name) => ({
        user: userId,
        type,
        name
    }));

    await Lookup.insertMany(documents);
};

const getLookups = async (userId, type) => {
    await seedDefaults(userId, type);
    return Lookup.find({
        user: userId,
        type
    }).sort({ name: 1 });
};

const createLookup = async (userId, data) => {
    const { type } = data;
    const name = data.name?.trim();

    if (!type) {
        throw new Error('Type is required');
    }

    if (!name) {
        throw new Error('Name is required');
    }

    const existing = await Lookup.findOne({
        user: userId,
        type,
        name: {
            $regex: new RegExp(`^${name}$`, 'i')
        }
    });

    if (existing) {
        throw new Error('Value already exists');
    }

    return Lookup.create({
        user: userId,
        type,
        name
    });
};

const updateLookup = async (userId, lookupId, data) => {
    const name = data.name?.trim();

    if (!name) {
        throw new Error('Name is required');
    }

    const lookup = await Lookup.findOne({
        _id: lookupId,
        user: userId
    });

    if (!lookup) {
        throw new Error('Lookup not found');
    }

    const duplicate = await Lookup.findOne({
        user: userId,
        type: lookup.type,
        _id: { $ne: lookupId },
        name: {
            $regex: new RegExp(`^${name}$`, 'i')
        }
    });

    if (duplicate) {
        throw new Error('Value already exists');
    }

    lookup.name = name;
    return lookup.save();
};

const deleteLookup = async (userId, lookupId) => {
    const lookup = await Lookup.findOne({
        _id: lookupId,
        user: userId
    });

    if (!lookup) {
        throw new Error('Lookup not found');
    }

    await lookup.deleteOne();
};

module.exports = {
    getLookups,
    createLookup,
    updateLookup,
    deleteLookup
};