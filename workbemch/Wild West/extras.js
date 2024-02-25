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
        stroke('firebrick');
        strokeWeight(5);
        fill(0, 0, 136, 64);
        rect(-2, -2, 154, 154);
        image(this._stateImg.get(this._currX, 0, 150, 150), 0, 0);
        image(this._icon, this._dx, this._dy);
        pop();
    }

}

class ProgressBar {

    constructor(px, py, w, h, text) {
        this._x = px;
        this._y = py;
        this._w = w;
        this._h = h;
        this._textsize = 0.6 * this._h;
        this._text = text;
        this._value = 0;
    }

    setValue(value) {
        this._value = constrain(value, 0, 1);
    }

    render() {
        push();
        translate(this._x, this._y);
        fill('lightgoldenrodyellow'); noStroke();
        rect(0, 0, this._w, this._h);
        fill('lightpink');
        rect(0, 0, this._w * this._value, this._h);
        textAlign(CENTER, CENTER);
        textSize(this._textsize);
        textStyle(BOLD);
        fill('black');
        text(this._text, 0, 0, this._w, this._h);
        stroke('firebrick'); strokeWeight(2); noFill();
        rect(0, 0, this._w, this._h);
        pop();
    }

}