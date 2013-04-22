var express = require('express'),
    user = require('./routes/users');
    typeFilm = require('./routes/typeFilm');
    films = require('./routes/films');
    cines = require('./routes/cines');

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
app.post('/films', films.addFilm);
app.put('/films/:id', films.updateFilm);
app.delete('/films/:id', films.deleteFilm);

app.get('/cines', cines.findAll);
app.get('/cines/:id', cines.findById);
app.post('/cines', cines.addCine);
app.put('/cines/:id', cines.updateCine);
app.delete('/cines/:id', cines.deleteCine);

app.listen(3000);
console.log('Listening on port 3000...');