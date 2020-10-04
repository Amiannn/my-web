class camera3d
{
    constructor(px, py, pz, nx, ny, nz)
    {
        this.pos = new vector3d(px, py, pz);
        this.nor = new vector3d(nx, ny, nz);
        // normalize
        this.nor.mul(1 / this.nor.radius);
    }
    set_normalvector(nx, ny, nz)
    {
        this.nor.x = nx;
        this.nor.y = ny;
        this.nor.z = nz;
        this.nor.toSpherical();
        this.nor.mul(1 / this.nor.radius);
    }
    move_position(dx, dy, dz)
    {
        var delta = new vector3d(dx, dy, dz);
        this.pos.add(delta);
    }
    move_polar(delta)
    {
        this.nor.polar_angle += delta;
        this.nor.toCartesian();
        this.nor.toSpherical();
    }
    move_azimuth(delta)
    {
        this.nor.azimuth_angle += delta;
        this.nor.toCartesian();
        this.nor.toSpherical();
    }
    shot(vertex)
    {
        var plane_x_axis = new vector3d(this.nor.x, this.nor.y, this.nor.z);
        var plane_y_axis = new vector3d(this.nor.x, this.nor.y, this.nor.z);
        // get plane axis
        plane_x_axis.azimuth_angle += 90;
        plane_x_axis.polar_angle = 0;
        plane_x_axis.toCartesian();
        
        plane_y_axis.polar_angle -= 90;
        plane_x_axis.azimuth_angle = 0;
        plane_y_axis.toCartesian();
        
        // parallel projection
        var pro = new vector3d(this.pos.x, this.pos.y, this.pos.z);
        pro.mul(-1);
        pro.add(vertex)
        var coff_t = pro.dot(this.nor) * -1;
        var projected_vertex = new vector3d(this.nor.x, this.nor.y, this.nor.z);
        projected_vertex.mul(coff_t);
        projected_vertex.add(vertex)
        projected_vertex.mul(-1);
        projected_vertex.add(this.pos);
        projected_vertex.mul(-1);
        
        // get plane axis value
        var projected_x = projected_vertex.dot(plane_x_axis);
        var projected_y = projected_vertex.dot(plane_y_axis);
        
        return {x:projected_x, y:projected_y};
    }
}