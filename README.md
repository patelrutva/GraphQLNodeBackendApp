# GraphQLNodeBackendApp
Backend Test App

● Service must parse XML : USED 'xml2js' library

● Parse and Combine all the of XML information into a single JSON object : USED 'axios' for getting data

● Produce an array of objects will the all of the information from the XML endpoints : CREATED 3 different SCHEMAS

● Service must schedule a job to get XML information on a regular basis : USED 'node-cron' library

● Service must save this into a document based datastore : USED mongoDB/mongoose to store/fetch data locally

● Service must have a single endpoint to get all the data : CREATED single endpoint '/graphql'

● Service must be Dockerized : CREATED/DEPLOYED on the dockerhub 'ID: rutvapatelrepos'

● Service must follow NodeJS best practices for project structure, and code : USED NodeJS AND Express

Nice to have: 

● Service can expose GraphQL endpoint for GQL queries : CREATED QUERIES for different array of object with FILTER

● Service can have a Cloud Foundry manifest for deployment : CREATED manifest, DEPLOYED on SAP Cloud Foundry Application Url: 'https://rutvabackendtestdemo.cfapps.us10.hana.ondemand.com/graphql'

NOTE : Cloud Foundry account is trial so not able to integrate mongodb service
