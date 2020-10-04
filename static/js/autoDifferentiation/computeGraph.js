class computeGraph
{
    constructor()
    {
        this.target = null;
        this.function_counter = 0;
        this.constant_counter = 0;
    }
    createFunctNode()
    {
        var nodeF = new node('F' + this.function_counter);
        this.function_counter += 1;
        return nodeF;
    }
    createConstNode(value)
    {
        var nodeC = new node('C' + this.constant_counter);
        nodeC.set(value);
        this.constant_counter += 1;
        return nodeC;
    }
    set(target)
    {
        this.target = target;
    }
    alu(nodeA, nodeB, mode)
    {
        var value = 0;
        switch(mode)
        {
            case 1:
                // add
                value = nodeA.value + nodeB.value;
            break;
            case 2:
                // mul
                value = nodeA.value * nodeB.value;
            break;
            case 3:
                // pow
                value = Math.pow(nodeA.value, nodeB.value);
            break;
        }
        return value;
    }
    diffAlu(nodeF)
    {
        switch(nodeF.mode)
        {
            case 1:
                // add
                nodeF.nodeA.diff += nodeF.diff * 1;
                nodeF.nodeB.diff += nodeF.diff * 1;
            break;
            case 2:
                // mul
                nodeF.nodeA.diff += nodeF.diff * nodeF.nodeB.value;
                nodeF.nodeB.diff += nodeF.diff * nodeF.nodeA.value;
            break;
            case 3:
                // pow
                nodeF.nodeA.diff += nodeF.diff * (nodeF.nodeB.value * Math.pow(nodeF.nodeA.value, (nodeF.nodeB.value - 1)));
                nodeF.nodeB.diff += nodeF.diff * (Math.log(nodeF.nodeA.value) * Math.pow(nodeF.nodeA.value, nodeF.nodeB.value));
            break;
        }
    }
    add(nodeA, nodeB)
    {
        // approximate overloading
        var nodeF = this.createFunctNode();
        if(typeof(nodeA) != 'object')
            nodeA = this.createConstNode(nodeA);
        if(typeof(nodeB) != 'object')
            nodeB = this.createConstNode(nodeB);

        // ALU
        var value = this.alu(nodeA, nodeB, 1);
        nodeF.alu(value, nodeA, nodeB, 1);
        return nodeF;
    }
    mul(nodeA, nodeB)
    {
        // approximate overloading
        var nodeF = this.createFunctNode();
        if(typeof(nodeA) != 'object')
            nodeA = this.createConstNode(nodeA);
        if(typeof(nodeB) != 'object')
            nodeB = this.createConstNode(nodeB);
        
        // ALU
        var value = this.alu(nodeA, nodeB, 2);
        nodeF.alu(value, nodeA, nodeB, 2);
        return nodeF;
    }
    pow(nodeA, nodeB)
    {
        // approximate overloading
        var nodeF = this.createFunctNode();
        if(typeof(nodeA) != 'object')
            nodeA = this.createConstNode(nodeA);
        if(typeof(nodeB) != 'object')
            nodeB = this.createConstNode(nodeB);
        
        // ALU
        var value = this.alu(nodeA, nodeB, 3);
        nodeF.alu(value, nodeA, nodeB, 3);
        return nodeF;
    }
    forward(nodeF)
    {
        var nodeA;
        var nodeB;

        if(nodeF.mode != 0)
        {
            nodeA = this.forward(nodeF.nodeA);
            nodeB = this.forward(nodeF.nodeB);
            nodeF.value = this.alu(nodeA, nodeB, nodeF.mode);
        }
        // nodeF.show();
        return nodeF;
    }
    cleanNodeDiff(nodeF)
    {
        if(nodeF == null) return;
        nodeF.diff = 0.0;
        this.cleanNodeDiff(nodeF.nodeA);
        this.cleanNodeDiff(nodeF.nodeB);
    }
    backwardTravel(nodeF)
    {
        if(nodeF.mode != 0)
        {
            this.diffAlu(nodeF);
            this.backwardTravel(nodeF.nodeA);
            this.backwardTravel(nodeF.nodeB);
        }
    }
    backward(nodeF)
    {
        this.cleanNodeDiff(nodeF);
        nodeF.diff = 1.0;
        this.backwardTravel(nodeF);
    }
}