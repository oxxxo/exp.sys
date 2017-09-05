var mContainer = document.getElementById('container');

var mXPlanes = [],
    mYPlanes = [],
    mZPlanes = [],
    mAllPlanes = [];

var mTrails = [];

var mPlaneSize = 300,
    mDivisions = 5,
    mSegmentSize = mPlaneSize / mDivisions;

window.onload = function() {
    init();
    requestAnimationFrame(loop);
};

function init() {
    TweenMax.set(mContainer, {
        perspective:4000,
        transformStyle:'preserve-3d'
    });

    createPlanes();
    createTrails();

    TweenMax.to(mContainer, 20, {ease:Linear.easeNone, rotationX:360, rotationY:360, repeat:-1})
}

function createPlanes() {
    var i,
        startOffset = mPlaneSize * -0.5;

    // x
    for (i = 0; i <= mDivisions; i++) {
        mXPlanes.push(createPlane(
            new Point(startOffset + mSegmentSize * i, 0, 0),
            new Point(0, -90, 0),
            "#00f"
        ));
    }
    // y
    for (i = 0; i <= mDivisions; i++) {
        mYPlanes.push(createPlane(
            new Point(0, startOffset + mSegmentSize * i, 0),
            new Point(90, 0, 0),
            "#0f0"
        ));
    }
    // z
    for (i = 0; i <= mDivisions; i++) {
        mZPlanes.push(createPlane(
            new Point(0, 0, startOffset + mSegmentSize * i),
            new Point(),
            "#f00"
        ));
    }
}

function createPlane(p, r, c) {
    var plane = new Plane(p, r, c);

    mAllPlanes.push(plane);
    mContainer.appendChild(plane.canvas);

    return plane;
}

function createTrails() {
    var x, y, z, position,
        h, s, l, color;

    for (var i = 0; i < 8; i++) {
        x = randomRange(0, mDivisions) | 0;
        y = randomRange(0, mDivisions) | 0;
        z = randomRange(0, mDivisions) | 0;
        position = new Point(x, y, z);

        h = randomRange(0, 180) | 0;
        s = randomRange(80, 100) | 0;
        l = randomRange(80, 100) | 0;
        color = 'hsl(' + h + ',' + s + '%,' + l + '%)';

        startTrailsAt(position, color);
    }
}

function startTrailsAt(point, color) {
    for (var i = 0; i < 6; i++) {
        var trail = new Trail(point);
        trail.color = color;
        mTrails.push(trail);
    }
}

function update() {
    invoke(mTrails, 'update');
}

function draw() {
    invoke(mAllPlanes, 'clear');
    invoke(mTrails, 'draw');
}

function loop() {
    update();
    draw();

    requestAnimationFrame(loop);
}


function Plane(p, r, c) {
    this.position = p;
    this.rotation = r;

    this.createCanvas();
    // moved these here because setting shadow color for each segment turned out to be quite expensive
    this.ctx.shadowColor = '#fff';
    this.ctx.shadowBlur = 16;
}
Plane.prototype = {
    createCanvas:function() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.width = mPlaneSize + 'px';
        this.canvas.style.height = mPlaneSize + 'px';
        this.canvas.width = mPlaneSize;
        this.canvas.height = mPlaneSize;
        this.ctx = this.canvas.getContext('2d');

        TweenMax.set(this.canvas, {
            left:-(mPlaneSize * 0.5) + 'px',
            top:-(mPlaneSize * 0.5) + 'px',
            x:this.position.x,
            y:this.position.y,
            z:this.position.z,
            rotationX:this.rotation.x,
            rotationY:this.rotation.y,
            rotationZ:this.rotation.z
        })
    },
    clear:function() {
        this.ctx.clearRect(0, 0, mPlaneSize, mPlaneSize);
    }
};

