let canvas = new fabric.Canvas("canvas");
let wireframe = $(".wireframe");
var urlString;
const bordercolor = "black";
var backgroundcolor = "#ffffff";
let fillcolor = "#ffffff";
var fontcolor = "#000000";
const strokeWidth = 1;
const fontFamily = "'Patrick Hand SC', cursive";

//FUNCTION TO GET OLD CANVAS
let getCanvas = (string) => {
    $.ajax({
        url: window.location.origin + "/api" + string,
        success: (data) => {
            urlString = data[0].url_string;
            let wireframeObject = data[0].wireframe_object;
            backgroundcolor = data[0].background_color;
            fillcolor = data[0].fill_color;
            fontcolor = data[0].font_color;
            $("#canvas").css("background-color", backgroundcolor);
            canvas.loadFromJSON(JSON.parse(wireframeObject));
        },
        error: err => {
            if(err.status == 404) {
                window.location.href = "./404";
                return;
            }
        }
    });
};

//ON LOAD, CHECK IF USER WANT TO ACCESS OLD CANVAS OR HAS WORKED ON ONE RECENTLY
if(window.location.pathname != "/") {
    getCanvas(window.location.pathname);
} else {
    $.ajax({
        url: window.location.origin + "/api/hasCookie",
        success: (data) => {
            if(data.cookie) {
                urlString = data.cookie;
                $(".cookie-overlay-shadow").removeClass("hidden");
            } else {
                return;
            }
        }
    });
}

//HANDLE CASE WHEN USER HAS COOKIES
$(".load-old-canvas").click(() => {
    getCanvas("/" + urlString);
    window.history.pushState("", "", "/" + urlString);
    $(".cookie-overlay-shadow").addClass("hidden");
});

$(".start-new-canvas").click(() => {
    $(".cookie-overlay-shadow").addClass("hidden");
});


//CREATORFUNCTIONS
let createRect = (left = 50, top = 50, width = 200, height = 50) => {
    rect = new fabric.Rect({
        left,
        top,
        fill: fillcolor,
        width,
        height,
        strokeWidth,
        stroke: bordercolor,
    });
    return canvas.add(rect);
};

let createCircle = (left = 100, top = 100, radius = 50) => {
    circle = new fabric.Circle({
        radius,
        fill: fillcolor,
        left,
        top,
        strokeWidth,
        stroke: bordercolor
    });
    return canvas.add(circle);
};

let createImage = (left = 50, top = 50, width = 200, height = 70) => {
    image = new fabric.Rect({
        left,
        top,
        fill: 'white',
        width,
        height,
        stroke: "black",
        strokeWidth
    });
    let line1 = new fabric.Line([left, top, width + left, top + height], {
        stroke: "black",
    });
    let line2 = new fabric.Line([left, top + height, width + left, top], {
        stroke: "black"
    });
    let group = new fabric.Group([image, line1, line2]);
    canvas.add(group);
};

let createText = (left = 50, top = 50, width = 200, height = 30) => {
    var textDefault = "Your text "
    var txtBoxConfig = {
        left,
        top,
        fontSize: 24,
        fontFamily,
        textAlign: 'left',
        width,
        height,
        backgroundColor: fillcolor,
        shadow: new fabric.Shadow( { color: 'rgba(0,0,0,0.3)', offsetX: 0.05, offsetY: 0.05 }),
        borderColor: bordercolor,
        fill: fontcolor
    };


    text = new fabric.Textbox(textDefault, txtBoxConfig);

    canvas.add(text);
};

let createHeading = (left = 50, top = 50, width = 200, height = 60) => {
    var textDefault = "Your Heading";
    var txtBoxConfig = {
        left,
        top,
        fontSize: 32,
        fontFamily,
        textAlign: 'left',
        width,
        height,
        backgroundColor: fillcolor,
        shadow: new fabric.Shadow( { color: 'rgba(0,0,0,0.3)', offsetX: 0.05, offsetY: 0.05 }),
        borderColor: bordercolor,
        fill: fontcolor
    };

    text = new fabric.Textbox(textDefault, txtBoxConfig);
    canvas.add(text);
};

let createInputField = (left = 50, top = 50, width = 130, height = 30) => {
    let text = new fabric.Text("|" ,{
        left: left + 10,
        top: top + 2,
        fontFamily,
        fontSize: 20,
        textAlign: "center",
    });

    var box = new fabric.Rect({
        left,
        top,
        fill: "white",
        width,
        height,
        strokeWidth,
        ry: 10,
        stroke: bordercolor,
    });

    var group = new fabric.Group([box, text]);
    canvas.add(group);
};

