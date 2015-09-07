var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var branch = mongoose.model('Branches');
var service = mongoose.model('Services');
var ticket = mongoose.model('Tickets');

router.get('/branch/services/:branchId', function (req, res, next) {
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

router.get('/branch/:branchId/service/:serviceId', function (req, res, next) {

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

module.exports = router;