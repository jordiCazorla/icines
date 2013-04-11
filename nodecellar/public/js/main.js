var globalUser;


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

                if(globalUser.rol == 1){
                    $('#inici-info').remove();
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
    if (globalUser.rol == 1){
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
    var cur = $('.slide-show li:first');
    cur.fadeOut( 1000 , function(){
        if ( cur.attr('class') == 'last' )
            cur = $('.slide-show li:first');
        else
            cur = cur.next();
        cur.fadeIn( 1000 );
    });
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
            '<script type="text/javascript">' +
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
                    '<span class="small_button_box"><a class="script_function" onclick="javascript:veurePelicules()">Veure Pel·lícules</a></span>' +
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