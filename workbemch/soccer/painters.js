function paintPlayer(scheme, p = p5.instance) {
    let body = [0.15, -0.5, 0.15, 0.5, -0.18, 0.3, -0.18, -0.3];
    return (function (elapsedTime, world) {
        let size = 4 * this.colRad;
        p.push();
        p.translate(this.pos.x, this.pos.y);
        p.rotate(this.headingAngle);
        p.fill(scheme.body); p.stroke(scheme.stroke); p.strokeWeight(1.4);
        p.beginShape();
        for (let idx = 0; idx < body.length; idx += 2)
            p.vertex(body[idx] * size, body[idx + 1] * size);
        p.endShape(p.CLOSE);
        p.fill(scheme.head); p.noStroke();
        p.ellipse(0, 0, 0.6 * size, 0.5 * size)
        p.pop();
    });
}

function initTeamInfo() {
    let t = [];
    t.push({ name: 'Red Roses', stroke: color(255, 0, 0), body: color(255, 190, 190), head: color(128, 0, 0) });
    t.push({ name: 'Blue Bottles', stroke: color(0, 0, 255), body: color(200, 200, 255), head: color(0, 0, 128) });
    t.push({ name: 'Purple Hearts', stroke: color(255, 0, 255), body: color(255, 200, 255), head: color(128, 0, 128) });
    t.push({ name: 'Orange Pips', stroke: color(255, 128, 0), body: color(255, 192, 64), head: color(166, 82, 0) });
    t.push({ name: 'Cyan Ides', stroke: color(0, 128, 128), body: color(200, 255, 255), head: color(0, 96, 96) });
    t.push({ name: 'Grey Beards', stroke: color(128), body: color(190), head: color(96) });
    return t;
}

function getGoalImage(side) {
    let f = 0.7, inset = 2;
    let pg = createGraphics(GOAL_NET_DEPTH, GOAL_WIDTH);
    pg.clear();
    if (side == LHS) {
        pg.translate(GOAL_NET_DEPTH, GOAL_WIDTH);
        pg.rotate(PI);
    }
    // Nets
    pg.noStroke(); pg.fill(0, 30);
    pg.rect(0, inset, GOAL_NET_DEPTH, GOAL_WIDTH - 2 * inset);
    pg.rect(0, inset, GOAL_NET_DEPTH * f, GOAL_WIDTH - 2 * inset);
    // Net edge
    pg.stroke(0, 96); pg.strokeWeight(2);
    pg.line(0, inset, GOAL_NET_DEPTH, inset);
    pg.line(0, GOAL_WIDTH - inset, GOAL_NET_DEPTH, GOAL_WIDTH - inset);
    pg.line(GOAL_NET_DEPTH, GOAL_WIDTH - inset, GOAL_NET_DEPTH, inset);
    pg.stroke(0, 48); pg.strokeWeight(1);
    pg.line(GOAL_NET_DEPTH * f, GOAL_WIDTH - inset, GOAL_NET_DEPTH * f, inset);
    // Goal posts
    pg.fill(0); pg.noStroke();
    pg.rect(0, 0, 5, 5, 2, 2);
    pg.rect(0, GOAL_WIDTH - 5, 5, 5, 2, 2);
    return pg;
}

function drawScoreBoard(secs) {
    let ha = LEFT, va = CENTER, hi = 10, vi = 0, tsize = 20;
    let bkCol = color('bisque'), tCol = color('darkslategrey');
    let bdrCol = color('darkslategrey'), bdrWeight = 1, cnrRad = 4;
    push();
    drawit(0, 20, 180, 40, team[0].name);
    ha = RIGHT;
    drawit(420, 20, 180, 40, team[1].name);
    bkCol = color('aliceblue'); tsize = 18;
    ha = CENTER; hi = 0;
    drawit(180 - 35, 25, 30, 30, score[0]);
    drawit(425, 25, 30, 30, score[1]);

    tsize = 20;
    let pc = getMatchTime(secs);
    drawit(250, 20, 100, 30, pc.time);

    // drawarc(pc.factor);
    pop();

    function drawit(x, y, w, h, name) {
        noStroke(); fill(bkCol);
        if (bdrWeight > 0) {
            stroke(bdrCol);
            strokeWeight(bdrWeight);
        }
        rect(x, y, w, h, cnrRad);
        textAlign(ha, va); textSize(tsize);
        fill(tCol);
        text(name, x + hi, y + vi, w - 2 * hi, h - 2 * vi);
    }

    function getMatchTime(secs) {
        let m = floor(secs / 60); secs -= m * 60;
        let s = secs.toFixed(1);
        return {
            factor: secs / $('MatchTime'),
            time: m.toString().padStart(2, '0') + ':' + s.toString().padStart(4, '0')
        };
    }
}


function drawarc(f) {
    push();
    let cx = 300, cy = 50, xr = 50, yr = 30;
    noFill(); strokeWeight(10); stroke(220);
    ellipse(cx, cy, 2 * xr, 2 * yr);
    let s = 1.5 * PI, e = 3.5 * PI;
    let p = map(f, 1, 0, s, e);
    //console.log(s, p, e, f);
    strokeWeight(3); stroke(255, 100, 100);
    arc(cx, cy, 2 * xr, 2 * yr, s, p);
    pop();
}