/**
 * Created with JetBrains WebStorm.
 * User: Randos
 * Date: 18/05/13
 * Time: 19:32
 * To change this template use File | Settings | File Templates.
 */
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
                    desactivarMenus();
                    backoffice_main();
                    var menu = '<a id="loggin_admin_menu" onclick="javascript:backoffice_main()">' + "Menu d'administrador." + '</a>';
                    $('#info-user-logged').append(menu);
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
    globalUser = null;
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