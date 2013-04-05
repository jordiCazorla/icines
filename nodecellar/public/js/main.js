
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

                var item;
                item = '<div class="loggin" id="info-user-logged"><div style="margin-top:25px;"> Benvingut,  ' + data.name +
                    '. <span/><a onclick="javascript:logout()" style="text-decoration: underline; cursor: pointer !important;">logout</a></div></div>';
                $('#user-info').append(item);
                $('#loggin-box').hide();
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
}

function animate() {
    cur.fadeOut( 1000 , function(){
        if ( cur.attr('class') == 'last' )
            cur = $('.slide-show li:first');
        else
            cur = cur.next();
        cur.fadeIn( 1000 );
    });
}

function veurePelicules() {
    $('#inici-info').hide();
    var item = '<div id="inici-pelicules">' +
        '<div class="breadcrumb">' +
            '<a onclick="javascript:veureHome()">Home</a> > <a onclick="">Pel·lícules</a>' +
        '</div>' +
        '<div class="menu-conent-boxes">' +
            '<div class="box" id="first">'+
                '<img src="img/example_film.jpg" alt="" title="" width="267" height="172" />'+
                '<h3 class="title-box">Rànquings millor pelicula</h3>'+
                '<ol>'+
                    '<li>'+
                        'Intel·ligència artificial'+
                    '</li>'+
                    '<li>'+
                        'Robots'+
                    '</li>' +
                '</ol>' +
                '<span class="small_button_box"><a href="#">Veure Rànquings</a></span>' +
            '</div>' +
            '<div class="box" id="middle">' +
                '<img src="img/example_film.jpg" alt="" title="" width="267" height="172" />' +
                '<h3 class="title-box">Pel·lícules</h3>' +
                "<p>Tota la informació d'aquesta pel·lícula i moltes a més aquí.</p>" +
                '<span class="small_button_box"><a class="script_function" onclick="javascript:veurePelicules()">Veure Pel·lícules</a></span>' +
            '</div>' +
            '<div class="box" id="last">' +
                '<img src="img/example_film.jpg" alt="" title="" width="267" height="172" />' +
                '<h3 class="title-box">Publicitat</h3>' +
                '<p>Promociona el teu espai aquí</p>' +
                '<span class="small_button_box"><a href="#">Accedir a publicitat</a></span>'
            '</div>' +
        '</div>' +
    '</div>';
    $('#main').append(item);
}

function veureHome(){
    //Eliminar tot possible div que s'hagi pogut afegir en algun moment
    $('#inici-pelicules').remove();

    //Mostrar el div inicial
    $('#inici-info').show();
}