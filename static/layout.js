// Sets up a server call to logout when the logout 'button' is clicked
const layout = {
    init: function() {
        document.querySelector('.logout').addEventListener('click', () => {
            fetch('/logout')
            .then(function(response) {
                return response.text();
            })
            .then(function(myText) {
                console.log(myText);
                window.location.href = '/'
            });
        })
        
    }
}

layout.init()