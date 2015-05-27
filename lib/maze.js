import * as _ from "lodash";
export default Maze;

function Maze(options) {
    var openNodes;
    var i;
    var child;
    _.extend(this, options);
    console.time("Initializing maze");
    this.grid = _.range(this.height + 1).map(function(y) {
        return _.range(this.width + 1).map(function(x) {
            return {
                x: x,
                y: y,
                children: [],
                parent: null
            };
        });
    }, this);
    this.children = [];

    this.getNodes().forEach(function(node) {
        node.neighbors = this.getNeighbors(node);
    }, this);
    console.timeEnd("Initializing maze");

    console.time("Generating maze");
    this.addWalls();
    openNodes = this.getOpenNodes();
    for(i = 0; openNodes.length; i++) {
        child = this.connectNode(_.sample(openNodes));
        if(this.depthFirst) {
            while(child && child.neighbors.some(notConnected)) {
                child = this.connectNode(child);
            }
        }
        openNodes = this.getOpenNodes();
    }
    console.timeEnd("Generating maze");
}

_.extend(Maze.prototype, {
    addWalls: function() {
        var x;
        var y;
        var width = this.width + 1;
        var height = this.height + 1;
        
        for(x = 0; x < width - 1; x++) {
            this.connect(this.getNode(x, 0), this.getNode(x + 1, 0));
            this.connect(this.getNode(x, height - 1), this.getNode(x + 1, height - 1));
        }
        
        for(y = 0; y < height - 1; y++) {
            this.connect(this.getNode(0, y), this.getNode(0, y + 1));
            this.connect(this.getNode(width - 1, y), this.getNode(width - 1, y + 1));
        }
    },
    
    getNodes: function() {
        return this._nodes || (this._nodes = _.flatten(this.grid));
    },
    
    getNode: function(x, y) {
        return this.grid[y] ? this.grid[y][x] : null;
    },
    
    getNeighbors: function(node) {
        var x = node.x;
        var y = node.y;
        return _.compact([
            this.getNode(x, y-1),
            this.getNode(x, y+1),
            this.getNode(x-1, y),
            this.getNode(x+1, y)
        ]);
    },
    
    connectNode: function(node) {
        var validChildren = node.neighbors.filter(notConnected);
        var child;
        if(this.selectChildNode) {
            child = this.selectChildNode(validChildren);
        } else {
            child = _.sample(validChildren);
        }
        this.connect(node, child);
        return child;
    },
    
    connect: function(parent, child) {
        if(!parent.parent) {
            parent.parent = {};
        }
        parent.children.push(child);
        child.parent = [parent.x, parent.y];
        this.children.push(child);
    },
    
    getOpenNodes: function() {
        var nodes = this.allowIslands ? this.getNodes() : this.children;
        return nodes.filter(function(node) {
            return node.neighbors.some(notConnected);
        }, this);
    },
    
    draw: function(width, height) {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        var nodeWidth = width/this.width;
        var nodeHeight = height/this.height;
        console.time("Drawing maze");
        canvas.width = width;
        canvas.height = height;
        context.strokeStyle = "#000000";
    
        context.beginPath();
        this.getNodes().forEach(function(node) {
            node.children.forEach(function(other) {
                if(vecEqual([node, other], this.entrance) || 
                   vecEqual([node, other], this.exit)) {
                    return;
                }
                context.moveTo(node.x * nodeWidth, node.y * nodeHeight);
                context.lineTo(other.x * nodeWidth, other.y * nodeHeight);
            }, this);
        }, this);
        context.stroke();
        console.timeEnd("Drawing maze");
        return canvas;
    }
});

function notConnected(node) {
    return !node.parent && !node.children.length;
}

function pointsEqual(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
}

function vecEqual(v1, v2) {
    var p1 = v1[0];
    var p2 = v1[1];
    var p3 = v2[0];
    var p4 = v2[1];
    return (pointsEqual(p1, p3) && pointsEqual(p2, p4)) ||
        (pointsEqual(p1, p4) && pointsEqual(p2, p3));
}
