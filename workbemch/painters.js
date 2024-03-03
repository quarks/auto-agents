let hintHeading = true, hintVelocity = true, hintForce = true;
let hintTrail = true, hintCircle = true, hintFleeCircle = true;
let hintObsDetect = true, hintFeelers = true, hintInterpose = true;
let hintCanSee = true;
let showColCircle = true;


function mvrArrowOffset(colF, colS, offset = 0, p = p5.instance) {
    let body = [-0.7, -0.45 + offset, -0.7, 0.45 + offset, 0.85, offset];
    return (function (world, elapsedTime) {
        let size = this.colRad;
        p.push();
        p.translate(this.pos.x, this.pos.y);
        p.rotate(this.headingAngle);
        p.fill(colF); p.stroke(colS); p.strokeWeight(1.1);
        p.beginShape();
        for (let idx = 0; idx < body.length; idx += 2)
            p.vertex(body[idx] * size, body[idx + 1] * size);
        p.endShape(CLOSE);
        p.pop();
    });
}

// --------------------------------------------------------------------------------------------------
// Updated paimnters

function paintEntity(colF, colS, p = p5.instance) {
    return (function (elapsedTime, world) {
        p.push();
        p.translate(this.pos.x, this.pos.y);
        let size = 2 * this.colRad;
        p.fill(colF); p.stroke(colS); p.strokeWeight(1.1);
        p.ellipse(0, 0, size, size);
        p.pop();
    });
}

