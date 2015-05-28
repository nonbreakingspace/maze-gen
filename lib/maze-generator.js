import _ from "lodash";
import cw from "catiline";
import mazeWorker from "./maze-worker";
export default maze;

function Maze(nodes, _config) {
    this.nodes = nodes;
    this._config = _config;
}

_.extend(Maze.prototype, {
    toCanvas: function(width, height) {
        var nodes = this.nodes;
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        var nodeWidth = width/this._config.width;
        var nodeHeight = height/this._config.height;

        canvas.width = width;
        canvas.height = height;
        context.strokeStyle = "#000000";
    
        context.beginPath();
        nodes.forEach(function(node) {
            var parent = node.parent;
            if(!parent) return;
            // don't draw exit/entrance
            // TODO: move this logic into the maze generation
            if(vecEqual([node, parent], this._config.entrance) || 
               vecEqual([node, parent], this._config.exit)) {
                return;
            }
            context.moveTo(node.parent.x * nodeWidth, node.parent.y * nodeHeight);
            context.lineTo(node.x * nodeWidth, node.y * nodeHeight);
        }, this);
        context.stroke();
        return canvas;
    }
});

function maze(_config) {
    return cw(mazeWorker).data(_config).then((nodes) => {
        var maze = new Maze(nodes, _config);
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
