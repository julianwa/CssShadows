
var mat4;

mat4.cssStr = function (mat) {
	return "matrix3d(" + 
		mat[0].toFixed(10)	+ "," + mat[1].toFixed(10)	+ "," + mat[2].toFixed(10)	+ "," + mat[3].toFixed(10)	+ ", " +
		mat[4].toFixed(10)	+ "," + mat[5].toFixed(10)	+ "," + mat[6].toFixed(10)	+ "," + mat[7].toFixed(10)	+ ", " +
		mat[8].toFixed(10)	+ "," + mat[9].toFixed(10)	+ "," + mat[10].toFixed(10) + "," + mat[11].toFixed(10) + ", " +
		mat[12].toFixed(10) + "," + mat[13].toFixed(10) + "," + mat[14].toFixed(10) + "," + mat[15].toFixed(10) + ")";
};

mat4.projectOntoPlane = function (mat, origin, plane, dest) {
	
	var m = mat4.create([
		-plane[0] * origin[0], -plane[0] * origin[1], -plane[0] * origin[2], -plane[0],
		-plane[1] * origin[0], -plane[1] * origin[1], -plane[1] * origin[2], -plane[1],
		-plane[2] * origin[0], -plane[2] * origin[1], -plane[2] * origin[2], -plane[2],
		-plane[3] * origin[0], -plane[3] * origin[1], -plane[3] * origin[2], -plane[3]
	]);
	
	var dot = origin[0] * plane[0] + origin[1] * plane[1] + origin[2] * plane[2] + plane[3];
	m[0] += dot;
	m[5] += dot;
	m[10] += dot;
	m[15] += dot;
	
	if (!dest) {
		dest = mat;
	}
	
	mat4.multiply(mat, m, dest);
};

var viewport = document.getElementById("viewport");
var groundPlane = document.getElementById("groundPlane");
var man = document.getElementById("man");
var shadow = document.getElementById("shadow");

var manPositionX = 0;

var applyWorldTransform = function(elem, worldTransform) {
	
	var transform = mat4.create();
	mat4.identity(transform);
	mat4.translate(transform, 
		[0.5 * (viewport.clientWidth - elem.clientWidth), 0.5 * (viewport.clientHeight - elem.clientHeight), 0]);
	
	mat4.multiply(transform, worldTransform);
	
	elem.style["-webkit-transform"] = mat4.cssStr(transform);
};

var planeFromWorldTransform = function(worldTransform) {
	
	var worldTransformInverseTranspose = mat4.create(worldTransform);
	mat4.inverse(worldTransformInverseTranspose);
	mat4.transpose(worldTransformInverseTranspose);

	var planeNormal = vec3.create();
	mat4.multiplyVec3(worldTransformInverseTranspose, [0, 0, 1], planeNormal);
	
	var planePoint = vec3.create();
	mat4.multiplyVec3(worldTransform, [0, 0, 0], planePoint);
	
	return vec4.create([planeNormal[0], planeNormal[1], planeNormal[2], -vec3.dot(planeNormal, planePoint));
};

var updateTransforms = function() {

	var groundPlaneWorldTransform = mat4.create();
	mat4.identity(groundPlaneWorldTransform);
	mat4.translate(groundPlaneWorldTransform, [0, viewport.clientHeight / 2, 0]);
	mat4.rotateX(groundPlaneWorldTransform, 1.4);
	mat4.translate(groundPlaneWorldTransform, [0, -groundPlane.clientHeight / 2, 0]);
	applyWorldTransform(groundPlane, groundPlaneWorldTransform);

	var plane = planeFromWorldTransform(groundPlaneWorldTransform);

	var manWorldTransform = mat4.create();
	mat4.identity(manWorldTransform);
	mat4.translate(manWorldTransform, [manPositionX, 100, 0]);
	applyWorldTransform(man, manWorldTransform);

	mat4.projectOntoPlane(manWorldTransform, [100, 10, 2000], plane);
	applyWorldTransform(shadow, manWorldTransform);
};

var onKeyPress = function() {
	
	manPositionX += 10;
	updateTransforms();
};

updateTransforms();