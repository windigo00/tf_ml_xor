import v2d from "./v2d.js";

export default class Canvas
{
    constructor(parentElement, w, h, useGl)
    {
        var canvas = document.createElement("CANVAS");
        canvas.setAttribute("width", w);
        canvas.setAttribute("height", h);
        this.width = w;
        this.height = h;
        parentElement.appendChild(canvas);
        parentElement.setAttribute('width', w);
        this.ctx = canvas.getContext(useGl ? "webgl" : "2d"); //2d context
        this.loop = false;
        this.dt = 0;
        this.lastNow = 0;
    }

    async draw(callback, loop)
    {
        if (!this.callback) {
            this.callback = callback;
        }
        if (loop) {
            this.loop = true;
        }
        if (this.loop) {
            var now = window.performance.now();
            this.dt = (now - this.lastNow)/1000;
            this.lastNow = now;
        }
        if (loop) {
            this.loop = true;
        }
        if (this.callback) {
            var that = this;
            this.callback(this.ctx).then(e => {
                if (that.loop) {
                    window.requestAnimationFrame(that.draw.bind(that));
                }
            })
        } else {
            return;
        }

    }

    get fps()
    {
        return this.dt != 0 ? Math.floor(1/this.dt) : 0;
    }

    clear(color)
    {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    text(val, x, y, color, font)
    {
        this.ctx.fillStyle = color ? color : "#FF0000";
        this.ctx.font = font ? font : "20px Tahoma";
        this.ctx.fillText(val, x ? x : 0, y ? y : 0);
    }

    point(p1, size, color, noFill)
    {
        this.ctx.beginPath();
		this.ctx.fillStyle = color;
		this.ctx.strokeStyle = color;
		this.ctx.arc(p1.x, p1.y, size, 0, 2 * Math.PI);
        if (noFill) {
            this.ctx.stroke();
        } else {
            this.ctx.fill();
        }
    }

    line(p1, p2, color, width)
    {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        if (width) {
            this.ctx.lineWidth = width;
        }
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
    }
    ngon(points, color, fill)
    {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
        this.ctx.moveTo(points[0].x, points[0].y);
        for(var i = 1, max = points.length; i < max; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }
        this.ctx.closePath();
        if (fill) {
            this.ctx.fill();
        } else {
            this.ctx.stroke();
        }
    }

    triangle(r, color, fill)
    {
        var a = new v2d(r * 2,  0),
            b = a.rot(120 * Math.PI/180).div(1.5),
            c = a.rot(-120 * Math.PI/180).div(1.5);

        this.ngon([a,b,c],color,fill);
    }
    /**
     * Draw rect from the center
     */
    rectangle(pos, w, h, color, fill)
    {
        var w2 = w/2, h2= h/2;
        var a = new v2d(pos.x - w2,  pos.y - h2),
            b = new v2d(pos.x + w2,  pos.y - h2),
            c = new v2d(pos.x + w2,  pos.y + h2),
            d = new v2d(pos.x - w2,  pos.y + h2);

        this.ngon([a,b,c,d],color,fill);
    }
    /**
     * Draw rect from the corner
     */
    rectangle2(pos, w, h, color, fill)
    {
        var a = new v2d(pos.x    , pos.y),
            b = new v2d(pos.x + w, pos.y),
            c = new v2d(pos.x + w, pos.y + h),
            d = new v2d(pos.x    , pos.y + h);

        this.ngon([a,b,c,d],color,fill);
    }

}
