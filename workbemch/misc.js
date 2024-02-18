// ###################################################################################
//  MISC
// ###################################################################################

function colorizeEntities(tree, painters) {
    function colourize(part) {
        part.entities.forEach(e => { e.painter = painters[part.level]; });
        part.children?.forEach(p => colourize(p));
    }
    colourize(tree.getRoot());
}

function renderTreeGrid() {
    function renderPart(level) {
        level = (2 ** (level - 1));
        let dx = r.treeSize / level, dy = r.treeSize / level;
        for (let i = r.lowX; i <= highX; i += dx) line(i, r.lowY, i, highY);
        for (let i = r.lowY; i <= highY; i += dy) line(r.lowX, i, highX, i);
    }
    let r = world.tree, d = world.domain;
    let highX = Math.min(r.highX, d.highX), highY = Math.min(r.highY, d.highY);
    stroke(0, 16); strokeWeight(1.1);
    for (let i = 1; i <= depth; i++) renderPart(i);
}

function createMazeWallImage(data, cellsize, cellCols) {
    function drawWallCell(t) {
        pg.push();
        pg.translate(px, py);
        switch (t) {
            case 0:
                pg.rect(- cs2, - cs2, cs, cs, cs / 5);
                break;
            case 1:
                pg.rect(- cs2, - cs2, cs, cs2);
                pg.arc(0, 0, cs, cs, 0, PI);
                break;
            case 2:
                pg.rect(0, - cs2, cs2, cs);
                pg.arc(0, 0, cs, cs, HALF_PI, HALF_PI + PI)
                break;
            case 3:
                pg.rect(- cs2, - cs2, cs, cs2);
                pg.rect(0, - cs2, cs2, cs);
                pg.arc(0, 0, cs, cs, HALF_PI, PI);
                break;
            case 4:
                pg.rect(- cs2, 0, cs, cs2);
                pg.arc(0, 0, cs, cs, PI, TWO_PI);
                break;
            case 6:
                pg.rect(0, - cs2, cs2, cs);
                pg.rect(- cs2, 0, cs, cs2);
                pg.arc(0, 0, cs, cs, PI, PI + HALF_PI);
                break;
            case 8:
                pg.rect(-cs2, - cs2, cs2, cs);
                pg.arc(0, 0, cs, cs, TWO_PI - HALF_PI, HALF_PI);
                break;
            case 9:
                pg.rect(- cs2, - cs2, cs, cs2);
                pg.rect(-cs2, - cs2, cs2, cs);
                pg.arc(0, 0, cs, cs, 0, HALF_PI);
                break;
            case 12:
                pg.rect(- cs2, 0, cs, cs2);
                pg.rect(-cs2, - cs2, cs2, cs);
                pg.arc(0, 0, cs, cs, PI + HALF_PI, TWO_PI);
                break;
            default:
                pg.rect(- cs2, - cs2, cs, cs);
                pg.rect(- cs2, 0, cs, cs2);
        }
        pg.pop();
    }
    let h = data.length, w = data[0].length, cs = cellsize, cs2 = cs / 2, px, py;
    let md = [];
    for (let i = 0; i < h + 2; i++)
        md.push(new Uint8Array(w + 2).fill(1));
    // Populate from data
    for (let i = 0; i < h; i++)
        for (let j = 0; j < w; j++)
            md[i + 1][j + 1] = data[i].charAt(j) === ' ' ? 0 : 1;
    let pg = createGraphics(w * cs, h * cs);
    pg.background(cellCols[0]);
    pg.fill(cellCols[1]);
    pg.noStroke();
    for (let i = 1; i < h + 1; i++) {
        py = (i - 1 + 0.5) * cs;
        for (let j = 1; j < w + 1; j++) {
            px = (j - 1 + 0.5) * cs;
            if ([md[i][j]] == 1) {
                let type = (md[i][j - 1] << 3);
                type += (md[i][j + 1] << 1);
                type += (md[i + 1][j] << 2);
                type += md[i - 1][j];
                drawWallCell(type);
            }
        }
    }
    return pg;
}