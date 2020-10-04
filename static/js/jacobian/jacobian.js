class Jacobian
{
    constructor(canvasIds)
    {
        this.id = canvasIds[0];
        this.canvas = document.getElementById(this.id);
        this.canvas2 = document.getElementById(this.id+'2');
        this.subCanvas = document.getElementById(canvasIds[1]);
        this.subCanvas2 = document.getElementById(canvasIds[1]+'2');
        this.funct_index = 1;
        // this.canvas.addEventListener("mousemove", this.zoomIn);
        // this.canvas.addEventListener("touchmove", this.zoomIn);
        this.height = this.canvas.height;
        this.width  = this.canvas.width;
        if(this.canvas.getContext){
            this.ctx = this.canvas.getContext("2d");
            this.ctx2 = this.canvas2.getContext("2d");
            this.subCtx = this.subCanvas.getContext("2d");
            this.subCtx2= this.subCanvas2.getContext("2d");
        }
        this.grids = this.create_grids(640, 1280, [-5, 5], [-10, 10])
        this.transform_grids = this.transform(this.grids);
        this.spaces = 60;
        this.step = 30;
        this.dataURL = '';
    }
    
    subTransform(pos)
    {
        var px = (pos.x - this.width/2)  / this.spaces;
        var py = (this.height/2 - pos.y) / this.spaces;
        var subGrids = this.create_grids(10, 10, [py-0.05, py+0.05], [px-0.05, px+0.05]);
        var traGrids = this.transform(subGrids);

        this.subCtx.clearRect(0, 0, this.subCanvas.width, this.subCanvas.height);
        this.subCtx2.clearRect(0, 0, this.subCanvas.width, this.subCanvas.height);
        
        var mx = Math.floor(subGrids[0].length / 2);
        var my = Math.floor(subGrids.length / 2);
        var spaces = 3000;
        var colors = [[0, 128, 0, 0.2], [0, 0, 128, 0.2]]

        // input space
        var mp = subGrids[my][mx];
        for(var i = 0;i < subGrids.length - 1; i++)
        {
            for(var j = 0;j < subGrids[i].length - 1; j++)
            {
                var p1 = subGrids[i][j];
                var p2 = subGrids[i][j+1];
                var p3 = subGrids[i+1][j];
                var p4 = subGrids[i+1][j+1];
                this.sub_draw_line((p1[1]-mp[1])*spaces, (p1[0]-mp[0])*spaces, (p2[1]-mp[1])*spaces, (p2[0]-mp[0])*spaces, colors[1], 2, this.subCtx, this.subCanvas);
                this.sub_draw_line((p1[1]-mp[1])*spaces, (p1[0]-mp[0])*spaces, (p3[1]-mp[1])*spaces, (p3[0]-mp[0])*spaces, colors[0], 2, this.subCtx, this.subCanvas);
                this.sub_draw_line((p2[1]-mp[1])*spaces, (p2[0]-mp[0])*spaces, (p4[1]-mp[1])*spaces, (p4[0]-mp[0])*spaces, colors[0], 2, this.subCtx, this.subCanvas);
                this.sub_draw_line((p3[1]-mp[1])*spaces, (p3[0]-mp[0])*spaces, (p4[1]-mp[1])*spaces, (p4[0]-mp[0])*spaces, colors[1], 2, this.subCtx, this.subCanvas);
            }
        }
        // input point
        var cx = this.subCanvas.width / 2;
        var cy = this.subCanvas.height / 2;
        this.subCtx.fillStyle = 'black';
        this.subCtx.beginPath();
        this.subCtx.arc(cx, cy, 5, 0, Math.PI*2,false); 
        this.subCtx.fill();
        this.subCtx.font = "15px Segoe UI";
        this.subCtx.fillText('input ('+Math.round(px*100)/100+', '+Math.round(py*100)/100+')', cx-40, cy-10);

        this.subCtx.fillStyle = 'RGB(0, 0, 0, 0.3)';
        this.subCtx.beginPath();
        this.subCtx.moveTo(this.subCanvas.width/2, this.subCanvas.height/2);
        this.subCtx.lineTo((subGrids[my][mx+1][1]-mp[1])*spaces + this.subCanvas.width/2,(subGrids[my][mx+1][0]-mp[0])*spaces + this.subCanvas.height/2);
        this.subCtx.lineTo((subGrids[my-1][mx+1][1]-mp[1])*spaces + this.subCanvas.width/2,(subGrids[my-1][mx+1][0]-mp[0])*spaces + this.subCanvas.height/2);
        this.subCtx.lineTo((subGrids[my-1][mx][1]-mp[1])*spaces + this.subCanvas.width/2,(subGrids[my-1][mx][0]-mp[0])*spaces + this.subCanvas.height/2);
        this.subCtx.closePath();
        this.subCtx.fill();

        var p1 = subGrids[my][mx];
        var p2 = subGrids[my+1][mx];
        var p3 = subGrids[my][mx+1];
        var v1 = [p2[0]-p1[0], p2[1]-p1[1]];
        var v2 = [p3[0]-p1[0], p3[1]-p1[1]];
        var inputArea = Math.abs((v1[1]*v2[0] - v1[0]*v2[1]));
        // console.log(inputArea)
        // console.log('v1: '+v1+', v2:'+v2)

        // output space
        var mp = traGrids[my][mx];
        for(var i = 0;i < traGrids.length - 1; i++)
        {
            for(var j = 0;j < traGrids[i].length - 1; j++)
            {
                var p1 = traGrids[i][j];
                var p2 = traGrids[i][j+1];
                var p3 = traGrids[i+1][j];
                var p4 = traGrids[i+1][j+1];

                this.sub_draw_line((p1[1]-mp[1])*spaces, (p1[0]-mp[0])*spaces, (p2[1]-mp[1])*spaces, (p2[0]-mp[0])*spaces, colors[1], 2, this.subCtx2, this.subCanvas2);
                this.sub_draw_line((p1[1]-mp[1])*spaces, (p1[0]-mp[0])*spaces, (p3[1]-mp[1])*spaces, (p3[0]-mp[0])*spaces, colors[0], 2, this.subCtx2, this.subCanvas2);
                this.sub_draw_line((p2[1]-mp[1])*spaces, (p2[0]-mp[0])*spaces, (p4[1]-mp[1])*spaces, (p4[0]-mp[0])*spaces, colors[0], 2, this.subCtx2, this.subCanvas2);
                this.sub_draw_line((p3[1]-mp[1])*spaces, (p3[0]-mp[0])*spaces, (p4[1]-mp[1])*spaces, (p4[0]-mp[0])*spaces, colors[1], 2, this.subCtx2, this.subCanvas2);
            }
        }
        // output point
        var cx = this.subCanvas2.width / 2;
        var cy = this.subCanvas2.height / 2;
        this.subCtx2.fillStyle = 'Red';
        this.subCtx2.beginPath();
        this.subCtx2.arc(cx, cy, 5, 0, Math.PI*2,false); 
        this.subCtx2.fill();
        this.subCtx2.font = "15px Segoe UI";
        this.subCtx2.fillText('output ('+Math.round(mp[1]*100)/100+', '+Math.round(mp[0]*100)/100+')', cx-40, cy-10);

        this.subCtx2.fillStyle = 'RGB(255, 0, 0, 0.3)';
        this.subCtx2.beginPath();
        this.subCtx2.moveTo(this.subCanvas.width/2, this.subCanvas.height/2);
        this.subCtx2.lineTo((traGrids[my][mx+1][1]-mp[1])*spaces + this.subCanvas.width/2,-(traGrids[my][mx+1][0]-mp[0])*spaces + this.subCanvas.height/2);
        this.subCtx2.lineTo((traGrids[my+1][mx+1][1]-mp[1])*spaces + this.subCanvas.width/2,-(traGrids[my+1][mx+1][0]-mp[0])*spaces + this.subCanvas.height/2);
        this.subCtx2.lineTo((traGrids[my+1][mx][1]-mp[1])*spaces + this.subCanvas.width/2,-(traGrids[my+1][mx][0]-mp[0])*spaces + this.subCanvas.height/2);
        this.subCtx2.closePath();
        this.subCtx2.fill();

        var p1 = traGrids[my][mx];
        var p2 = traGrids[my+1][mx];
        var p3 = traGrids[my][mx+1];
        var v1 = [p2[0]-p1[0], p2[1]-p1[1]];
        var v2 = [p3[0]-p1[0], p3[1]-p1[1]];
        var outputArea = Math.abs((v1[1]*v2[0] - v1[0]*v2[1]));

        var jacobianCoff = outputArea / inputArea;
        var jacobianCoun = this.jacobian_Determinant(px, py);
        var real_text = document.getElementById("real");
        var coun_text = document.getElementById("count");
        real_text.innerHTML = '<mark class="red">　 </mark><b style="color:white;">.</b><b>÷ </b><mark class="black">　 </mark><b style="color:white;">.</b>= '+jacobianCoff;
        coun_text.innerHTML = 'Jacobian Determinant = ' +jacobianCoun;

        // console.log('Real: ' + jacobianCoff)
        // console.log('Coun: ' + jacobianCoun)
    }

    drawNow(pos)
    {
        this.ctx2.clearRect(0, 0, this.width, this.height);
        
        var colors = [[0, 100, 0, 0.7], [0, 0, 100, 0.7]];
        var px = (pos.x - this.width/2)  / this.spaces;
        var py = (this.height/2 - pos.y) / this.spaces;
        
        // x axis
        for(var x = this.grids[0][0][1];x < this.grids[0][this.grids[0].length-1][1]; x+=0.1)
        {
            this.draw_line(x * this.spaces, py * this.spaces, (x + 1)* this.spaces, py* this.spaces, colors[1], 2, this.ctx2);
            var p1 = this.funct(x, py);     
            var p2 = this.funct(x + 0.1, py);
            if(Math.floor(x*10) % 2 == 0)
                this.draw_line(p1[1]*this.spaces, p1[0]*this.spaces, p2[1]*this.spaces, p2[0]*this.spaces, colors[1], 2, this.ctx2);
        }
        // y axis
        for(var y = this.grids[0][0][0];y < this.grids[this.grids.length-1][0][0]; y+=0.1)
        {
            this.draw_line(px* this.spaces, y* this.spaces, px* this.spaces, (y + 1)* this.spaces, colors[0], 2, this.ctx2);
            var p1 = this.funct(px, y);     
            var p2 = this.funct(px, y + 0.1);
            if(Math.floor(y*10) % 2 == 0)
                this.draw_line(p1[1]*this.spaces, p1[0]*this.spaces, p2[1]*this.spaces, p2[0]*this.spaces, colors[0], 2, this.ctx2);
        }

        // input point
        this.ctx2.fillStyle = 'black';
        this.ctx2.beginPath();
        this.ctx2.arc(pos.x, pos.y, 5, 0, Math.PI*2,false); 
        this.ctx2.fill();
        this.ctx2.font = "15px Segoe UI";
        this.ctx2.fillText('input', pos.x-40, pos.y-10);
        // output point
        this.ctx2.fillStyle = 'red';
        var p = this.funct(px, py);
        var x = p[1]* this.spaces + this.width/2;
        var y = this.height/2 - p[0]* this.spaces;
        // console.log('x: '+x+', y:'+y)
        this.ctx2.beginPath();
        this.ctx2.arc(x , y, 5, 0, Math.PI*2,false); 
        this.ctx2.fill();
        this.ctx2.font = "15px Segoe UI";
        this.ctx2.fillText('output', x-40, y-10);
    }
    funct(x, y)
    {
        if(this.funct_index == 1)
            return [y + Math.sin(x), x + Math.cos(y)];
        else if(this.funct_index == 2)
            return [x*Math.sin(y), x*Math.cos(y)];
        // return [x*Math.sin(y), x*Math.cos(y)];
        // return [x*x, y*y]
        // return [(y/2)*Math.sin(x), y*Math.cos(x)];
        // return [y + Math.sin(x), x + Math.cos(y)];
    }
    jacobian_Determinant(x, y)
    {
        if(this.funct_index == 1)
            return Math.abs(1 + Math.cos(x)*Math.sin(y));
        else if(this.funct_index == 2)
            return Math.abs(x);
    }
    transform(grids)
    {
        var output_grids = new Array(grids.length);

        for(var i = 0;i < grids.length; i++)
        {
            output_grids[i] = new Array(grids[i].length);
            for(var j = 0;j < grids[i].length; j++)
            {
                output_grids[i][j] = this.funct(grids[i][j][1], grids[i][j][0]);
            }
        }
        return output_grids;
    }
    create_grids(h, w, yrange, xrange)
    {
        var grids = new Array(h);
        for(i = 0;i < h; i++) grids[i] = new Array(w);

        var hinterval = (yrange[1] - yrange[0]) / h;
        var winterval = (xrange[1] - xrange[0]) / w;
        
        for(var i = 0;i < h; i++)
        {
            for(var j = 0;j < w; j++)
            {
                grids[i][j] = [hinterval*i + yrange[0], winterval*j + xrange[0]];
            }
        }
        // console.log(grids);
        return grids;
    }
    draw_line(x1, y1, x2, y2, c, l)
    {
        this.ctx.strokeStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + c[3] + ')';
        // this.ctx.lineCap = 'round';
        this.ctx.lineWidth = l;
        
        var cx = this.width  / 2;
        var cy = this.height / 2;
        
        x1 = x1 + cx;
        y1 = cy - y1;
        x2 = x2 + cx;
        y2 = cy - y2;

        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }
    draw_line(x1, y1, x2, y2, c, l, ctx)
    {
        ctx.strokeStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + c[3] + ')';
        // this.ctx.lineCap = 'round';
        ctx.lineWidth = l;
        
        var cx = this.width  / 2;
        var cy = this.height / 2;
        
        x1 = x1 + cx;
        y1 = cy - y1;
        x2 = x2 + cx;
        y2 = cy - y2;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    sub_draw_line(x1, y1, x2, y2, c, l, ctx, canvas)
    {
        ctx.strokeStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + c[3] + ')';
        // this.ctx.lineCap = 'round';
        ctx.lineWidth = l;
        
        var cx = canvas.width  / 2;
        var cy = canvas.height / 2;
        
        x1 = x1 + cx;
        y1 = cy - y1;
        x2 = x2 + cx;
        y2 = cy - y2;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    draw_function(grids, colors)
    {        
        // this.ctx.clearRect(0, 0, this.width, this.height);
        for(var i = 0;i < grids.length - 1; i += 1)
        {
            for(var j = 0;j < grids[i].length - 1; j += 1)
            {
                var p1 = grids[i][j];
                var p2 = grids[i][j+1];
                var p3 = grids[i+1][j];

                if(i % this.step == 0)
                    this.draw_line(p1[1]*this.spaces, p1[0]*this.spaces, p2[1]*this.spaces, p2[0]*this.spaces, colors[1], 2, this.ctx);
                if(j % this.step == 0)
                    this.draw_line(p1[1]*this.spaces, p1[0]*this.spaces, p3[1]*this.spaces, p3[0]*this.spaces, colors[0], 2, this.ctx);
                if(j + 1 == grids[i].length)
                {
                    var p4 = grids[i+1][j+1];
                    this.draw_line(p3[1]*this.spaces, p3[0]*this.spaces, p4[1]*this.spaces, p4[0]*this.spaces, colors[0], 2, this.ctx);
                }
                if(i + 1 == grids[i].length)
                {
                    var p4 = grids[i+1][j+1];
                    this.draw_line(p2[1]*this.spaces, p2[0]*this.spaces, p4[1]*this.spaces, p4[0]*this.spaces, colors[0], 2, this.ctx);
                }
            }
        }
        // draw y axis
        var mid = Math.floor(grids[0].length / 2);
        for(var i = 0;i < grids.length-1; i++)
        {
            var p1 = grids[i][mid];
            var p2 = grids[i+1][mid];
            this.draw_line(p1[1]*this.spaces, p1[0]*this.spaces, p2[1]*this.spaces, p2[0]*this.spaces, colors[0], 5, this.ctx);
        }

        // draw x axis
        var mid = Math.floor(grids.length / 2);
        for(var i = 0;i < grids[0].length-1; i++)
        {
            var p1 = grids[mid][i];
            var p2 = grids[mid][i+1];
            this.draw_line(p1[1]*this.spaces, p1[0]*this.spaces, p2[1]*this.spaces, p2[0]*this.spaces, colors[1], 5, this.ctx);
        }
    }
    show_grids(grids)
    {
        for(var i = 0;i < grids.length; i++)
        {
            for(var j = 0;j < grids[i].length; j++)
            {
                console.log(grids[i][j])
            }
        }
    }
}





function main()
{
    var jdrawer = new Jacobian(["mainCanvas", "subCanvas"]);
    
    var colors = [[0, 100, 0, 0.1], [0, 0, 100, 0.1]];
    jdrawer.draw_function(jdrawer.grids, colors);

    var colors = [[0, 100, 0, 0.2], [0, 0, 100, 0.2]];
    jdrawer.draw_function(jdrawer.transform_grids, colors);
    
    jdrawer.canvas.addEventListener("mousemove", getCursorPos);
    
    var select = document.getElementById("funct_selector");
    select.addEventListener("change", selected_funct_change);
    function getCursorPos(e) {
        var a, x = 0, y = 0;
        e = e || window.event;
        /* Get the x and y positions of the image: */
        a = jdrawer.canvas.getBoundingClientRect();
        /* Calculate the cursor's x and y coordinates, relative to the image: */
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        /* Consider any page scrolling: */
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        jdrawer.drawNow({x : x, y : y});
        jdrawer.subTransform({x : x, y : y});
    }
    function selected_funct_change()
    {
        jdrawer.funct_index = select.value;

        jdrawer.ctx.clearRect(0, 0, jdrawer.width, jdrawer.height);
        var colors = [[0, 100, 0, 0.1], [0, 0, 100, 0.1]];
        jdrawer.draw_function(jdrawer.grids, colors);
        jdrawer.transform_grids = jdrawer.transform(jdrawer.grids);
        var colors = [[0, 100, 0, 0.2], [0, 0, 100, 0.2]];
        jdrawer.draw_function(jdrawer.transform_grids, colors);
    }
}