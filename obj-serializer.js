/**
 * @author kovacsv / http://kovacsv.hu/
 * @author kaosat-dev 
 */
var detectEnv = require("composite-detect");

OBJSerializer = function () {
};

OBJSerializer.prototype = {
	constructor: OBJSerializer,

  serialize: function( rootElement ){
    return this.exportHierarchy (rootElement);
  },

  exportHierarchy : function (hierarchy) {
		var current;
    var meshes = [];
		hierarchy.traverse (function (current) {
			if (current instanceof THREE.Mesh) {
				meshes.push (current);
			}
		});
		return this.exportMeshes ( meshes );
	},

	exportMeshes: function ( meshes, name ) {
    var name = name || "exported";
    var header = "solid "+name+"\n";

    var content = "#"+header;

    var vertexData = "";
    var uvData = "";
    var normalData = "";
    var faceData = "";

    var i, j, mesh, geometry, face, matrix, position;
    var vertexOffset=0, uvOffset=0, normalOffset=0;
		for (i = 0; i <meshes.length ; i++) {
			mesh = meshes[i];
			geometry = mesh.geometry;
			matrix = mesh.matrix;
			position = mesh.position;
      //console.log("faceOffset", faceOffset,meshes.length, mesh.name);

      for (j = 0; j < geometry.vertices.length; j++) {
        var vertex = this.getTransformedPosition (geometry.vertices[j], matrix, position);
        vertexData += 'v ' + vertex.x + ' ' + vertex.y + ' ' + vertex.z + '\n';
      }

		  // uvs
      var tmpUvOffset = 0;
		  for ( var j = 0, l = geometry.faceVertexUvs[ 0 ].length; j < l; j ++ ) {
			  var vertexUvs = geometry.faceVertexUvs[ 0 ][ j ];
         tmpUvOffset += vertexUvs.length
			  for ( var k = 0; k < vertexUvs.length; k ++ ) {
				  var uv = vertexUvs[ k ];
				  uvData += 'vt ' + uv.x + ' ' + uv.y + '\n';
			  }
		  }

		  // normals
		  // faces
      var tmpNormalOffset = 0;
      for (j = 0, k=1; j < geometry.faces.length; j++, k += 3) {
				face = geometry.faces[j];
        //normals
        var normals = face.vertexNormals;
        tmpNormalOffset += normals.length
			  for ( var u = 0; u < normals.length; u ++ ) {
				  var normal = normals[ u ];
				  normalData += 'vn ' + normal.x + ' ' + normal.y + ' ' + normal.z + '\n';
			  }

        faceData += 'f ';
			  faceData += ( face.a + 1 +vertexOffset) + '/' + ( k + uvOffset) + '/' + ( k + normalOffset ) + ' ';
			  faceData += ( face.b + 1 +vertexOffset) + '/' + ( k + 1 + uvOffset ) + '/' + ( k + 1+ normalOffset ) + ' ';
			  faceData += ( face.c + 1 +vertexOffset) + '/' + ( k + 2 + uvOffset ) + '/' + ( k + 2+ normalOffset ) + '\n';

			}
      vertexOffset += geometry.vertices.length;
      uvOffset += tmpUvOffset
      normalOffset += tmpNormalOffset;
    }
    content += vertexData + uvData + normalData + faceData;
    return content;
	},

	addLineToContent : function (line, content) {
		content += line + '\n';
    return content;
	},

	addTriangleToContent : function (normal, vertex1, vertex2, vertex3, content) {
		content = this.addLineToContent ('\tfacet normal ' + normal.x + ' ' + normal.y + ' ' + normal.z, content);
		content = this.addLineToContent ('\t\touter loop', content);
		content = this.addLineToContent ('\t\t\tvertex ' + vertex1.x + ' ' + vertex1.y + ' ' + vertex1.z, content);
		content = this.addLineToContent ('\t\t\tvertex ' + vertex2.x + ' ' + vertex2.y + ' ' + vertex2.z, content);
		content = this.addLineToContent ('\t\t\tvertex ' + vertex3.x + ' ' + vertex3.y + ' ' + vertex3.z, content);
		content = this.addLineToContent ('\t\tendloop', content);
		content = this.addLineToContent ('\tendfacet', content);
    return content;
	},

	getTransformedPosition : function (vertex, matrix, position) {
		var result = vertex.clone ();
		if (matrix !== undefined) {
			result.applyMatrix4 (matrix);
		}
		if (position !== undefined) {
			result.add (position);
		}
		return result;
	},

};
   
if (detectEnv.isModule) module.exports = OBJSerializer;
