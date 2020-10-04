document.writeln("<script type='text/javascript' src='static/js/autoDifferentiation/node.js'></script>");
document.writeln("<script type='text/javascript' src='static/js/autoDifferentiation/computeGraph.js'></script>");
document.writeln("<script type='text/javascript' src='static/js/neuralNetwork/layers.js'></script>");
document.writeln("<script type='text/javascript' src='static/js/neuralNetwork/models.js'></script>");
document.writeln("<script type='text/javascript' src='static/js/neuralNetwork/dataGenerator.js'></script>");
document.writeln("<script type='text/javascript' src='static/js/neuralNetwork/modelDrawer.js'></script>");

function build_model()
{
    // build model
    var layer = new layers();
    var model = new models(layer.input(2));
    model.add(layer.dense(3));
    model.add(layer.activation('sigmoid', 3));
    model.add(layer.dense(3));
    model.add(layer.activation('sigmoid', 3));
    model.add(layer.dense(1));
    model.add(layer.activation('sigmoid', 1));
    return model;
}

function main()
{
    // build model
    var model = build_model();
    
    var layer_select = document.getElementById('layer_selector');
    var node_select = document.getElementById('node_selector');
    var draw_layer_index = 0;
    var draw_neuron_index = 0;
    layer_select.addEventListener("change", selectedLayerChange);
    node_select.addEventListener("change", selectedNeuronChange);

    // layer selector    
    layer_select.options.length = 0;
    for(var i = 0;i < model.layers_stack.length; i++)
    {
        var text = '顯示：' + model.layers_stack[i].tag;
        layer_select.options[layer_select.options.length] = new Option(text, i);
    }
    layer_select.selectedIndex = model.layers_stack.length - 1;
    draw_layer_index = model.layers_stack.length - 1;

    // node selector
    var index = layer_select.value;
    node_select.options.length = 0;
    for(var i = 0;i < model.layers_stack[index].output.length; i++)
    {
        var text = 'neuron_' + i;
        // bias
        if(model.layers_stack[index].type == 1)
            if(i + 1 == model.layers_stack[index].output.length)
                text = 'bias_0';
        node_select.options[node_select.options.length] = new Option(text, i);
    }
    node_select.selectedIndex = 0;
    draw_neuron_index = 0;

    // layer select change
    function selectedLayerChange()
    {
        var index = layer_select.value;
        draw_layer_index = index;
        draw_neuron_index = 0;
        node_select.options.length = 0;
        for(var i = 0;i < model.layers_stack[index].output.length; i++)
        {
            var text = 'neuron_' + i;
            // bias
            if(model.layers_stack[index].type == 1)
            if(i + 1 == model.layers_stack[index].output.length)
                text = 'bias_0';
            node_select.options[node_select.options.length] = new Option(text, i);
        }
        node_select.selectedIndex = 0;
    }

    // node select change
    function selectedNeuronChange()
    {
        draw_neuron_index = node_select.value;
    }

    // create data point
    var mainCanvas2 = document.getElementById("mainCanvas2");
    var dgen = new dataGenerator(mainCanvas2);

    // draw layer
    var mainCanvas = document.getElementById('mainCanvas');
    var loss_label = document.getElementById('loss_label');
    var drawer = new modelDrawer(model, mainCanvas);
    var neural_tick;
    
    // start training
    start_training();

    // button control
    document.getElementById('clear_btn').addEventListener('click', clean_data_point);
    function clean_data_point()
    {
        // clean training data
        dgen.clean();
        dgen.draw_point();
        
        // pause training
        pause_training()

        // clean canvas
        ctx = mainCanvas.getContext('2d');
        ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

        // rebuild model
        model = build_model();
        drawer = new modelDrawer(model, mainCanvas);
    }

    document.getElementById('pause_btn').addEventListener('click', pause_training);
    function pause_training()
    {
        clearInterval(neural_tick);
        document.getElementById('pause_btn').disabled = true;
        document.getElementById('start_btn').disabled = false;
    }

    document.getElementById('start_btn').addEventListener('click', start_training);
    document.getElementById('start_btn').disabled = true;
    function start_training()
    {
        neural_tick = setInterval(tick, 50);
        document.getElementById('pause_btn').disabled = false;
        document.getElementById('start_btn').disabled = true;
    }

    function tick()
    {
        var loss = model.fit_batch(dgen.x_batch, dgen.y_batch, 0.1, 50);
        drawer.draw_layer(draw_layer_index, draw_neuron_index, [-1, 1], [-1, 1], 0.03);
        loss_label.innerHTML = '<b>model loss：' + loss + '</b>';
    }
}