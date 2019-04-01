var g;
const cartLogic = {
    cart : [],
    workCart: [],
    queryDataSet: null,
    init: function(){


        // Get the <span> element that closes the modalx
        var span = document.getElementsByClassName("close")[0];
        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            cartLogic.getModal().style.display = "none";
            document.getElementById("circle-graph").checked = true;

            // Removes the chart out of the Modal when you click off
            var graphNode = document.querySelector(".piechart_3d").firstChild;
            if(graphNode)
                document.querySelector(".piechart_3d").removeChild(graphNode)
            removeOptions();
        }
        
        function removeOptions(){
            // Removes the children of the right span
            var optionDiv = document.getElementById("graph-options");
            while(optionDiv.firstChild){
                optionDiv.removeChild(optionDiv.firstChild);
            }
        }
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == cartLogic.getModal()) {
                cartLogic.getModal().style.display = "none";
                document.getElementById("circle-graph").checked = true;

                // Removes the chart out of the Modal when you click off
                var graphNode = document.querySelector(".piechart_3d").firstChild;
                if(graphNode)
                    document.querySelector(".piechart_3d").removeChild(graphNode)
                removeOptions();
            }

        }

        // populate the cart from local storage
        this.cart = this.getFromLocal("cart");
        if(this.cart != null){
            this.addNodesToCart(this.cart, ".all-cart", "all-cart-selection");
        }
        else{
            this.cart = [];
        }

        // Populate the working set if any
        this.workCart = this.getFromLocal("workCart");
        if(this.workCart != null){
            this.addNodesToCart(this.workCart,".working-cart","working-cart-selection");
        }
        else{
            this.workCart = [];
        }
        
        // DELETE All CART BOX SELECTED, grabs all the check boxes and deletes those checked. Resets SELECT ALL if needed
        document.getElementById('delete-all-cart-items').addEventListener('click', function(e){
            var buttons = cartLogic.getByName('all-cart-selection');
            var i = 0;
            for(; i < buttons.length; i++){
                if(buttons[i].checked){
                    // Deletes the ID from the cart
                    cartLogic.deleteFromCart(buttons[i].parentElement.previousElementSibling.innerText, "allCart")
                    // Removes the card for the screen
                    cartLogic.delete_selected(buttons[i]);
                }
            }

            // Turns off the mass select button
            cartLogic.setCheckboxValue(document.getElementById('cart-mass-selection'), false);

            // Clear the Local storage and save the new cart
            cartLogic.removeFromLocalStorage("cart");
            cartLogic.saveToLocal("cart", cartLogic.cart);
        });

        // DELETE Working Cart BOX SELECTED, grabs all the check boxes and deletes those checked. Resets SELECT ALL if needed
        document.getElementById('delete-working-cart-items').addEventListener('click', function(e){
            var buttons = cartLogic.getByName('working-cart-selection');
            var i = 0;
            for(; i < buttons.length; i++){
                if(buttons[i].checked){
                    // Deletes the ID from the cart
                    cartLogic.deleteFromCart(buttons[i].parentElement.previousSibling.innerText, "workCart")
                    // Removes the card for the screen
                    cartLogic.delete_selected(buttons[i]);
                }
            }

            // Turns off the mass select button
            cartLogic.setCheckboxValue(document.getElementById('working-mass-selected'), false);

            // Clear the Local storage and save the new cart
            cartLogic.removeFromLocalStorage("workCart");
            cartLogic.saveToLocal("workCart", cartLogic.workCart);
        });

        // SELECT 'All' Cart BOX CHECKBOXES
        document.getElementById('cart-mass-selection').addEventListener('click', function(e){
            // sets all the selected box to flag
            cartLogic.toggleMassSelect(cartLogic.getByName('all-cart-selection'), e.target.checked);
        });

         // SELECT working cart BOX CHECKBOXES
         document.getElementById('working-mass-selected').addEventListener('click', function(e){
            // sets all the selected box to flag

            cartLogic.toggleMassSelect(cartLogic.getByName('working-cart-selection'), e.target.checked);
        });

        document.getElementById('add-nodes-to-working-cart').addEventListener('click', function(e){
            cartLogic.addDevicesToWorking();
        });

        // Creates click handler for the dynamically producted selected elements
        $(".all-cart").on('click', '.delete', function(e){
            // Deletes the node, removes it from the cart, updates local storage
            console.log("Deleting the current node");

            cartLogic.delete_selected(e.target.parentElement);
            cartLogic.deleteFromCart(e.target.parentElement.parentElement.previousElementSibling.innerText, "allCart");
            cartLogic.removeFromLocalStorage("cart");
            cartLogic.saveToLocal("cart", cartLogic.cart);
        });

        // Creates click handler for the dynamically producted selected elements
        $(".working-cart").on('click', '.delete', function(e){
            // Deletes the node, removes it from the cart, updates local storage
            console.log("Deleting the current node");

            cartLogic.delete_selected(e.target.parentElement);
            cartLogic.deleteFromCart(e.target.parentElement.parentElement.previousElementSibling.innerText, "workCart");
            cartLogic.removeFromLocalStorage("workCart");
            cartLogic.saveToLocal("workCart", cartLogic.workCart);
        });

        $(".all-cart").on("click", ".add-singlenode", function(e){
            console.log("plus");
            var node = {};
            node["id"] = e.target.parentElement.parentElement.innerText;
            if(!cartLogic.inCart(node,cartLogic.workCart)){
                cartLogic.addNodeToCart(node, "workCart");
                cartLogic.createCartNodeItem(node, ".working-cart", "working-cart-selection");
                // Clear the Local storage and save the new cart
                cartLogic.removeFromLocalStorage("workCart");
                cartLogic.saveToLocal("workCart", cartLogic.workCart);
            }

        })

        
        $('#preview-query-parameters-form').submit(function(eventObj) {
            var idString = '<input type="hidden" name="ids" value="' + cartLogic.listWorkingSet() + '"/>';
            $(this).append(idString);
            return true;
        });

        function downloadDataSet(params){
            console.log("Making Post request");
            console.log(params);
            var url = "http://127.0.0.1:5000/downloadcsv";
            // var url = "https://download-dot-neat-environs-205720.appspot.com/downloadcsv"
            var data = params;
            
            
            fetch(url, 
                {
                    method: 'POST', // or 'PUT'
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data), // data can be `string` or {object}!
                }
            ).then(response => {

                if(response.headers.get("statusText") == "OK"){
                    const reader = response.body.getReader();
                    return new ReadableStream({
                        start(controller) {
                          return pump();
                          function pump() {
                              console.log("pumping");
                            return reader.read().then(({ done, value }) => {
                              // When no more data needs to be consumed, close the stream
                              if (done) {
                                  controller.close();
                                  return;
                              }
                              // Enqueue the next data chunk into our target stream
                              controller.enqueue(value);
                              return pump();
                            });
                          }
                        }  
                    })
                }
                else{
                    alert(response.headers.get("error"));
                    throw 'cancel';
                }

            })
            .then(stream => new Response(stream))
            .then(response => response.blob())
            .then(blob => URL.createObjectURL(blob))
            .then(url => {
                var fn = params["filename"] == "" ? "download.csv" : params["filename"] + ".csv"
                saveAs(url, fn);
            })
        }
        
        function saveAs(blob, fileName) {
            var url = blob;
        
            var anchorElem = document.createElement("a");
            anchorElem.style = "display: none";
            anchorElem.href = url;
            anchorElem.download = fileName;
        
            document.body.appendChild(anchorElem);
            anchorElem.click();
        
            document.body.removeChild(anchorElem);
        
            // On Edge, revokeObjectURL should be called only after
            // a.click() has completed
            setTimeout(function() {
                window.URL.revokeObjectURL(url);
            }, 1000);
        }
        // Goes through the Analytics download options and gets all their values
        function getDownloadParams(){
            var data = {};
            
            var particleTypes = document.getElementsByClassName("download-pm-type");
            for(var i = 0; i < particleTypes.length; i++){
                if(particleTypes[i].checked){
                    data[particleTypes[i].name] = true;
                }
            }
        
            var operations = document.getElementsByName("download-operation");
            for(var i = 0; i < operations.length;i++)
            {
                if(operations[i].checked){
                    data["operation"] = operations[i].value;
                    break;
                }
            }
            
            data["from-date"] = document.getElementById("download-from-date").value;
            data["from-time"] = document.getElementById("download-from-time").value;
            data["to-date"] = document.getElementById("download-to-date").value;
            data["to-time"] = document.getElementById("download-to-time").value;
            
            var box = document.getElementById("query-limit-value");
            if(box.value != ""){
                data["limit"] = box.value;
            }
            else{
                data["limit"] = null;
            }
            
            data["ids"] = cartLogic.listWorkingSet();
            data["filename"] = document.querySelector("#query-filename-value").value
            return data;
        };
        
        // Blocks the form from being submitted and does a manual Fetch call
        document.getElementById("download-parameters").addEventListener("click", function(event){
            console.log("preventing default");
            event.preventDefault();
            if(cartLogic.listWorkingSet() != "")
            {
                var params = getDownloadParams();
                downloadDataSet(params);
            }
            else{
                alert("No devices in the Query Set.");
            }
        });

        // Sets up the handler for the button that is created for graph view options
        $("#graph-options").on("click", "#submit-graph-options", function(e){
            var selectednodes = ([].slice.call(document.getElementsByClassName("graph-pm-option"))).filter(btn=>btn.checked);
            var keys = [];
            for(var i = 0; i < selectednodes.length; i++){
                keys.push(selectednodes[i].name);
            }

            graphLogic.graphDataKeys = keys;
            
            // Grabs the current id that was clicked
            var id = graphLogic.currentId;

            if(document.getElementById("circle-graph").checked){
                // Creates the graph data formatted for selected device and parameters
                var graphData = graphLogic.turnObjectsToListOfData(keys, cartLogic.queryDataSet[id]);
                graphLogic.loadCircleGraph(graphData);
            }
            else{
                // Format for bar graph
                var graphData = graphLogic.formatBarGraphData(keys,cartLogic.queryDataSet[id]);
                graphLogic.loadBarGraph(graphData);
            }


            // turn off the selected nodes
            for(var i = 0; i < selectednodes.length; i++){
                selectednodes[i].checked = false;
            }
        });
        // Sets up the handler to expand result rows
        $("#data-display").on('click', '.header-info-graph', function(e){
            console.log("clicked Graph button");
            var rowId = e.target.parentElement.parentElement.firstElementChild.innerText;


            
            if(rowId)
                // Pulls out the Particulate types for this row
                idKeys = cartLogic.getDataKeys(rowId);
                // Store the row id so that it can be toggled
                graphLogic.currentId = rowId;
                // Turns the data into graph format

                // TODO uncomment this to get the graph data set
                // var graphData = graphLogic.turnObjectsToListOfData(idKeys, cartLogic.queryDataSet[rowId]);


                // Turns the Div's style to Block so it can be seen
                cartLogic.getModal().style.display = "block";


                // GRABS all the parameters, convers to array, filters the array on whether its checked
                var selectedParams = ([].slice.call(document.getElementsByClassName("pm-type"))).filter(p=>p.checked);
                cartLogic.createGraphOptions(selectedParams);
                // Draw the graph
                // graphLogic.loadCircleGraph(graphData);



                // Store the row id so that it can be toggled
                graphLogic.currentId = rowId;
        });

        // Sets up the handler to expand result rows
        $("#data-display").on('click', '.header-info-text', function(e){
            console.log("clicked");
            console.log(e.target.parentElement.firstElementChild.innerText);
            var dataView = document.getElementById(e.target.parentElement.firstElementChild.innerText);
            console.log(dataView);
            g = dataView;
            if(dataView)
                dataView.classList.toggle("current-view");
        });
    },
    createGraphOptions: function(parameters){

        // Grabs the right div of the modal
        var right_div = document.getElementById("graph-options");

        // When formatting text don't cap these two
        notCaps = ["Temperature", "Humidity"];
        // Create a div with an input box followed by label for each parameter chosen
        parameters.forEach(function(option){
            var current_div = document.createElement("div");
            current_div.classList.add("graph-option-div")
            nameValue = option.name;
            console.log(nameValue);
            console.log(! (nameValue in notCaps));
            if (!notCaps.includes(nameValue)) 
                nameValue = nameValue.toUpperCase();
            
            current_div.innerHTML = '<input type="checkbox" name="' + option.name+ '" class="graph-pm-option" value="True"> <label>' + nameValue + '</label>';
            right_div.appendChild(current_div);
        });

        // Add submit button
        var btn = document.createElement("button")
        btn.type="submit"
        btn.id = "submit-graph-options";
        btn.innerText = "View";
        btn.classList.add("btn");
        btn.classList.add("btn-success")

        right_div.appendChild(btn);
    },
    toggleMassSelect: function(buttons,value){
            // Function for toggle mass select button
            var i = 0;
            console.log(buttons);
            console.log(value);
            for(; i < buttons.length;i++){
                // buttons[i].checked = value;
                cartLogic.setCheckboxValue(buttons[i], value);
            }
    },
    getDataKeys: function(id){
        return Object.keys(cartLogic.queryDataSet[id][0]).filter(element => element != "time");
    },
    setCheckboxValue: function(btn, value){
        btn.checked = value;
    },
    getById: function(id){
        return document.getElementById(id);
    },
    getByName: function(name){
        return document.getElementsByName(name);
    },
    getByClass: function(c_name){
        return document.getElementsByClassName(c_name);
    },
    delete_selected: function(target){
        // Grabs the parent element and it's grandparent
        var parent = target.parentElement.parentElement;
        var g_parent = parent.parentElement;

        // Changes the opacity to trigger the transition styling then removes the element after .5 seconds
        parent.style.opacity ='0';
        setTimeout(function(){g_parent.removeChild(parent);}, 300);
    },
    deleteFromCart: function(id, deleteFrom){
        if(deleteFrom == "allCart")
            this.cart = this.cart.filter(p=>p["id"] != id);
        else if (deleteFrom == "workCart")
            this.workCart = this.workCart.filter(p => p["id"] != id);
    },
    addNodeToCart: function(node, cartName){
        if(cartName == "allCart"){
            this.cart.push(node);
        }
        else if(cartName == "workCart"){
            this.workCart.push(node);
        }
    },
    removeFromLocalStorage: function(value){
        localStorage.removeItem(value);
    },
    saveToLocal: function(name, value){
        localStorage.setItem(name, JSON.stringify(value));
    },
    getFromLocal: function(value){
        return JSON.parse(localStorage.getItem(value));
    },
    toggleClass: function(){
        document.querySelector(".cart").classList.toggle("closed");
    },
    createCartNodeItem: function(i, cartClass, inputType){
        var right = document.querySelector(cartClass);

        var div = document.createElement('div');
        div.classList.add('box');

        var div_left = document.createElement("div");
        div_left.classList.add("box-left");
        div_left.innerHTML = i.id.toUpperCase();

        var addOrDel = document.createElement("h4");
        var del = document.createElement('h4');
        var check = document.createElement('input');
        // If its in the "ALL Cart" give it an exit and plus sign
        if(cartClass == ".all-cart"){
            addOrDel.value = "adder";
            addOrDel.innerHTML = '<i class="fas fa-plus"></i>';
            addOrDel.classList.add("add-singlenode")

            // del.type="submit";
            del.value="delete";
            del.innerHTML = '<i class="fas fa-times times"></i>'
            del.name="selected-item"
            del.classList.add('delete');
            del.classList.add("sub-right");
            div_left.append(addOrDel);


            check.type="checkbox";
            check.classList.add("sub-right");
            check.classList.add("cart-checkbox");
            check.name= inputType;
        } 
        else{

            div_left.classList.add("working-card");

            // If its in the working cart, give it a minus instead of an X
            del.value = "deleter";
            del.innerHTML = '<i class="fas fa-minus"></i>';
            del.classList.add('delete');
            del.classList.add("sub-right");
            del.classList.add("remove-singlenode");

            check.type="checkbox";
            check.classList.add("sub-right");
            check.classList.add("work-checkbox");
            check.name= inputType;
        }

        var div_right = document.createElement("div");
        div_right.classList.add("box-right");

        // var del = document.createElement('h4');
        // // del.type="submit";
        // del.value="delete";
        // del.innerHTML = '<i class="fas fa-times times"></i>'
        // del.name="selected-item"
        // del.classList.add('delete');
        // del.classList.add("sub-right");


        // var check = document.createElement('input');
        // check.type="checkbox";
        // check.classList.add("sub-right");
        // check.classList.add("cart-checkbox");
        // check.name= inputType;

        div_right.appendChild(del);
        div_right.appendChild(check);
        div.appendChild(div_left);
        div.appendChild(div_right);
        right.appendChild(div);

        // div.appendChild(del);
        // div.appendChild(check);
        // right.appendChild(div);
    },
    addNodesToCart: function(nodes, cartClass, inputType){
        for(var i = 0; i < nodes.length; i++){
            // Adds a node to the html cart
            this.createCartNodeItem(nodes[i], cartClass,inputType);

            // Adds the node to the 'logical'
            //cart.push(nodes[i]);
        }
    },
    addDevicesToWorking: function(){
        var buttons = cartLogic.getByName('all-cart-selection');
        var i = 0;
        for(; i < buttons.length; i++){
            var node = {id: buttons[i].parentElement.previousElementSibling.innerText};
            if(buttons[i].checked && !cartLogic.inCart(node, cartLogic.workCart)){
                // Deletes the ID from the cart
                cartLogic.addNodeToCart(node, "workCart");
                cartLogic.createCartNodeItem(node, ".working-cart", "working-cart-selection");
                // cartLogic.deleteFromCart(buttons[i].parentElement.innerText, "workCart")
                // Removes the card for the screen
                // cartLogic.delete_selected(buttons[i]);
            }
            cartLogic.setCheckboxValue(buttons[i], false);
        }

        // Turns off the mass select button
        cartLogic.setCheckboxValue(document.getElementById('cart-mass-selection'), false);

        // Clear the Local storage and save the new cart
        cartLogic.removeFromLocalStorage("workCart");
        cartLogic.saveToLocal("workCart", cartLogic.workCart);

    },
    inCart: function(node, cart){
        // Verify that the selected node isnt already in the cart, filter cart
        var nodeExists = cart.filter(p=>p["id"] == node["id"]);
        return nodeExists.length > 0 ? true : false;
    },
    listWorkingSet: function(){
        var idList = "";
        var i = 0;
        for(; i < cartLogic.workCart.length; i++){
            idList += cartLogic.workCart[i]["id"]
            if(i < cartLogic.workCart.length - 1){
                idList += ",";
            }
        }
        return idList;
    },
    processQueryData: function(rawData){
        var parsedData = JSON.parse(rawData.replace(/None/g,'0'));
        // 'cache' that query
        cartLogic.queryDataSet = parsedData;

        console.log(parsedData);

        // Construct HTML
        this.createDataTable(parsedData);
    },
    createDataTable: function(data){
        // Grab the outer table to add data to
        var outerWrapper = this.getById("data-display");

        // For each device Reponse and Data
        for(var deviceId in data){
            var deviceHasData = data[deviceId].length > 0;
            // Create a div with device id as a header
            var deviceDiv = this.createDiv();
            deviceDiv.classList.add("device-info-header")

            // Create device info text
            var deviceH3 = this.createH4();
            deviceH3.innerText = deviceId;
            deviceH3.classList.add("header-info-text");
            deviceDiv.append(deviceH3);
            // Adds a clickable pointer over ID if it has return value
            if(deviceHasData){
                deviceH3.classList.add("clickable-row");
            }
            // Create another one that displays result size
            deviceH3 = this.createH4();
            deviceH3.classList.add("header-info-text");

            // If the device has a result set show the size
            if(deviceHasData){
                deviceH3.innerText = data[deviceId].length;
                deviceH3.classList.add("clickable-row");
                // append it to the div
                deviceDiv.append(deviceH3);
                var iconH3 = this.createH4();
                iconH3.classList.add("header-info-text");
                iconH3.innerHTML = '<i class="fas fa-chart-bar chart-logo header-info-graph"></i>';
                iconH3.classList.add("clickable-row");
                deviceDiv.append(iconH3);
            }
            else{
                deviceH3.innerText = "0";
                // append it to the div
                deviceDiv.append(deviceH3);
            }

            
            // append that div to the frame
            outerWrapper.append(deviceDiv);




            // If that device has data create rows with header and data
            if(data[deviceId].length > 0){
                // Create a table row to attach a table inside of
                var innerTableDiv = this.createDiv();
                innerTableDiv.classList.add("tableinfo-div")
                innerTableDiv.id = deviceId;
                var innerTable = this.createTableElement();
                innerTable.classList.add("inner-table")
                // innerTable.id = deviceId;
                // Creates the header for the inner table 
                var innerTableHeaderRow = this.createTableRow();

                // Grab keys from an object instasnce and fills header row
                var keys = Object.keys(data[deviceId][0]);
                for( var key in keys){
                    // Create a TH tag with the key as the text
                    var innerTableTh = this.createTableHeader();
                    innerTableTh.innerText = keys[key];

                    // Add it to the table row
                    innerTableHeaderRow.append(innerTableTh)
                }
                innerTable.appendChild(innerTableHeaderRow);

                // Loop through each of the rows
                var i = 0;
                for ( ; i < data[deviceId].length; i++){
                    var innerTableDataRow = this.createTableRow();
                    for(var e in data[deviceId][i]){
                        var td = this.createTableData();
                        td.innerHTML = data[deviceId][i][e];
                        innerTableDataRow.appendChild(td);
                    }
                    innerTable.appendChild(innerTableDataRow);
                }

                innerTableDiv.appendChild(innerTable)
                outerWrapper.append(innerTableDiv);
            }
        }


    },
    createTableElement: function(){
        return document.createElement("table");
    },
    createTableRow: function(){
        return document.createElement("tr");
    },
    createTableHeader: function(){
        return document.createElement("th");
    },
    createTableData: function(){
        return document.createElement("td");
    },
    createDiv: function(){
        return document.createElement("div");
    },
    createH4: function(){
        return document.createElement("h4");
    },
    setParameters: function(rawParameters){
        x = 2;
        parameters = JSON.parse(rawParameters);

        // Sets the chosen particulate matter
        cartLogic.setParticulateParameter(parameters);
        cartLogic.setOperationParameter(parameters);
        cartLogic.setLimitParameter(parameters);
        cartLogic.setDateParameters(parameters);
    },
    setParameterValueByName: function(name, value){
        document.getElementsByName(name)[0] = value;
    },
    setParameterValueById: function(id, value){
        document.getElementById(id) = value;
    },
    setParticulateParameter: function(params){
        // Checks all the different particulate matter types
        if(params["pm1"]){
            document.getElementsByName("pm1")[0].checked = true;
        }
        if(params["pm10"]){
            document.getElementsByName("pm10")[0].checked = true;
        }
        if(params["pm2.5"]){
            document.getElementsByName("pm2.5")[0].checked = true;
        }
        if(params["no"]){
            document.getElementsByName("no")[0].checked = true;
        }
        if(params["co"]){
            document.getElementsByName("co")[0].checked = true;
        }
        if(params["Temperature"]){
            document.getElementsByName("Temperature")[0].checked = true;
        }
        if(params["Humidity"]){
            document.getElementsByName("Humidity")[0].checked = true;
        }
    },
    setOperationParameter: function(params){
        document.getElementById(params["operation"]).checked = true;
    },
    setLimitParameter: function(params){
       document.getElementsByName("limit")[0] = params["limit"];
    },
    setDateParameters: function(params){
        document.getElementById("from-date").value = params["from-date"];
        document.getElementById("from-time").value = params["from-time"];
        document.getElementById("to-date").value = params["to-date"];
        document.getElementById("to-time").value = params["to-time"];
    },
    getModal: function(){
        return document.getElementById('myModal');
    }


};


