let canvas = new fabric.Canvas("canvas");
let wireframe = $(".wireframe");
var rect, circle, image, text, textbox, button, group, heading;
const bordercolor = "black";
const backgroundcolor = "white";
const strokeWidth = 2;
const fontFamily = "'Patrick Hand SC', cursive"

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

console.log(fabric);

$(".create-circle").on("click", () => {
    circle = new fabric.Circle({
        radius: 50,
        fill: backgroundcolor,
        left: 100,
        top: 100,
        strokeWidth: 2,
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
        strokeWidth: 2
    });
    canvas.add(image);
});

$(".create-text").on("click", () => {
    text = new fabric.Text("yoyo", {
        fontSize: 24,
        fontFamily,
        left: 50,
        top: 50
    });
    canvas.add(text);
});

$(".create-heading").on("click", () => {
    heading = new fabric.Text("heading", {
        fontSize: 32,
        fontFamily,
        left: 50,
        right: 50
    });
    canvas.add(heading);
});

$(".create-textbox").on("click", () => {
    let text = "your input";

    var txtBoxConfig = {
        fontSize: 24,
        fontFamily: fontFamily,
        textAlign: 'left',
        width: 200,
        height: 60,
        backgroundColor: backgroundcolor,
        shadow: new fabric.Shadow( { color: 'rgba(0,0,0,0.3)', offsetX: 0.05, offsetY: 0.05 }),
        borderColor: bordercolor
    };
    textbox = new fabric.Textbox(text, txtBoxConfig);
    canvas.add(textbox);
});

$(".create-button").on("click", () => {
    button = new fabric.Rect({
        left: 50,
        top: 50,
        fill: "rgb(209, 210, 211)",
        width: 70,
        height: 30,
        strokeWidth: 2,
        ry: 10,
    });
    text = new fabric.Text("button", {
        left: 60,
        top: 52,
        fontFamily: fontFamily,
        fontSize: 20,
        textAlign: "center",
    });
    group = new fabric.Group([button, text]);
    canvas.add(group);
});



let onKeyDownHandler = (e) => {
    if(e.keyCode == 46) {
        var activeObject = canvas.getActiveObject();
        canvas.remove(activeObject);
        return;
    }
};



$(".wireframe").mousemove((e) => {
    $(".cursor-x").html("x: " + (Math.round(e.pageX - wireframe.offset().left)));
    $(".cursor-y").html("y: " + (Math.round(e.pageY - wireframe.offset().top)));
});

var isDragging;
$("body").mousedown((e) => {
    isDragging = false;
    $("body").mousemove((e) => {
        isDragging = true;
        //console.log(e.pageX, e.pageY);

    });
    $("body").mouseup(() => {
        $("body").off("mousemove");
    });
});

document.onkeydown = onKeyDownHandler;
