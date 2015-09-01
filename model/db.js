var mongoose = require('mongoose');
var dbURI = 'mongodb://art606:Polymorphysm1@ds035623.mongolab.com:35623/ionicapp';

mongoose.connect(dbURI);
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to the external database.');
});
mongoose.connection.on('error', function (err) {
    global.mongo_error = "Not Connected to the Database";
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

var branchesSchema = new mongoose.Schema({
    branchId: Number,
    branchName: String,
    description: String
});

var servicesSchema = new mongoose.Schema({
    branchId: Number,
    serviceName: String,
    peopleInQue: Number
})

var ticketsSchema = new mongoose.Schema({
    ticketId: Number,
    ticketStatus: String,
    ticketName: String
})
mongoose.model('Branches', branchesSchema, "branchesSchema");
mongoose.model('Services', servicesSchema, "servicesSchema");
mongoose.model('Tickets', ticketsSchema, "ticketsSchema");