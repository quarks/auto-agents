Ball a, b;

void setup() {
	size(640, 480);
	a = new Ball(1, 200, 200, 80);
	b = new Ball(2, 340, 250, 150);
}

void draw() {
	background(220, 250, 220);
	a.draw();
	b.draw();
	drawAxis(a, b);
}

void drawAxis(Ball pa, Ball pb) {
  PVector Pa = new PVector(pa.x, pa.y);
  PVector Pb = new PVector(pb.x, pb.y);
  PVector Vab = PVector.sub(Pb, Pa).normalize();
  float angle = atan2(Vab.y, Vab.x);
  PVector centre = PVector.add(Pa, Pb).div(2);
	push();
	stroke(0);
	fill(0);
	translate(centre.x, centre.y);
	rotate(angle);
	line(-200, 0, 200, 0);
	triangle(200, 0, 190, -10, 190, 10);
	pop();
}


void ensureNoOverlap(Ball pa, Ball pb) {
  PVector Pa = new PVector(pa.x, pa.y);
  PVector Pb = new PVector(pb.x, pb.y);
  float overlap = PVector.dist(Pa, Pb) - (pa.r + pb.r);
	if (overlap < 0) {
		overlap = abs(overlap);
    PVector Vab = PVector.sub(Pb, Pa);
		Vab.normalize();
		println(Vab.toString(), overlap);
    float M = (pa.m + pb.m);
    PVector shiftA = PVector.mult(Vab, -overlap * pb.m / M);
    PVector shiftB = PVector.mult(Vab, overlap * pa.m / M);
		println(shiftA.toString());
		println(shiftB.toString());
		pa.shift(shiftA);
		pb.shift(shiftB);
	}
}

void mouseClicked() {
	ensureNoOverlap(a, b);
}

class Ball {
  float x, y, r;
  float ox, oy;
  float m;

	Ball(float m, float x, float y, float r) {
		this.x = this.ox = x;
		this.y = this.oy = y;
		this.r = r;
		this.m = m;
	}

  void draw() {
	noStroke();
	fill(0, 32);
	ellipse(x, y, 2 * r, 2 * r);
	stroke(200, 0, 0);
	noFill();
	ellipse(ox, oy, 2 * r, 2 * r);
	noStroke();
	fill(0);
	ellipse(x, y, 5, 5);
	fill(200, 80, 80);
	ellipse(ox, oy, 5, 5);
}

void shift(PVector delta) {
	ox = x + delta.x;
	oy = y + delta.y;
}
}