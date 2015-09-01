var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var branch = mongoose.model('Branches');
var service = mongoose.model('Services');
var ticket = mongoose.model('Tickets');
var ObjectID = require('mongodb').ObjectID

router.get('/branches', function (req, res, next) {
    branch.find({}, function (err, branches) {
        if (err) {
            res.status(err.status || 400);
            res.end(JSON.stringify({error: err.toString()}));
            return;
        }
        res.header("Content-type", "application/json");
        res.end(JSON.stringify(branches));
    });
});

router.get('/branch/:branchId', function (req, res, next) {
    branch.find({'branchId': req.params.branchId}, function (err, branch) {
        if (err) {
            res.status(err.status || 400);
            res.end(JSON.stringify({error: err.toString()}));
            return;
        }
        res.header("Content-type", "application/json");
        res.end(JSON.stringify(branch));

    });
});

router.get('/branches/services/:branchId', function (req, res, next) {
    console.log(req.params.branchId);
    service.find({'branchId': req.params.branchId}, function (err, branch) {
        if (err) {
            res.status(err.status || 400);
            res.end(JSON.stringify({error: err.toString()}));
            return;
        }
        res.header("Content-type", "application/json");
        res.end(JSON.stringify(branch));

    });
});

router.get('/branches/:branchId/services/:serviceId', function (req, res, next) {

    var idBranchString = req.params.branchId;
    var idServiceString = req.params.serviceId;
    var request = req.params;
    console.log(request)
    console.log(idBranchString)
    console.log(idServiceString)
    service.find({$and: [{'branchId': idBranchString}, {'_id': idServiceString}]}, function (err, service) {
        if (err) {
            res.status(err.status || 400);
            res.end(JSON.stringify({error: err.toString()}));
            return;
        }
        console.log(service.length)
        res.header("Content-type", "application-json");
        res.end(JSON.stringify(service));
    })
});

router.post('/create/branch', function (req, res) {
    var data = req.body;
    console.log("in post");
    console.log(data)
    branch.create({
        branchId: data.branchId,
        branchName: data.branchName,
        description: data.description
    }, function (err, newBranch) {
        if (err) {
            res.status(err.status || 400);
            res.end(JSON.stringify({error: err.toString()}));
            console.log("err when inserting branch");
            return;
        }
        console.log("after post branch " + newBranch._id);
        service.create({
            branchId: data.branchId,
            serviceName: data.serviceName,
            peopleInQue: data.peopleInQue
        }, function (err, newService) {
            if (err) {
                res.status(err.status || 400);
                res.end(JSON.stringify({error: err.toString()}));
                console.log("err when inserting service");
                return;
            }
            var result = [];
            result.push(newBranch);
            result.push(newService)
            res.header("Content-type", "application/json");
            res.end(JSON.stringify(result));
        });
    });
})

router.post('/ticket/create', function(req, res){

    ticket.findOne({}, {}, { sort: { 'ticketNumber' : -1 }}, function(err, latestTicket) {
    console.log("here" + latestTicket.ticketNumber);
    var data = req.body;
    console.log(data);
    var ticketNumb = latestTicket.ticketNumber;
        ticketNumb++;
        console.log(ticketNumb + "ticket number after ++ ")
    ticket.create({ticketStatus: data.ticketStatus, ticketName: data.ticketName, ticketNumber: ticketNumb}, function(err, newTicket){
        if(err){
            res.status(err.status || 400);
            res.end(JSON.stringify({error: err.toString()}))
            return;
        }
        res.header("Content-type", "application/json");
        res.end(JSON.stringify(newTicket));
    })
    });
})

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
})

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
})

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
})

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
})
module.exports = router;
