import _ from "lodash";
import cw from "catiline";
import mazeWorker from "./maze-worker";
export default maze;

function Maze(nodes, _config) {
    this.nodes = nodes;
    this._config = _config;
}

_.extend(Maze.prototype, {
    toCanvas(width, height, canvas, context) {
        var nodes = this.nodes;
        var nodeWidth = (width - 1) / this._config.width;
        var nodeHeight = (height - 1) / this._config.height;

        if(!canvas) {
            canvas = document.createElement("canvas");
        }
        if(!context) {
            context = canvas.getContext("2d");
        }

        canvas.width = width;
        canvas.height = height;
        context.lineWidth = 1;
        context.lineCap = "butt";
        context.strokeStyle = "#000000";
        context.fillStyle = "#FFFFFF";
        context.translate(0.5, 0.5);
        context.beginPath();
        nodes.forEach(function(node) {
            node.children.forEach((child) => {
                var cx = 0;
                var cy = 0;
                // don't draw exit/entrance
                // TODO: move this logic into the maze generation
                if(vecEqual([node, child], this._config.entrance) || 
                    vecEqual([node, child], this._config.exit)) {
                    return;
                }
                if(node.x > child.x) {
                    cx = -0.5;
                }
                else if(node.x < child.x) {
                    cx = 0.5;
                }

                if(node.y > child.y) {
                    cy = -0.5;
                }
                else if(node.y < child.y) {
                    cy = 0.5;
                }

                context.moveTo((node.x * nodeWidth) - cx, (node.y * nodeHeight) - cy);
                context.lineTo((child.x * nodeWidth) + cx, (child.y * nodeHeight) + cy);
            });
        }, this);
        
        context.stroke();
        return canvas;
    }
});

function maze(_config) {
    console.time("Generated maze");
    return cw(mazeWorker).data(_config).then((nodes) => {
        var maze = new Maze(nodes, _config);
        console.timeEnd("Generated maze");
        return maze;
    });

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
