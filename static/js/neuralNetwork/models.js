class models
{
    constructor(input)
    {
        this.input_layer  = input;
        this.output_layer = input;
        this.graph = new computeGraph();
        this.weights = [];
        this.layers_stack = [input];
        this.weight_counter = 0;
    }
    add(layer)
    {
        switch(layer.type)
        {
            case 0:
                // input layer
            break;
            case 1:
                // dense layer
                var connect = [];
                for(var i = 0;i < layer.input.length - 1; i++)
                {
                    var nodeW = new node('w0-'+i);
                    nodeW.set(Math.random());
                    connect.push(nodeW);
                    var nodeT = this.graph.mul(this.output_layer.output[0], nodeW);

                    for(var j = 1;j < this.output_layer.output.length; j++)
                    {
                        var nodeW = new node('w'+j+'-'+i);
                        nodeW.set(Math.random());
                        nodeT = this.graph.add(nodeT, this.graph.mul(this.output_layer.output[j], nodeW));
                        connect.push(nodeW);
                    }
                    layer.input[i].value = nodeT.value;
                    layer.input[i].nodeA = nodeT.nodeA;
                    layer.input[i].nodeB = nodeT.nodeB;
                    layer.input[i].mode  = nodeT.mode;
                }
                this.weight_counter += 1;
                this.weights.push({'weight':connect, 'tag':'weight_layer_'+this.weight_counter});
                this.output_layer = layer;
                this.layers_stack.push(layer);
            break;
            case 2:
                // activation layer
                for(var i = 0;i < layer.input.length; i++)
                {
                    layer.input[i].value = this.output_layer.output[i].value;
                    layer.input[i].nodeA = this.output_layer.output[i].nodeA;
                    layer.input[i].nodeB = this.output_layer.output[i].nodeB;
                    layer.input[i].mode  = this.output_layer.output[i].mode;
                }
                this.output_layer = layer;
                this.layers_stack.push(layer);
            break;
        }
    }
    forward()
    {
        for(var i = 0;i < this.output_layer.output.length; i++)
        {
            this.graph.forward(this.output_layer.output[i]);
        }
    }
    createLossFunction()
    {
        // mean squre error
        var lossfunction = {x:[], y:[], f:null};
        
        // set input
        for(var i = 0;i < this.input_layer.input.length; i++)
            lossfunction.x.push(this.input_layer.input[i])

        // make loss function
        var predict = this.output_layer.output[0];
        var ground = new node('g0');
        lossfunction.y.push(ground);
        var nodeT = this.graph.pow(this.graph.add(ground, this.graph.mul(predict, -1)), 2);
        for(var i = 1;i < this.output_layer.output.length; i++)
        {
            var predict = this.output_layer.output[i];
            var ground  = new node('g'+i);
            lossfunction.y.push(ground);
            nodeT = this.graph.add(nodeT, this.graph.pow(this.graph.add(ground, this.graph.mul(predict, -1)), 2));
        }
        lossfunction.f = this.graph.mul(nodeT, 0.5);
        return lossfunction;
    }
    fit_batch(x_batch, y_batch, lr, epoch)
    {
        // mean squre error
        var lossfunction = this.createLossFunction();
        
        for(var ep = 0;ep < epoch; ep++)
        {
            for(var i = 0;i < x_batch.length; i++)
            {
                // set input
                for(var j = 0;j < x_batch[i].length; j++)
                    lossfunction.x[j].set(x_batch[i][j]);
                
                // set ground truth
                for(var j = 0;j < y_batch[i].length; j++)
                    lossfunction.y[j].set(y_batch[i][j]);
                
                // count total loss
                this.graph.forward(lossfunction.f);

                // count gradient
                this.graph.backward(lossfunction.f);

                // update weights
                for(var j = 0;j < this.weights.length; j++)
                {
                    var weight = this.weights[j].weight;
                    for(var k = 0;k < weight.length; k++)
                    {
                        weight[k].set(weight[k].value - weight[k].diff * lr);
                    }
                }
            }
            // console.log(lossfunction.f.value);
        }
        return Math.round(lossfunction.f.value*100000)/100000;
    }
    summary()
    {
        for(var i = 0;i < this.layers_stack.length; i++)
        {
            var layer = this.layers_stack[i];
            console.log(layer);
        }
        console.log('---------------');
        console.log(this.weights);
    }
}