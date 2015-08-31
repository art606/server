function getBranchServices (branchId, serviceId) {
    for (var i = 0; i < service.length; i++) {
        if (service[i].branchId === parseInt(branchId)) {
            var arr = service[i].services;
            console.log(arr);
            for (var j = 0; j < arr.length; j++) {
                if (arr[j].id === parseInt(serviceId)) {
                    return arr[j];
                }
            }
        }
    }
    return null;
}
