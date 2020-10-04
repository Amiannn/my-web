class vector3d
{
    constructor(x, y, z)
    {
        // cartesian coordinate system
        this.x = x;
        this.y = y;
        this.z = z;

        // spherical coordinate system
        this.toSpherical()
    }
    clean()
    {
        // cartesian coordinate system
        this.x = 0.0;
        this.y = 0.0;
        this.z = 0.0;

        // spherical coordinate system
        this.raidus = 0.0;
        this.polar_angle = 0.0;
        this.azimuth_angle = 0.0;
    }
    setSpherical(r, polar, azimuth)
    {
        this.radius = r;
        this.polar_angle = polar;
        this.azimuth_angle = azimuth;
        this.toCartesian();
    }
    setCartesian(x, y, z)
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.toSpherical();
    }
    toSpherical()
    {
        var r = Math.pow(this.x*this.x + this.y*this.y, 0.5);
        this.radius = Math.pow(r*r + this.z*this.z, 0.5);
        this.polar_angle = Math.atan2(this.z, r) * 180 / Math.PI;
        this.azimuth_angle = Math.atan2(this.y, this.x) * 180 / Math.PI;
    }
    toCartesian()
    {
        this.z = this.radius * Math.sin(this.polar_angle * Math.PI / 180);
        this.y = this.radius * Math.cos(this.polar_angle * Math.PI / 180) * Math.sin(this.azimuth_angle * Math.PI / 180);
        this.x = this.radius * Math.cos(this.polar_angle * Math.PI / 180) * Math.cos(this.azimuth_angle * Math.PI / 180);
    }
    add(vector_b)
    {
        this.x += vector_b.x;
        this.y += vector_b.y;
        this.z += vector_b.z;
        this.toSpherical();
    }
    mul(coff)
    {
        this.x *= coff;
        this.y *= coff;
        this.z *= coff;
        this.toSpherical();
    }
    dot(vector_b)
    {
        return (this.x * vector_b.x + this.y * vector_b.y + this.z * vector_b.z);
    }
    cross(vector_b)
    {
        var x = this.y * vector_b.z - this.z * vector_b.y;
        var y = this.z * vector_b.x - this.x * vector_b.z;
        var z = this.x * vector_b.y - this.y * vector_b.x;
        return new vector3d(x, y, z);
    }
}