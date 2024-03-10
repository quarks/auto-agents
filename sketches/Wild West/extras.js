function getTime() {
    let ms = floor(millis() / 1000);
    let s = (ms % 60).toString().padStart(2, '0');
    let m = (floor(ms / 60)).toString().padStart(5, ' ');
    return `${m}:${s}`;
}

class Logger {
    constructor(px, py, maxItems) {
        this._x = px;
        this._y = py;
        this._items = [];
        this._maxi = maxItems;
        this._rh = 18;
        this._cw = [70, 60, 390];
        this._tw = this._cw.reduce((x, y) => x + y, 0);
        this._th = (this._maxi + 1) * this._rh;
        this._panY = 0;
        this._clock = setInterval(() => { this.pan(); }, 33);
    }

    pan() {
        if (this._panY < 0) {
            this._panY += 2.5;
            if (this._panY >= 0) {
                this._panY = 0;
                if (this._items.length > this._maxi) this._items.shift();
            }
        }
    }

    add(item) {
        switch (item.type) {
            case PT:
            case RT:
                item.msg = `#${item.msgID} to ${item.toAgent.name} : ${item.msg}`;
                item['backCol'] = item.agent == bob ? 'darkblue' : 'brown';
                item['textCol'] = item.agent == bob ? 'lightcyan' : 'bisque';
                item['indicator'] = 'gold';
                break;
            case SC:
                item['backCol'] = item.agent == bob ? 'lightcyan' : 'bisque';
                item['textCol'] = item.agent == bob ? 'darkblue' : 'brown';
                item['indicator'] = 'crimson';
            default:
        }
        item.time = getTime(item.time);
        this._items.push(item);
        this._panY -= this._rh;
    }

    render() {
        let rh = this._rh, tw = this._tw, th = this._th;
        let cw0 = this._cw[0], cw1 = this._cw[1];
        let insetW = 12, insetH = 10;
        textAlign(LEFT, CENTER); textSize(14);
        push();
        translate(this._x, this._y);
        // ##########################################################################
        // ###############    Start of drawing inside clip    #######################
        // ##########################################################################
        push();
        beginClip(); rect(0, 0, tw, th); endClip();
        // Table background
        noStroke(); fill(0, 48); rect(0, 0, tw, th);
        // Table items (reverse chronological order)
        let py = this._panY;
        for (let i = this._items.length - 1; i >= 0; i--) {
            py += rh; drawItem(this._items[i], py);
        }
        // Table header
        fill('peru'); rect(0, 0, tw, rh); fill('oldlace');
        textAlign(RIGHT, TOP);
        text('Time', cw0 - insetW, 3);
        textAlign(LEFT, TOP);
        text('Agent', cw0 + insetW, 3);
        text('Activity Report', cw0 + cw1 + insetW, 3);
        // Draw cell borders
        stroke(0, 32); strokeWeight(1); noFill();
        line(cw0, 0, cw0, th); line(cw0 + cw1, 0, cw0 + cw1, th);
        for (let i = 2; i <= this._maxi + 2; i++) line(0, i * rh + this._panY, tw, i * rh + this._panY);
        pop();
        // ##########################################################################
        // ###############     End of drawing inside clip     #######################
        // ##########################################################################
        push();
        // Draw table border
        stroke('firebrick'); strokeWeight(4); noFill();
        rect(-2, -2, tw + 4, th + 4);
        // Highlight most recent activity
        let s = 4.5;
        fill('firebrick');
        fill(this._items[this._items.length - 1].indicator)
        noStroke();
        translate(0, 1.5 * rh);
        triangle(0.5, -s, 0.5, s, 2.3 * s, 0);
        triangle(tw - 0.5, -s, tw - 0.5, s, tw - 2.3 * s, 0);
        triangle(cw0 - 0.25, -s, cw0 - 0.25, s, cw0 - 1.5 * s, 0);
        triangle(cw0 + 0.25, -s, cw0 + 0.25, s, cw0 + 1.5 * s, 0);
        triangle(cw0 + cw1 - 0.25, -s, cw0 + cw1 - 0.25, s, cw0 + cw1 - 1.5 * s, 0);
        triangle(cw0 + cw1 + 0.25, -s, cw0 + cw1 + 0.25, s, cw0 + cw1 + 1.5 * s, 0);
        stroke('firebrick'); strokeWeight(2.5); noFill();
        line(0, rh / 2, tw, rh / 2);
        pop();
        pop();

        function drawItem(item, py) {
            fill(item.backCol); rect(0, py, tw, rh); fill(item.textCol);
            textAlign(RIGHT, CENTER);
            text(item.time, cw0 - insetW, insetH + py);
            textAlign(LEFT, CENTER);
            text(item.agent.name, cw0 + insetW, insetH + py);
            text(item.msg, cw0 + cw1 + insetW, insetH + py);
        }
    }

}

class StateIconViewer {

    constructor(px, py, stateImg, dx, dy, icon) {
        this._x = px;
        this._y = py;
        this._stateImg = stateImg;
        this._dx = dx;
        this._dy = dy;
        this._icon = icon;
        this._currX = 0;
        this._targetX = 0;
        this._clock = 0;
    }

    setStateIdx(idx) {
        this._targetX = idx * 150;
        if (this._currX !== this._targetX)
            this._clock = setInterval(() => { this.update() }, 15);
    }

    update() {
        if (this._currX === this._targetX)
            clearInterval(this._clock);
        else
            this._currX += (this._currX < this._targetX) ? 10 : -10;
    }

    render() {
        push();
        translate(this._x, this._y);
        stroke('firebrick'); strokeWeight(5); fill(0, 0, 136, 64);
        rect(-2, -2, 154, 154);
        image(this._stateImg.get(this._currX, 0, 150, 150), 0, 0);
        image(this._icon, this._dx, this._dy);
        pop();
    }

}

class ProgressBar {

    constructor(px, py, w, h, text) {
        this._x = px; this._y = py; this._w = w; this._h = h;
        this._textsize = 0.6 * this._h; this._text = text;
        this._value = 0;
    }

    setValue(value) {
        this._value = constrain(value, 0, 1);
    }

    render() {
        push();
        translate(this._x, this._y);
        noStroke(); fill('cornsilk'); rect(0, 0, this._w, this._h);
        fill('burlywood'); rect(0, 0, this._w * this._value, this._h);
        textAlign(CENTER, CENTER); textSize(this._textsize); textStyle(BOLD);
        fill('black'); text(this._text, 0, 0, this._w, this._h);
        stroke('firebrick'); strokeWeight(2); noFill();
        rect(0, 0, this._w, this._h);
        pop();
    }

}