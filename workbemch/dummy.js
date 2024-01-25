Ball a, b;

void setup() {
	size(640, 480);
	a = new Ball(1, 200, 200, 80);
	b = new Ball(5, 340, 250, 150);
}

void draw() {
	background(220, 250, 220);
	a.draw();
	b.draw();
	drawAxis(a, b);
}

void ensureNoOverlap(Ball pa, Ball pb) {
  PVector Pa = new PVector(pa.x, pa.y);
  PVector Pb = new PVector(pb.x, pb.y);
  float overlap = pa.r + pb.r - PVector.dist(Pa, Pb);
	if (overlap > 0) {
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

}

void shift(PVector delta) {
	ox = x + delta.x;
	oy = y + delta.y;
}
}
