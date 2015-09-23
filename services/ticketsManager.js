/**
 * Created by ArturK on 2015-09-18.
 */


var mongoose = require('mongoose');
var ticketsSchema = new mongoose.Schema({
    branchId: Number,
    serviceId: Number,
    ticketId: Number,
    ticketStatus: String,
    ticketName: String,
    ticketNumber: Number
})
var x;
//mongoose.model('Tickets', ticketsSchema, "ticketsSchema");
var ticketModel  = mongoose.model('Tickets');
var ticketsManager = {
    get : function(id, callback){
        console.log("ticketsManager get id=",id)

        ticketModel.findOne({'_id': id}, function(err, ticket){
            callback(ticket);
        })

    },

    getByOrigId : function(ticketId, callback){

        ticketModel.findOne({'ticketNumber': ticketId}, function(err, ticket){
            console.log("in findByOrigId, after questioning db: ", ticket);
            callback(ticket);
        })
    },

    store : function(ticket, callback){
        console.log("in ticketsManager, before update: ", ticket)
        if (ticket._id !== undefined){
            ticketModel.findOneAndUpdate({'_id': ticket._id}, {new: true}, ticket, function (err, ticketFromDb) {
                console.log("ticketsManager, in store(), after update: ", ticketFromDb);
                callback(ticketFromDb);
            })
        }else{
            ticketModel.create(ticket, function (err, ticketFromDb){
                console.log("ticket created", ticketFromDb)
                callback(ticketFromDb)
            });
        }
    }
}

module.exports = ticketsManager;