function backoffice_main(){
    //TODO: comprovar si ha de ser un remove o un hide, depen de si canviem l'slideshow.
    amagar();


    //Mirem quin tipus d'usuari estem. Si som admins o cinema
    var item;
    if (globalUser.rol == 1){
        item= '<div class="backoffice_admin_main" id="backoffice_admin_main">'+
            "<h2>Menú backoffice rol d'admin</h2>" +
            '<ul><li><a onclick="javascript:gestioPelicules()"> Gestió de pel·lícules </a></li>'+
            '<li><a onclick="javascript:gestioCinemes()"> Gestió de cinemes </a></li>' +
            '<li><a onclick="javascript:gestioPeliculaCinema()"> Gestió de pel·lícules a cinema </a></li>' +
            '<li><a onclick="javascript:gestioSlideshow()">' + " Gestió de l'slideshow </a></li>" +
            '</ul>' +
            '<input class="button-login" type="button" value="Pàgina principal" onclick="javascript:veureHome()" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '</div>';
        $('#main').append(item);
    }
}

function gestioSlideshow(){
    amagar();
    var item;
    item= '<div class="backoffice_admin_slideshow" id="backoffice_admin_slideshow">'+
        "<h2>Gestió de l'slideshow</h2>" +
        '<ul><li><a onclick="javascript:llistatSlideshow()">' + " Llistat de l'slideshow </a></li>" +
        '<li><a onclick="javascript:crearMenuSlideshow()"> Crear slideshow </a></li>' +
        '</ul>' +
        '<input class="button-login" type="button" value="Torna enrere" onclick="javascript:backoffice_main()" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
        '</div>';
    $('#main').append(item);
}

function llistatSlideshow(){
    amagar();

    $.getJSON( 'slideimages', function(data) {
        var slideshows = data;
        var item;
        item = '<div class="backoffice_admin_list_slideshow" id="backoffice_admin_list_slideshow">'+
            "<h2>Llistat de l'slideshow</h2>";
        if(data.length == 0){
            item = item + '<div>No tenim cap imatge</div>';
        }
        for(var i=0; i < data.length; i++){
            item = item +
                '<a onclick="javascript:detallSlideshow(' +
                "'" + data[i]._id + "'" + ')"><img src="' + data[i].url + '" width="300px" height="150px" style="float:left;"></a>';
        }
        item = item +
            '<input class="button-login" type="button" value="Torna enrere" onclick="javascript:gestioSlideshow()" style="float: left; clear: both;  margin-top: 10px; margin-left: 50px;"/>' +
            '</div>';
        $('#main').append(item);
    });

}

function crearMenuSlideshow(){
    amagar();

    var item;
    item= '<div class="backoffice_admin_new_slideshow" id="backoffice_admin_new_slideshow">' +
        "<h2>Creació de la imatge</h2>" +
        '<div class="new" id="new-form">' +
        '<div id="register-data" style=" margin-top: 30px;">' +
        '<label class="form-field FBLabel">Url de la imatge:</label>' +
        '<br/>' +
        '<input id="new_url" class="form-field FBInput" />' +
        '<br/>' +
        '<input class="button-login form-field" type="button" value="Nova imatge" onclick="javascript:crearSlideshow()" style="float: left;   margin-top: 10px; "/>' +
        '<input class="button-login form-field" type="button" value="Cancelar" onclick="javascript:llistatSlideshow()" style="float: left; margin: 10px 0px 0px 10px"/>' +
        '</div>' +
        '</div>'+
        '</div> ';
    $('#main').append(item);
}

function crearSlideshow(){
    var data = {
        url: $('#new_url').val()
    };

    $.post("slideimages",
        data,
        function(data){
            llistatSlideshow();
        },"json");
}

function detallSlideshow(idSlideshow){
    amagar();
    $.getJSON( 'slideimages/' + idSlideshow, function(data) {
        var slideshows = data;
        var item;
        item = '<div class="backoffice_admin_slideshow_element" id="backoffice_admin_slideshow_element">'+
            "<h2>Imatge</h2>" +
            '<img src="' + data.url + '" width="300px" height="150px" style="float:left;" >' +
            '<input class="button-login" type="button" value="Torna enrere" onclick="javascript:llistatSlideshow()" style="float: left; clear: both;  margin-top: 10px; margin-left: 50px;"/>' +
            '<input class="button-login" type="button" value="Eliminar" onclick="javascript:eliminaSlideshow('+ "'" + idSlideshow +"'" +')" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '</div>';
        $('#main').append(item);
    });
}

