class Geom2D {
    /**
     * Calculates the squared distance between 2 points
     * @param x0 point 1
     * @param y0 point 1
     * @param x1 point 2
     * @param y1 point 2
     * @return the distance between the pos squared
     */
    static distance_sq(x0, y0, x1, y1) {
        return (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
    }
    /**
     * Calculates the distance between 2 points
     * @param x0 point 1
     * @param y0 point 1
     * @param x1 point 2
     * @param y1 point 2
     * @return the distance between the pos squared
     */
    static distance(x0, y0, x1, y1) {
        return Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
    }
    /**
     * This sets the distance used to decide whether a point is 'near, a line. This
     * is initially set at 1.0 <br>
     * @param nearness must be >0 otherwise it is unchanged
     */
    static po_to_line_dist(nearness) {
        if (nearness > 0)
            Geom2D.NEARNESS = nearness;
    }
    /**
     * See if point is near the finite line. <br>
     *
     * @param v0 line start
     * @param v1 line end
     * @param p point to consider
     * @param vp filled with xy position of the nearest point on finite line (if provided)
     * @return true if p is near the line
     */
    static is_po_near_line(v0, v1, p, vp) {
        let pnl = Geom2D.po_nearest_line(v0, v1, p);
        if (pnl) {
            let d = Math.sqrt((p.x - pnl.x) * (p.x - pnl.x) + (p.y - pnl.y) * (p.y - pnl.y));
            if (vp)
                vp.set(pnl);
            if (d <= Geom2D.NEARNESS)
                return true;
        }
        return false;
    }
    /**
     * See if point is near the infinite line. <br>
     *
     * @param v0 line passes through this po
     * @param v1 line passes through this po
     * @param p point to consider
     * @param vp filled with xy position of the nearest point on line (must not be undefined)
     * @return true if p is near the line
     */
    static is_po_near_infinite_line(v0, v1, p, vp) {
        let pnl = Geom2D.po_nearest_infinite_line(v0, v1, p);
        if (pnl) {
            let d = Math.sqrt((p.x - pnl.x) * (p.x - pnl.x) + (p.y - pnl.y) * (p.y - pnl.y));
            if (vp)
                vp.set(pnl);
            if (d <= Geom2D.NEARNESS)
                return true;
        }
        return false;
    }
    /**
     * Given a point find the nearest position on a finite line.
     *
     * @param v0 line start
     * @param v1 line end
     * @param p point to consider
     * @return returns undefined if the line is undefined or if the nearest point is not on the line
     */
    static po_nearest_line(v0, v1, p) {
        let vp = undefined;
        let the_line = v1.sub(v0); // Vector2D.sub(v1, v0);
        let lineMag = the_line.length();
        lineMag = lineMag * lineMag;
        if (lineMag > 0.0) {
            let pv0_line = p.sub(v0); //Vector2D.sub(p, v0);
            let t = pv0_line.dot(the_line) / lineMag;
            if (t >= 0 && t <= 1) {
                vp = new Vector2D();
                vp.x = the_line.x * t + v0.x;
                vp.y = the_line.y * t + v0.y;
            }
        }
        return vp;
    }
    /**
     * Given a point find the nearest position on an infinite line.
     * @param v0 line start
     * @param v1 line end
     * @param p point to consider
     * @return returns undefined if the line is undefined else the nearest position
     */
    static po_nearest_infinite_line(v0, v1, p) {
        let vp = undefined;
        let the_line = v1.sub(v0); // Vector2D.sub(v1, v0);
        let lineMag = the_line.length();
        lineMag = lineMag * lineMag;
        if (lineMag > 0.0) {
            vp = new Vector2D();
            let pv0_line = p.sub(v0); // Vector2D.sub(p, v0);
            let t = pv0_line.dot(the_line) / lineMag;
            vp.x = the_line.x * t + v0.x;
            vp.y = the_line.y * t + v0.y;
        }
        return vp;
    }
    /**
     * Sees if a line ersects with the circumference of a circle.
     *
     * @param x0
     * @param y0
     * @param x1
     * @param y1
     * @param cx centre of circle x position
     * @param cy centre of circle y position
     * @param r radius of circle
     * @return true if the line ersects the circle else false
     */
    static line_circle(x0, y0, x1, y1, cx, cy, r) {
        let f = (x1 - x0);
        let g = (y1 - y0);
        let fSQ = f * f;
        let gSQ = g * g;
        let fgSQ = fSQ + gSQ;
        let rSQ = r * r;
        let xc0 = cx - x0;
        let yc0 = cy - y0;
        let xc1 = cx - x1;
        let yc1 = cy - y1;
        let lineInside = xc0 * xc0 + yc0 * yc0 < rSQ && xc1 * xc1 + yc1 * yc1 < rSQ;
        let fygx = f * yc0 - g * xc0;
        let root = r * r * fgSQ - fygx * fygx;
        if (root > Geom2D.ACCY && !lineInside) {
            let fxgy = f * xc0 + g * yc0;
            let t = fxgy / fgSQ;
            if (t >= 0 && t <= 1)
                return true;
            // Circle intersects with one end then return true
            if ((xc0 * xc0 + yc0 * yc0 < rSQ) || (xc1 * xc1 + yc1 * yc1 < rSQ))
                return true;
        }
        return false;
    }
    /**
     * Calculate the pos of intersection between a line and a circle. <br>
     * An array is returned that contains the intersection pos in x, y order.
     * If the array is of length: <br>
     * 0 then there is no intersection <br>
     * 2 there is just one intersection (the line is a tangent to the circle) <br>
     * 4 there are two intersections <br>
     *
     * @param x0 start of line
     * @param y0 start of line
     * @param x1 end of line
     * @param y1 end of line
     * @param cx centre of circle x position
     * @param cy centre of circle y position
     * @param r radius of circle
     * @return the intersection pos as an array (2 elements per intersection)
     */
    static line_circle_p(x0, y0, x1, y1, cx, cy, r) {
        let result = [];
        let f = (x1 - x0);
        let g = (y1 - y0);
        let fSQ = f * f;
        let gSQ = g * g;
        let fgSQ = fSQ + gSQ;
        let xc0 = cx - x0;
        let yc0 = cy - y0;
        let fygx = f * yc0 - g * xc0;
        let root = r * r * fgSQ - fygx * fygx;
        if (root > -Geom2D.ACCY) {
            let fxgy = f * xc0 + g * yc0;
            if (root < Geom2D.ACCY) { // tangent so just one po
                let t = fxgy / fgSQ;
                if (t >= 0 && t <= 1) {
                    result.push(x0 + f * t);
                    result.push(y0 + g * t);
                }
            }
            else { // possibly two intersections
                root = Math.sqrt(root);
                let t = (fxgy - root) / fgSQ;
                if (t >= 0 && t <= 1) {
                    result = [x0 + f * t, y0 + g * t];
                }
                t = (fxgy + root) / fgSQ;
                if (t >= 0 && t <= 1) {
                    result.push(x0 + f * t);
                    result.push(y0 + g * t);
                }
            }
        }
        return result;
    }
    /**
     * See if two lines intersect <br>
     * @param x0 start of line 1
     * @param y0 start of line 1
     * @param x1 end of line 1
     * @param y1 end of line 1
     * @param x2 start of line 2
     * @param y2 start of line 2
     * @param x3 end of line 2
     * @param y3 end of line 2
     * @return true if the lines ersect
     */
    static line_line(x0, y0, x1, y1, x2, y2, x3, y3) {
        let f1 = (x1 - x0);
        let g1 = (y1 - y0);
        let f2 = (x3 - x2);
        let g2 = (y3 - y2);
        let f1g2 = f1 * g2;
        let f2g1 = f2 * g1;
        let det = f2g1 - f1g2;
        if (Math.abs(det) > Geom2D.ACCY) {
            let s = (f2 * (y2 - y0) - g2 * (x2 - x0)) / det;
            let t = (f1 * (y2 - y0) - g1 * (x2 - x0)) / det;
            return (s >= 0 && s <= 1 && t >= 0 && t <= 1);
        }
        return false;
    }
    /**
     * Find the point of intersection between two lines. <br>
     * This method uses Vector2D objects to represent the line end pos.
     * @param v0 start of line 1
     * @param v1 end of line 1
     * @param v2 start of line 2
     * @param v3 end of line 2
     * @return a Vector2D object holding the intersection coordinates else undefined if no intersection
     */
    static line_line_pv(v0, v1, v2, v3) {
        let intercept = undefined;
        let f1 = (v1.x - v0.x);
        let g1 = (v1.y - v0.y);
        let f2 = (v3.x - v2.x);
        let g2 = (v3.y - v2.y);
        let f1g2 = f1 * g2;
        let f2g1 = f2 * g1;
        let det = f2g1 - f1g2;
        if (Math.abs(det) > Geom2D.ACCY) {
            let s = (f2 * (v2.y - v0.y) - g2 * (v2.x - v0.x)) / det;
            let t = (f1 * (v2.y - v0.y) - g1 * (v2.x - v0.x)) / det;
            if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
                intercept = new Vector2D(v0.x + f1 * s, v0.y + g1 * s);
        }
        return intercept;
    }
    /**
     * Find the point of intersection between two lines. <br>
     * An array is returned that contains the intersection pos in x, y order.
     * If the array is of length: <br>
     * 0 then there is no intersection <br>
     * 2 these are the x/y coordinates of the intersection po. <br>
     * @param x0 start of line 1
     * @param y0 start of line 1
     * @param x1 end of line 1
     * @param y1 end of line 1
     * @param x2 start of line 2
     * @param y2 start of line 2
     * @param x3 end of line 2
     * @param y3 end of line 2
     * @return an array of coordinates for the intersection if any
     */
    static line_line_p(x0, y0, x1, y1, x2, y2, x3, y3) {
        let result = [];
        let f1 = (x1 - x0);
        let g1 = (y1 - y0);
        let f2 = (x3 - x2);
        let g2 = (y3 - y2);
        let f1g2 = f1 * g2;
        let f2g1 = f2 * g1;
        let det = f2g1 - f1g2;
        if (Math.abs(det) > Geom2D.ACCY) {
            let s = (f2 * (y2 - y0) - g2 * (x2 - x0)) / det;
            let t = (f1 * (y2 - y0) - g1 * (x2 - x0)) / det;
            if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
                result = [x0 + f1 * s, y0 + g1 * s];
        }
        return result;
    }
    /**
     * Find the intersection point between two infinite lines that
     * pass through the pos (v0,v1) and (v2,v3)
     * @return a Vector2D object of the intercept or undefoned if parallel
     */
    static line_line_infinite_pv(v0, v1, v2, v3) {
        let intercept = undefined;
        let f1 = (v1.x - v0.x);
        let g1 = (v1.y - v0.y);
        let f2 = (v3.x - v2.x);
        let g2 = (v3.y - v2.y);
        let f1g2 = f1 * g2;
        let f2g1 = f2 * g1;
        let det = f2g1 - f1g2;
        if (Math.abs(det) > Geom2D.ACCY) {
            let s = (f2 * (v2.y - v0.y) - g2 * (v2.x - v0.x)) / det;
            intercept = new Vector2D(v0.x + f1 * s, v0.y + g1 * s);
        }
        return intercept;
    }
    /**
     * Find the point of intersection between two infinite lines that pass through the pos
     * ([x0,y0],[x1,y1]) and ([x2,y2],[x3,y3]). <br>
     * An array is returned that contains the intersection pos in x, y order.
     * If the array is of length: <br>
     * 0 then there is no intersection <br>
     * 2 these are the x/y coordinates of the intersection po. <br>
     * @return an array of coordinates for the intersection if any
     */
    static line_line_infinite_p(x0, y0, x1, y1, x2, y2, x3, y3) {
        let result = [];
        let f1 = (x1 - x0);
        let g1 = (y1 - y0);
        let f2 = (x3 - x2);
        let g2 = (y3 - y2);
        let f1g2 = f1 * g2;
        let f2g1 = f2 * g1;
        let det = f2g1 - f1g2;
        if (Math.abs(det) > Geom2D.ACCY) {
            let s = (f2 * (y2 - y0) - g2 * (x2 - x0)) / det;
            result = [x0 + f1 * s, y0 + g1 * s];
        }
        return result;
    }
    /**
     * Calculate the intersection pos between a line and a collection of lines. <br>
     * This will calculate all the intersection pos between a given line
     * and the lines formed from the pos in the array xy. <br>
     * If the parameter continuous = true the pos form a continuous line so the <br>
     * <pre>
     * line 1 is from xy[0],xy[1] to xy[2],xy[3] and
     * line 2 is from xy[2],xy[3] to xy[4],xy[5] and so on
     * </pre>
     * and if continuous is false then each set of four array elements form their
     * own line <br>
     * <pre>
     * line 1 is from xy[0],xy[1] to xy[2],xy[3] and
     * line 2 is from xy[4],xy[5] to xy[6],xy[7] and so on
     * </pre>
     *
     * @param x0 x position of the line start
     * @param y0 y position of the line start
     * @param x1 x position of the line end
     * @param y1 y position of the line end
     * @param xy array of x/y coordinates
     * @param continuous if true the pos makes a continuous line
     * @return an array with all the intersection coordinates
     */
    static line_lines_p(x0, y0, x1, y1, xy, continuous) {
        let result = [];
        let stride = continuous ? 2 : 4;
        let f1, g1, f2, g2, f1g2, f2g1, det;
        f1 = (x1 - x0);
        g1 = (y1 - y0);
        for (let i = 0; i < xy.length - 3; i += stride) {
            f2 = (xy[i + 2] - xy[i]);
            g2 = (xy[i + 3] - xy[i + 1]);
            f1g2 = f1 * g2;
            f2g1 = f2 * g1;
            det = f2g1 - f1g2;
            if (Math.abs(det) > Geom2D.ACCY) {
                let s = (f2 * (xy[i + 1] - y0) - g2 * (xy[i] - x0)) / det;
                let t = (f1 * (xy[i + 1] - y0) - g1 * (xy[i] - x0)) / det;
                if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
                    result.push(x0 + f1 * s);
                    result.push(y0 + g1 * s);
                }
            }
        }
        return result;
    }
    /**
     * Determine if the circumferences of two circles intersect
     * @param cx0 centre of first circle x position
     * @param cy0 centre of first circle y position
     * @param r0 radius of first circle
     * @param cx1 centre of second circle x position
     * @param cy1 centre of second circle y position
     * @param r1 radius of second circle
     * @return true if the circumferences intersect
     */
    static circle_circle(cx0, cy0, r0, cx1, cy1, r1) {
        let dxSQ = (cx1 - cx0) * (cx1 - cx0);
        let dySQ = (cy1 - cy0) * (cy1 - cy0);
        let rSQ = (r0 + r1) * (r0 + r1);
        let drSQ = (r0 - r1) * (r0 - r1);
        return (dxSQ + dySQ <= rSQ && dxSQ + dySQ >= drSQ);
    }
    /**
     * Calculate the intersection pos between two circles. <br>
     * If the array is of length: <br>
     * 0 then there is no intersection <br>
     * 2 there is just one intersection (the circles are touching) <br>
     * 4 there are two intersections <br>
     *
     * @param cx0 centre of first circle x position
     * @param cy0 centre of first circle y position
     * @param r0 radius of first circle
     * @param cx1 centre of second circle x position
     * @param cy1 centre of second circle y position
     * @param r1 radius of second circle
     * @return an array with the intersection pos
     */
    static circle_circle_p(cx0, cy0, r0, cx1, cy1, r1) {
        let result = [];
        let dx = cx1 - cx0;
        let dy = cy1 - cy0;
        let distSQ = dx * dx + dy * dy;
        if (distSQ > Geom2D.ACCY) {
            let r0SQ = r0 * r0;
            let r1SQ = r1 * r1;
            let diffRSQ = (r1SQ - r0SQ);
            let root = 2 * (r1SQ + r0SQ) * distSQ - distSQ * distSQ - diffRSQ * diffRSQ;
            if (root > -Geom2D.ACCY) {
                let distINV = 0.5 / distSQ;
                let scl = 0.5 - diffRSQ * distINV;
                let x = dx * scl + cx0;
                let y = dy * scl + cy0;
                if (root < Geom2D.ACCY) {
                    result = [x, y];
                }
                else {
                    root = distINV * Math.sqrt(root);
                    let xfac = dx * root;
                    let yfac = dy * root;
                    result = [x - yfac, y + xfac, x + yfac, y - xfac];
                }
            }
        }
        return result;
    }
    /**
     * Calculate the tangents from a po. <br>
     * If the array is of length: <br>
     * 0 then there is no tangent the point is inside the circle <br>
     * 2 there is just one intersection (the point is on the circumference) <br>
     * 4  there are two pos.
     *
     * @param x x position for point of interest
     * @param y y position for point of interest
     * @param cx centre of circle x position
     * @param cy centre of circle y position
     * @param r radius of circle
     * @return an array of the tangent point coordinates
     */
    static tangents_to_circle(x, y, cx, cy, r) {
        let result = [];
        let dx = cx - x;
        let dy = cy - y;
        let dxSQ = dx * dx;
        let dySQ = dy * dy;
        let denom = dxSQ + dySQ;
        let root = denom - r * r;
        if (root > -Geom2D.ACCY) {
            let denomINV = 1.0 / denom;
            let A, B;
            if (root < Geom2D.ACCY) { // point is on circle
                A = -r * dx * denomINV;
                B = -r * dy * denomINV;
                result = [cx + A * r, cy + B * r];
            }
            else {
                root = Math.sqrt(root);
                A = (-dy * root - r * dx) * denomINV;
                B = (dx * root - r * dy) * denomINV;
                result.push(cx + A * r);
                result.push(cy + B * r);
                A = (dy * root - r * dx) * denomINV;
                B = (-dx * root - r * dy) * denomINV;
                result.push(cx + A * r);
                result.push(cy + B * r);
            }
        }
        return result;
    }
    /**
     * Will calculate the contact pos for both outer and inner tangents. <br>
     * There are no tangents if one circle is completely inside the other.
     * If the circles eract only the outer tangents exist. When the circles
     * do not ersect there will be 4 tangents (outer and inner), the array
     * has the outer pair first.
     *
     * @param cx0 x position for the first circle
     * @param cy0 y position for the first circle
     * @param r0 radius of the first circle
     * @param cx1 x position for the second circle
     * @param cy1 y position for the second circle
     * @param r1 radius of the second circle
     * @return an array of tangent contact pos
     */
    static tangents_between_circles(cx0, cy0, r0, cx1, cy1, r1) {
        let result = [];
        let dxySQ = (cx0 - cx1) * (cx0 - cx1) + (cy0 - cy1) * (cy0 - cy1);
        if (dxySQ <= (r0 - r1) * (r0 - r1))
            return result;
        let d = Math.sqrt(dxySQ);
        let vx = (cx1 - cx0) / d;
        let vy = (cy1 - cy0) / d;
        for (let sign1 = +1; sign1 >= -1; sign1 -= 2) {
            let c = (r0 - sign1 * r1) / d;
            if (c * c > 1)
                continue;
            let h = Math.sqrt(Math.max(0.0, 1.0 - c * c));
            for (let sign2 = +1; sign2 >= -1; sign2 -= 2) {
                let nx = vx * c - sign2 * h * vy;
                let ny = vy * c + sign2 * h * vx;
                result.push(cx0 + r0 * nx);
                result.push(cy0 + r0 * ny);
                result.push(cx1 + sign1 * r1 * nx);
                result.push(cy1 + sign1 * r1 * ny);
            }
        }
        return result;
    }
    /**
     * Outside is in the same direction of the plane normal. <br>
     * The first four parameters represent the start and end position
     * for a line segment (finite plane).
     *
     * @param x0 x start of the line
     * @param y0 y start of the line
     * @param x1 x end of the line
     * @param y1 y end of the line
     * @param px x position of the point to test
     * @param py y position of the point to test
     * @return returns either PLANE_INSIDE, PLANE_OUTSIDE or ON_PLANE
     */
    static which_side_pp(x0, y0, x1, y1, px, py) {
        let side;
        let dot = (y0 - y1) * (px - x0) + (x1 - x0) * (py - y0);
        if (dot < -Geom2D.ACCY)
            side = Geom2D.PLANE_INSIDE;
        else if (dot > Geom2D.ACCY)
            side = Geom2D.PLANE_OUTSIDE;
        else
            side = Geom2D.ON_PLANE;
        return side;
    }
    /**
     * Outside is in the same direction of the plane normal. <br>
     * This version requires a single point on the plane and the normal
     * direction. Useful for an infinite plane or for testing many
     * pos against a single plane when the plane normal does not have
     * to be calculated each time.
     *
     * @param x0 x position of a point on the plane
     * @param y0 y position of a point on the plane
     * @param nx x value of normal vector
     * @param ny y value of normal vector
     * @param px x position of the point to test
     * @param py y position of the point to test
     * @return returns either PLANE_INSIDE, PLANE_OUTSIDE or ON_PLANE
     */
    static which_side_pn(x0, y0, nx, ny, px, py) {
        let side;
        let dot = nx * (px - x0) + ny * (py - y0);
        if (dot < -Geom2D.ACCY)
            side = Geom2D.PLANE_INSIDE;
        else if (dot > Geom2D.ACCY)
            side = Geom2D.PLANE_OUTSIDE;
        else
            side = Geom2D.ON_PLANE;
        return side;
    }
    /**
     * Code copied from {@link java.awt.geom.Rectangle2D#ersectsLine(, , , )}
     */
    static _outcode(pX, pY, rectX, rectY, rectWidth, rectHeight) {
        let out = 0;
        if (rectWidth <= 0) {
            out |= Geom2D.OUT_LEFT | Geom2D.OUT_RIGHT;
        }
        else if (pX < rectX) {
            out |= Geom2D.OUT_LEFT;
        }
        else if (pX > rectX + rectWidth) {
            out |= Geom2D.OUT_RIGHT;
        }
        if (rectHeight <= 0) {
            out |= Geom2D.OUT_TOP | Geom2D.OUT_BOTTOM;
        }
        else if (pY < rectY) {
            out |= Geom2D.OUT_TOP;
        }
        else if (pY > rectY + rectHeight) {
            out |= Geom2D.OUT_BOTTOM;
        }
        return out;
    }
    /**
     * Determine whether a line intersects with any part of a box. <br>
     * The box is represented by the top-left and bottom-right corner coordinates.
     * @param lx0 start of line
     * @param ly0 start of line
     * @param lx1 end of line
     * @param ly1 end of line
     * @param rx0 top-left corner of rectangle
     * @param ry0 top-left corner of rectangle
     * @param rx1 bottom-right corner of rectangle
     * @param ry1  bottom-right corner of rectangle
     * @return true if they intersect else false
     */
    static line_box_xyxy(lx0, ly0, lx1, ly1, rx0, ry0, rx1, ry1) {
        let out1, out2;
        let rectWidth = rx1 - rx0;
        let rectHeight = ry1 - ry0;
        if ((out2 = Geom2D._outcode(lx1, ly1, rx0, ry0, rectWidth, rectHeight)) == 0) {
            return true;
        }
        while ((out1 = Geom2D._outcode(lx0, ly0, rx0, ry0, rectWidth, rectHeight)) != 0) {
            if ((out1 & out2) != 0) {
                return false;
            }
            if ((out1 & (Geom2D.OUT_LEFT | Geom2D.OUT_RIGHT)) != 0) {
                let x = rx0;
                if ((out1 & Geom2D.OUT_RIGHT) != 0) {
                    x += rectWidth;
                }
                ly0 = ly0 + (x - lx0) * (ly1 - ly0) / (lx1 - lx0);
                lx0 = x;
            }
            else {
                let y = ry0;
                if ((out1 & Geom2D.OUT_BOTTOM) != 0) {
                    y += rectHeight;
                }
                lx0 = lx0 + (y - ly0) * (lx1 - lx0) / (ly1 - ly0);
                ly0 = y;
            }
        }
        return true;
    }
    /**
     * Determine whether a line intersects with any part of a box. <br>
     * The box is represented by the top-left corner coordinates and the box width and height.
     * @param lx0 start of line
     * @param ly0 start of line
     * @param lx1 end of line
     * @param ly1 end of line
     * @param rx0 top-left corner of rectangle
     * @param ry0 top-left corner of rectangle
     * @param rWidth width of rectangle
     * @param rHeight height of rectangle
     * @return true if they intersect else false
     */
    static line_box_xywh(lx0, ly0, lx1, ly1, rx0, ry0, rWidth, rHeight) {
        let out1, out2;
        if ((out2 = Geom2D._outcode(lx1, ly1, rx0, ry0, rWidth, rHeight)) == 0) {
            return true;
        }
        while ((out1 = Geom2D._outcode(lx0, ly0, rx0, ry0, rWidth, rHeight)) != 0) {
            if ((out1 & out2) != 0) {
                return false;
            }
            if ((out1 & (Geom2D.OUT_LEFT | Geom2D.OUT_RIGHT)) != 0) {
                let x = rx0;
                if ((out1 & Geom2D.OUT_RIGHT) != 0) {
                    x += rWidth;
                }
                ly0 = ly0 + (x - lx0) * (ly1 - ly0) / (lx1 - lx0);
                lx0 = x;
            }
            else {
                let y = ry0;
                if ((out1 & Geom2D.OUT_BOTTOM) != 0) {
                    y += rHeight;
                }
                lx0 = lx0 + (y - ly0) * (lx1 - lx0) / (ly1 - ly0);
                ly0 = y;
            }
        }
        return true;
    }
    /**
     * Determine whether two boxes ersect. <br>
     * The boxes are represented by the top-left and bottom-right corner coordinates.
     *
     * @param ax0 top-left corner of rectangle A
     * @param ay0 top-left corner of rectangle A
     * @param ax1 bottom-right corner of rectangle A
     * @param ay1 bottom-right corner of rectangle A
     * @param bx0 top-left corner of rectangle B
     * @param by0 top-left corner of rectangle B
     * @param bx1 bottom-right corner of rectangle B
     * @param by1 bottom-right corner of rectangle B
     * @return true if the boxes intersect
     */
    static box_box(ax0, ay0, ax1, ay1, bx0, by0, bx1, by1) {
        let topA = Math.min(ay0, ay1);
        let botA = Math.max(ay0, ay1);
        let leftA = Math.min(ax0, ax1);
        let rightA = Math.max(ax0, ax1);
        let topB = Math.min(by0, by1);
        let botB = Math.max(by0, by1);
        let leftB = Math.min(bx0, bx1);
        let rightB = Math.max(bx0, bx1);
        if (botA <= topB || botB <= topA || rightA <= leftB || rightB <= leftA)
            return false;
        return true;
    }
    /**
     * If two boxes overlap then the overlap region is another box. This method is used to
     * calculate the coordinates of the overlap. <br>
     * The boxes are represented by the top-left and bottom-right corner coordinates.
     * If the returned array has a length:
     * 0 then they do not overlap <br>
     * 4 then these are the coordinates of the top-left and bottom-right corners of the overlap region.
     *
     * @param ax0 top-left corner of rectangle A
     * @param ay0 top-left corner of rectangle A
     * @param ax1 bottom-right corner of rectangle A
     * @param ay1 bottom-right corner of rectangle A
     * @param bx0 top-left corner of rectangle B
     * @param by0 top-left corner of rectangle B
     * @param bx1 bottom-right corner of rectangle B
     * @param by1 bottom-right corner of rectangle B
     * @return an array with the overlap box coordinates (if any)
     */
    static box_box_p(ax0, ay0, ax1, ay1, bx0, by0, bx1, by1) {
        let result = [];
        let topA = Math.min(ay0, ay1);
        let botA = Math.max(ay0, ay1);
        let leftA = Math.min(ax0, ax1);
        let rightA = Math.max(ax0, ax1);
        let topB = Math.min(by0, by1);
        let botB = Math.max(by0, by1);
        let leftB = Math.min(bx0, bx1);
        let rightB = Math.max(bx0, bx1);
        if (botA <= topB || botB <= topA || rightA <= leftB || rightB <= leftA)
            return result;
        let leftO = (leftA < leftB) ? leftB : leftA;
        let rightO = (rightA > rightB) ? rightB : rightA;
        let botO = (botA > botB) ? botB : botA;
        let topO = (topA < topB) ? topB : topA;
        result = [leftO, topO, rightO, botO];
        return result;
    }
    /**
     * Determine if the point pX/pY is inside triangle defined by triangle ABC whose
     * vertices are given by [ax,ay] [bx,by] [cx,cy]. The triangle vertices should
     * provided in counter-clockwise order.
     * @return true if the point is inside
     */
    static is_in_triangle(aX, aY, bX, bY, cX, cY, pX, pY) {
        let ax = cX - bX;
        let ay = cY - bY;
        let bx = aX - cX;
        let by = aY - cY;
        let cx = bX - aX;
        let cy = bY - aY;
        let apx = pX - aX;
        let apy = pY - aY;
        let bpx = pX - bX;
        let bpy = pY - bY;
        let cpx = pX - cX;
        let cpy = pY - cY;
        let aCROSSbp = ax * bpy - ay * bpx;
        let cCROSSap = cx * apy - cy * apx;
        let bCROSScp = bx * cpy - by * cpx;
        return ((aCROSSbp < 0) && (bCROSScp < 0) && (cCROSSap < 0));
    }
    /**
     * Determine if the point (p) is inside triangle defined by triangle ABC. The
     * triangle vertices should provided in counter-clockwise order.
     *
     * @param a triangle vertex 1
     * @param b triangle vertex 2
     * @param c triangle vertex 3
     * @param p point of interest
     * @return true if inside triangle else false
     */
    static is_in_triangle_v(a, b, c, p) {
        return Geom2D.is_in_triangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y);
    }
    /**
     * Determine if the point pX/pY is inside triangle defined by triangle ABC. The
     * triangle vertices should provided in counter-clockwise order.
     *
     * @param a triangle vertex 1
     * @param b triangle vertex 2
     * @param c triangle vertex 3
     * @param pX x position for point of interest
     * @param pY y position for point of interest
     * @return true if inside triangle else false
     */
    static is_in_triangle_vp(a, b, c, pX, pY) {
        return Geom2D.is_in_triangle(a.x, a.y, b.x, b.y, c.x, c.y, pX, pY);
    }
    /**
     * See if a point is inside the rectangle defined by top-left and bottom right coordinates
     * @param x0 top-left corner of rectangle
     * @param y0 top-left corner of rectangle
     * @param x1 bottom-right corner of rectangle
     * @param y1 bottom-right corner of rectangle
     * @param pX x position of point of interest
     * @param pY y position of point of interest
     * @return true if inside rectangle else false
     */
    static is_in_rectangle_xyxy(x0, y0, x1, y1, pX, pY) {
        return (pX >= x0 && pY >= y0 && pX <= x1 && pY <= y1);
    }
    /**
     * See if this a is inside the rectangle defined by top-left and bottom right coordinates
     * @param v0 top-left corner of rectangle
     * @param v1 bottom-right corner of rectangle
     * @param p point of interest
     * @return true if inside rectangle else false
     */
    static is_in_rectangle_xyxy_v(v0, v1, p) {
        return Geom2D.is_in_rectangle_xyxy(v0.x, v0.y, v1.x, v1.y, p.x, p.y);
    }
    /**
     * See if a point is inside the rectangle defined by top-left and bottom right coordinates
     * @param x0 top-left corner of rectangle
     * @param y0 top-left corner of rectangle
     * @param width width of rectangle
     * @param height height of rectangle
     * @param pX x position of point of interest
     * @param pY y position of point of interest
     * @return true if inside rectangle else false
     */
    static is_in_rectangle_xywh(x0, y0, width, height, pX, pY) {
        return (pX >= x0 && pY >= y0 && pX <= x0 + width && pY <= y0 + height);
    }
    /**
     * See if this a is inside the rectangle defined by top-left and bottom right coordinates
     * @param v0 top-left corner of rectangle
     * @param width width of rectangle
     * @param height height of rectangle
     * @param p point of interest
     * @return true if inside rectangle else false
     */
    static is_in_rectangle_xywh_v(v0, width, height, p) {
        return Geom2D.is_in_rectangle_xyxy(v0.x, v0.y, v0.x + width, v0.y + height, p.x, p.y);
    }
    /**
     * See if the given point is inside a polygon defined by the vertices provided. The shape can be
     * open or closed and the order can be clockwise or counter-clockwise.
     *
     * @param verts the vertices of the shape
     * @param x0 x position
     * @param y0 y position
     * @return true if x0, y0 is inside polygon else returns false
     */
    static is_in_polygon(verts, x0, y0) {
        let oddNodes = false;
        for (let i = 0, j = verts.length - 1; i < verts.length; j = i, i++) {
            let vi = verts[i];
            let vj = verts[j];
            if ((vi.y < y0 && vj.y >= y0 || vj.y < y0 && vi.y >= y0) && (vi.x + (y0 - vi.y) / (vj.y - vi.y) * (vj.x - vi.x) < x0))
                oddNodes = !oddNodes;
        }
        return oddNodes;
    }
    /**
     * Create a set of triangles from a concave/convex polygon with no holes and no
     * intersecting sides.
     *
     * @param contour an array of vertices that make up a 2D polygon
     * @param closed true if the polygon is closed i.e. the first and last vertex represent
     * the same 2D position.
     * @return an array of vertex indices (to contour list in counter-clockwise order)
     * in groups of three for the render triangles (counter-clockwise)
     */
    static triangulate(contour, closed = false) {
        let n = closed ? contour.length - 1 : contour.length;
        if (n < 3)
            return [];
        //contour.reverse()
        let result = [];
        let vList = [];
        /* we want a counter-clockwise polygon in V based on computer screen coordinates */
        if (0 < Geom2D.area(contour))
            for (let v = 0; v < n; v++)
                vList[v] = v;
        else
            for (let v = 0; v < n; v++)
                vList[v] = (n - 1) - v;
        let nv = n;
        /*  remove nv-2 Vertices, creating 1 triangle every time */
        let count = 2 * nv; /* error detection */
        for (let v = nv - 1; nv > 2;) {
            /* if we loop, it is probably a non-simple polygon */
            if (0 >= (count--))
                return []; // Triangulation: ERROR - probable bad polygon!
            /* three consecutive vertices in current polygon, <u,v,w> */
            let u = v;
            if (nv <= u)
                u = 0; /* previous */
            v = u + 1;
            if (nv <= v)
                v = 0; /* new v    */
            let w = v + 1;
            if (nv <= w)
                w = 0; /* next     */
            if (Geom2D._snip(contour, u, v, w, nv, vList)) {
                /* true names of the vertices */
                let a = vList[u], b = vList[v], c = vList[w];
                /* output Triangle */
                result.push(a);
                result.push(b);
                result.push(c);
                /* remove v from remaining polygon */
                for (let s = v, t = v + 1; t < nv; s++, t++)
                    vList[s] = vList[t];
                nv--;
                /* reset error detection counter */
                count = 2 * nv;
            }
        }
        return result.reverse();
    }
    /**
     * Calculate the area of the polygon.
     *
     * @param contour an array of vertices that make up an open 2D polygon
     * @return the area of the polygon
     */
    static area(contour) {
        let n = contour.length;
        let areaX2 = 0;
        for (let p = n - 1, q = 0; q < n; p = q++)
            areaX2 += contour[p].x * contour[q].y - contour[q].x * contour[p].y;
        return areaX2 * 0.5;
    }
    static _snip(contour, u, v, w, n, vList) {
        let p;
        let Ax = contour[vList[u]].x;
        let Ay = contour[vList[u]].y;
        let Bx = contour[vList[v]].x;
        let By = contour[vList[v]].y;
        let Cx = contour[vList[w]].x;
        let Cy = contour[vList[w]].y;
        if (Geom2D.ACCY > (((Bx - Ax) * (Cy - Ay)) - ((By - Ay) * (Cx - Ax))))
            return false;
        for (p = 0; p < n; p++) {
            if ((p == u) || (p == v) || (p == w))
                continue;
            let Px = contour[vList[p]].x;
            let Py = contour[vList[p]].y;
            if (Geom2D.is_in_triangle(Ax, Ay, Bx, By, Cx, Cy, Px, Py))
                return false;
        }
        return true;
    }
}
Geom2D.ACCY = 1E-30;
Geom2D.ON_PLANE = 16;
Geom2D.PLANE_INSIDE = 17;
Geom2D.PLANE_OUTSIDE = 18;
Geom2D.OUT_LEFT = 1;
Geom2D.OUT_TOP = 2;
Geom2D.OUT_RIGHT = 4;
Geom2D.OUT_BOTTOM = 8;
Geom2D.NEARNESS = 1.0;
//# sourceMappingURL=geom2d.js.map