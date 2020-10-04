class render3d
{
    constructor(canvas)
    {
        this.canvas = canvas;
        this.zoomScale = 100;
        if(this.canvas.getContext){
            this.ctx = this.canvas.getContext("2d");
            this.height = this.canvas.height;
            this.width = this.canvas.width;
        }
    }
    run(camera, mesh)
    {
        this.ctx.clearRect(0, 0, this.width, this.height);
        var colors = [[0, 200, 0, 0.5], [0, 0, 200, 0.5]];
        var c = 0;
        var zoom = this.zoomScale;
        for(var i = 0;i < mesh.struct.length; i++)
        {
            var tri = []
            for(var j = 0;j < 3; j++)
            {
                var p = camera.shot(mesh.struct[i][j]);
                tri.push(p);
            }
            // console.log(tri)
            this.draw_triangle(tri[0].x*zoom, tri[0].y*zoom, tri[1].x*zoom, tri[1].y*zoom, tri[2].x*zoom, tri[2].y*zoom, colors[c]);
            c = (c + 1) % 2;
        }
    }
    draw_line(x1, y1, x2, y2, c, l)
    {
        this.ctx.strokeStyle = 'rgba('+c[0]+','+c[1]+','+c[2]+','+c[3]+')';
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
    draw_triangle(x1, y1, x2, y2, x3, y3, c)
    {
        this.ctx.fillStyle = 'rgba('+c[0]+','+c[1]+','+c[2]+','+c[3]+')';
        
        var cx = this.width  / 2;
        var cy = this.height / 2;

        x1 = x1 + cx;
        y1 = cy - y1;
        x2 = x2 + cx;
        y2 = cy - y2;
        x3 = x3 + cx;
        y3 = cy - y3;

        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineTo(x3, y3);
        this.ctx.closePath();
        this.ctx.fill();
    }

}