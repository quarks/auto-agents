let hintHeading = true, hintVelocity = true, hintForce = true;
let hintTrail = true, hintCircle = true, hintFleeCircle = true;
let hintObsDetect = true, hintFeelers = true, hintInterpose = true;

let showColCircle = true;

function entBasic(colF, colS, p = p5.instance) {
    return (function () {
        p.push();
        p.translate(this._pos.x, this._pos.y);
        let size = 2 * this.colRad;
        p.fill(colF); p.stroke(colS); p.strokeWeight(1.1);
        p.ellipse(0, 0, size, size);
        p.pop();
    });
}

function entPerson(colF, colS, p = p5.instance) {
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

function entObsAnim(p = p5.instance) {
    let col = [p.color(255, 0, 0), p.color(255, 255, 0), p.color(0, 255, 0), p.color(0, 0, 255)];
    let a = Math.PI * Math.random();
    let pi2 = Math.PI / 4;

    return (function () {
        let size = 2 * this.colRad;
        a += 0.01;
        p.push();
        p.translate(this._pos.x, this._pos.y); p.rotate(a);
        p.noStroke();
        for (let i = 0; i < 8; i++) {
            p.fill(col[i % 4]);
            p.arc(0, 0, size, size, 0, pi2, PIE);
            p.rotate(pi2);
        }
        p.stroke(0, 0, 0); p.strokeWeight(1.1); p.noFill();;
        p.ellipse(0, 0, size, size);
        p.pop();
    });
}

function entWall(col, weight, p = p5.instance) {
    return (function () {
        p.push();
        p.stroke(col); p.strokeWeight(weight);
        p.line(this._pos.x, this._pos.y, this._end.x, this._end.y);
        p.stroke(120); p.strokeWeight(weight / 4);
        if (this.repelSide == OUTSIDE || this.repelSide == BOTH_SIDES) {
            p.push();
            p.translate(this.norm.x * 3, this.norm.y * 3);
            p.line(this._pos.x, this._pos.y, this._end.x, this._end.y);
            p.pop();
        }
        if (this.repelSide == INSIDE || this.repelSide == BOTH_SIDES) {
            p.push();
            p.translate(this.norm.x * -3, this.norm.y * -3);
            p.line(this._pos.x, this._pos.y, this._end.x, this._end.y);
            p.pop();
        }
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
        if (this.pilot.isObsAvoidOn) {
            if (hintObsDetect) showObstacleDetectBox.call(this, p);
            if (hintHeading) showHeading.call(this, p);
            if (hintVelocity) showVelocity.call(this, p);
        }
        if (this.pilot.isFleeOn) { // Draw flee hints?
            if (hintFleeCircle) showFleeCircle.call(this, p);
        }
        if (this.pilot.isWallAvoidOn) {
            if (hintFeelers) showFeelers.call(this, p);
        }
        if (this.pilot.isInterposeOn) {
            if (hintInterpose) showInterpose.call(this, p);
        }
        let size = 2 * this.colRad;
        p.rotate(this.headingAngle);
        if (showColCircle) {
            p.fill(0, 32); p.noStroke();
            p.ellipse(0, 0, 2 * this.colRad, 2 * this.colRad);
        }
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
        if (showColCircle) {
            p.fill(0, 32); p.noStroke();
            p.ellipse(0, 0, 2 * this.colRad, 2 * this.colRad);
        }
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

function mvrArrow(colF, colS, p = p5.instance) {
    let body = [-0.7, -0.45, -0.7, 0.45, 0.85, 0];
    return (function () {
        p.push();
        p.translate(this._pos.x, this._pos.y);
        p.rotate(this.headingAngle)
        let size = this.colRad;
        if (showColCircle) {
            p.fill(0, 32); p.noStroke();
            p.ellipse(0, 0, 2 * this.colRad, 2 * this.colRad);
        }
        p.fill(colF); p.stroke(colS); p.strokeWeight(1.1);
        p.beginShape();
        for (let idx = 0; idx < body.length; idx += 2)
            p.vertex(body[idx] * size, body[idx + 1] * size);
        p.endShape(CLOSE);
        p.pop();
    });
}

// ###################################################################################
//  RENDERING HINTS
// ###################################################################################

function showInterpose(p = p5.instance) {
    let p0 = this.pilot.agent0.pos.sub(this.pos);
    let p1 = this.pilot.agent1.pos.sub(this.pos);
    let mid = p0.add(p1).div(2);
    p.push();
    // p.translate(p0.x, p0.y);
    p.stroke(0, 64); p.strokeWeight(1);
    p.line(p0.x, p0.y, p1.x, p1.y);
    p.fill(0, 32); p.noStroke();
    p.ellipse(mid.x, mid.y, 10, 10);
    p.pop();
}


function showFeelers(p = p5.instance) {
    let feelers = this.pilot.getFeelers();
    let pos = this.pos;
    p.push();
    p.stroke(0, 128); p.strokeWeight(1);
    feelers.forEach((f) => p.line(0, 0, f.x - pos.x, f.y - pos.y));
    p.pop();
}


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

function showObstacleDetectBox(p = p5.instance) {
    let w = this.colRad;
    let len = 2 * this.speed;
    p.push();
    p.rotate(this.velAngle);
    p.noFill(); p.strokeWeight(1.2); p.stroke(180, 160, 10);
    p.rect(0, -this.colRad, this.pilot.boxLength, 2 * this.colRad);
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
