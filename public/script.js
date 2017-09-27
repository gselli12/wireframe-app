let canvas = new fabric.Canvas("canvas");
let wireframe = $(".wireframe");
var rect, circle, image, text, inputfield, button, group, heading, urlString;
const bordercolor = "black";
const backgroundcolor = "white";
const strokeWidth = 2;
const fontFamily = "'Patrick Hand SC', cursive";

console.log(window.location);

//IF USER WANTS TO ACCESS SAVED CANVAS, LOAD IT
if(window.location.pathname != "/") {
    $.ajax({
        url: window.location.origin + "/api" + window.location.pathname,
        success: (data) => {
            urlString = data[0].url_string;
            let wireframeObject = data[0].wireframe_object;
            canvas.loadFromJSON(wireframeObject);
        },
        error: err => {
            if(err.status == 404) {
                window.location.href = "./404";
                return;
            }
        }
    });
}

$(".create-rect").on("click", () => {
    rect = new fabric.Rect({
        left: 50,
        top: 50,
        fill: backgroundcolor,
        width: 200,
        height: 50,
        strokeWidth: 2,
        stroke: bordercolor,

    });
    canvas.add(rect);
});

$(".create-circle").on("click", () => {
    circle = new fabric.Circle({
        radius: 50,
        fill: backgroundcolor,
        left: 100,
        top: 100,
        strokeWidth,
        stroke: bordercolor
    });
    canvas.add(circle);
});

$(".create-image").on("click", () => {
    image = new fabric.Rect({
        left: 50,
        top: 50,
        fill: 'grey',
        width: 200,
        height: 70,
        strokeWidth
    });
    canvas.add(image);
});

$(".create-text").on("click", () => {
    var textDefault = "Your text"
    var txtBoxConfig = {
        fontSize: 24,
        fontFamily,
        textAlign: 'left',
        width: 200,
        height: 60,
        backgroundColor: backgroundcolor,
        shadow: new fabric.Shadow( { color: 'rgba(0,0,0,0.3)', offsetX: 0.05, offsetY: 0.05 }),
        borderColor: bordercolor
    };

    text = new fabric.Textbox(textDefault, txtBoxConfig);
    canvas.add(text);
});

$(".create-heading").on("click", () => {
    var textDefault = "Your Heading";
    var txtBoxConfig = {
        fontSize: 32,
        fontFamily,
        textAlign: 'left',
        width: 200,
        height: 60,
        backgroundColor: backgroundcolor,
        shadow: new fabric.Shadow( { color: 'rgba(0,0,0,0.3)', offsetX: 0.05, offsetY: 0.05 }),
        borderColor: bordercolor
    };

    heading = new fabric.Text("heading", {
        fontSize: 32,
        fontFamily,
        left: 50,
        right: 50
    });

    text = new fabric.Textbox(textDefault, txtBoxConfig);
    canvas.add(text);
});

$(".create-inputfield").on("click", () => {
    let text = new fabric.Text("|" ,{
        left: 60,
        top: 52,
        fontFamily,
        fontSize: 20,
        textAlign: "center",
    });

    var box = new fabric.Rect({
        left: 50,
        top: 50,
        fill: "white",
        width: 100,
        height: 30,
        strokeWidth,
        ry: 10,
        stroke: bordercolor,
    });

    var group = new fabric.Group([box, text]);
    canvas.add(group);
});

$(".create-button").on("click", () => {
    button = new fabric.Rect({
        left: 50,
        top: 50,
        fill: "rgb(209, 210, 211)",
        width: 70,
        height: 30,
        strokeWidth,
        ry: 10,
    });
    text = new fabric.Text("button", {
        left: 60,
        top: 52,
        fontFamily,
        fontSize: 20,
        textAlign: "center",
    });
    group = new fabric.Group([button, text]);
    canvas.add(group);
});


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
        activeObject = canvas.getActiveObject()
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
        $("body ").append((e) => {
            return `<div class='context-menu'>
            <div class="copy">Copy</div>
            <div class="cut">Cut</div>
            <div class="paste">Paste</div>
            <div class = "group">Group</div>
            <div class="ungroup">Ungroup</div>
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
        $(".group").off().click((e) => {
            var objs = canvas.getActiveObjects();
            if(objs.length > 1) {
                let left = [];
                let top = [];
                let toGroup = objs.map(object => {
                    left.push(object.aCoords.tl.x);
                    top.push(object.aCoords.tl.y)
                    return object.set("active", true);
                });

                let minLeft = left.reduce((a, b) => {
                    return Math.min(a,b);
                })
                let minTop = top.reduce((a,b) => {
                    return Math.min(a,b);
                })

                let group = new fabric.Group(toGroup, {
                    left: minLeft,
                    top: minTop
                });
                canvas.activeObject = null;

                canvas.add(group);
                toGroup.forEach(obj => {
                    return canvas.remove(obj)
                })
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

    $.ajax({
        url: '/api/' + urlString,
        method: 'POST',
        contentType: "application/json",
        dataType:'json',
        data: json,
        success: (data) => {
            console.log("saved");
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

//SETTINGS OPTIONS
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

$(".layout-settings input:checkbox").change(function() {
    $('.layout-settings input[type="checkbox"]').not(this).prop('checked', false);

    if($("#phone-layout").is(":checked")){
        $("#canvas").width("375");
        $("#canvas").height("667");
    } else if ($("#tablet-layout").is(":checked")){
        $("#canvas").width("614");
        $("#canvas").height("756");
    } else {
        $("#canvas").width("1024");
        $("#canvas").height("600");
    }
});

$("#grid-size").on("change", () => {
    let input = $("#range-bar")[0].value+"px";
    let prop = input + " " + input;
    $("#range-number").html(input);
    $("#canvas").css("background-size", prop);
});

// var isDragging;
// $("body").mousedown((e) => {
//     isDragging = false;
//     $("body").mousemove((e) => {
//         isDragging = true;
        //console.log(e.pageX, e.pageY);
//
//     });
//     $("body").mouseup(() => {
//         $("body").off("mousemove");
//     });
// });

document.oncontextmenu = mouseDownHandler;
document.onkeydown = onKeyDownHandler;
