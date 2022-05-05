class Sling {
  constructor(pointA, body) {
    var options = {
      pointA: pointA,
      bodyB: body,
      stiffness: 0.2,
      length: 40
    };
    this.pointA = pointA;
    this.sling = Constraint.create(options);
    World.add(world, this.sling);
  }
  attach(pointA, body) {
    this.sling.bodyB = body;
    this.sling.pointA = pointA;
  }

  fly() {
    this.sling.bodyB = null;
  }

  display() {
    if (this.sling.bodyB) {
      var posA = this.sling.pointA;
      var posB = this.sling.bodyB.position;
      push();
      stroke("#d7b38c");
      strokeWeight(4);
      line(posA.x - 5, posA.y, posB.x - 10, posB.y);
      line(posA.x + 5, posA.y, posB.x + 10, posB.y);
      pop();
    }
  }
}