function eliminaSlideshow(idSlideshow){
    $.ajax({url: "/slideimages/" + idSlideshow,
        type: 'DELETE',
        success: function(result){
            llistatSlideshow();
        }});
}

function gestioPelicules(){
    $('#backoffice_admin_main').remove();
    $('#backoffice_admin_list_pelis').remove();
    var item;
    item= '<div class="backoffice_admin_pelis" id="backoffice_admin_pelis">'+
        "<h2>Gestió de pel·lícules</h2>" +
        '<ul><li><a onclick="javascript:llistatPelicules()"> Llistat de pel·lícules </a></li>' +
        '<li><a onclick="javascript:crearPelicules()"> Crear pel·lícula </a></li>' +
        '</ul>' +
        '<input class="button-login" type="button" value="Torna enrere" onclick="javascript:backoffice_main()" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
        '</div>';
    $('#main').append(item);
}

function llistatPelicules(){
    amagar();

    $.getJSON( 'films', function(data) {
        var films = data;
        var item;
        item = '<div class="backoffice_admin_list_pelis" id="backoffice_admin_list_pelis">'+
            "<h2>Llistat de pel·lícules</h2>" +
            '<table class="film-list">' +
            '<tr><th>Titol</th><th>Titol original</th></tr>';
        for(var i=0; i < data.length; i++){
            item = item + '<tr><th>' +
                '<a onclick="javascript:detallPelicula(' +
                "'" + data[i]._id + "'" + ')">' + data[i].title + '</a></th>' +
                '<th>' + data[i].original_title + '</th></tr>';
        }
        item = item + '</table>' +
            '<input class="button-login" type="button" value="Torna enrere" onclick="javascript:gestioPelicules()" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '</div>';
        $('#main').append(item);
    });

}

function crearPelicules(){
    amagar();
    $.getJSON( 'typefilm', function(data) {

        var item;

        item= '<div class="backoffice_admin_new_peli" id="backoffice_admin_new_peli">' +
            "<h2>Creació d'una pel·lícula</h2>" +
            '<div class="new" id="new-form">' +
            '<div id="register-data" style=" margin-top: 30px;">' +
            '<label class="form-field FBLabel">Títol:</label>' +
            '<br/>' +
            '<input id="new-title" class="form-field FBInput" />' +
            '<br/>' +
            '<label class="form-field FBLabel">Titol original:</label>' +
            '<br/>' +
            '<input id="new-original-title" class="form-field FBInput"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Durada:</label>' +
            '<br/>' +
            '<input id="new-duration" class="form-field FBInput"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Director:</label>' +
            '<br/>' +
            '<input id="new-direction" class="form-field FBInput"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Cast:</label>' +
            '<br/>' +
            '<input id="new-cast" class="form-field FBInput"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Trailer:</label>' +
            '<br/>' +
            '<input id="new-trailer" class="form-field FBInput"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Genere:</label>' +
            '<br/> <select class="form-field FBInput" id="new-genere">';
        for(var i=0; i < data.length; i++){
            item = item + '<option value="' + data[i]._id + '">' + data[i] .name + '</option>';
        }
        item = item +
            '</select><br/>' +
            '<label class="form-field FBLabel">Data:</label>' +
            '<br/>' +
            '<input type="date" id="new-data" class="form-field FBInput"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Resum:</label>' +
            '<br/>' +
            '<input id="new-review" size="100px" type="text" class="form-field FBInput"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Imatge:</label>' +
            '<br/>' +
            '<input id="new-image" size="100px" type="text" class="form-field FBInput"/>' +
            '<br/>' +
            '<input class="button-login form-field" type="button" value="Nova pel·lícula" onclick="javascript:crearPelicula()" style="float: left;   margin-top: 10px; "/>' +
            '<input class="button-login form-field" type="button" value="Cancelar" onclick="javascript:cancelarNovaPelicula()" style="float: left; margin: 10px 0px 0px 10px"/>' +
            '</div>' +
            '</div>'+
            '</div> ';
        $('#main').append(item);
    });
}

