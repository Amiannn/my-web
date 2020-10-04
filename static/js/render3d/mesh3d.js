class mesh3d
{
    constructor(meshjson)
    {
        this.meshjson = meshjson;
        this.build_mesh();
        // var path = '/static/js/render3d/meshs/box.json';
        // this.load_mesh(path);
        // setTimeout(() => {this.build_mesh();}, 100);
    }
    build_mesh()
    {
        this.struct = [];
        for(var i = 0;i < this.meshjson['vertices'].length / 3; i++)
        {
            var triangle = [];
            for(var j = 0;j < 3; j++)
            {
                var x = this.meshjson['vertices'][i*3+j][0];
                var y = this.meshjson['vertices'][i*3+j][1];
                var z = this.meshjson['vertices'][i*3+j][2];

                var vertex = new vector3d(x, y, z)
                triangle.push(vertex);
            }
            this.struct.push(triangle);
        }
    }
}