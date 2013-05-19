var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('userdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'userdb' database");
        db.collection('users', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'users' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving user: ' + id);
    db.collection('users', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findByName = function(req, res){
    var name = req.params.name;
    var password = req.params.password;
    db.collection('users', function(err, collection) {
        collection.findOne({'name': name}, function(err, item) {
            if(item != null){
                if (item.password == password){
                    res.send({"result": "ok", "name": item.name, "email": item.email, "rol": item.rol, "_id": item._id});
                }
                else{
                    res.send({"result": "ko"});
                }
            }else{
                res.send({"result": "ko"});
            }

        });
    });
}

exports.existUserByName = function(req, res){
    var name = req.params.name;
    db.collection('users', function(err, collection) {
        collection.findOne({'name': name}, function(err, item) {
            if(item != null){
                res.send({"result": "ok"});
            }else{
                res.send({"result": "ko"});
            }
        });
    });
}

exports.findAll = function(req, res) {
    db.collection('users', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addUser = function(req, res) {
    var user = req.body;
    console.log('Adding user: ' + JSON.stringify(user));
    db.collection('users', function(err, collection) {
        collection.insert(user, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateUser = function(req, res) {
    var id = req.params.id;
    var user = req.body;
    console.log('Updating user: ' + id);
    console.log(JSON.stringify(user));
    db.collection('users', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, user, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating user: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(user);
            }
        });
    });
}

exports.deleteUser = function(req, res) {
    var id = req.params.id;
    console.log('Deleting user: ' + id);
    db.collection('users', function(err, collection) {
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

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var users = [
        {
            name: "admin",
            password: "admin",
            email: "admin@admin.com",
            rol: 1
        },
        {
            name: "ivan",
            password: "ivan",
            email: "u1902293@campus.udg.edu",
            rol: 2
        },
        {
            name: "jordi",
            password: "jordi",
            email: "u1901962@campus.udg.edu",
            rol: 2
        }];

    db.collection('users', function(err, collection) {
        collection.insert(users, {safe:true}, function(err, result) {});
    });

};