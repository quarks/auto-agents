let hintHeading = true, hintVelocity = true, hintForce = true;
let hintTrail = true, hintCircle = true, hintFleeCircle = true;

function enyBasic(colF, colS, p = p5.instance) {
    return (function () {
        p.push();
        p.translate(this._pos.x, this._pos.y);
        let size = 2 * this.colRad;
        p.fill(colF); p.stroke(colS); p.strokeWeight(1.1);
        p.ellipse(0, 0, size, size);
        p.pop();
    });
}

function enyPerson(colF, colS, p = p5.instance) {
    let body = [0.15, -0.5, 0.15, 0.5, -0.18, 0.3, -0.18, -0.3];
    return (function () {
        p.push();
        p.translate(this._pos.x, this._pos.y);
        let size = 2 * this.colRad;
        p.fill(colF); p.stroke(colS); p.strokeWeight(1.1);
        p.beginShape();
        for (let idx = 0; idx < body.length; idx += 2)
            p.vertex(body[idx] * size, body[idx + 1] * size);
        p.endShape(CLOSE);
        p.fill(colS); p.noStroke();
        p.ellipse(0, 0, 0.6 * size, 0.56 * size);
        p.pop();
    });
}

function obsAnim(p = p5.instance) {
    let a = Math.PI * Math.random();
    let pi2 = Math.PI / 2;
    return (function () {
        let size = 2 * this.colRad;
        a += 0.02;
        p.push();
        p.translate(this._pos.x, this._pos.y);
        p.noStroke();
        p.rotate(a); p.fill(255, 0, 0); p.arc(0, 0, size, size, 0, pi2, PIE);
        p.rotate(pi2); p.fill(255, 255, 0); p.arc(0, 0, size, size, 0, pi2, PIE);
        p.rotate(pi2); p.fill(0, 255, 0); p.arc(0, 0, size, size, 0, pi2, PIE);
        p.rotate(pi2); p.fill(0, 0, 255); p.arc(0, 0, size, size, 0, pi2, PIE);
        p.stroke(0, 0, 0); p.strokeWeight(1.1); p.noFill();;
        p.ellipse(0, 0, size, size);
        p.pop();
    });
}

function wallBarrier(col, weight, p = p5.instance) {
    return (function () {
        p.push();
        p.stroke(col); p.strokeWeight(weight);
        p.line(this._pos.x, this._pos.y, this._end.x, this._end.y);
        p.pop();
    });
}

function vcePerson(colF, colS, p = p5.instance) {
    let body = [0.15, -0.5, 0.15, 0.5, -0.18, 0.3, -0.18, -0.3];
    return (function () {
        p.push();
        p.translate(this.pos.x, this.pos.y);
        if (hintHeading) showHeading.call(this, p);
        if (hintVelocity) showVelocity.call(this, p);
        if (this.pilot.isWanderOn) { // Draw wander hints?
            if (hintHeading) showHeading.call(this, p);
            if (hintVelocity) showVelocity.call(this, p);
            if (hintCircle) showWanderCircle.call(this, p);
            if (hintForce) showWanderForce.call(this, p);
        }
        if (this.pilot.isFleeOn) { // Draw flee hints?
            if (hintFleeCircle)
                showFleeCircle.call(this, p);
        }
        let size = 2 * this.colRad;
        p.rotate(this.headingAngle)
        p.fill(colF); p.stroke(colS); p.strokeWeight(1.1);
        p.beginShape();
        for (let idx = 0; idx < body.length; idx += 2)
            p.vertex(body[idx] * size, body[idx + 1] * size);
        p.endShape(p.CLOSE);
        p.fill(colS); p.noStroke();
        p.ellipse(0, 0, 0.6 * size, 0.56 * size)
        p.pop();
    });
}

function mvrPerson(colF, colS, p = p5.instance) {
    let body = [0.15, -0.5, 0.15, 0.5, -0.18, 0.3, -0.18, -0.3];
    return (function () {
        p.push();
        p.translate(this._pos.x, this._pos.y);
        p.rotate(this.headingAngle)
        let size = 2 * this.colRad;
        p.fill(colF); p.stroke(colS); p.strokeWeight(1.1);
        p.beginShape();
        for (let idx = 0; idx < body.length; idx += 2)
            p.vertex(body[idx] * size, body[idx + 1] * size);
        p.endShape(CLOSE);
        p.fill(colS); p.noStroke();
        p.ellipse(0, 0, 0.6 * size, 0.56 * size)
        p.pop();
    });
}

// ###################################################################################
//  RENDERING HINTS
// ###################################################################################

function showHeading(p = p5.instance) {
    let wd2 = this.pilot.wanderDist / 2;
    p.push();
    p.rotate(this.headingAngle);
    p.noFill(); p.strokeWeight(4); p.stroke(163, 163, 255);
    p.line(0, 0, wd2, 0);
    p.noStroke(); p.fill(163, 163, 255);
    p.triangle(wd2, -6, wd2, 6, wd2 + 10, 0);
    p.pop();
}

function showVelocity(p = p5.instance) {
    p.push();
    p.rotate(this.velAngle);
    p.noFill(); p.strokeWeight(2); p.stroke(250, 208, 162);
    p.line(0, 0, this.speed, 0);
    p.noStroke(); p.fill(250, 208, 162);
    p.triangle(this.speed, -6, this.speed, 6, this.speed + 10, 0);
    p.pop();
}

function showWanderCircle(p = p5.instance) {
    let wd = this.pilot.wanderDist, wr2 = 2 * this.pilot.wanderRadius;
    p.push();
    p.rotate(this.headingAngle);
    p.strokeWeight(2); p.stroke(0, 32); p.fill(0, 10);
    p.ellipse(wd, 0, wr2, wr2);
    p.pop();
}

function showFleeCircle(p = p5.instance) {
    let fe2 = 2 * this.pilot.fleeRadius;
    p.push();
    p.fill(0, 8); p.noStroke();
    p.ellipse(0, 0, fe2, fe2);
    p.pop();
}

function showWanderForce(p = p5.instance) {
    let pt = this.pilot;
    let wd = pt.wanderDist, wt = pt.wanderTarget;
    let wta = Math.atan2(wt.y, wd + wt.x);
    p.push();
    p.rotate(this.headingAngle);
    p.noFill(); p.strokeWeight(2); p.stroke(200, 0, 0);
    p.line(0, 0, wd + wt.x, wt.y);
    p.translate(wd + wt.x, wt.y); p.rotate(wta);
    p.noStroke(); p.fill(200, 0, 0); p.noStroke();
    p.triangle(-14, -5, -14, 5, 0, 0);
    p.pop();
}

function colorizeEntities(tree, painters) {
    function colourize(part) {
        part._entities.forEach(e => { e.painter = painters[part._level]; });
        part._children?.forEach(p => colourize(p));
    }
    colourize(tree.getRoot());
}
