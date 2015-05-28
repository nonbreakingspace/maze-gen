import React from "react";
import _ from "lodash";
import Maze from "../maze";
import extendState from "../mixins/extend-state";

export const MazeComponent = React.createClass({
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
        var {width, height, canvasWidth, canvasHeight, depthFirst, allowIslands} = this.props;

        var enx = Math.floor(Math.random() * width);
        var exx = Math.floor(Math.random() * width);
        return new Maze({
            depthFirst: depthFirst,
            allowIslands: allowIslands,
            width: width,
            height: height,
            entrance: [
                {x: enx, y: 0},
                {x: enx + 1, y: 0}
            ],
            exit: [
                {x: exx, y: height},
                {x: exx + 1, y: height}
            ]
        }).draw(canvasWidth, canvasHeight);
    },

    insertCanvas() {
        this.createMaze().then((canvas) => {
            var node;
            console.log("canvas: " + canvas);
            if(this.isMounted()) {
                node = this.getDOMNode();
                while (node.firstChild) {
                    node.removeChild(node.firstChild);
                }
                node.appendChild(canvas);
            }
        });
    },

    componentDidMount() {
        console.time("Inserting maze canvas");
        this.insertCanvas();
        console.timeEnd("Inserting maze canvas");
    },

    componentDidUpdate() {
        console.time("Inserting maze canvas");
        this.insertCanvas();
        console.timeEnd("Inserting maze canvas");
    },

    // shouldComponentUpdate(newProps) {
    //     return this.props !== newProps;
    // },


    render() {
        return (
            <div {...this.props}></div>
        );
    }
});

export default MazeComponent;