const Vehicles = require('../mongo-models/AllVehicleMakes');
const VehicleTypes = require('../mongo-models/VehicleTypesForMakeIds');
const VehicleModels = require('../mongo-models/ModelsForMake');
const { default: Axios } = require("axios");
const xml2js = require('xml2js');

////-------------- INITIALIZE FUNTION XML2JSON --------------////
function xml2json(api_response){
    var json_response = {};
    ///--- Parse all the data from xml to json starts ---///
    xml2js.parseString(api_response,{ explicitArray : false }, function (err, converted_XML) {    
        if (err) return console.log(err);
        json_response = converted_XML.Response.Results;
    });
    return json_response;
    ///--- Parse all the data from xml to json ends ---///
};
////-------------- END OF FUNTION XML2JSON --------------////

////-------------- INITIALIZE FUNTION ADDING VEHICLE MAKES --------------////
const addVehicleMakes = async () => {
    ///--- FUNCTION ADD VEHICEL MAKES STARTS ---///
    const allvehiclexmlurl= "https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML";
    try{
        return await Axios.get(allvehiclexmlurl,{}).then(function(api_response){
            ///--- PARSE XML TO JSON---///
            const vehicle_make_json_list = xml2json(api_response.data).AllVehicleMakes;
            const vehicle_makelist = [];
            if(vehicle_make_json_list !== undefined) {
                if (vehicle_make_json_list.length == undefined){ //if it is just one object
                vehicle_makelist.push(vehicle_make_json_list);
                }else{}
            ///-- Adding to document based datastore ---///
                vehicle_make_json_list.forEach((vehicle_make) => {
                Vehicles.findOneAndUpdate({"Make_ID": vehicle_make.Make_ID},  vehicle_make, {upsert: true}, function(err, doc) {
                    if (err) { console.log(err); }
                    console.log("Record Added/Updated for Make_ID:: " + vehicle_make.Make_ID);
                });
            });
            }else{}
        });
    } catch (error) { console.error(error); }
    ///--- FUNCTION ADD VEHICEL MAKES STARTS ---///
};
////-------------- END OF FUNTION ADDING VEHICLE MAKES --------------////

module.exports = {
    addVehicleMakes: addVehicleMakes()
};