document.writeln("<script type='text/javascript' src='static/js/physicsEngine/vector2d.js'></script>");
document.writeln("<script type='text/javascript' src='static/js/physicsEngine/entity.js'></script>");
document.writeln("<script type='text/javascript' src='static/js/physicsEngine/world.js'></script>");
document.writeln("<script type='text/javascript' src='static/js/physicsEngine/engine.js'></script>");
document.writeln("<script type='text/javascript' src='static/js/physicsEngine/render.js'></script>");
document.writeln("<script type='text/javascript' src='static/js/physicsEngine/entityAdder.js'></script>");

function main()
{
    var canvas  = document.getElementById('mainCanvas');
    var canvas2 = document.getElementById('mainCanvas2');
    var gravitySlider  = document.getElementById('gravitySlider');
    var frictionSlider = document.getElementById('frictionSlider');
    gravitySlider.value = 98;
    frictionSlider.value = 5;

    var myWorld = new world(canvas.width, canvas.height);
    var myEntity= new entity('', 10, 10)
    myEntity.position.x = 1;
    myEntity.position.y = 100;
    myEntity.velocity.x = 10;
    myEntity.velocity.y = -5;
    myEntity.position.toPolarSystem();
    myEntity.velocity.toPolarSystem();
    myWorld.addEntity(myEntity);

    var myEntity= new entity('', 10, 10)
    myEntity.position.x = canvas.width / 2;
    myEntity.position.y = 500;
    myEntity.velocity.x = -10;
    myEntity.velocity.y = 5;
    myEntity.position.toPolarSystem();
    myEntity.velocity.toPolarSystem();
    myWorld.addEntity(myEntity);

    var myEntity= new entity('', 10, 10)
    myEntity.position.x = canvas.width;
    myEntity.position.y = 200;
    myEntity.velocity.x = -10;
    myEntity.velocity.y = 7;
    myEntity.position.toPolarSystem();
    myEntity.velocity.toPolarSystem();
    myWorld.addEntity(myEntity);

    var myEngine = new engine();
    var myRender = new render(canvas);
    var entityHandler = new entityAdder(canvas2, myWorld);
    setInterval(startWorld, 10);

    function startWorld()
    {
        myEngine.run(myWorld, 0.1);
        myRender.run(myWorld);
    }

    gravitySlider.addEventListener('change', changeGravity);
    frictionSlider.addEventListener('change', changeFriction);
    function changeGravity()
    {
        var gravity = gravitySlider.value / 10;
        myWorld.forces[0].y = -gravity;
        document.getElementById('gravityLabel').innerHTML = "地吸引力 Gravity： " + gravity;
    }
    function changeFriction()
    {
        var friction = frictionSlider.value / 100;
        myEngine.friction = friction;
        document.getElementById('frictionLabel').innerHTML = "摩擦力 Friction： " + friction;
    }
}