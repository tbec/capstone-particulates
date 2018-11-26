const layout = {
    init: function() {
        // console.log(document.querySelector('.logout'));
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