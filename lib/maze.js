import _ from "lodash";
import cw from "catiline";
import mazeWorker from "./maze-worker";
export default maze;

function Maze(grid, _config) {
    this.grid = grid;
    this._config = _config;
}

_.extend(Maze.prototype, {
    toCanvas: function(width, height) {
        var grid = this.grid;
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
    }
});

function maze(_config) {
    var worker = cw(mazeWorker);

    var p = worker.data(_config);
    console.log(_config);
    return p.then((grid) => {
        var maze = new Maze(grid, _config);
        return maze;
    });

}

_.extend(maze, {
    function(width, height) {
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
