var globalUser;
var slide_counter = 1;

function login() {
    var name = $('#login-usuari').val();
    var password = $('#login-password').val();
    if(name ==  '' || password == ''){
        alert("Algun dels parametres es buit");
    }else
    {
        $.getJSON( 'users/' + name + '/' + password, function(data) {
            if(data.result == 'ok'){
                //TODO: guardar l'item en un usuari global
                globalUser = {'name': data.name, 'email': data.email, 'rol': data.rol, '_id': data._id};

                var item;
                item = '<div class="loggin" id="info-user-logged"><div style="margin-top:25px;"> Benvingut,  ' + data.name +
                    '. <span/><a onclick="javascript:logout()" style="text-decoration: underline; cursor: pointer !important;">logout</a></div></div>';
                $('#user-info').append(item);
                $('#loggin-box').hide();

                if(globalUser.rol != 2){
                    backoffice_main();
                }
            }
            else{
                alert("L'usuari i/o la contrasenya són incorrectes");
            }
        });
    }
}
function logout(){
    $('#info-user-logged').remove();
    $('#login-password').val('');
    $('#loggin-box').show();
    if (globalUser.rol != 2){
        veureHome();
    }
    globalUser = {};
}

function cancelarRegistre(){
    $('#loggin-box').show();
    $('#register-form').hide();
}

function registre(){
    $('#loggin-box').hide();
    $(':input','#register-data')
        .not(':button, :submit, :reset, :hidden')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');
    $('#register-form').show();
}

function registrar(){
    if(validar()){
        $.post("users",
            {name: $('#register-name').val(), email: $('#register-email').val(), password: $('#register-password').val(), rol: 2},
            function(data){
                $('#register-form').hide();
                $('#login-usuari').val( $('#register-name').val() );
                $('#login-password').val( $('#register-password').val() );
                login();
            },"json");
    }
}

