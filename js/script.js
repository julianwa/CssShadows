
mat4.cssStr = function(mat) {
	return 'matrix3d(' + 
		mat[0]  + ',' + mat[1]  + ',' + mat[2]  + ',' + mat[3]  + ', ' +
		mat[4]  + ',' + mat[5]  + ',' + mat[6]  + ',' + mat[7]  + ', ' +
        mat[8]  + ',' + mat[9]  + ',' + mat[10] + ',' + mat[11] + ', ' +
        mat[12] + ',' + mat[13] + ',' + mat[14] + ',' + mat[15] + ')';
};

var groundPlaneWorldTransform = mat4.create();
mat4.identity(groundPlaneWorldTransform); 
mat4.scale(groundPlaneWorldTransform, [2,1,1]);

var groundPlane = document.getElementById('groundPlane');
groundPlane.style['-webkit-transform'] = mat4.cssStr(groundPlaneWorldTransform);