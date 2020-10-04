class modelDrawer
{
    constructor(model, canvas)
    {
        this.model = model;
        this.canvas = canvas;
        this.width  = this.canvas.width;
        this.height = this.canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.img = this.ctx.getImageData(0, 0, this.height, this.width);
        this.graph = new computeGraph();
    }
    hsv2rgb(h, s, v) {
        var r, g, b, i, f, p, q, t;
        if (arguments.length === 1) {
            s = h.s, v = h.v, h = h.h;
        }
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
    draw_pixel(x, y, color)
    {
        var off = (y * this.width + x) * 4;
        this.img.data[off    ] = color.r;
        this.img.data[off + 1] = color.g;
        this.img.data[off + 2] = color.b;
        this.img.data[off + 3] = 255;
    }
    draw_layer(layer_index, neuron_index, x_range, y_range, step)
    {
        var layer = this.model.layers_stack[layer_index];
        
        this.ctx.clearRect(0, 0, this.width, this.height);
        var maps = [];
        var min = 0;
        var max = 1;
        for(var y = y_range[0];y < y_range[1]; y+= step)
        {
            var map = [];
            for(var x = x_range[0];x < x_range[1]; x+=step)
            {
                this.model.input_layer.input[0].set(x); 
                this.model.input_layer.input[1].set(y);

                this.graph.forward(layer.output[neuron_index]);
                var value = layer.output[neuron_index].value;
                if(value > max) max = value;
                if(value < min) min = value;
                map.push(value);
            }
            maps.push(map);
        }
        for (var y = 0;y < this.height; y++) {
            for(var x = 0;x < this.width; x++)
            {
                var y_index = Math.floor(y * (maps.length / this.height));
                var x_index = Math.floor(x * (maps[0].length / this.width));
                var value = maps[y_index][x_index]
                
                value = ((value - min) / (max - min)) * 0.33 + 0.33;
                var color = this.hsv2rgb(value, 1, 1);
                this.draw_pixel(x, y, color);
            }
        }
        this.ctx.putImageData(this.img, 0, 0);
    }
}