function Trail(position) {

    this.style = {
        strokeStyle:'#f00',
        lineWidth:1
    };

    this.t0 = 0;
    this.t1 = 0;
    this.deltaTime = (1/randomRange(5, 20));
    this.points = [position || new Point()];
    this.maxLength = 3;
}
Trail.prototype = {
    set color(c) {
        this.style.strokeStyle = c;
    },
    update:function() {
        this.t1 += this.deltaTime;
        this.t0 = Math.max(0, this.t1 - this.maxLength);

        if (this.t1 >= this.points.length - 1) {
            this.appendPoint();
        }
    },
    appendPoint:function() {
        var point = this.points[this.points.length - 1].clone();
        var direction = getRandomDirection();

        point.x = clamp(point.x + direction.x, 0, mDivisions);
        point.y = clamp(point.y + direction.y, 0, mDivisions);
        point.z = clamp(point.z + direction.z, 0, mDivisions);

        this.points.push(point);
    },
    draw:function() {
        var p0, p1, start, end;

        for (var i = 0; i < this.points.length - 1; i++) {
            p0 = this.points[i];
            p1 = this.points[i + 1];

            if (this.t0 < i + 1) {

                if (this.t0 > i) {
                    start = this.t0 - i;
                }
                else {
                    start = 0;
                }

                if (this.t1 < (i + 1)) {
                    end = this.t1 - i;
                }
                else {
                    end = 1;
                }
            }

            this.connectPoints(p0, p1, start, end);
        }
    },
    connectPoints:function(p0, p1, start, end) {
        var ctx;

        var x0 = p0.x + (p1.x - p0.x) * start,
            y0 = p0.y + (p1.y - p0.y) * start,
            z0 = p0.z + (p1.z - p0.z) * start;

        var x1 = p0.x + (p1.x - p0.x) * end,
            y1 = p0.y + (p1.y - p0.y) * end,
            z1 = p0.z + (p1.z - p0.z) * end;

        if (p0.x === p1.x) {
            ctx = mXPlanes[p0.x].ctx;

            applyStyle(ctx, this.style);

            ctx.beginPath();
            ctx.moveTo(z0 * mSegmentSize, y0 * mSegmentSize);
            ctx.lineTo(z1 * mSegmentSize, y1 * mSegmentSize);
            ctx.stroke();
        }

        if (p0.y === p1.y) {
            ctx = mYPlanes[p0.y].ctx;

            applyStyle(ctx, this.style);

            ctx.beginPath();
            ctx.moveTo(x0 * mSegmentSize, z0 * mSegmentSize);
            ctx.lineTo(x1 * mSegmentSize, z1 * mSegmentSize);
            ctx.stroke();
        }

        if (p0.z === p1.z) {
            ctx = mZPlanes[p0.z].ctx;

            applyStyle(ctx, this.style);

            ctx.beginPath();
            ctx.moveTo(x0 * mSegmentSize, y0 * mSegmentSize);
            ctx.lineTo(x1 * mSegmentSize, y1 * mSegmentSize);
            ctx.stroke();
        }
    }
};

function Point(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}
Point.prototype = {
    add:function(p) {
        this.x += p.x;
        this.y += p.y;
        this.z += p.z;

        return this;
    },
    clone:function() {
        return new Point(this.x, this.y, this.z);
    }
};


function invoke(a, m) {
    a.forEach(function(el) {
        el[m].apply(el);
    });
}

function randomRange(min, max) {
    return min + Math.random() * (max - min);
}

function wrap(v, min, max) {
    return (((v - min) % (max - min)) + (max - min)) % (max - min) + min;
}

function clamp(x, min, max) {
    return x < min ? min : x > max ? max : x;
}

function applyStyle(ctx, style) {
    for (var p in style) {
        ctx[p] = style[p];
    }
}

getRandomDirection = (function getRandomDirection() {
    var directions = [
        new Point(1, 0, 0),
        new Point(-1, 0, 0),
        new Point(0, 1, 0),
        new Point(0, -1, 0),
        new Point(0, 0, 1),
        new Point(0, 0, -1)
    ];

    return function() {
        return directions[Math.floor(Math.random() * directions.length)];
    }
})();