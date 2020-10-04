class node
{
    constructor(tag)
    {
        this.value = 0.0;
        this.diff  = 0.0;
        this.mode  = 0;
        this.tag   = tag;
        this.nodeA = null;
        this.nodeB = null;
    }
    set(value)
    {
        this.value = value;
        this.mode  = 0;
    }
    alu(value, nodeA, nodeB, mode)
    {
        this.value = value;
        this.nodeA = nodeA;
        this.nodeB = nodeB;
        this.mode  = mode;
    }
    show()
    {
        if(this.mode != 0)
            console.log(this.tag+'('+this.nodeA.tag+', '+this.nodeB.tag+')'+' >> Op:'+this.mode+', '+' value:' + this.value + ', diff: ' + this.diff);
        else
            console.log(this.tag+' >> value:' + this.value + ', diff: ' + this.diff);
    }
}