function cancelarNovaPelicula(){
    amagar();
    gestioPelicules();
}

function detallPelicula(id){
    amagar();
    $.getJSON( 'films/' + id, function(data) {
        var item;
        var rating = parseInt(data.vote_sum) + 0.0;
        if (data.votes != 0){
            rating = rating / data.votes;
        }
        item = '<div class="backoffice_admin_detail_peli" id="backoffice_admin_detail_peli">' +
            "<h2>Detall d'una pel·lícula</h2>" +
            '<label id="title">Títol:</label>' + data.title +
            '</br><label id="original_title">Títol original:</label>' + data.original_title +
            '</br><label id="duration">Durada:</label>' + data.duration +
            '</br><label id="director">Director:</label>' + data.director +
            '</br><label id="cast">Casting:</label>' + data.cast +
            '</br><label id="trailer">Trailer:</label>' + data.trailer +
            '</br><label id="Genere">Genere:</label><div style="display: inline;" id="genere_name"></div>' +
            '</br><label id="dataFilm">Data de la pel·lícula:</label>' + data.dataFilm +
            '</br><label id="rating">Puntuació:</label>' + rating +
            '</br><label id="review">Resum:</label>' + data.review +
            '</br><label id="image">Imatge:</label>' + data.image +
            '</br>' +
            '<input class="button-login" type="button" value="Editar" onclick="javascript:editMenuPelicula(' +
            "'" + data._id + "'" + ')" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '<input class="button-login" type="button" value="Eliminar" onclick="javascript:eliminarPelicula(' +
            "'" + data._id + "'" + ')" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '<input class="button-login" type="button" value="Llistat de Pel·lícules" onclick="javascript:llistatPelicules()" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '<input class="button-login" type="button" value="Menú backoffice" onclick="javascript:backoffice_main()" style="float: left;   margin-top: 10px; margin-left: 50px;"/>'
        '</div> ';
        $('#main').append(item);

        $.getJSON( 'typefilm/' + data.typeFilm, function(data) {
            $('#genere_name').append(data.name);
        });
    });
}

function eliminarPelicula(id){
    $.ajax({url: "/films/" + id,
        type: 'DELETE',
        success: function(result){
            llistatPelicules();
        }});
}

function crearPelicula(){
    var data = {
        title: $('#new-title').val(),
        original_title: $('#new-original-title').val(),
        duration: $('#new-duration').val(),
        director: $('#new-direction').val(),
        cast: $('#new-cast').val(),
        trailer: $('#new-trailer').val(),
        typeFilm: $('#new-genere option:selected').val(),
        vote_sum: 0,
        votes: 0,
        dataFilm: $('#new-data').val(),
        review: $('#new-review').val(),
        image: $('#new-image').val()
    };

    $.post("films",
        data,
        function(data){
            llistatPelicules();
        },"json");
}

