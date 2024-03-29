import React from "react";
import _ from "lodash";
import MazeComponent from "./components/maze";
import extendStateMixin from "./mixins/extend-state";

const defaultMazeConfig = {
    width: 50,
    height: 30,
    enableLoops: false,
    depthFirst: true,
    maxBranchLength: 0,
    cellSize: 20
};

var App = React.createClass({
    mixins: [extendStateMixin],

    getInitialState() {
        return {
            stagedMazeConfig: defaultMazeConfig,
            currentMazeConfig: defaultMazeConfig
        };
    },

    extendStagedConfig(...sources) {
        this.extendState({
            stagedMazeConfig: _.extend({}, _.clone(this.state.stagedMazeConfig), ...sources),
            currentMazeConfig: this.state.currentMazeConfig
        });
    },

    setWidth(event) {
        this.extendStagedConfig({
            width: +event.target.value
        });
    },

    setHeight(event) {
        this.extendStagedConfig({
            height: +event.target.value
        });
    },

    setCellSize(event) {
        this.extendStagedConfig({
            cellSize: +event.target.value
        });
    },

    setMaxBranchLength(event) {
        this.extendStagedConfig({
            maxBranchLength: +event.target.value
        });
    },

    toggleLoops() {
        this.extendStagedConfig({
            enableLoops: !this.state.stagedMazeConfig.enableLoops
        });
    },

    toggleDepthFirst() {
        this.extendStagedConfig({
            depthFirst: !this.state.stagedMazeConfig.depthFirst
        });
    },

    generate(event) {
        event.preventDefault();
        this.refs.maze.recreateMaze();
        this.extendState({
            stagedMazeConfig: this.state.stagedMazeConfig,
            currentMazeConfig: this.state.stagedMazeConfig
        });
    },

    render() {
        var stagedConfig = this.state.stagedMazeConfig;
        var currentConfig = this.state.currentMazeConfig;
        var canvasWidth = (currentConfig.width * currentConfig.cellSize) + 1;
        var canvasHeight = (currentConfig.height * currentConfig.cellSize) + 1;

        return (
            <div className="app">
                <div className="maze-container">
                    <MazeComponent {...currentConfig} 
                        canvasWidth={canvasWidth}
                        canvasHeight={canvasHeight}
                        style={{
                            position: "relative",
                            left: "50%",
                            marginLeft: -(canvasWidth/2)
                        }}
                    ref="maze"/>
                </div>
                <form className="maze-config" onSubmit={this.generate}>
                    <div className="generate-button-container">
                        <button>Generate</button>
                    </div>

                    <div>
                        <label>Width:</label>
                        <input type="number" min="2" max="1000" value={stagedConfig.width} onChange={this.setWidth}/>
                    </div>

                    <div>
                        <label>Height:</label>
                        <input type="number" min="2" max="1000" value={stagedConfig.height} onChange={this.setHeight}/>
                    </div>

                    <div>
                        <label>Cell Size:</label>
                        <input type="number" min="1" max="1000" value={stagedConfig.cellSize} onChange={this.setCellSize}/>
                    </div>

                    <div>
                        <label>Max Branch Length:</label>
                        <input type="number" min="0" max="1000" value={stagedConfig.maxBranchLength} onChange={this.setMaxBranchLength}/>
                    </div>

                    <div>
                        <label onClick={this.toggleLoops}>Enable Loops:</label>
                        <input type="checkbox" checked={!!stagedConfig.enableLoops} onChange={this.toggleLoops}/>
                    </div>
                </form>
            </div>
        );
    }
});

var outlet = document.getElementById("outlet");
function draw() {
    React.render(<App/>, outlet);
}
draw();