let createButton = (left = 50, top = 50, width = 70, height = 30) => {
    button = new fabric.Rect({
        left,
        top,
        fill: "rgb(209, 210, 211)",
        width,
        height,
        strokeWidth,
        ry: 10,
    });
    text = new fabric.Text("button", {
        left: left + width/2 - 26,
        top: top + height/2 - 11,
        fontFamily,
        fontSize: 20,
        textAlign: "left",
    });

    group = new fabric.Group([button, text]);
    canvas.add(group);
};

let createGhost = (left, top, width, height) => {
    ghostRect = new fabric.Rect({
        id: 1,
        left,
        top,
        fill: "rgba(172, 136, 241, 0.4)",
        width,
        height,
        strokeWidth: strokeWidth,
        stroke: bordercolor,
    });
    return canvas.add(ghostRect);
};

let removeGhost = () => {
    let objects = canvas.getObjects();
    objects.forEach(object => {
        if (object.id == 1) {
            canvas.remove(object);
        }
    });
};

//CREATING DEFAULT ELEMENTS ON BUTTON
$(".create-rect").on("click", function() {
    createRect();
});

$(".create-circle").on("click", () => {
    createCircle();
});

$(".create-image").on("click", () => {
    createImage();
});

$(".create-text").on("click", () => {
    createText();
});

$(".create-heading").on("click", () => {
    createHeading();
});

$(".create-inputfield").on("click", () => {
    createInputField();
});

$(".create-button").on("click", () => {
    createButton();
});


//KEYBOARD SHORTCUTS
var copiedObjects = [];
let onKeyDownHandler = (e) => {
    e = e || window.event;
    var key = e.which || e.keyCode;
    var ctrl = e.ctrlKey ? e.ctrlKey : ((key === 17) ? true : false);
    let activeObject = canvas.getActiveObject();

    //DELETE OBJ ON ESC
    if(e.keyCode == 46) {
        let activeObject = canvas.getActiveObject();
        canvas.remove(activeObject);
        $(".element-x").html("x: 0");
        $(".element-y").html("y: 0");
        $(".element-height").html("height: 0");
        $(".element-width").html("width: 0");
        $(".adding-new-element").remove();
        return;
    }

    //COPY OBJ ON CTRL + C
    else if(ctrl && e.keyCode == 67) {
        copiedObjects = [];
        activeObject = canvas.getActiveObject();

        //if more than one obj is selected
        if(activeObject._objects)  {
            Object.keys(activeObject._objects).forEach(object => {
                copiedObjects.push(activeObject._objects[object]);
            });
            return;
        }

        copiedObjects.push(activeObject);
    }

    //PASTE OBJ ON CTRL + V
    else if(ctrl && e.keyCode == 86) {
        copiedObjects.forEach(object => {
            paste(object);
        });
    }

    //CUT OBJ ON CTRL + X
    else if(ctrl && e.keyCode == 88) {
        copiedObjects = [];
        activeObject = canvas.getActiveObject();
        copiedObjects.push(activeObject);
        canvas.remove(activeObject);
        return;
    }
};

function paste(object) {
    object.clone(function (cloned) {
        canvas.discardActiveObject();
        cloned.set({
            top: cloned.top + 20,
            evented: true
        });
        if (cloned.type === 'activeSelection') {
            // active selection needs a reference to the canvas.
            cloned.canvas = canvas;
            cloned.forEachObject(function (obj) {
                canvas.add(obj);
            });
            cloned.setCoords();
        } else {
            canvas.add(cloned);
        }
        canvas.setActiveObject(cloned);
        canvas.requestRenderAll();
    });
}


