THREE = require("three");
OBJSerializer = require("../obj-serializer");
fs = require("fs");


describe("STL serializer tests", function() {
  var serializer = new OBJSerializer();

  it("can serialize to obj files", function() {
    var object = new THREE.Mesh(new THREE.CubeGeometry(10,10,10),new THREE.MeshBasicMaterial);

    var obsGeneratedOBJ = serializer.serialize(object);
    var expGeneratedOBJ = fs.readFileSync("specs/data/cube.obj", "utf8")
    expect(obsGeneratedOBJ).toEqual(expGeneratedOBJ);
  });

  it("can serialize an object hierarchy to obj files", function() {
    var object = new THREE.Mesh(new THREE.CubeGeometry(10,10,10),new THREE.MeshBasicMaterial);
    object.name = "cube";
    var subObject = new THREE.Mesh(new THREE.SphereGeometry(10,10,10),new THREE.MeshBasicMaterial);
    subObject.position.x = 20;
    object.add( subObject );

    var obsGeneratedOBJ = serializer.serialize(object);
    var expGeneratedOBJ = fs.readFileSync("specs/data/hierarchy.obj", "utf8")
    expect(obsGeneratedOBJ).toEqual(expGeneratedOBJ);
  });
});
