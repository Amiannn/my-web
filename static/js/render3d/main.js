document.writeln("<script type='text/javascript' src='static/js/render3d/vector3d.js'></script>");
document.writeln("<script type='text/javascript' src='static/js/render3d/mesh3d.js'></script>");
document.writeln("<script type='text/javascript' src='static/js/render3d/camera3d.js'></script>");
document.writeln("<script type='text/javascript' src='static/js/render3d/render3d.js'></script>");

function initialize(path)
{
        // open mesh file
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var meshjson = JSON.parse(this.responseText);
                var mymesh = new mesh3d(meshjson);
                main(mymesh)
            }
        };
        xmlhttp.open("GET", path, true);
        xmlhttp.send();
}

function main(myMesh)
{
    var myCanvas = document.getElementById('mainCanvas');
    var myCamera = new camera3d(5, 10, 5, -5, -5, -5);
    var myRender = new render3d(myCanvas);
    setInterval(moveCamera, 10);
    // myRender.run(myCamera, myMesh, 100);
    var pAngle = 0.5;
    var pDirection = 1;
    var aAngle = 1;
    var aDirection = 1;

    // event contorll
    myCanvas.addEventListener("mousewheel", zoomCanvas, false);
    myCanvas.addEventListener("mousedown", dragCanvasDown, false);
    myCanvas.addEventListener("mouseup", dragCanvasUp, false);
    myCanvas.addEventListener("mousemove", getCursorPos, false);

    // drag
    var mouse_x = 0;
    var mouse_y = 0;
    var down_x = 0;
    var down_y = 0;
    var drag_contorll = false;

    // select event
    var select = document.getElementById("mesh_selector");
    select.addEventListener("change", selectedMeshChange);

    function selectedMeshChange()
    {
        var mesh_file = ["box.json", "book.json", "funct.json"];
        var path = '/static/js/render3d/meshs/';
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var meshjson = JSON.parse(this.responseText);
                myMesh.meshjson = meshjson;
                myMesh.build_mesh();
            }
        };
        xmlhttp.open("GET", path+mesh_file[select.value - 1], true);
        xmlhttp.send();
    }

    function getCursorPos(e) 
    {
        var a, x = 0, y = 0;
        e = e || window.event;
        a = myCanvas.getBoundingClientRect();
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        mouse_x = x;
        mouse_y = y;
    }
    
    function dragCanvasDown(event)
    {
        down_x = mouse_x;
        down_y = mouse_y;
    }

    function dragCanvasUp(event)
    {
        var delta_x = mouse_x - down_x;
        var delta_y = mouse_y - down_y;
        var scale = 0.01;
        aAngle += -delta_x * scale;
        pAngle += delta_y * scale;
        console.log('up x:'+delta_x + ' y:'+delta_y);
    }
    
    function zoomCanvas(event)
    {
        event.preventDefault();
        var e = window.event || event;
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        if(delta == 1)
        {
            myRender.zoomScale += 10;
        }
        else
        {
            if(myRender.zoomScale < 0)
                myRender.zoomScale = 0;
            else
                myRender.zoomScale -= 10;
        }
    }

    function moveCamera()
    {
        myCamera.pos.azimuth_angle += aAngle * aDirection;
        if (Math.abs(myCamera.pos.azimuth_angle + aAngle * aDirection) > 90)
            aDirection *= 1
        
        myCamera.pos.polar_angle += pAngle * pDirection;
        if (Math.abs(myCamera.pos.polar_angle + pAngle * pDirection) > 90)
            pDirection *= -1
        
        aAngle *= 0.999;
        pAngle *= 0.999;
        myCamera.pos.toCartesian();
        myCamera.pos.toSpherical();
        // console.log(myCamera.pos.polar_angle)
        
        var nx = -myCamera.pos.x;
        var ny = -myCamera.pos.y;
        var nz = -myCamera.pos.z;
        
        myCamera.set_normalvector(nx, ny, nz)

        // myCamera.move_position(0, -1, 0);
        myRender.run(myCamera, myMesh);
        
    }
}