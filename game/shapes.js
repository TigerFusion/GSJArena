"use strict";

function createWall(gl)
{
	var colors;
	var vertices;
	var indices;
	
	var colorsArray = [];
	var indicesArray = [];
	var textureArray = [];
	
	var textureBuffer;
	var colorBuffer;
	var vertexBuffer;
	var indexBuffer;
	
	var index1;
	var index2;

	var object = {};

	var verticesArray = [
		// Top Side
		 40, 2.5, 0,
		-40, 2.5, 0,
		 40,-2.5, 0,
		-40, 2.5, 0,
		-40,-2.5, 0,
		 40,-2.5, 0,

		// Front Side
		 40,-2.5, 0,
		-40,-2.5, 0,
		 40,-2.5,-5,
		-40,-2.5, 0,
		-40,-2.5,-5,
		 40,-2.5,-5,

		// Back Side
		-40, 2.5, 0,
		 40, 2.5, 0,
		-40, 2.5,-5,
		 40, 2.5, 0,
		 40, 2.5,-5,
		-40, 2.5,-5,

		// Left Side
		-40,-2.5, 0,
		-40, 2.5, 0,
		-40,-2.5,-5,
		-40, 2.5, 0,
		-40, 2.5,-5,
		-40,-2.5,-5,

		// Right Side
		 40, 2.5, 0,
		 40,-2.5, 0,
		 40, 2.5,-5,
		 40,-2.5, 0,
		 40,-2.5,-5,
		 40, 2.5,-5
	];
	
	// Top Face
	var colorsArray1 = [
		0.9, 0.9, 0.9, 1,
		0.9, 0.9, 0.9, 1,
		0.9, 0.9, 0.9, 1,
		0.9, 0.9, 0.9, 1,
		0.9, 0.9, 0.9, 1,
		0.9, 0.9, 0.9, 1
	];
	
	// Side Faces
	var colorsArray2 = [
		1, 1, 1, 1,
		1, 1, 1, 1,
		0.8, 0.8, 0.8, 1,
		1, 1, 1, 1,
		0.8, 0.8, 0.8, 1,
		0.8, 0.8, 0.8, 1
	];
	
	// Top Faces
	for (index1 = 0; index1 < colorsArray1.length; index1++)
	{
		colorsArray.push(colorsArray1[index1]);
	}
	
	// Side faces
	for (index1 = 0; index1 < 4; index1++)
	{
		for (index2 = 0; index2 < colorsArray2.length; index2++)
		{
			colorsArray.push(colorsArray2[index2]);
		}
	}
	
	// Top Front and Back sides
	var texCoordsArray1 = [
		8, 1,
		0, 1,
		8, 0,
		0, 1,
		0, 0,
		8, 0
	];
	
	for (index1 = 0; index1 < 3; index1++)
	{
		for (index2 = 0; index2 < texCoordsArray1.length; index2++)
		{
			textureArray.push(texCoordsArray1[index2]);
		}
	}
	
	// Left and Right Sides
	var texCoordsArray2 = [
		1, 1,
		0, 1,
		1, 0,
		0, 1,
		0, 0,
		1, 0
	];
	
	for (index1 = 0; index1 < 2; index1++)
	{
		for (index2 = 0; index2 < texCoordsArray2.length; index2++)
		{
			textureArray.push(texCoordsArray2[index2]);
		}
	}
	
	// The wall's indices
	for (index1 = 0; index1 < (verticesArray.length / 3.0); index1++)
	{
		indicesArray.push(index1);
	}
	
	// Create our buffers
	textureBuffer = gl.createBuffer();
	
	gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureArray), gl.STATIC_DRAW);

	colorBuffer = gl.createBuffer();
	
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorsArray), gl.STATIC_DRAW);

	vertexBuffer = gl.createBuffer();
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesArray), gl.STATIC_DRAW);
	
	indexBuffer = gl.createBuffer();
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicesArray), gl.STATIC_DRAW);
	
	object.textureBuffer = textureBuffer;
	object.colorBuffer = colorBuffer;
	object.vertexBuffer = vertexBuffer;
	object.indexBuffer = indexBuffer;
	object.indexLength = (verticesArray.length / 3.0);
	object.radius = 0; // This means the radius will not be used
	object.lighting = false;
	object.texture = true;
	object.sampler = 0;
	
	return object;
}

