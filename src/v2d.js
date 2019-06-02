
const SMALL_NUM  = 0.00000001;// anything that avoids division overflow

export default class v2d
{

	constructor(x, y)
	{
		if (x instanceof v2d) {
			this.x = x.x;
			this.y = x.y;
		} else {
			this.x = x != undefined ? x : 0;
			this.y = y != undefined ? y : 0;
		}
		this.reset();
	}

	add(v)
	{
		var n = this.copy();
		n.x += v.x;
		n.y += v.y;
		return n;
	}
	sub(v)
	{
		var n = this.copy();
		n.x -= v.x;
		n.y -= v.y;
		return n;
	}
	mul(v)
	{
		var n = this.copy();
		if (v instanceof v2d) {
			n.x *= v.x;
			n.y *= v.y;
		} else {
			n.x *= v;
			n.y *= v;
		}
		return n;
	}
	div(v)
	{
		var n = this.copy();
		n.x /= v;
		n.y /= v;
		return n;
	}

	get length()
	{
		if (this._len == null ) {
			this._len = Math.sqrt(this.x * this.x + this.y * this.y);
		}
		return this._len;
	}

	dot(v)
	{
        var a = this.normalize();
        var b = v.normalize();
        return a.x * b.x + a.y * b.y;
	}
    /**
     *
     * @param {type} v
     * @returns {undefined}
     */
    perp(v)
    {
        var a = this.normalize();
        var b = v.normalize();
        return a.x * b.y - a.y * b.x;
    }

	angle(v)
	{
        if (!v) {
            v = new v2d(1,0);
        }

		if (this.length && v.length) {
            return Math.acos(this.dot(v)/* (this.length * v.length);*/);
//            var i2 = Math.PI/2;
//            var i = Math.PI/180;
//            console.log(d, r, r / i)
//            if (d > 0 && r < i2) {
////                r *= -1;
//            } else
//            if (d > 0 && r > i2) {
//                r *= -1;
//
//            } else
//            if (d < 0 && r < i2) {
//                r *= -1;
//
//            } else
//            if (d < 0 && r > i2) {
////                r *= -1;
//
//            }
			return r;
		} else {
			return 0;
		}
	}

    set(x,y)
    {
        if (x instanceof v2d) {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x;
            this.y = y;
        }
    }

	normalize(v)
	{
		v = v != undefined ? v : this;
        if (v.length != 1) {
            var t = v.length;
            v.x /= t;
            v.y /= t;
            this._len = 1;
        }
		return v;
	}

    rot(theta)
    {
        return this.rotate(theta);
    }

    _rot(t)
    {
        var x = this.x,
            y = this.y,
            c = Math.cos(t),
            s = Math.sin(t);
        this.x = x * c - y * s;
        this.y = x * s + y * c;
    }

    rotate(theta)
    {
        var n = this.copy();
        var cs = Math.cos(theta);
        var sn = Math.sin(theta);
		n.x = this.x * cs - this.y * sn;
		n.y = this.x * sn + this.y * cs;
		return n;
    }

    copy()
    {
        return new v2d(this);
    }

    reset()
    {
        this._len = null;
        return this;
    }

    getCloser(p1, p2)
    {
        var l1 = this.sub(p1).length;
        var l2 = this.sub(p2).length;
        return l1 > l2 ? p2 : p1;
    }

    randomize(x, y)
    {
        this.x = (x ? x : 1) * (0.5 - Math.random());
        this.y = (y ? y : (x ? x : 1)) * (0.5 - Math.random());
        return this;
    }

    distSq(v)
    {
        var x = v.x - this.x;
        var y = v.y - this.y;
        return x*x + y*y;
    }
}