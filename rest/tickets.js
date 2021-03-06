var express = require('express');
var router = express.Router();
var ticketsManager = require("./../managers/ticketsManager")
var servicesManager = require("./../managers/servicesManager")
var TicketsHandler = require("./../handlers/ticketsHandler")

router.post('/branches/:branchId/services/:serviceId/printTicket', function(req, res){

    servicesManager.get(req.params.serviceId, function (err, service){
        if(err){
            res.status(err.status || 400);
            res.end(JSON.stringify({error: err.toString()}))

            return;
        }
        var params = req.body;
        TicketsHandler.printTicket(service, params, function (err, ticket){
            if(err){
                res.status(err.status || 400);
                res.end(JSON.stringify({error: err.toString()}))
                return;
            }
            console.log("PrintTicket return", ticket)
            res.header("Content-type", "application/json");
            res.end(JSON.stringify(ticket));
        })
    });
});
router.get('/branches/:branchId/services/:serviceId/tickets', function(req, res){
    ticketsManager.getAll(req.params.serviceId, function(err, tickets){
        if(err){
            res.status(err.status || 400);
            res.end(JSON.stringify({error: err.toString()}))
            return;
        }
        res.header("Content-type", "application/json");
        res.end(JSON.stringify(tickets));
    })
});
router.get('/branches/:branchId/services/:serviceId/tickets/:ticketId', function(req, res){
    ticketsManager.get(req.params.ticketId, function(err, ticket){
        if(err){
            res.status(err.status || 400);
            res.end(JSON.stringify({error: err.toString()}))
            return;
        }
        res.header("Content-type", "application/json");
        res.end(JSON.stringify(ticket));
    })
});
module.exports = router;