function createGrass(gl)
{
	var colorBuffer;
	var vertexBuffer;
	var indexBuffer;
	var textureBuffer;
	
	var index1;
	var index2;

	var object = {};

	var colorsArray =
	[
		1, 1, 1, 1,
		1, 1, 1, 1,
		1, 1, 1, 1,
		1, 1, 1, 1
	];
	
	var verticesArray =
	[
		 200, 200,-5,
		-200, 200,-5,
		 200,-200,-5,
		-200,-200,-5
	];

	var textureArray =
	[
		10, 10,
		0,  10,
		10, 0,
		0,  0
	];

	var indicesArray =
	[
		0, 1, 3, 0, 3, 2
	];
	
	// Create our buffers
	textureBuffer = gl.createBuffer();
	
	gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureArray), gl.STATIC_DRAW);
	
	colorBuffer = gl.createBuffer();
	
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorsArray), gl.STATIC_DRAW);

	vertexBuffer = gl.createBuffer();
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesArray), gl.STATIC_DRAW);
	
	indexBuffer = gl.createBuffer();
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicesArray), gl.STATIC_DRAW);

	object.textureBuffer = textureBuffer;
	object.colorBuffer = colorBuffer;
	object.vertexBuffer = vertexBuffer;
	object.indexBuffer = indexBuffer;
	object.indexLength = indicesArray.length;
	object.radius = 200;
	object.lighting = false;
	object.texture = true;
	object.sampler = 1;
	
	return object;
}

// Copyright (c) 2010-2011 Stuart Caunt visit iSGL3D for license: http://isgl3d.com
function createCylinder(gl, height, topRadius, bottomRadius, verticalSlices, horizontalSlices)
{
	var _height = height;
	var _topRadius = topRadius;
	var _bottomRadius = bottomRadius;
	// radiusSegments
	var _ns = verticalSlices;
	// heightSegments
	var _nt = horizontalSlices;
	var _openEnded = true;
	
	var totalHeight;
	var dR;
	var length;
	var vOffset;
	var radius;
	var s;
	var t;
	var theta;
	var totalNT;
	
	var first;
	var second;
	var third;
	var fourth;
	
	var verticesArray = [];
	var normalsArray = [];
	
	var normalBuffer;
	var vertexBuffer;
	var indexBuffer;
	
	var object = {};
	
	if (_openEnded)
	{
		totalHeight = _height;
	}
	else
	{
		totalHeight = _bottomRadius + _height + _topRadius;
	}
	
	dR = _bottomRadius - _topRadius;
	length = Math.sqrt(_height * _height + dR * dR);

	if (!_openEnded)
	{
		// Create bottom
		for (s = 0; s <= _ns; s++)
		{
			verticesArray.push(0);
			verticesArray.push(-(_height / 2));
			verticesArray.push(0);
			
			normalsArray.push(0);
			normalsArray.push(-1);
			normalsArray.push(0);
			
			//indexedTextures.push(1.0 * s / _ns);
			//indexedTextures.push(1);
		}
	}
	
	if (_openEnded)
	{
		vOffset = 0;
	}
	else
	{
		vOffset = _bottomRadius;
	}
	
	// Create middle
	for (t = 0; t <= _nt; t++)
	{
		radius = _bottomRadius - (_bottomRadius - _topRadius) * t / _nt;
		
		for (s = 0; s <= _ns; s++)
		{
			theta = s * 2 * Math.PI / _ns;

			verticesArray.push(radius * Math.sin(theta));
			verticesArray.push(-(_height / 2) + (t * _height / _nt));
			verticesArray.push(radius * Math.cos(theta));
			
			normalsArray.push(Math.sin(theta) * _height / length);
			normalsArray.push(dR / length);
			normalsArray.push(Math.cos(theta) * _height / length);

			//indexedTextures.push(1.0 * s / _ns);
			//indexedTextures.push(1.0 - (vOffset + t * _height / _nt) / totalHeight);
		}
	}

	if (!_openEnded)
	{
		// Create top
		for (s = 0; s <= _ns; s++)
		{
			verticesArray.push(0);
			verticesArray.push(_height / 2);
			verticesArray.push(0);
			
			normalsArray.push(0);
			normalsArray.push(1);
			normalsArray.push(0);
			
			//indexedTextures.push(1.0 * s / _ns);
			//indexedTextures.push(0);
		}
	}
	
	if (_openEnded)
	{
		totalNT = _nt;
	}
	else
	{
		totalNT = _nt + 2;
	}
		
	var indicesArray = [];
	
	for (t = 0; t < totalNT; t++)
	{
		for (s = 0; s < _ns; s++)
		{
			first = (t * (_ns + 1)) + s;
			second = first + (_ns + 1);
			third = first + 1;
			fourth = second + 1;
			
			indicesArray.push(first);
			indicesArray.push(third);
			indicesArray.push(second);
			
			indicesArray.push(second);
			indicesArray.push(third);
			indicesArray.push(fourth);
		}
	}
	
	// Create our buffers
	normalBuffer = gl.createBuffer();
	
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalsArray), gl.STATIC_DRAW);

	vertexBuffer = gl.createBuffer();
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesArray), gl.STATIC_DRAW);
	
	indexBuffer = gl.createBuffer();
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicesArray), gl.STATIC_DRAW);

	object.normalBuffer = normalBuffer;
	object.vertexBuffer = vertexBuffer;
	object.indexBuffer = indexBuffer;
	object.indexLength = indicesArray.length;
	object.radius = 0;
	object.lighting = true;
	object.texture = false;
	object.sampler = -1;
	
	return object;
}