function editMenuPelicula(id){
    amagar();

    $.getJSON( 'films/' + id, function(data) {
        var item;

        item= '<div class="backoffice_admin_edit_peli" id="backoffice_admin_edit_peli">' +
            "<h2>Edita una pel·lícula</h2>" +
            '<div class="new" id="new-form">' +
            '<div id="register-data" style=" margin-top: 30px;">' +
            '<label class="form-field FBLabel">Títol:</label>' +
            '<br/>' +
            '<input id="new-title" class="form-field FBInput" value="' + data.title + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Titol original:</label>' +
            '<br/>' +
            '<input id="new-original-title" class="form-field FBInput" value="' + data.original_title + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Durada:</label>' +
            '<br/>' +
            '<input id="new-duration" class="form-field FBInput" value="' + data.duration + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Director:</label>' +
            '<br/>' +
            '<input id="new-direction" class="form-field FBInput" value="' + data.director + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Cast:</label>' +
            '<br/>' +
            '<input id="new-cast" class="form-field FBInput" value="' + data.cast + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Trailer:</label>' +
            '<br/>' +
            '<input id="new-trailer" class="form-field FBInput" value="' + data.trailer + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Genere:</label>' +
            '<br/>' +
            '<select id="new-genere" class="form-field FBInput"></select>' +
            '<br/>' +
            '<label class="form-field FBLabel">Data:</label>' +
            '<br/>' +
            '<input type="date" id="new-data" class="form-field FBInput" value="' + data.dataFilm + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Resum:</label>' +
            '<br/>' +
            '<input id="new-review" size="100px" type="text" class="form-field FBInput" value="' + data.review + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Imatge:</label>' +
            '<br/>' +
            '<input id="new-image" size="100px" type="text" class="form-field FBInput" value="' + data.image + '"/>' +
            '<br/>' +
            '<input id="edit-vote-sum" value=' + data.vote_sum + ' type="hidden" />' +
            '<input id="edit-votes" value=' + data.votes + ' type="hidden" />' +
            '<input class="button-login form-field" type="button" value="Editar" onclick="javascript:editPelicula(' + "'" + data._id + "'" + ')" style="float: left;   margin-top: 10px; "/>' +
            '<input class="button-login form-field" type="button" value="Cancelar" onclick="javascript:detallPelicula(' + "'" + data._id + "'" + ')" style="float: left; margin: 10px 0px 0px 10px"/>' +
            '</div>' +
            '</div>'+
            '</div> ';
        $('#main').append(item);
        $.getJSON( 'typefilm/' + data.typeFilm, function(data) {
            var item;
            var gen= data._id;
            item = '<option selected value=' + data._id + '>' + data.name + '</option>';
            $('#new-genere').append(item);
            $.getJSON( 'typefilm', function(data) {
                var item;
                for(var i=0; i < data.length; i++){
                    if( data[i]._id != gen){
                        item= item + '<option value=' + data[i]._id + '>' + data[i].name + '</option>';
                    }
                }
                $('#new-genere').append(item);
            });
        });

    });

}

function editPelicula(id){
    var data = {
        title: $('#new-title').val(),
        original_title: $('#new-original-title').val(),
        duration: $('#new-duration').val(),
        director: $('#new-direction').val(),
        cast: $('#new-cast').val(),
        trailer: $('#new-trailer').val(),
        typeFilm: $('#new-genere option:selected').val(),
        dataFilm: $('#new-data').val(),
        review: $('#new-review').val(),
        vote_sum: $('#edit-vote-sum').val(),
        votes: $('#edit-votes').val(),
        image: $('#new-image').val()
    };
    $.ajax({
        url: '/films/' + id,
        type: 'PUT',
        data: data,
        success: function(result){
            detallPelicula(id);
        }
    });
}

function gestioCinemes(){
    amagar();

    var item;
    item= '<div class="backoffice_admin_cines" id="backoffice_admin_cines">'+
        "<h2>Gestió de cinemes</h2>" +
        '<ul><li><a onclick="javascript:llistatCinemes()"> Llistat de cinemes </a></li>' +
        '<li><a onclick="javascript:crearMenuCinema()"> Crear Cinema </a></li>' +
        '</ul>' +
        '<input class="button-login" type="button" value="Torna enrere" onclick="javascript:backoffice_main()" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
        '</div>';
    $('#main').append(item);
}

function llistatCinemes(){
    amagar();

    $.getJSON( 'cines', function(data) {
        var cines = data;
        var item;
        item = '<div class="backoffice_admin_list_cines" id="backoffice_admin_list_cines">'+
            "<h2>Llistat de cinemes</h2>" +
            '<table class="cines-list">' +
            '<tr><th>Nom</th><th>Ciutat</th></tr>';
        for(var i=0; i < data.length; i++){
            item = item + '<tr><th>' +
                '<a onclick="javascript:detallCinema(' +
                "'" + data[i]._id + "'" + ')">' + data[i].name + '</a></th>' +
                '<th>' + data[i].city + '</th></tr>';
        }
        item = item + '</table>' +
            '<input class="button-login" type="button" value="Torna enrere" onclick="javascript:gestioCinemes()" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '</div>';
        $('#main').append(item);
    });
}

