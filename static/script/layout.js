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


function toggleSelected(btn){
    
    // Removes the old
    console.log("This is what was clicked");
    console.log(btn);
    //document.getElementsByClassName('selected')[0].classList.remove('selected');
    //var grandParent = ((btn.target).parentElement).parentElement.classList.add("selected");
};


// Grabs all the nav options adding the event listener for clicking on changing view
function initSelectedAction(){

    var options = ["index", "account", "map", "graph", "download", "devices"];
    console.log("Hit this");

    var navBtns = document.getElementsByClassName('logo');
    var i;
    for(i = 0; i < navBtns.length; i++){
        navBtns[i].addEventListener('click', toggleSelected);
    }

    var url = document.URL;
    var urlSplit = url.split("/");
    var currentPage=  urlSplit[urlSplit.length - 1].toLowerCase();
    console.log(url);
    console.log(currentPage);

    if (options.includes(currentPage)){
        var navSelected = document.getElementsByName(currentPage);
        navSelected[0].parentElement.classList.add("selected");

    }


}

initSelectedAction();