const graphLogic ={
    currentId: null,
    graphDataKeys: null,
    init: function(){

        // Sets up event handler for the bar radio button
        document.getElementById("bar-graph").addEventListener("click", function(){
            // var keys = cartLogic.getDataKeys(graphLogic.currentId);
            var keys = graphLogic.graphDataKeys;
            var barData = graphLogic.formatBarGraphData(keys, cartLogic.queryDataSet[graphLogic.currentId]);
            graphLogic.loadBarGraph(barData);
        });

        // Sets up the event handler for the circle graph radio button
        document.getElementById("circle-graph").addEventListener("click", function(){
            var keys = graphLogic.graphDataKeys;
            // var keys = cartLogic.getDataKeys(graphLogic.currentId);
            var graphData = graphLogic.turnObjectsToListOfData(keys, cartLogic.queryDataSet[graphLogic.currentId]);
            graphLogic.loadCircleGraph(graphData);
        })
    },
    formatBarGraphData: function(keys, data){
        var outData = []

        var noCaps = ["Temperature", "Humidity"];
        // Structure that will hold each looped item
        var dataDict = {}
        // Adds the description
        outData.push(["Particulate"]);
        // Adds each key as a field
        keys.forEach(function(key){
            if(noCaps.includes(key)){
                outData[0].push(key);
                dataDict[key] = 0;
            }
            else{
                outData[0].push(key.toUpperCase());
                dataDict[key.toUpperCase()] = 0;
            }
        });

        var i = 0;
        for(; i < data.length; i++){
            keys.forEach(function(key){
                if(noCaps.includes(key)){
                    dataDict[key] += data[i][key];
                }
                else{
                    dataDict[key.toUpperCase()] += data[i][key.toUpperCase()];

                }
            });

            // Every fifth row, average and create a bar graph grow
            if( i % 5 == 4 || i == data.length - 1){
                var j = 1;
                var newRow = []
                // Push a multiple of 5
                newRow.push((i + 1).toString());

                // Go through each key pushed to the title and add the values averaged over 5 minute intervals
                for( ; j < outData[0].length; j++){
                    var mod = i == data.length - 1 ? i % 5 : 5;
                    // Special case where there's 0th row
                    mod = mod == 0 ? 1 : mod;
                    newRow.push(dataDict[outData[0][j]] / mod);
                }
                // Push the new data row to the out data
                outData.push(newRow);

                // Clear the dictionary.
                keys.forEach(function(key){
                    if(noCaps.includes(key)){
                        dataDict[key] = 0;

                    }
                    else{
                        dataDict[key.toUpperCase()] = 0;
                    }
                });
            }

        }
        return outData;
    },
    loadBarGraph:function(data){
        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(function(){
            drawBarGraph(data);
        });

        function drawBarGraph(dataSet){
            // var data = google.visualization.arrayToDataTable([
            //     ['Year', 'Sales', 'Expenses', 'Profit'],
            //     ['2014', 1000, 400, 200],
            //     ['2015', 1170, 460, 250],
            //     ['2016', 660, 1120, 300],
            //     ['2017', 1030, 540, 350]
            //   ]);

            var data = google.visualization.arrayToDataTable(dataSet);
    
            var options = {
            chart: {
                title: 'Average Particulate.',
                subtitle: '5 Minute average over last hour of query time.',
            }
            };
    
            var chart = new google.charts.Bar(document.getElementsByClassName('piechart_3d')[0]);
    
            chart.draw(data, google.charts.Bar.convertOptions(options));
        }
    },
    loadCircleGraph: function(data){
        google.charts.load("current", {packages:["corechart"]});
        google.charts.setOnLoadCallback(function(){
            drawGraph(data);
        });

        function drawGraph(dataSet){
            var data = google.visualization.arrayToDataTable(dataSet);
            var options = {
                title: 'Measurement Distribution',
                is3D: true,
            };
        
            var chart = new google.visualization.PieChart(document.getElementsByClassName('piechart_3d')[0]);
            chart.draw(data, options);
        }
    },
    turnObjectsToListOfData: function(keys, values){
        var outData = [];
        outData.push(["Particulate", "Average"])

        // Don't need to uppercase these fields
        notUpper = ["Temperature", "Humidity"]
        keys.forEach(function(key){
            var current = []
            // current.push(key);
            if(notUpper.includes(key))
                current.push(key);
            else
                current.push(key.toUpperCase());
            

            var count = 0;
            var total = 0;
            values.forEach(function(obj){
                // total += obj[key];
                if(notUpper.includes(key))
                    total += obj[key];
                else
                    total += obj[key.toUpperCase()];
                count += 1;
            });

            value = total/count;
            if(value < 0)
                current.push(0);
            else
                current.push(value);
            // current.push(total/count);
            outData.push(current);
        });
        return outData;
    }
    
}

cartLogic.init();
graphLogic.init();