function crearMenuCinema(){
    amagar();

    var item;
    item= '<div class="backoffice_admin_new_cinema" id="backoffice_admin_new_cinema">' +
        "<h2>Creació d'una pel·lícula</h2>" +
        '<div class="new" id="new-form">' +
        '<div id="register-data" style=" margin-top: 30px;">' +
        '<label class="form-field FBLabel">Nom:</label>' +
        '<br/>' +
        '<input id="new-name" class="form-field FBInput" />' +
        '<br/>' +
        '<label class="form-field FBLabel">Direcció: </label>' +
        '<br/>' +
        '<input id="new-direction" class="form-field FBInput"/>' +
        '<br/>' +
        '<label class="form-field FBLabel">Ciutat: </label>' +
        '<br/>' +
        '<input id="new-city" class="form-field FBInput"/>' +
        '<br/>' +
        '<label class="form-field FBLabel">Telefon: </label>' +
        '<br/>' +
        '<input id="new-phone" class="form-field FBInput"/>' +
        '<br/>' +
        '<label class="form-field FBLabel">Email: </label>' +
        '<br/>' +
        '<input id="new-email" class="form-field FBInput"/>' +
        '<br/>' +
        '<label class="form-field FBLabel">Latitud: </label>' +
        '<br/>' +
        '<input id="new-latitud" class="form-field FBInput"/>' +
        '<br/>' +
        '<label class="form-field FBLabel">Longitud: </label>' +
        '<br/>' +
        '<input id="new-longitud" class="form-field FBInput"/>' +
        '<br/>' +
        '<label class="form-field FBLabel">Imatge:</label>' +
        '<br/>' +
        '<input id="new-image" size="100px" type="text" class="form-field FBInput"/>' +
        '<br/>' +
        '<input class="button-login form-field" type="button" value="Nou cinema" onclick="javascript:crearCinema()" style="float: left;   margin-top: 10px; "/>' +
        '<input class="button-login form-field" type="button" value="Cancelar" onclick="javascript:cancelarNouCinema()" style="float: left; margin: 10px 0px 0px 10px"/>' +
        '</div>' +
        '</div>'+
        '</div> ';
    $('#main').append(item);
}

function crearCinema(){
    var data = {
        name: $('#new-name').val(),
        direction: $('#new-direction').val(),
        city: $('#new-city').val(),
        phone: $('#new-phone').val(),
        email: $('#new-email').val(),
        latitud: $('#new-latitud').val(),
        longitud: $('#new-longitud').val(),
        "vote_sum": 0,
        "votes": 0,
        "image": $('#new-image').val()
    };

    $.post("cines",
        data,
        function(data){
            llistatCinemes();
        },"json");
}

function cancelarNouCinema(){
    amagar();
    gestioCinemes();
}

function detallCinema(id){
    amagar();
    $.getJSON( 'cines/' + id, function(data) {
        var item;
        item = '<div class="backoffice_admin_detail_cine" id="backoffice_admin_detail_cine">' +
            "<h2>Detall d'un cinema</h2>" +
            '<label id="title">Nom: </label>' + data.name +
            '</br><label id="direction">Direcció: </label>' + data.direction +
            '</br><label id="city">Ciutat: </label>' + data.city +
            '</br><label id="phone">Telefon: </label>' + data.phone +
            '</br><label id="email">Email: </label>' + data.email +
            '</br><label id="latitud">Latitud: </label>' + data.latitud +
            '</br><label id="longitud">Longitud: </label>' + data.longitud +
            '</br><label id="image">Imatge: </label>' + data.image +
            '</br>' +
            '<input class="button-login" type="button" value="Editar" onclick="javascript:editMenuCinema(' +
            "'" + data._id + "'" + ')" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '<input class="button-login" type="button" value="Eliminar" onclick="javascript:eliminarCinema(' +
            "'" + data._id + "'" + ')" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '<input class="button-login" type="button" value="Torna enrere" onclick="javascript:llistatCinemes()" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '</div> ';
        $('#main').append(item);

        $.getJSON( 'typefilm/' + data.typeFilm, function(data) {
            $('#genere_name').append(data.name);
        });
    });
}

