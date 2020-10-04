class dataGenerator
{
    constructor(canvas)
    {
        this.x_batch = [[0.5, 0.5], [0.5, -0.5], [-0.5, -0.5], [-0.5, 0.5]];
        this.y_batch = [[1], [0], [1], [0]];
        // this.clean()
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.draw_point();
        this.listen_mouse();
    }
    clean()
    {
        this.x_batch = [];
        this.y_batch = [];
    }
    draw_point()
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for(var i = 0;i < this.x_batch.length; i++)
        {
            var x = this.x_batch[i][0];
            var y = this.x_batch[i][1];
            x = (x + 1) * this.canvas.width / 2;
            y = (y + 1) * this.canvas.height / 2;
            switch(this.y_batch[i][0])
            {
                case 0:
                    this.ctx.fillStyle = 'rgb(0, 255, 0, 255)';
                break;
                case 1:
                    this.ctx.fillStyle = 'rgb(0, 0, 255, 255)';
                break;
            }
            this.ctx.beginPath();
            this.ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
            this.ctx.fill()
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.stroke();
        }
    }
    listen_mouse()
    {
        this.canvas.addEventListener("mousedown", mouseDown, false);
        var my = this;

        function mouseDown(e)
        {
            var pos = getCursorPos(e);
            var x = (pos.x / my.canvas.width) * 2 - 1;
            var y = (pos.y / my.canvas.height) * 2 - 1;
            
            switch(e.buttons)
            {
                case 1:
                    my.x_batch.push([x, y]);
                    my.y_batch.push([0]);
                break;
                case 4:
                    my.x_batch.push([x, y]);
                    my.y_batch.push([1]);
                break;
            }
            my.draw_point();
        }

        function getCursorPos(e) 
        {
            var a, x = 0, y = 0;
            e = e || window.event;
            a = my.canvas.getBoundingClientRect();
            x = e.pageX - a.left;
            y = e.pageY - a.top;
            x = x - window.pageXOffset;
            y = y - window.pageYOffset;
            return {x:x, y:y};
        }
    }

}