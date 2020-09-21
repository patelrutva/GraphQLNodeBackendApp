const Vehicles = require('../mongo-models/AllVehicleMakes');
const VehicleTypes = require('../mongo-models/VehicleTypesForMakeIds');
const VehicleModels = require('../mongo-models/ModelsForMake');
const { default: Axios } = require("axios");
const xml2js = require('xml2js');

function xml2json(data){
    var details = {};
    ///--- Parse all the data from xml to json starts ---///
    xml2js.parseString(data,{ explicitArray : false }, function (err, result) {    
        if (err) return console.log(err);
        details = result.Response.Results;
    });
    return details;
    ///--- Parse all the data from xml to json ends ---///
};

////-------------- INITIALIZE FUNTION ADDING VEHICLE TYPES --------------////
const addVehicleTypes = async() => {
    ///--- FUNCTION ADD VEHICEL TYPES STARTS ---///
    const all_vehicle_makes = await Vehicles.find({},function(err, response) {  //Getting all vehicle makes to find their vehicle types//
        if (err) { console.error(error); }
        return response;
    });

    ///--- Getting all vehicle type details using vehicle make_id ---///
    all_vehicle_makes.forEach( async(vehicle_make) => { 
        const allvehicleModelsxmlurl= "https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/"+vehicle_make.Make_ID+"?format=xml";
        try{
            return await Axios.get(allvehicleModelsxmlurl, {}).then((api_response) => {
                const vehicle_typelist = [];

                const vehicle_type_json_list = xml2json(api_response.data).VehicleTypesForMakeIds;
                if(vehicle_type_json_list !== undefined) {
                    if(vehicle_type_json_list.length == undefined){ //if it is just one object
                        vehicle_typelist.push(vehicle_type_json_list);
                    }else{}

                    ///--- looping all the vehicletypes to add it ine the datastore ---///
                    for(var j in vehicle_typelist) { 
                        var vehicle_type = vehicle_typelist[j];
                       // console.log(JSON.stringify(vehicle_typelist) + "  vehicle type "+ JSON.stringify(vehicle_typelist[j])+ "  " + j);
                        vehicle_typeObject = {
                            $set: {VehicleTypeId: vehicle_type.VehicleTypeId, VehicleTypeName:vehicle_type.VehicleTypeName},
                            $push: {VehicleMake: vehicle_make._id} //reference of Vehicle Make
                        },

                        //---- If vehicle Type already exist just update the Vehicle Make Object---//
                        VehicleTypes.findOneAndUpdate({"VehicleTypeId": vehicle_type.VehicleTypeId},  vehicle_typeObject, {upsert: true}, function(err, doc) {
                            if (err) { console.log(err); }
                            console.log("Record Added/Updated for VehicleTypeId:: " + vehicle_type.VehicleTypeId);
                        });
                    }
                }else{}
            }).catch((response) => {console.log(response.message)} );
        } catch (error) { console.error(error); }
    })
    ///--- FUNCTION ADD VEHICEL TYPES ENDS ---///
};
////-------------- END OF FUNTION ADDING VEHICLE TYPES --------------////

module.exports = {
    addVehicleTypes: addVehicleTypes()
};