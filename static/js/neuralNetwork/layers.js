class layers
{
    constructor()
    {
        this.input_counter = 0;
        this.dense_counter = 0;
        this.activation_counter = 0;
    }
    input(num)
    {
        var layer_input = [];
        for(var i = 0;i < num; i++)
            layer_input.push(new node('x' + i));
        // console.log(input_layer);
        this.input_counter += 1;
        return {'type':0, 'input':layer_input, 'output':layer_input, 'tag':'input_layer_'+this.input_counter};
    }
    dense(num)
    {
        var layer_input = [];
        for(var i = 0;i < num; i++)
            layer_input.push(new node('h' + i));
        // add bias
        var nodeB = new node('B0');
        nodeB.set(1);
        layer_input.push(nodeB);
        this.dense_counter += 1;
        return {'type':1, 'input':layer_input, 'output':layer_input, 'tag':'dense_layer_'+this.dense_counter};
    }
    activation(types, num)
    {
        var layer_input  = [];
        var layer_output = [];
        for(var i = 0;i < num; i++)
        {
            var nodeA = new node('a' + i);
            layer_input.push(nodeA);
            layer_output.push(sigmoid(nodeA));
        }
        this.activation_counter += 1;
        return {'type':2, 'input':layer_input, 'output':layer_output, 'tag':'activation_layer_'+this.activation_counter};
        
        function sigmoid(nodeA)
        {
            var graph = new computeGraph();
            var sigmoid = graph.pow(graph.add(graph.pow(Math.E, graph.mul(nodeA, -1)), 1), -1);
            return sigmoid;
        }
    }
}