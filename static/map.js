const map_view = {
    adjust_size : function(){
        var map = document.querySelector('iframe');
        // Tested heights and widths to make this cover the screen perfectly
        map.height = window.innerHeight - 70;
        map.width = window.innerWidth - 100;
        console.log("Map sized");
    },
    set_event : function(){
        window.addEventListener('resize', adjust_height);
    }
};

function adjust_height(){
    var map = document.querySelector('iframe');
    // Tested heights and widths to make this cover the screen perfectly
    map.height = window.innerHeight - 63;
    map.width = window.innerWidth - 100;
}


map_view.adjust_size();
map_view.set_event();