function paintAnimBrolly(p = p5.instance) {
    let col = ['red', 'yellow', 'limegreen', 'blue'];
    let a = Math.PI * Math.random();
    let pi2 = Math.PI / 4;
    return (function (elapsedTime, world) {
        let size = 2 * this.colRad;
        a += elapsedTime;
        p.push();
        p.translate(this.pos.x, this.pos.y); p.rotate(a);
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

function paintWall(col, weight, p = p5.instance) {
    return (function (elapsedTime, world) {
        p.push();
        p.stroke(col); p.strokeWeight(weight);
        p.line(this.start.x, this.start.y, this.end.x, this.end.y);
        p.stroke(60); p.strokeWeight(1);
        if (this.repelSide == OUTSIDE || this.repelSide == BOTH_SIDES) {
            p.push();
            p.translate(this.norm.x * 2, this.norm.y * 2);
            p.line(this.start.x, this.start.y, this.end.x, this.end.y);
            p.pop();
        }
        if (this.repelSide == INSIDE || this.repelSide == BOTH_SIDES) {
            p.push();
            p.translate(this.norm.x * -2, this.norm.y * -2);
            p.line(this.start.x, this.start.y, this.end.x, this.end.y);
            p.pop();
        }
        p.pop();
    });
}

function paitSimpleWall(col, weight, p = p5.instance) {
    return (function (elapsedTime, world) {
        p.push();
        p.stroke(col); p.strokeWeight(weight);
        p.line(this.start.x, this.start.y, this.end.x, this.end.y);
        p.pop();
    });
}


function paintFencedArea(colF, p = p5.instance) {
    return (function (elapsedTime, world) {
        p.push();
        p.stroke(colF);
        p.fill(colF);
        p.strokeJoin(ROUND);
        p.strokeWeight(1.1); // Fix for antialiasing
        let t = this.triangles;
        beginShape(TRIANGLES);
        t.forEach(pv => vertex(pv.x, pv.y));
        endShape();
        p.pop();
    });
}

function paintArrow(colF, colS, hints = [], p = p5.instance) {
    let body = [-0.7, -0.45, -0.7, 0.45, 0.85, 0];
    return (function (elapsedTime, world) {
        p.push();
        let size = this.colRad;
        p.translate(this.pos.x, this.pos.y);
        for (let hint of hints) hint.call(this, p);
        p.rotate(this.headingAngle)
        p.fill(colF); p.stroke(colS); p.strokeWeight(1.1);
        p.beginShape();
        for (let idx = 0; idx < body.length; idx += 2)
            p.vertex(body[idx] * size, body[idx + 1] * size);
        p.endShape(CLOSE);
        p.pop();
    });
}

function paintPerson(colF, colS, hints = [], p = p5.instance) {
    let body = [0.15, -0.5, 0.15, 0.5, -0.18, 0.3, -0.18, -0.3];
    return (function (elapsedTime, world) {
        let size = 2 * this.colRad;
        p.push();
        p.translate(this.pos.x, this.pos.y);
        for (let hint of hints) hint.call(this, p);
        p.rotate(this.headingAngle);
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

function showInterpose(p = p5.instance) {
    let pt = this.pilot;
    if (pt && pt.isInterposeOn) {
        let p0 = pt.agent0.pos.sub(this.pos);
        let p1 = pt.agent1.pos.sub(this.pos);
        let mid = p0.add(p1).div(2);
        p.push();
        p.stroke(0, 64); p.strokeWeight(1);
        p.line(p0.x, p0.y, p1.x, p1.y);
        p.fill(0, 32); p.noStroke();
        p.ellipse(mid.x, mid.y, 10, 10);
        p.pop();
    }
}

function showFeelers(p = p5.instance) {
    let pt = this.pilot;
    if (pt && pt.isWallAvoidOn) {
        let feelers = pt.getFeelers();
        let pos = this.pos;
        p.push();
        p.stroke(0, 128); p.strokeWeight(1);
        feelers.forEach((f) => p.line(0, 0, f.x - pos.x, f.y - pos.y));
        p.pop();
    }
}

function showCanSee(p = p5.instance) {
    let vd = 2 * this.viewDistance;
    let fov = this.viewFOV;
    p.push();
    p.rotate(this.headingAngle);
    p.fill(200, 180, 32, 64); p.strokeWeight(1); p.stroke(180, 140, 32);
    p.arc(0, 0, vd, vd, -fov / 2, fov / 2, p.PIE);
    p.pop();
}

function showObstacleDetectBox(p = p5.instance) {
    let pt = this.pilot;
    if (pt && pt.isObsAvoidOn) {
        let w = this.colRad;
        let len = 2 * this.speed;
        p.push();
        p.rotate(this.velAngle);
        p.noFill(); p.strokeWeight(1.2); p.stroke(180, 160, 10);
        p.rect(0, -this.colRad, pt.boxLength, 2 * this.colRad);
        p.pop();
    }
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
    let pt = this.pilot;
    if (pt && pt.isWanderOn) {
        let wd = pt.wanderDist, wr2 = 2 * pt.wanderRadius;
        let wa = pt.wanderAngle;
        p.push();
        p.rotate(this.headingAngle);
        p.translate(wd, 0);
        p.strokeWeight(2); p.stroke(0, 32); p.fill(0, 10);
        p.ellipse(0, 0, wr2, wr2);
        p.rotate(wa);
        p.stroke(255, 0, 0, 48); p.fill(255, 0, 0, 24);
        p.arc(0, 0, wr2, wr2, -this.pilot.wanderAngleDelta, this.pilot.wanderAngleDelta, p.PIE);
        p.pop();
    }
}

function showWanderForce(p = p5.instance) {
    let pt = this.pilot;
    if (pt && pt.isWanderOn) {
        let wt = pt.wanderTarget;
        let wta = Math.atan2(wt.y, wt.x);
        p.push();
        p.rotate(this.headingAngle);
        p.noFill(); p.strokeWeight(2); p.stroke(200, 0, 0);
        p.line(0, 0, wt.x, wt.y);
        p.translate(wt.x, wt.y); p.rotate(wta);
        p.noStroke(); p.fill(200, 0, 0); p.noStroke();
        p.triangle(-14, -5, -14, 5, 0, 0);
        p.pop();
    }
}

function showFleeCircle(p = p5.instance) {
    let pt = this.pilot;
    if (pt && pt.isFleeOn) {
        let fe2 = 2 * pt.fleeRadius;
        p.push();
        p.fill(0, 16); p.noStroke();
        p.ellipse(0, 0, fe2, fe2);
        p.pop();
    }
}

