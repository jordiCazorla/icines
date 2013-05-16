var express = require('express'),
    user = require('./routes/users');
    typeFilm = require('./routes/typeFilm');
    films = require('./routes/films');
    cines = require('./routes/cines');
    votes = require('./routes/votes');
    timetable = require('./routes/timetable');
    billboard = require('./routes/billboard');

var app = express();

app.configure(function () {
    app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.use(express.static(__dirname+'/public'));
});

app.get('/users', user.findAll);
app.get('/users/:id', user.findById);
app.post('/users', user.addUser);
app.put('/users/:id', user.updateUser);
app.delete('/users/:id', user.deleteUser);
app.get('/users/:name/:password', user.findByName);
app.get('/exist/:name', user.existUserByName);

app.get('/typefilm', typeFilm.findAll);
app.get('/typefilm/:id', typeFilm.findById);
app.post('/typefilm', typeFilm.addTypeFilm);
app.put('/typefilm/:id', typeFilm.updateTypeFilm);
app.delete('/typefilm/:id', typeFilm.deleteTypeFilm);

app.get('/films', films.findAll);
app.get('/films/:id', films.findById);
app.get('/filmByType/:idType', films.findByIdType);
app.post('/films', films.addFilm);
app.put('/films/:id', films.updateFilm);
app.delete('/films/:id', films.deleteFilm);

app.get('/cines', cines.findAll);
app.get('/cines/:id', cines.findById);
app.post('/cines', cines.addCine);
app.put('/cines/:id', cines.updateCine);
app.delete('/cines/:id', cines.deleteCine);

app.get('/votes', votes.findAll);
app.get('/votes/:id', votes.findById);
app.post('/votes', votes.addVote);
app.put('/votes/:id', votes.updateVote);
app.delete('/votes/:id', votes.deleteVote);
app.get('/votesByElemUser/:element_id/:user_id', votes.findByElementAndUser);

app.get('/timetable', timetable.findAll);
app.get('/timetable/:id', timetable.findById);
app.post('/timetable', timetable.addTimetable);
app.put('/timetable/:id', timetable.updateTimetable);
app.delete('/timetable/:id', timetable.deleteTimetable);

app.get('/billboard', billboard.findAll);
app.get('/billboard/:id', billboard.findById);
app.post('/billboard', billboard.addBillboard);
app.put('/billboard/:id', billboard.updateBillboard);
app.delete('/billboard/:id', billboard.deleteBillboard);
//app.delete('/deleteBillboards/:idPeli/:idCine', billboard.deleteBillboardsPeliCine);
app.get('/findAllBillboard/:idCine/:idPeli', billboard.findBillboardPeliCine);
app.get('/findAllPeliFromCine/:idCine', billboard.findAllPeliFromCine);


app.listen(3000);
console.log('Listening on port 3000...');