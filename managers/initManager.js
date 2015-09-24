var serviceManager = require('./../managers/servicesManager');
var branchManager = require('./../managers/branchesManager');
var ticketsManager = require('./../managers/ticketsManager');
var branches = [
    {id: 1, name: "Warszawa", description: "Warszawa, ul: Asss, Godziny otwarcia: 8-16"},
    {id: 2, name: "Kraków", description: "Kraków, ul: Bnn, Godziny otwarcia: 8-16"},
    {id: 3, name: "Poznañ", description: "{Poznañ, ul:Cccc, Godziny otwarcia: 8-16"}
];

var services = [
    {id: 1, subServiceId: 0, name: "Us³uga 1", description: "Us³uga 1, details: Aaaaaaaaaaa", letter : "A"},
    {id: 2, subServiceId: 0, name: "Us³uga 2", description: "Us³uga 2, details: Bbbbbbbbbbb", letter : "B"},
    {id: 3, subServiceId: 0, name: "Us³uga 3", description: "Us³uga 3, details: Ccccccccccc", letter : "C"},
    {id: 4, subServiceId: 0, name: "Us³uga 4", description: "Us³uga 4, details: Ddddddddddd", letter : "D"},
    {id: 5, subServiceId: 0, name: "Us³uga 6", description: "Us³uga 6, details: Eeeeeeeeeee", letter : "E"},
    {id: 6, subServiceId: 0, name: "Us³uga 7", description: "Us³uga 7, details: Ggggggggggg", letter : "F"},
]

module.exports.loadServices = function () {
    for (var i = 0; i < services.length; i++) {
        var service = services[i];
        serviceManager.store(service, function (err, branch) {
        });
    }
}

module.exports.dropDatabase = function () {
    branchManager.clear(function (err, data) {
        console.log('branchManager clear done');
    });
    serviceManager.clear(function (err, data) {
        console.log('serviceManager clear done');
    });
    ticketsManager.clear(function (err, data) {
        console.log('serviceManager clear done');
    });
}

module.exports.initDatabase = function () {

    for (var i = 0; i < branches.length; i++) {
        var branch = branches[i];
        initBranch(branch);
    }
}
function initBranch(branch) {
    branchManager.getByOrigId(branch.id, function (err, oldStoredBranch) {
        if (oldStoredBranch == null) {
            var branchToStore = {
                origId: branch.id,
                name: branch.name,
                description: branch.description
            }
            branchManager.store(branchToStore, function (err, storedBranch) {
                console.log("stored branch id = " + storedBranch.origId);
                for (var j = 0; j < services.length; j++) {
                    var service = services[j];
                    initBranchService(storedBranch, service);
                }
            });
        }
    });
}
function initBranchService(storedBranch, service) {
    serviceManager.getByOrigId(storedBranch.origId, service.id, service.subServiceId, function (err, oldStoredService) {

        if (oldStoredService == null) {
            var serviceToStore = {
                origId: service.id,
                origSubServiceId: service.subServiceId,
                name: service.name,
                description: service.description,
                branchId: storedBranch._id,
                branchOrigId: storedBranch.origId,
                letter : service.letter
            };

            serviceManager.store(serviceToStore, function (err, storedService) {

                console.log("stored service branchId = "+storedService.branchOrigId+" id = " + storedService.origId);
            });
        }
    })
}



