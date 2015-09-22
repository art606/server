var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var branch = mongoose.model('Branches');
var service = mongoose.model('Services');
var ticket = mongoose.model('Tickets');data =

router.post('/ticket/create', function(req, res){
    var data = req.body;
    var idBranch = data.branchId;
    var idService = data.serviceId;
    console.log('here1')
    ticket.findOne({}, {}, {sort: { 'ticketNumber': -1 }}, function(err, latestTicket) {
        console.log(latestTicket)
        var ticketNumb = latestTicket.ticketNumber;
        ticketNumb++;
        console.log('here2')
        ticket.create({ 'branchId': idBranch, 'serviceId': idService,
            'ticketStatus': "WAITING", 'ticketName': "A", 'ticketNumber': ticketNumb}, function(err, newTicket){
            if(err){
                res.status(err.status || 400);
                res.end(JSON.stringify({error: err.toString()}))
                return;
            }
            console.log(newTicket)
            res.header("Content-type", "application/json");
            res.end(JSON.stringify(newTicket));
        })
    });
});

router.get('/tickets', function(req, res){
    ticket.find({}, function(err, tickets){
        if(err){
            res.status(err.status || 400);
            res.end(JSON.stringify({error: err.toString()}));
            return;
        }
        res.header("Content-type", "application/json");
        res.end(JSON.stringify(tickets));
    })
});

router.get('/ticket/:_id', function(req, res){
    var id = req.params._id;
    ticket.findOne({'_id': id}, function(err, ticket){
        if(err){
            res.status(err.status || 400);
            res.end(JSON.stringify({error: err.toString()}))
            return;
        }
        res.header("Content-type", "application/json");
        res.end(JSON.stringify(ticket));
    })
});

router.delete('/ticket/delete/:_id', function(req, res){
    var id = req.params._id;
    console.log(id)
    ticket.remove({'_id': id},function(err, ticket){
        if(err){
            res.status(err.status || 400);
            res.end(JSON.stringify({error: err.toString()}))
            return;
        }
        res.header("Content-type", "application/json");
        res.end(JSON.stringify(ticket));
    })
});

router.put('/ticket/status/:_id', function(req, res){
    var data = req.body; //{"ticketStatus": 'Handling'};
    var ticketToUpdate = req.params._id;
    ticket.findOneAndUpdate({'_id': ticketToUpdate}, data , function(err, result){
        if (err) {
            res.status(err.status || 400);
            res.end(JSON.stringify({error: err.toString()}));
            return;
        }
        console.log(result.ticketStatus)
        res.header("Content-type", "application/json");
        res.end(JSON.stringify(result));
    })
});
module.exports = router;