// Copyright (c) 2010-2011 Stuart Caunt visit iSGL3D for license: http://isgl3d.com
function createSphere(gl, verticalSlices, horizontalSlices, radius)
{
    // Use GL_TRIANGLES;
	// longs = verticalSlices
	// lats = horizontalSlices
	
	var theta;
	var phi;
	var longs = verticalSlices;
	var lats = horizontalSlices;
	
	var sinTheta;
	var sinPhi;
	var cosTheta;
	var cosPhi;
			
	var x;
	var y;
	var z;
	var u;
	var v;
	
	var first;
	var second;
	var third;
	var fourth;
	
	var latNumber1;
	var longNumber1;
	var latNumber2;
	var longNumber2;
	
	var verticesArray = [];
	var normalsArray = [];

	var normalBuffer;
	var vertexBuffer;
	var indexBuffer;
	
	var object = {};
	
	for (latNumber1 = 0; latNumber1 <= lats; ++latNumber1)
	{
		for (longNumber1 = 0; longNumber1 <= longs; ++longNumber1)
		{
			theta = latNumber1 * Math.PI / lats;
			phi = longNumber1 * 2 * Math.PI / longs;
			
			sinTheta = Math.sin(theta);
			sinPhi = Math.sin(phi);
			cosTheta = Math.cos(theta);
			cosPhi = Math.cos(phi);
			
			x = cosPhi * sinTheta;
			y = cosTheta;
			z = sinPhi * sinTheta;
			u = 1.0 - (1.0 * longNumber1 / longs);
			v = 1.0 * latNumber1 / lats;
			
			verticesArray.push(radius * x);
			verticesArray.push(radius * y);
			verticesArray.push(radius * z);

			normalsArray.push(x);
			normalsArray.push(y);
			normalsArray.push(z);
			
			//indexedTextures.push(u);
			//indexedTextures.push(v);
		}
	}
	
	var indicesArray = [];
	
	for (latNumber2 = 0; latNumber2 < lats; latNumber2++)
	{
		for (longNumber2 = 0; longNumber2 < longs; longNumber2++)
		{
			first = (latNumber2 * (longs + 1)) + longNumber2;
			second = first + (longs + 1);
			third = first + 1;
			fourth = second + 1;
			
			indicesArray.push(first);
			indicesArray.push(third);
			indicesArray.push(second);
			
			indicesArray.push(second);
			indicesArray.push(third);
			indicesArray.push(fourth);
		}
	}
	
	// Create our buffers
	normalBuffer = gl.createBuffer();
	
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalsArray), gl.STATIC_DRAW);

	vertexBuffer = gl.createBuffer();
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesArray), gl.STATIC_DRAW);
	
	indexBuffer = gl.createBuffer();
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicesArray), gl.STATIC_DRAW);
	
	object.normalBuffer = normalBuffer;
	object.vertexBuffer = vertexBuffer;
	object.indexBuffer = indexBuffer;
	object.indexLength = indicesArray.length;
	object.radius = 0;
	object.lighting = true;
	object.texture = false;
	object.sampler = -1;
	
	return object;
}

function createRoundedSquare(gl, squareHalfSize)
{
	var colorsArray =
	[
		0, 0, 0, 1,
		0, 0, 0, 1,
		0, 0, 0, 1,
		0, 0, 0, 1
	];
	
	var verticesArray =
	[
		 squareHalfSize, squareHalfSize, 0,
		-squareHalfSize, squareHalfSize, 0,
		 squareHalfSize,-squareHalfSize, 0,
		-squareHalfSize,-squareHalfSize, 0
	];

	var indicesArray =
	[
		0, 1, 3, 0, 3, 2
	];
	
	var object = {};
	
	// Create our buffers
	var colorBuffer = gl.createBuffer();
	
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorsArray), gl.STATIC_DRAW);

	var vertexBuffer = gl.createBuffer();
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesArray), gl.STATIC_DRAW);
	
	var indexBuffer = gl.createBuffer();
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicesArray), gl.STATIC_DRAW);

	object.colorBuffer = colorBuffer;
	object.vertexBuffer = vertexBuffer;
	object.indexBuffer = indexBuffer;
	object.indexLength = indicesArray.length;
	object.radius = 0.0;
	object.lighting = false;
	object.texture = false;
	object.sampler = -1;

	return object;
}