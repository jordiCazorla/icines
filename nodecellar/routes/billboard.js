var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('billboardsdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'billboardsdb' database");
        db.collection('billboards', {safe:true}, function(err, collection) {
           if (err) {
                console.log("The 'billboards' collection doesn't exist. Creating it with sample data...");
                populateDB();
           }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving billboards: ' + id);
    db.collection('billboards', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('billboards', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addBillboard = function(req, res) {
    var billboard = req.body;
    console.log('Adding billboard: ' + JSON.stringify(billboard));
    db.collection('billboards', function(err, collection) {
        collection.insert(billboard, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateBillboard = function(req, res) {
    var id = req.params.id;
    var billboard = req.body;
    console.log('Updating billboard: ' + id);
    console.log(JSON.stringify(billboard));
    db.collection('billboards', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, billboard, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating billboard: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(billboard);
            }
        });
    });
}

exports.deleteBillboard = function(req, res) {
    var id = req.params.id;
    console.log('Deleting billboard: ' + id);
    db.collection('billboards', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

exports.newBillboard = function(req, res){
    var idPeli = req.params.idPeli;
    var idCine = req.params.idCine;
    var idTimeTable = req.idTimeTable;
    var billboard = {cine_id: idCine, peli_id: idPeli, timetable_id: idTimeTable };
    console.log('Adding billboard: ' + JSON.stringify(billboard));
    db.collection('billboards', function(err, collection) {
        collection.insert(billboard, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.findBillboardPeliCine = function(req, res){
    var idPeli = req.params.idPeli;
    var idCine = req.params.idCine;
    console.log("encara funciono");
    db.collection('billboards', function(err, collection) {
        collection.find({cine_id: idCine, peli_id: idPeli }).toArray(function(err, item) {
            if (item != null) {
                res.send(item);
            } else {
                res.send({'error': 'error'});
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    /*var billboards = [
        { cine_id: "", peli_id: "", timetable_id: "00:00h" }];

    db.collection('billboards', function(err, collection) {
        collection.insert(billboards, {safe:true}, function(err, result) {});
    });*/

};