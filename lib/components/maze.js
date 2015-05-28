import React from "react";
import _ from "lodash";
import maze from "../maze";
import extendState from "../mixins/extend-state";


const MazeComponent = React.createClass({
    getDefaultProps() {
        return {
            width: 20,
            height: 20,
            canvasWidth: 500,
            canvasHeight: 500,
            depthFirst: true,
            allowIslands: false
        };
    },

    createMaze() {
        const {width, height, canvasWidth, canvasHeight, depthFirst, allowIslands} = this.props;
        var {entrance, exit} = this.props;
        var entrance;
        var exit;
        var exitX;
        var entranceX;

        if(!entrance) {
            entranceX = Math.floor(Math.random() * width);
            entrance = [
                {x: entranceX, y: 0},
                {x: entranceX + 1, y: 0}
            ];
        }
        if(!exit) {
            exitX = Math.floor(Math.random() * width);
            exit = [
                {x: exitX, y: height},
                {x: exitX + 1, y: height}
            ];
        }
        return maze({
            depthFirst: depthFirst,
            allowIslands: allowIslands,
            width: width,
            height: height,
            entrance: entrance,
            exit: exit
        }).then((maze) => {
            return maze.toCanvas(canvasWidth, canvasHeight);
        });
    },

    recreateMaze() {
        this._canvas = null;
    },

    removeCanvas() {
        var node = this.getDOMNode();
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
        return node;
    },

    insertCanvas() {
        var _addCanvas = (canvas) => {
            var node;
            this._canvas = canvas;

            if(this.isMounted()) {
                node = this.getDOMNode();
                while (node.firstChild) {
                    node.removeChild(node.firstChild);
                }
                node.appendChild(canvas);
                this._renderedCanvas = canvas;
            }
        };

        if(this._canvas) {
            _addCanvas(this._canvas);
            
        }
        else {
            this.createMaze().then(_addCanvas);
        }
    },

    shouldComponentUpdate(lastProps) {
        return lastProps !== this.props;
    },

    componentDidMount() {
        this.insertCanvas();
    },

    componentDidUpdate() {
        this.insertCanvas();
    },

    render() {
        return (
            <div {...this.props} style={_.extend({width: this.props.canvasWidth, height: this.props.canvasHeight, display: "inline-block", position: "relative"}, this.props.style)}>
            </div>
        );
    }
});

export default MazeComponent;