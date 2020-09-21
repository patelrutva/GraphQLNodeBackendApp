const mongo = require('mongoose');
const Schema = mongo.Schema;

const VehicleTypechema = new Schema({
    VehicleTypeId: {
        type     : Number,
        required : true,
        unique   : true
    },
    VehicleTypeName: {
        type     : String,
        required : true,
        unique   : true
    },
    VehicleMake: [{ type: Schema.Types.ObjectId, ref: 'VehicleMake' }]
});

module.exports = mongo.model('VehicleType', VehicleTypechema);