//RIGHT MOUSECLICK EVENTS
let mouseDownHandler = (e) => {
    var activeObject = canvas.getActiveObject();
    let pageX = e.pageX;
    let pageY = e.pageY;

    if(activeObject) {
        e.preventDefault();
        $("body ").append(() => {
            return `<div class='context-menu'>
            <div class="copy">Copy</div>
            <div class="cut">Cut</div>
            <div class="paste">Paste</div>
            <div class = "group">Group</div>
            <div class="ungroup">Ungroup</div>
            <div class="change-color">Change Color
                <input id='individual-color-picker'/>
            </div>
            <div class="send-front">Bring one layer up</div>
            <div class="send-very-front">Bring to front</div>
            <div class="send-back">Send one layer back</div>
            <div class="send-very-back">Send to back</div>
        </div>`;
        });
        $(".context-menu").css("left", pageX);
        $(".context-menu").css("top", pageY);
        $(".copy").off().click(() => {
            copiedObjects = [];
            copiedObjects.push(activeObject);
        });
        $(".paste").off().click(() => {
            copiedObjects.forEach(object => {
                paste(object);
            });
        });
        $(".cut").off().click(() => {
            copiedObjects = [];
            copiedObjects.push(activeObject);
            $(".context-menu").remove();
            canvas.remove(activeObject);
        });
        $(".group").off().click(() => {
            var objs = canvas.getActiveObjects();
            if(objs.length > 1) {
                let left = [];
                let top = [];
                let toGroup = objs.map(object => {
                    left.push(object.aCoords.tl.x);
                    top.push(object.aCoords.tl.y);
                    return object.set("active", true);
                });

                let minLeft = left.reduce((a, b) => {
                    return Math.min(a,b);
                });
                let minTop = top.reduce((a,b) => {
                    return Math.min(a,b);
                });

                let group = new fabric.Group(toGroup, {
                    left: minLeft,
                    top: minTop
                });
                canvas.activeObject = null;

                canvas.add(group);
                toGroup.forEach(obj => {
                    return canvas.remove(obj);
                });
            }
        });
        $(".ungroup").off().click(() => {
            let activeGroup = canvas.getActiveObject();
            var destroyedGroup = activeGroup.destroy();
            var items = destroyedGroup.getObjects();

            items.forEach(item => {
                canvas.add(item);
            });

            canvas.remove(activeGroup);
        });
        $("#individual-color-picker").spectrum({
            preferredFormat: "hex",
            color: "#ffffff",
            showInput: true
        });
        $("#individual-color-picker").change(function() {
            let activeObject = canvas.getActiveObject();
            activeObject.set("fill", this.value);
            canvas.renderAll();
            $(".context-menu").remove();
        });
        $(".send-front").off().click(() => {
            canvas.bringForward(activeObject);
        });
        $(".send-very-front").off().click(() => {
            canvas.bringToFront(activeObject);
        });
        $(".send-back").off().click(() => {
            canvas.sendBackwards(activeObject);
        });
        $(".send-very-back").off().click(() => {
            canvas.sendToBack(activeObject);
        });
        $(document).on("click", function() {
            $(".context-menu").remove();
        });
    }
};


//DETECTING CURSOR POSITION IN CANVAS
$(".wireframe").mousemove((e) => {
    $(".cursor-x").html("x: " + (Math.round(e.pageX - wireframe.offset().left)));
    $(".cursor-y").html("y: " + (Math.round(e.pageY - wireframe.offset().top)));
});

//DETECTING OBJECT POSITION IN CANVAS:
canvas.on('object:selected', function(e) {
    $(".element-x").html("x: " + Math.round(e.target.left));
    $(".element-y").html("y: " + Math.round(e.target.top));
    $(".element-height").html("height: " + Math.round(e.target.height));
    $(".element-width").html("width: " + Math.round(e.target.width));

    canvas.on("object:moving", (e) => {
        $(".element-x").html("x: " + Math.round(e.target.left));
        $(".element-y").html("y: " + Math.round(e.target.top));
    });

    canvas.on("object:modified", (e) => {
        $(".element-height").html("height: " + Math.round(e.target.height * e.target.scaleY));
        $(".element-width").html("width: " + Math.round(e.target.width * e.target.scaleX));
    });

});


//SAVING
$("#save-button").click(function(){
    let json = JSON.stringify(canvas);
    if(!urlString) {
        urlString = makeid();
    }


    let data = [json, backgroundcolor, fontcolor, fillcolor];
    let send = JSON.stringify(data);

    $.ajax({
        url: '/api/' + urlString,
        method: 'POST',
        contentType: "application/json",
        data: send,
        success: () => {
            window.history.pushState("", "", "/" + urlString);
            $(".canvas-saved").html("Canvas saved as <div class='highlight'>" + window.location.origin + "/" + urlString + "</div>");
            $(".canvas-saved").removeClass("hidden");
            setTimeout(() => {
                $(".canvas-saved").addClass("hidden");
            }, 10000);
        },
        error: (err) => {
            console.log(err);
        }
    });
});

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


//SETTINGS SECTION
$("#settings-button").on("click", () => {
    $(".settings-layover").addClass("visible");
    $(".settings").addClass("visible");
});

$(".settings-layover").on("click", () => {
    $(".settings-layover").removeClass("visible");
    $(".settings").removeClass("visible");
});

$(".close-button").on("click", () => {
    $(".settings-layover").removeClass("visible");
    $(".settings").removeClass("visible");
});

//VIEW SETTINGS
$(".view-settings input:checkbox").change( function() {
    $('.view-settings input[type="checkbox"]').not(this).prop('checked', false);

    if($("#view-grid").is(":checked")){
        $("#canvas").css("background-image", 'linear-gradient(to right, rgb(234, 236, 239) 0.5px, transparent 1px), linear-gradient(to bottom, rgb(234, 236, 239) 0.5px, transparent 1px)');
        $("#canvas").css("background-size", "20px 20px");
        $("#canvas").css("background-position", "0 0");
        $("#grid-size").toggle();
    } else if ($("#view-column").is(":checked")){
        $("#canvas").css("background-size", "100px 100px");
        $("#canvas").css("background-position", "25px 5px");
        $("#canvas").css("background-image", "linear-gradient(to right,  #ffe6e6 70px, transparent 1px)");
        $("#grid-size").css("display", "none");
    } else {
        $("#canvas").css("background-image", "none");
        $("#grid-size").css("display", "none");
    }
});

