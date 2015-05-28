import _ from "lodash";
import cw from "catiline";
export default Maze;

function Maze(config) {
    this._config = config;
}

_.extend(Maze.prototype, {
    build: function() {
        function _build(config, callback) {
            var openNodes;
            var i;
            var child;
            var children = [];
            var grid = range(0, config.height + 1).map(function(y) {
                return range(0, config.width + 1).map(function(x) {
                    return {
                        x: x,
                        y: y,
                        children: [],
                        parent: null
                    };
                });
            });
            var nodes = grid.reduce(function(nodes, row) {
                return nodes.concat(row);
            }, []);
            nodes.forEach(function(node) {
                node.neighbors = getNeighbors(node);
            });

            addWalls();
            openNodes = getOpenNodes();
            for(i = 0; openNodes.length; i++) {
                child = connectNode(sample(openNodes));
                if(config.depthFirst) {
                    while(child && child.neighbors.some(notConnected)) {
                        child = connectNode(child);
                    }
                }
                openNodes = getOpenNodes();
            }

            callback(grid);

            // fns
            function getNode(x, y) {
                return grid[y] ? grid[y][x] : null;
            }

            function range(a, b) {
                var r = [];
                while(a < b) {
                    r.push(a);
                    a++;
                }
                return r;
            }

            function sample(arr) {
                return arr[Math.floor(arr.length * Math.random())];
            }

            function getNeighbors(node) {
                var x = node.x;
                var y = node.y;
                return [
                    getNode(x, y-1),
                    getNode(x, y+1),
                    getNode(x-1, y),
                    getNode(x+1, y)
                ].filter(function(v) {
                    return !!v;
                });
            }

            function connectNode(node) {
                var validChildren = node.neighbors.filter(notConnected);
                var child = sample(validChildren);
                connect(node, child);
                return child;
            }
            
            function connect(parent, child) {
                if(!parent.parent) {
                    parent.parent = {};
                }
                parent.children.push([child.x, child.y]);
                child.parent = [parent.x, parent.y];
                children.push(child);
            }

            function addWalls() {
                var x;
                var y;
                var width = config.width + 1;
                var height = config.height + 1;
                
                for(x = 0; x < width - 1; x++) {
                    connect(getNode(x, 0), getNode(x + 1, 0));
                    connect(getNode(x, height - 1), getNode(x + 1, height - 1));
                }
                
                for(y = 0; y < height - 1; y++) {
                    connect(getNode(0, y), getNode(0, y + 1));
                    connect(getNode(width - 1, y), getNode(width - 1, y + 1));
                }
            }

            function getOpenNodes() {
                var nodes = children;
                return nodes.filter(function(node) {
                    return node.neighbors.some(notConnected);
                });
            }

            function notConnected(node) {
                return !node.parent && !node.children.length;
            }
        }

        var worker = cw(_build);
        var p = worker.data(this._config);
        worker.on("*", function() {
            console.log("end");
        });
        return p;
    },
    
    draw: function(width, height) {
        return this.build().then((grid) => {
            var nodes = _.flatten(grid);
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            var nodeWidth = width/this._config.width;
            var nodeHeight = height/this._config.height;

            nodes.forEach((node) => {
                node.children = node.children.map((coords) => {
                    return grid[coords[1]] ? grid[coords[1]][coords[0]] : console.log("NOT FOUND: " + coords);
                });
            });

            canvas.width = width;
            canvas.height = height;
            context.strokeStyle = "#000000";
        
            context.beginPath();
            nodes.forEach(function(node) {
                node.children.forEach(function(other) {
                    if(vecEqual([node, other], this._config.entrance) || 
                       vecEqual([node, other], this._config.exit)) {
                        return;
                    }
                    context.moveTo(node.x * nodeWidth, node.y * nodeHeight);
                    context.lineTo(other.x * nodeWidth, other.y * nodeHeight);
                }, this);
            }, this);
            context.stroke();
            return canvas;
        }, (error) => console.error(error));
    }
});

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