function validar(){
    var validation = true;
    $('.register-error').remove();
    /*
     * Conditions
     */
    var name = $('#register-name').val();

    if(name == ""){
        validation = false;
        $('#register-name').after("<span class='register-error'>* Name cannot be blank</span>");
    }
    else{
        var pattern = /^\w+$/;

        if(!pattern.test(name)){
            validation = false;
            $('#register-name').after("<span class='register-error'>* Name cannot contain simbols like ($,%,&,...)</span>");
        }
        else{
            $.getJSON('exist/' + name, function(data){
                if(data.result == 'ok'){
                    validation = false;
                    $('#register-name').after("<span class='register-error'>* Name already in use</span>");
                }
            });
        }
    }

    /*
     * Conditions
     */
    var email = $('#register-email').val();

    if(email == ""){
        validation = false;
        $('#register-email').after("<span class='register-error'>* Email cannot be blank</span>");
    }
    else{
        var pattern = /^\w+@\w+\.\w+$/;

        if(!pattern.test(email)){
            validation = false;
            $('#register-email').after("<span class='register-error'>* Email error format</span>");
        }
    }

    /*
     * Conditions
     */
    var password = $('#register-password').val();
    var confirm_password = $('#register-confirm-password').val();

    if(password == ""){
        validation = false;
        $('#register-password').after("<span class='register-error'>* Password cannot be blank</span>");
    }
    else{
        var pattern = /^(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

        if(!pattern.test(password)){
            validation = false;
            $('#register-password').after("<span class='register-error'>* Password cannot contain simbols like ($,%,&,...)</span>");
        }
    }

    if(password != confirm_password){
        validation = false;
        $('#register-confirm-password').after("<span class='register-error'>* Must be equal to the password</span>");
    }

    return validation;
}

function animate() {

    /*var cur = $('.slide-show li:first');
    cur.fadeOut( 1000 , function(){
        if ( cur.attr('class') == 'last' )
            cur = $('.slide-show li:first');
        else
            cur = cur.next();
        cur.fadeIn( 1000 );
    });*/
}

function getGeneres(){
    var typefilms;

    $.getJSON( 'typefilm', {sync: true}, function(data) {
        var typefilms = data;
        var position = '';
        var llistat = '';
        var op;
        //TODO: Per cada un s'haurà de fer una petició
        for(var i=0; i < data.length; i++){
            op = i % 3;
            if (op == 0){
                position = 'first';
                if(i == 3) llistat = llistat + '<div class="menu-conent-boxes" id="second-line">';
                else llistat = llistat + '<div class="menu-conent-boxes">';
            }else if(op == 1) position = 'middle';
            else position = 'last';
            llistat = llistat + '<div class="box" id="'+position+'">'+
                '<img src="img/example_film.jpg" alt="" title="" width="267" height="172" />'+
                '<h3 class="title-box">'+data[i].name+'</h3>'+
                '<ol>'+
                '<li>'+
                'Intel·ligència artificial'+
                '</li>'+
                '<li>'+
                'Robots'+
                '</li>' +
                '</ol>' +
                '<span class="small_button_box"><a href="#">Veure Rànquings</a></span>' +
                '</div>'
            if (op == 2) llistat = llistat + '</div>';
        }
        llistat = llistat + '</div>' + '</div>';
        $('#main').append(llistat);
    });
}

function veurePelicules() {
    $('#inici-info').remove();
    var typeFilms;
    var llistat = '<div id="inici-pelicules">' +
        '<div class="breadcrumb">' +
        '<a onclick="javascript:veureHome()">Home</a> > <a onclick="">Pel·lícules</a>' +
        '</div>';


    getGeneres();
}

function veureHome(){
    //Eliminar tot possible div que s'hagi pogut afegir en algun moment
    $('#inici-pelicules').remove();

    var item= '<div id="inici-info">' +
        '<div class="breadcrumb">' +
        '</div>' +
            '<ul class="slide-show ppt">' +
                '<li>' +
                    '<!-- image -->' +
                    '<div class="image-view">' +
                        '<span>' +
                            '<img src="img/example_film.jpg" alt="" title="" class="image-slide-show" width="910" height="352" />' +
                        '</span>' +
                    '</div>' +
                    '<!-- title -->' +
                    '<div class="title-view">' +
                        '<span>Troba les millors estrenes</span>' +
                    '</div>' +
                    '<!-- desc -->' +
                    '<div class="desc-view">' +
                        '<span>' +
                        'Tot el que vols saber de les estrenes que trobaràs als cinemes gironins. No et perdis totes les novetats de la cartellera.' +
                        '</span>' +
                    '</div>' +
                    '<!-- button -->' +
                    '<div class="button-view">' +
                        '<span>' +
                            '<a href="#">Veure estrenes</a>' +
                        '</span>' +
                    '</div>' +
                '</li>' +
                '<li>' +
                '<!-- image -->' +
                '<div class="image-view">' +
                '<span>' +
                '<img src="img/example_film2.jpg" alt="" title="" class="image-slide-show" width="910" height="352" />' +
                '</span>' +
                '</div>' +
                '<!-- title -->' +
                '<div class="title-view">' +
                '<span>La nostra cartellera</span>' +
                '</div>' +
                '<!-- desc -->' +
                '<div class="desc-view">' +
                '<span>' +
                'No dubtis en visitar la nostra cartallera per veure poder gaudir de la teva pel·lícula en el teu cinema.' +
                '</span>' +
                '</div>' +
                '<!-- button -->' +
                '<div class="button-view">' +
                '<span>' +
                '<a href="#">Veure cartellera</a>' +
                '</span>' +
                '</div>' +
                '</li>' +
                '</li>' +
                '<li>' +
                '<!-- image -->' +
                '<div class="image-view">' +
                '<span>' +
                '<img src="img/example_film3.jpg" alt="" title="" class="image-slide-show" width="910" height="352" />' +
                '</span>' +
                '</div>' +
                '<!-- title -->' +
                '<div class="title-view">' +
                '<span>Els cinemes gironins al teu abast</span>' +
                '</div>' +
                '<!-- desc -->' +
                '<div class="desc-view">' +
                '<span>' +
                "Et posem els cinemes gironins a l'abast d'un sol clic. Accedeix a la cartellera de cada un d'ells." +
                '</span>' +
                '</div>' +
                '<!-- button -->' +
                '<div class="button-view">' +
                '<span>' +
                '<a href="#">Veure cinemes</a>' +
                '</span>' +
                '</div>' +
                '</li>' +
            '</ul>' +
            '<script>' +
            "$('.slide-show li:gt(0)').hide();" +
            "$('.slide-show li:last').addClass('last');" +
            "$(function() {" +
                'setInterval( "animate()", 5000 );' +
                '} );' +
            '</script> ' +

            '<div class="menu-conent-boxes">' +
                '<div class="box" id="first">' +
                    '<img src="img/example_film.jpg" alt="" title="" width="267" height="172" />' +
                    '<h3 class="title-box">Rànquings millor pelicula</h3>' +
                    '<ol>' +
                        '<li>' +
                        'Intel·ligència artificial' +
                        '</li>' +
                        '<li>' +
                        'Robots' +
                        '</li>' +
                    '</ol>' +
                    '<span class="small_button_box"><a href="#">Veure Rànquings</a></span>' +
                '</div>' +
                '<div class="box" id="middle">' +
                    '<img src="img/example_film.jpg" alt="" title="" width="267" height="172" />' +
                    '<h3 class="title-box">Pel·lícules</h3>' +
                    "<p>Tota la informació d'aquesta pel·lícula i moltes a més aquí.</p>" +
                    '<span class="small_button_box"><a class="script_function" c>Veure Pel·lícules</a></span>' +
                '</div>' +
                '<div class="box" id="last">' +
                    '<img src="img/example_film.jpg" alt="" title="" width="267" height="172" />' +
                    '<h3 class="title-box">Publicitat</h3>' +
                    '<p>Promociona el teu espai aquí</p>' +
                    '<span class="small_button_box"><a href="#">Accedir a publicitat</a></span>' +
                '</div>' +
            '</div>' +
        '</div>' ;

    //Mostrar el div inicial
    //$('#inici-info').show();
    $('#main').append(item);
}

function startAnimation(){
    $('#element1').hide();
    $('#element2').hide();
    $('#element3').hide();

    //$('#element1').show();

    animation();
}

function animation(){

    var cur = $('#element'+slide_counter);
    cur.fadeOut( 1000, function(){
        if (slide_counter == 3){
            slide_counter = 1;
        }else{
            slide_counter=slide_counter+1;
        }
        
        cur = $('#element'+slide_counter);
        cur.fadeIn( 1000 );
    });
    $(function() {
        setInterval( "animation()", 5000 );
    } );
}

function backoffice_main(){
    //TODO: comprovar si ha de ser un remove o un hide, depen de si canviem l'slideshow.
    $('#inici-info').remove();
    $('#backoffice_admin_pelis').remove();


    //Mirem quin tipus d'usuari estem. Si som admins o cinema
    var item;
    if (globalUser.rol == 1){
        item= '<div class="backoffice_admin_main" id="backoffice_admin_main">'+
            "<h2>Menú backoffice rol d'admin</h2>" +
            '<ul><li><a onclick="javascript:gestioPelicules()"> Gestió de pel·lícules </a></li></ul>' +
        '</div>';
        $('#main').append(item);
    }
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
     $('#backoffice_admin_pelis').remove();
     $('#backoffice_admin_detail_peli').remove();

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
     $('#backoffice_admin_pelis').remove();
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
         '<br/>' +
         '<input id="new-genere" class="form-field FBInput"/>' +
         '<br/>' +
         '<label class="form-field FBLabel">Data:</label>' +
         '<br/>' +
         '<input id="new-data" class="form-field FBInput"/>' +
         '<br/>' +
         '<label class="form-field FBLabel">Resum:</label>' +
         '<br/>' +
         '<input id="new-review" size="100px" type="text" class="form-field FBInput"/>' +
         '<br/>' +
         '<input class="button-login form-field" type="button" value="Nova pel·lícula" onclick="javascript:crearPelicula()" style="float: left;   margin-top: 10px; "/>' +
         '<input class="button-login form-field" type="button" value="Cancelar" onclick="javascript:cancelarNovaPelicula()" style="float: left; margin: 10px 0px 0px 10px"/>' +
         '</div>' +
     '</div>'+
     '</div> ';
     $('#main').append(item);
 }

function cancelarNovaPelicula(){
    $('#backoffice_admin_new_peli').remove();
    gestioPelicules();
}

function detallPelicula(id){
    $('#backoffice_admin_list_pelis').remove();
    $('#backoffice_admin_edit_peli').remove();
    $.getJSON( 'films/' + id, function(data) {
        var item;
        item = '<div class="backoffice_admin_detail_peli" id="backoffice_admin_detail_peli">' +
            "<h2>Detall d'una pel·lícula</h2>" +
            '<label id="title">Títol:</label>' + data.title +
            '</br><label id="original_title">Títol original:</label>' + data.original_title +
            '</br><label id="duration">Durada:</label>' + data.duration +
            '</br><label id="director">Director:</label>' + data.director +
            '</br><label id="cast">Casting:</label>' + data.cast +
            '</br><label id="trailer">Trailer:</label>' + data.trailer +
            '</br><label id="Genere">Genere:</label>' + data.genere +
            '</br><label id="dataFilm">Data de la pel·lícula:</label>' + data.dataFilm +
            '</br><label id="rating">Puntuació:</label>' + data.rating +
            '</br><label id="review">Resum:</label>' + data.review +
            '</br>' +
            '<input class="button-login" type="button" value="Editar" onclick="javascript:editMenuPelicula(' +
            "'" + data._id + "'" + ')" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '<input class="button-login" type="button" value="Eliminar" onclick="javascript:eliminarPelicula(' +
            "'" + data._id + "'" + ')" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '<input class="button-login" type="button" value="Torna enrere" onclick="javascript:llistatPelicules()" style="float: left;   margin-top: 10px; margin-left: 50px;"/>' +
            '</div> ';
        $('#main').append(item);
    });
}

function eliminarPelicula(id){
    /*$.ajax({url: "films/", data: id, type: 'DELETE', success: function(result){
        $('#backoffice_admin_detail_peli').remove();
        llistatPelicules();
    }});*/
}

function crearPelicula(){
    $.post("films",
        {title: $('#new-title').val(), original_title: $('#new-original-title').val(), duration: $('#new-duration').val(), director: $('#new-direction').val(),
            cast: $('#new-cast').val(), trailer: $('#new-trailer').val(), typeFilm: $('#new-genere').val(), dataFilm: $('#new-data').val(), review: $('#new-review').val()},
        function(data){
            $('#backoffice_admin_new_peli').remove();
            llistatPelicules();
        },"json");
}

function editMenuPelicula(id){
    $('#backoffice_admin_detail_peli').remove();

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
            '<input id="new-genere" class="form-field FBInput" value="' + data.typeFilm + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Data:</label>' +
            '<br/>' +
            '<input id="new-data" class="form-field FBInput" value="' + data.dataFilm + '"/>' +
            '<br/>' +
            '<label class="form-field FBLabel">Resum:</label>' +
            '<br/>' +
            '<input id="new-review" size="100px" type="text" class="form-field FBInput" value="' + data.review + '"/>' +
            '<br/>' +
            '<input class="button-login form-field" type="button" value="Editar" onclick="javascript:editPelicula(' + "'" + data._id + "'" + ')" style="float: left;   margin-top: 10px; "/>' +
            '<input class="button-login form-field" type="button" value="Cancelar" onclick="javascript:detallPelicula(' + "'" + data._id + "'" + ')" style="float: left; margin: 10px 0px 0px 10px"/>' +
            '</div>' +
            '</div>'+
            '</div> ';
        $('#main').append(item);
    });

}

function editPelicula(id){
    $.put("films",
        {title: $('#new-title').val(), original_title: $('#new-original-title').val(), duration: $('#new-duration').val(), director: $('#new-direction').val(),
            cast: $('#new-cast').val(), trailer: $('#new-trailer').val(), typeFilm: $('#new-genere').val(), dataFilm: $('#new-data').val(), review: $('#new-review').val()},
        function(data){
            $('#backoffice_admin_new_peli').remove();
            detallPelicula(data._id);
        },"json");
}
