// Adding all the 'functionality' of the signup and login form
const login = {
    init: function(){
        [...document.querySelectorAll('.toggle-button')].forEach(button => button.addEventListener('click', this.makeActive))
    },
    makeActive: function({target}){
        [...document.querySelectorAll('.toggle-button')].forEach(button => button.classList.remove('active'));
        [...document.querySelectorAll('.form-signin')].forEach(form => form.classList.remove('active'));

        target.classList.add('active')
        
        if(target.classList.contains('open-login')) 
            document.querySelector('.form-signin.login').classList.add('active')
        else 
            document.querySelector('.form-signin.signup').classList.add('active')
        
    }
}

login.init()