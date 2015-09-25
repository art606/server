var express = require('express');
var router = express.Router();
var branchManager = require('./../managers/branchesManager');

router.get('/branches', function (req, res) {

    branchManager.getAll(function(err, branches){
        if (err) {
            res.status(err.status || 400);
            res.end(JSON.stringify({error: err.toString()}));
            return;
        }
        res.header("Content-type", "application/json");
        res.end(JSON.stringify(branches));
    });
});

router.get('/branches/:branchId', function (req, res) {
    branchManager.get(req.params._id, function (err, branch) {
        if (err) {
            res.status(err.status || 400);
            res.end(JSON.stringify({error: err.toString()}));
            return;
        }
        res.header("Content-type", "application/json");
        res.end(JSON.stringify(branch));
    });
});
router.get('/wsclients', function (req,res){
    var array = new Array();
    var server = require("./../handlers/WSHandler").server();
    if(server !== undefined) {
        array.push("clients length:"+ server.clients.length);
        server.clients.forEach(function (client) {
            array.push("----clientId : "+ client.clientId);
        })
    }else{
        rray.push("no server");
    }
    res.header("Content-type", "application/json");
    res.end(JSON.stringify(array));
})
module.exports = router;
