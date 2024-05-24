const mongoose = require('mongoose');
const itemSchema = require('../schema/item');

const ItemModel = mongoose.model('Items',itemSchema);

module.exports = ItemModel;