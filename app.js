const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const app = express()  
const cron = require("node-cron");

mongoose.connect('mongodb://localhost:27017/vehicledb',{
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex:true
  })
  .then(() => console.log('Successfully connect to MongoDB.'))
  .catch((err) => console.log("Connection error", err))

  app.set('port', process.env.PORT || 8080);

  // schedule tasks to be run on the server
  cron.schedule("1 * * * *",   function() {
    console.log("running a Vehicl_MAKE every first minute in hour");

    ///--- Add All Vehicle Makes function starts ---///
    const storeVehicleMakeData = require('./schema/storeVehicleMakeData');
    ///--- Add All Vehicle Makes function ends ---///
  });

  cron.schedule("5 * * * *",   function() {
    console.log("running a Vehicl_TYPE every 5th minute in hour");
    ///--- Add All Vehicle Types function starts ---///
    const storeVehicleMakeData = require('./schema/storeVehicleTypeData');
    ///--- Add All Vehicle Types function ends ---///
  });

  cron.schedule("10 * * * *",   function() {
    console.log("running a Vehicl_MODEL every 10th minute in hour");
    ///--- Add All Vehicle Models function starts ---///
    const storeVehicleMakeData = require('./schema/storeVehicleModelData');
    ///--- Add All Vehicle Models function ends ---///
  });

  app
  .use('/graphql', graphqlHTTP({schema: schema, graphiql: true}))
  .listen(app.get('port'), function (err) {
    console.log('GraphQL Server is now running on localhost:8080');
  });