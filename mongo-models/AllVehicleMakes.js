const mongo = require('mongoose');
const Schema = mongo.Schema;

const VehicleMakeSchema = new Schema({
    Make_ID: {
        type     : Number,
        required : true,
        unique   : true
    },
    Make_Name: {
        type     : String,
        required : true,
        unique   : true
    }
});

module.exports = mongo.model('VehicleMake', VehicleMakeSchema);
