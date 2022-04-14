"use strict";

var ARENA =
{
	levelScreen:true,
	levelNumber:1
};

var VSHADER_SOURCE =
	"attribute vec3 a_Position;\n" +
	"attribute vec4 a_Color;\n" +
	"attribute vec3 a_Normal;\n" +
	"attribute vec2 a_TexCoord;\n" +

	"uniform mat4 u_MvpMatrix;\n" +
	"uniform mat4 u_RotationMatrix;\n" +
	"uniform mat4 u_ModelViewMatrix;\n" +
	"uniform vec4 u_Color;\n" +
	"uniform bool u_Lighting;\n" +
	"uniform bool u_Texture;\n" +

	"varying vec4 v_Color;\n" +
	"varying vec3 v_Position;\n" +
	"varying vec3 v_Normal;\n" +
	"varying vec2 v_TexCoord;\n" +
	"varying vec3 v_WorldLightPosition;\n" +

	"void main()\n" +
	"{\n" +
	"	gl_Position = u_MvpMatrix * vec4(a_Position, 1.0);\n" +
	"	if (u_Texture == true)\n" +
	"	{\n" +
	"		v_Position = a_Position;\n" +
	"		v_Color = a_Color;\n" +
	"		v_TexCoord = a_TexCoord;\n" +
	"	}\n" +
	"	else if (u_Lighting == true)\n" +
	"	{\n" +
	"		v_Position = vec3(u_RotationMatrix * vec4(a_Position, 1.0));\n" +
	"		v_WorldLightPosition = vec3(u_ModelViewMatrix * vec4( 40.0, 40.0, 60.0, 1.0));\n" +
	"		v_Color = u_Color;\n" +
	"		v_Normal = vec3(u_RotationMatrix * vec4(a_Normal, 0.0));\n" +
	"		gl_Position = u_MvpMatrix * vec4(a_Position, 1.0);\n" +
	"	}\n" +
	"	else\n" +
	"	{\n" +
	"		v_Color = a_Color + u_Color;\n" +
	"		v_Position = a_Position;\n" +
	"	}\n" +
	"}\n";

var FSHADER_SOURCE =
	"precision mediump float;\n" +

	"uniform float u_Radius;\n" +
	"uniform bool u_Lighting;\n" +
	"uniform bool u_Texture;\n" +
	"uniform sampler2D u_Sampler;\n" +

	"varying vec4 v_Color;\n" +
	"varying vec3 v_Position;\n" +
	"varying vec3 v_Normal;\n" +
	"varying vec2 v_TexCoord;\n" +
	"varying vec3 v_WorldLightPosition;\n" +

	"void main()\n" +
	"{\n" +
	"	if (u_Radius > 0.0)\n" +
	"	{\n" +
			// This uses no sqrt() to find the distance so it should be faster
	"		vec2 distance = v_Position.xy - vec2(0.0);\n" +
	"		if (u_Radius * u_Radius < dot(distance, distance))\n" +
	"		{\n" +
	"			discard;\n" +
	"		}\n" +
	"	}\n" +
	"	vec4 fragmentColor = v_Color;\n" +
	"	if (u_Texture == true)\n" +
	"	{\n" +
	"		vec4 TexColor = texture2D(u_Sampler, v_TexCoord);\n" +
	"		fragmentColor = fragmentColor * TexColor;\n" +
	"	}\n" +
	"	else if (u_Lighting == true)\n" +
	"	{\n" +
	"		vec3 N = normalize(v_Normal);\n" +
			// This light follows the camera
	"		vec3 L1 = normalize(-v_Position);\n" +
	"		float clampShine1 = clamp(dot(N,L1), 0.0, 1.0);\n" +
	"		fragmentColor += vec4(0.2) * clampShine1;\n" +
			// This light stays in the same spot in the world
	"		vec3 L2 = normalize(v_WorldLightPosition - v_Position);\n" +
	"		float clampShine2 = clamp(dot(N,L2), 0.0, 1.0);\n" +
	"		fragmentColor += vec4(0.3) * clampShine2;\n" +
	"	}\n" +

	"	gl_FragColor = fragmentColor;\n" +
	"}\n";