function editMenuCinema(id){
    amagar();
    $.getJSON( 'cines/' + id, function(data) {
        var item;
        item = '<div class="backoffice_admin_edit_cine" id="backoffice_admin_edit_cine">' +
            "<h2>Detall d'un cinema</h2>" +
            '<label class="form-field FBLabel">Nom:</label>' +
            '<br/>' +
            '<input id="new-name" class="form-field FBInput" value="' + data.name + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Direcció:</label>' +
            '<br/>' +
            '<input id="new-direction" class="form-field FBInput" value="' + data.direction + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Ciutat:</label>' +
            '<br/>' +
            '<input id="new-city" class="form-field FBInput" value="' + data.city + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Telefon:</label>' +
            '<br/>' +
            '<input id="new-phone" class="form-field FBInput" value="' + data.phone + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Email:</label>' +
            '<br/>' +
            '<input id="new-email" class="form-field FBInput" value="' + data.email + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Latitud:</label>' +
            '<br/>' +
            '<input id="new-latitud" class="form-field FBInput" value="' + data.latitud + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Longitud:</label>' +
            '<br/>' +
            '<input id="new-longitud" class="form-field FBInput" value="' + data.longitud + '"/>' +
            '</br>' +
            '<label class="form-field FBLabel">Imatge:</label>' +
            '<br/>' +
            '<input id="new-image" class="form-field FBInput" value="' + data.image + '"/>' +
            '</br>' +
            '<input id="edit-vote-sum" value=' + data.vote_sum + ' type="hidden" />' +
            '<input id="edit-votes" value=' + data.votes + ' type="hidden" />' +
            '<input class="button-login" type="button" value="Editar" onclick="javascript:editCinema(' +
            "'" + data._id + "'" + ')" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '<input class="button-login" type="button" value="Torna enrere" onclick="javascript:detallCinema(' +
            "'" + data._id + "'" + ')" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '</div> ';
        $('#main').append(item);
    });
}

function editCinema(id){
    var data = {
        name: $('#new-name').val(),
        direction: $('#new-direction').val(),
        city: $('#new-city').val(),
        phone: $('#new-phone').val(),
        email: $('#new-email').val(),
        latitud: $('#new-latitud').val(),
        longitud: $('#new-longitud').val(),
        image: $('#new-image').val(),
        vote_sum: $('#edit-vote-sum').val(),
        votes: $('#edit-votes').val()
    };
    $.ajax({
        url: '/cines/' + id,
        type: 'PUT',
        data: data,
        success: function(result){
            detallCinema(id);
        }
    });
}

function eliminarCinema(id){
    $.ajax({url: "/cines/" + id,
        type: 'DELETE',
        success: function(result){
            llistatCinemes();
        }});
}

function gestioPeliculaCinema(){
    amagar();
    $.getJSON( 'cines', function(data) {
        var cines = data;
        var item;
        item = '<div class="backoffice_admin_pelis_cinema" id="backoffice_admin_pelis_cinema">'+
            "<h2>Escull el teu cinema</h2><ul>";

        for(var i=0; i < data.length; i++){
            item = item +
                '<li>' +
                '<a onclick="javascript:escollirPelicula(' +
                "'" + data[i]._id + "'" + ')">' + data[i].name + '</a>' +
                '</li>';

        }
        item = item + '</ul>' +
            '<input class="button-login" type="button" value="Torna enrere" onclick="javascript:backoffice_main()" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '</div>';
        $('#main').append(item);
    });
}

function escollirPelicula(idCine){
    amagar();
    $.getJSON( 'films', function(data) {
        var films = data;
        var item;
        item = '<div class="backoffice_admin_pelis_cinema_choose_peli" id="backoffice_admin_pelis_cinema_choose_peli">'+
            "<h2>Escull una pel·lícula</h2><ul>";

        for(var i=0; i < data.length; i++){
            item = item +
                '<li>' +
                '<a onclick="javascript:veureTimetables(' +
                "'" + data[i]._id + "','" + idCine + "'"+ ')">' + data[i].title + '</a>' +
                '</li>';

        }
        item = item + '</ul>' +
            '<input class="button-login" type="button" value="Torna enrere" onclick="javascript:gestioPeliculaCinema()" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '</div>';
        $('#main').append(item);
    });
}

