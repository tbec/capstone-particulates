current = "";
const deviceManager = {
    init: function(){

        var btns = document.getElementsByClassName("add-to-cart");

        for( i =0; i < btns.length; i++){
            btns[i].addEventListener("click", function() { 
                deviceManager.addToCart(this.id);
            });
        }
    },
    addToCart: function(id){
        console.log(id)

        // var url = 'http://127.0.0.1:5000/mydevice/info';
        var url ="https://download-dot-neat-environs-205720.appspot.com/mydevice/info"
        var data = {"id": id};

        fetch(url, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers:{
            'Content-Type': 'application/json'
        }
        }).then(function(e){
            return e.json();
        }).then(function(e){
            // current = JSON.stringify((JSON.parse(e)["value"]));
            current = JSON.parse(e)["value"];
            deviceManager.addNodetoCart(current);
        });
    },
    addNodetoCart: function(node){
        cart = this.getCart();
        if(!this.nodeInCart(cart, node)){
            cart.push(node);
            this.saveCart(cart);
            alert("Device Added to Cart!");
        }
        else{
            console.log("nope");
        }
        
    },
    getCart: function(){
        return JSON.parse(localStorage["cart"]);
    },
    nodeInCart : function(cart, node){
        cross = cart.filter(element => element.id == node["id"]);
        return cross.length != 0;
    },
    saveCart: function(cart){
        localStorage.clear();
        localStorage.setItem("cart", JSON.stringify(cart));
    }
};

deviceManager.init();