function init()
{
	var canvas = document.getElementById("webgl");
	var projectionMatrix = mat4.create();
	var lastTime = Date.now();
	var resolution = 0.5;
	var animate = true;
	var animationID;
	var timeStep;
	var now;

	var index1;
	
	// This resizes the webgl view to the full size of the window view
	canvas.style.width = "100%";
	canvas.style.height = "100%";

	// This makes the body the full size of the window
	var body = document.body;
	body.style.margin = "0px";
	body.style.padding = "0px";
	body.style.width = "100%";
	body.style.height = "100%";
	body.style.overflow = "hidden";
	body.style.position = "absolute";

	var levelNumber = document.createElement("span");
	levelNumber.style.textAlign ="center";
	levelNumber.style.fontSize = "7em";
	levelNumber.style.width = "100%";
	levelNumber.style.top = "180px";
	levelNumber.style.color = "white";
	levelNumber.style.position = "absolute";
	levelNumber.style.zIndex = 1;
	levelNumber.id = "LevelNumber";
	body.appendChild(levelNumber);
	
	var scoreNumber = document.createElement("span");
	scoreNumber.style.textAlign ="center";
	scoreNumber.style.fontSize = "7em";
	scoreNumber.style.top = "20px";
	scoreNumber.style.right = "50px";
	scoreNumber.style.color = "white";
	scoreNumber.style.position = "absolute";
	scoreNumber.style.zIndex = 1;
	scoreNumber.id = "ScoreNumber";
	scoreNumber.innerHTML = "0";
	body.appendChild(scoreNumber);

	var gl = getWebGLContext(canvas);

	if (!gl)
	{
		console.log("Failed to get the rendering context for WebGL");
		return;
	}
	
	var shaderProgram = initShaderProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
	
	if (!shaderProgram)
	{
		console.log("Failed to intialize shaders.");
		return;
	}
	
	document.addEventListener("keydown", function(event)
	{
		keydown(event, world);
		// event.preventDefault(); prevents a system beep from older browsers
		event.preventDefault();
	}, false);
	
	document.addEventListener("keyup", function(event)
	{
		keyup(event, world);
	}, false);

	document.addEventListener("visibilitychange", function(event)
	{
		if (document.hidden)
		{
			animate = false;
			// Pause the drawing view with the "animationID" from the requestAnimation
			cancelAnimationFrame(animationID);
			//console.log("Browser tab is hidden");
			//alert("Browser tab is hidden");
			
//		canvas.parentNode.removeChild(canvas);
		}
		else if (document)
		{
			animate = true;
			
//		canvas = document.createElement("canvas");
//		canvas.innerHTML = "Please use a browser that supports \"canvas\"";
//		canvas.id = "webgl";
//		
//		body.appendChild(canvas);
//		
//		gl = getWebGLContext(canvas);
//		
//		// This resizes the webgl view to the full size of the window view
//		canvas.style.width = "100%";
//		canvas.style.height = "100%";
//		
//		shaderProgram = initShaderProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
//		shaderProgram.a_Position = gl.getAttribLocation(shaderProgram, "a_Position");
//		shaderProgram.a_Color = gl.getAttribLocation(shaderProgram, "a_Color");
//		shaderProgram.a_Normal = gl.getAttribLocation(shaderProgram, "a_Normal");
//		shaderProgram.a_TexCoord = gl.getAttribLocation(shaderProgram, "a_TexCoord");
//		
//		shaderProgram.u_MvpMatrix = gl.getUniformLocation(shaderProgram, "u_MvpMatrix");
//		shaderProgram.u_RotationMatrix = gl.getUniformLocation(shaderProgram, "u_RotationMatrix");
//		shaderProgram.u_ModelViewMatrix = gl.getUniformLocation(shaderProgram, "u_ModelViewMatrix");
//		shaderProgram.u_Radius = gl.getUniformLocation(shaderProgram, "u_Radius");
//		shaderProgram.u_Lighting = gl.getUniformLocation(shaderProgram, "u_Lighting");
//		shaderProgram.u_Texture = gl.getUniformLocation(shaderProgram, "u_Texture");
//		shaderProgram.u_Color = gl.getUniformLocation(shaderProgram, "u_Color");
//		shaderProgram.u_Sampler = gl.getUniformLocation(shaderProgram, "u_Sampler");
//
//		gl.clearColor(0.2, 0.5, 1.0, 1.0);
//		gl.clearDepth(1.0);
//		gl.enable(gl.DEPTH_TEST);
//		gl.depthFunc(gl.LEQUAL);
//		gl.enable(gl.CULL_FACE);
//		gl.cullFace(gl.BACK);
//		
//		gl.useProgram(shaderProgram);
			
			animationID = requestAnimationFrame(draw);
			// Reset the time so the animation starts where it stopped
			lastTime = Date.now();
			
			//console.log("Browser tab is visible");
			//alert("Browser tab is visible");
		}
	}, false);

	shaderProgram.a_Position = gl.getAttribLocation(shaderProgram, "a_Position");
	shaderProgram.a_Color = gl.getAttribLocation(shaderProgram, "a_Color");
	shaderProgram.a_Normal = gl.getAttribLocation(shaderProgram, "a_Normal");
	shaderProgram.a_TexCoord = gl.getAttribLocation(shaderProgram, "a_TexCoord");
	
	shaderProgram.u_MvpMatrix = gl.getUniformLocation(shaderProgram, "u_MvpMatrix");
	shaderProgram.u_RotationMatrix = gl.getUniformLocation(shaderProgram, "u_RotationMatrix");
	shaderProgram.u_ModelViewMatrix = gl.getUniformLocation(shaderProgram, "u_ModelViewMatrix");
	shaderProgram.u_Radius = gl.getUniformLocation(shaderProgram, "u_Radius");
	shaderProgram.u_Lighting = gl.getUniformLocation(shaderProgram, "u_Lighting");
	shaderProgram.u_Texture = gl.getUniformLocation(shaderProgram, "u_Texture");
	shaderProgram.u_Color = gl.getUniformLocation(shaderProgram, "u_Color");
	shaderProgram.u_Sampler = gl.getUniformLocation(shaderProgram, "u_Sampler");

	gl.clearColor(0.2, 0.5, 1.0, 1.0);
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);
	
	gl.useProgram(shaderProgram);
		
	// Initialize the "projectMatrix"
	resizeScreen(gl, canvas, resolution, projectionMatrix);
	
	window.addEventListener("resize", function(event)
	{
		// Resize the "projectMatrix"
		resizeScreen(gl, canvas, resolution, projectionMatrix);
	}, false);

	window.addEventListener("keydown", function(event)
	{
		// This changes the resolution
		if (event.keyCode === 82) // r
		{
			if (resolution === 1)
			{
				resolution = 0.5;
			}
			else if (resolution === 0.5)
			{
				resolution = 0.25;
			}
			else if (resolution === 0.25)
			{
				resolution = 1;
			}
			
			resizeScreen(gl, canvas, resolution, projectionMatrix);
		}
	}, false);
	
	// This is the motion for the world
	var world =
	{
		angleDegrees:{x:0, y:0, z:0},
		angularVelocity:{x:0, y:0, z:0},
		position:{x:0, y:-15, z:0},
		velocity:{x:0, y:0, z:0}
	}
	
	var collisionArena = new CollisionArena(gl);
	
	var draw = function()
	{
		now = Date.now();
		
		//var timeStep = (now - lastTime) / 1000.0; // This converts it to seconds
		timeStep = (now - lastTime) / 1000.0;
		lastTime = now;
		
		// Put the air brakes on the y velocity if the thrust key is not being held
		if (ARENA.thrust === false)
		{
			world.velocity.y *= 0.9;
			
			// Stop moving the world when it is too slow to notice
			if (world.velocity.y <= 0.5)
			{
				world.velocity.y = 0.0;
			}
		}
		
		world.angleDegrees.z += world.angularVelocity.z * timeStep;
		
		var a = radiansFromDegrees(world.angleDegrees.z);
		var d = world.velocity.y * timeStep;
		world.position.x += -Math.sin(a) * d;
		world.position.y +=  Math.cos(a) * d;
		
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		if (ARENA.levelScreen === true && ARENA.levelNumber > -1)
		{
			world =
			{
				angleDegrees:{x:0, y:0, z:0},
				angularVelocity:{x:0, y:0, z:0},
				position:{x:0, y:-15, z:0},
				velocity:{x:0, y:0, z:0}
			};
		}
		
		collisionArena.update(gl, world, shaderProgram, projectionMatrix, timeStep);
		
		if (animate === true)
		{
			animationID = requestAnimationFrame(draw);
		}
	}
	
	draw();
}