function veureTimetables(idPeli, idCine){
    amagar();
    $.getJSON( 'timetable', function(data) {
        $.getJSON( 'findAllBillboard/' + idCine + '/' + idPeli, function(billboards) {
            //var timetable = data;
            var item;
            item = '<div class="backoffice_admin_pelis_cinema_timetable" id="backoffice_admin_pelis_cinema_timetable">'+
                "<h2>Escull l'horari </h2>" +
                "<h3>(has de mantenir seleccionat la tecla 'Control' per seleccionar més d'un valor)</h3>" +
                "<select multiple style='height: 500px' id='timetable_list'>";

            for(var i=0; i < data.length; i++){
                var trobat = false;
                var j = 0;
                if(billboards.length == 0){
                    item = item +
                        '<option value="'+data[i]._id+'">' + data[i].time +'</option>' ;
                }else{
                    while(!trobat && j < billboards.length){
                        if(billboards[j].timetable_id == data[i]._id){
                            trobat = true;
                            item = item +
                                '<option value="'+data[i]._id+'" selected>' + data[i].time +'</option>' ;
                        }
                        j=j+1;
                    }
                    if(!trobat){
                        item = item +
                            '<option value="'+data[i]._id+'">' + data[i].time +'</option>' ;
                    }
                }
            }
            item = item + '</select>' +
                '<input class="button-login" type="button" value="Submit" onclick="javascript:assignCineFilm('+"'" + idPeli + "','" + idCine + "'" + ')" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
                '<input class="button-login" type="button" value="Torna enrere" onclick="javascript:escollirPelicula(' + "'" + idCine + "'" + ')" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
                '</div>';
            $('#main').append(item);
        });
    });
}

function assignCineFilm(idPeli, idCine){

    var selectedValues = [];
    $("#timetable_list :selected").each(function(){
        selectedValues.push($(this).val());
    });

    amagar();
    $.getJSON('findAllBillboard/' + idCine + '/' + idPeli, function(results){
        for(var j = 0; j < results.length; j++){
            $.ajax({url: "/billboard/" + results[j]._id,
                type: 'DELETE',
                async: false,
                success: function(result){}});
        }
        for (var i = 0; i < selectedValues.length; i++){
            var data = {
                cine_id: idCine, peli_id: idPeli, timetable_id: selectedValues[i]
            };
            $.ajax({url: "/billboard",
                type: 'POST',
                data: data,
                async: false
            });
        }
        mostrarPeliculaTimetable(idPeli, idCine);
    });

}

function mostrarPeliculaTimetable(idPeli, idCine){
    amagar();

    $.getJSON( 'findAllBillboard/'+idCine+'/'+idPeli, function(billboard_result) {
        if(!billboard_result.error){
            //Tenim resultats
            $.getJSON( 'cines/'+idCine, function(cine) {
                var item =  '<div class="backoffice_admin_info_pelis_cinema_timetable" id="backoffice_admin_info_pelis_cinema_timetable">'+
                    "<h2>Cinema, pel·lícula i horari </h2>" +
                    '<label id="cine_title">El cinema es: </label>' + cine.name + '</br>';
                $.getJSON( 'films/'+idPeli, function(peli) {
                    item = item + '<label id="peli_title">La pel·lícula es: </label>' + peli.title + '</br>' +
                        '<label id="list_timetable">Llistat d'+"'" + 'horaris: </label> ';
                    item = item + '</div>';
                    $('#main').append(item);
                    for(var i = 0; i < billboard_result.length; i++){
                        if(i == billboard_result.length -1){
                            $.getJSON( 'timetable/'+billboard_result[i].timetable_id, function(timetable) {
                                var time = timetable.time + '<br/>';
                                $('#list_timetable').append(time);
                            });

                        }else{
                            $.getJSON( 'timetable/'+billboard_result[i].timetable_id, function(timetable) {
                                var time = timetable.time + '<br/>';
                                $('#list_timetable').append(time);
                            });
                        }
                    }
                });
            });
        }
        else{
            alert("quelcom ha anat malament");
        }
    });
}
