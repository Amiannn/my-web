class entityAdder
{
    constructor(canvas, world)
    {
        this.canvas = canvas;
        this.world  = world;

        if(this.canvas.getContext)
        {
            this.ctx = this.canvas.getContext("2d");
        }
        this.listen_mouse()
    }

    listen_mouse()
    {
        this.canvas.addEventListener("mousedown", mouseDown, false);
        this.canvas.addEventListener("mouseup", mouseUp, false);
        this.canvas.addEventListener("mousemove", mouseMove, false);
        var my = this;
        var ifdown = false;
        var down_x = 0;
        var down_y = 0;
        var match_index = -1;

        function mouseDown(e)
        {
            var pos = getCursorPos(e);
            var x = pos.x;
            var y = my.canvas.height - pos.y;
            down_x = x;
            down_y = y;
            ifdown = true;
            switch(e.buttons)
            {
                case 1:
                    match_index = my.search_entity(x, y, 30);
                    if(match_index != -1)
                    {
                        var entity_a = my.world.entitys[match_index];
                        down_x = entity_a.position.x;
                        down_y = entity_a.position.y;
                        entity_a.freez = true;
                    }
                    my.draw_point(down_x, down_y, [0, 255, 0, 255])
                break;
                case 4:
                    var myEntity= new entity('', 10, 10)
                    myEntity.position.x = x;
                    myEntity.position.y = y;
                    myEntity.velocity.x = 0;
                    myEntity.velocity.y = 0;
                    myEntity.freez = true;
                    myEntity.position.toPolarSystem();
                    myEntity.velocity.toPolarSystem();
                    my.world.addEntity(myEntity);
                    match_index = my.world.entitys.length - 1;
                break;
            }
        }

        function mouseUp(e)
        {
            var pos = getCursorPos(e);
            var x = pos.x;
            var y = my.canvas.height - pos.y;
            if(match_index != -1)
            {
                var entity_a = my.world.entitys[match_index];
                var delta_x = x - down_x;
                var delta_y = y - down_y;
                entity_a.velocity.add(new vector2d(delta_x, delta_y));
                entity_a.freez = false;
                match_index = -1;
            }
            ifdown = false;
            my.ctx.clearRect(0, 0, my.canvas.width, my.canvas.height);
        }

        function mouseMove(e)
        {
            var pos = getCursorPos(e);
            var x = pos.x;
            var y = my.canvas.height - pos.y;
            
            if(ifdown)
            {
                my.draw_point(down_x, down_y, [112, 112, 112, 200])
                my.draw_line(down_x, down_y, x, y, [112, 112, 112, 200], 2)
            }
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

    draw_point(x, y, c)
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'rgba('+c[0]+','+c[1]+','+c[2]+','+c[3]+')';
        this.ctx.beginPath();
        this.ctx.arc(x, this.canvas.height - y, 2, 0, 2 * Math.PI, false);
        this.ctx.fill()
    }
    draw_line(x1, y1, x2, y2, c, l)
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = 'rgba('+c[0]+','+c[1]+','+c[2]+','+c[3]+')';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = l;
        
        y1 = this.canvas.height - y1;
        y2 = this.canvas.height - y2;

        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    search_entity(x, y, min_radius)
    {
        var index = -1;
        for(var i = 0;i < this.world.entitys.length; i++)
        {
            var pos = this.world.entitys[i].position;
            var dist = Math.pow(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2), 0.5);
            
            if(dist < min_radius)
            {
                min_radius = dist;
                index = i;
            }
        }
        return index;
    }
}