function resizeScreen(gl, canvas, resolution, projectionMatrix)
{
	canvas.width = window.innerWidth * resolution;
	canvas.height = window.innerHeight * resolution;

	// normalize the width and height then find the frustum
	var x = canvas.width;
	var y = canvas.height;
	var length = Math.sqrt((x * x) + (y * y));
	var nx = x / length;
	var ny = y / length;
	
	gl.viewport(0, 0, canvas.width, canvas.height);
	mat4.frustum(projectionMatrix, -nx, nx, -ny, ny, 1.0, 10000);
}

function keydown(event, world)
{
	// Key Down alert (keep this)
	//alert("event: " + event.code + " " + event.which + " " + event.key + " " + event.keyCode);
	
	// Note that both rotation and translation values work opposite of OpenGL
	switch (event.keyCode)
	{
		case 87: // w
		case 38: // ArrowUp
			ARENA.thrust = true;
			world.velocity.y = 30.0;
		break;
		
		case 83: // s
		case 40: // ArrowDown
			ARENA.thrust = true;
			world.velocity.y =-30.0;
		break;
		
		case 65: // a
		case 37: // ArrowLeft
			world.angularVelocity.z = 50.0;
		break;
		
		case 68: // d
		case 39: // ArrowRight
			world.angularVelocity.z =-50.0;
		break;
	}
}

function keyup(event, world)
{
	// Key Up alert (keep this)
	//alert("event: " + event.key);
	
	switch (event.keyCode)
	{
		/*case 32: // Spacebar
			GSJ_FIRE_WATER_BURST = false;
		break;*/

		case 87: // w
		case 38: // ArrowUp
		case 83: // s
		case 40: // ArrowDown
			ARENA.thrust = false;
			//world.velocity.y = 0.0;
		break;
		
		case 65: // a
		case 37: // ArrowLeft
		case 68: // d
		case 39: // ArrowRight
			world.angularVelocity.z = 0.0;
		break;
	}
}