//LAYOUT SETTINGS
$(".layout-settings input:checkbox").change(function() {
    $('.layout-settings input[type="checkbox"]').not(this).prop('checked', false);

    if($("#phone-layout").is(":checked")){
        $("#canvas").width("375");
        $("#canvas").height("667");
        $(".wireframe").width("375");
        $(".wireframe").height("667");
    } else if ($("#tablet-layout").is(":checked")){
        $("#canvas").width("614");
        $("#canvas").height("756");
        $(".wireframe").width("614");
        $(".wireframe").height("756");
    } else {
        $("#canvas").width("1024");
        $("#canvas").height("600");
        $(".wireframe").width("1024");
        $(".wireframe").height("600");
    }
});

$("#grid-size").on("change", () => {
    let input = $("#range-bar")[0].value+"px";
    let prop = input + " " + input;
    $("#range-number").html(input);
    $("#canvas").css("background-size", prop);
});

//STYLING SETTINGS
$("#colorpicker").spectrum({
    preferredFormat: "hex",
    color: "#ffffff",
    showInput: true,
    allowEmpty:true
});

$("#backgroundcolorpicker").spectrum({
    preferredFormat: "hex",
    color: backgroundcolor,
    showInput: true
});

$("#backgroundcolorpicker").change(function() {
    backgroundcolor = this.value;
    $("#canvas").css("background-color", backgroundcolor);
});

$(".font-color").change(function() {
    fontcolor = this.value;
});

$("#colorpicker").change(function() {
    fillcolor = this.value;
});



//ADDING ELEMENTS ON MOUSEDRAG
var isDragging = false;
$(".wireframe").off("mousedown").mousedown((e) => {
    isDragging = false;
    let initialX = e.pageX;
    let initialY = e.pageY;

    $(".wireframe").mousemove(() => {
        isDragging = true;
    });
    $(".wireframe").off("mouseup").mouseup((evt) => {
        var wasDragging = isDragging;
        isDragging = false;
        let activeObject = canvas.getActiveObject();
        var finalX = evt.pageX;
        var finalY = evt.pageY;

        let left = initialX < finalX ? initialX - $(".wireframe").offset().left : finalX - $(".wireframe").offset().left;

        let top = initialY < finalY ? initialY - $(".wireframe").offset().top : finalY - $(".wireframe").offset().top;

        let width = Math.abs(initialX - finalX);
        let height = Math.abs(initialY - finalY);

        if(wasDragging && width > 30 && height > 30 && !activeObject) {

            $("body").append("<div class='adding-new-element'></div>");

            $(".adding-new-element").css("left", initialX - (initialX - finalX));
            $(".adding-new-element").css("top", initialY - (initialY - finalY));

            createGhost(left, top, width, height);


            $(".adding-new-element").html(`
                <button class="create-rect-page">Rectangle</button>
                <button class="create-circ-page">Circle</button>
                <button class="create-img-page">Image</button>
                <button class="create-text-page">Text</button>
                <button class="create-heading-page">Heading</button>
                <button class="create-inputfield-page">Inputfield</button>
                <button class="create-button-page">Button</button>
                <img src="close.png" class="img close-new-elem" />
                `);


            $(".create-rect-page").click(() => {
                createRect(left, top, width, height);
                $(".adding-new-element").remove();
                removeGhost();
            });

            $(".create-circ-page").click(() => {
                createCircle(left, top, width/2);
                $(".adding-new-element").remove();
                removeGhost();
            });
            $(".create-img-page").click(() => {
                createImage(left, top, width, height);
                $(".adding-new-element").remove();
                removeGhost();
            });
            $(".create-text-page").click(() => {
                createText(left, top, width, height);
                $(".adding-new-element").remove();
                removeGhost();
            });
            $(".create-heading-page").click(() => {
                createHeading(left, top, width, height);
                $(".adding-new-element").remove();
                removeGhost();
            });
            $(".create-inputfield-page").click(() => {
                createInputField(left, top, width, height);
                $(".adding-new-element").remove();
                removeGhost();
            });
            $(".create-button-page").click(() => {
                createButton(left, top, width, height);
                $(".adding-new-element").remove();
                removeGhost();
            });
            $(".close-new-elem").click(() => {
                $(".adding-new-element").remove();
                removeGhost();
            });

        }
    });
});

document.oncontextmenu = mouseDownHandler;
document.onkeydown = onKeyDownHandler;
