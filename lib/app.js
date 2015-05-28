import React from "react";
import _ from "lodash";
import MazeComponent from "./components/maze";
import extendStateMixin from "./mixins/extend-state";

const defaultMazeConfig = {
    width: 25,
    height: 25,
    enableLoops: false,
    depthFirst: true,
    maxBranchLength: 0
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

    generate() {
        this.refs.maze.recreateMaze();
        this.extendState({
            stagedMazeConfig: this.state.stagedMazeConfig,
            currentMazeConfig: this.state.stagedMazeConfig
        });
    },

    render() {
        var style = {
            position: "relative",
            height: "100%"
        };

        var stagedConfig = this.state.stagedMazeConfig;
        return (
            <main style={style}>
                <section className="maze-container">
                    <MazeComponent {...this.state.currentMazeConfig} ref="maze"/>
                </section>

                <section className="maze-config">
                    <div>
                        <label>Width:</label>
                        <input type="number" min="10" max="1000" value={stagedConfig.width} onChange={this.setWidth}/>
                    </div>

                    <div>
                        <label>Height:</label>
                        <input type="number" min="10" max="1000" value={stagedConfig.height} onChange={this.setHeight}/>
                    </div>

                    <div>
                        <label>Max Branch Length:</label>
                        <input type="number" min="0" max="1000" value={stagedConfig.maxBranchLength} onChange={this.setMaxBranchLength}/>
                    </div>

                    <div>
                        <label onClick={this.toggleLoops}>Enable Loops:</label>
                        <input type="checkbox" checked={!!stagedConfig.enableLoops} onChange={this.toggleLoops}/>
                    </div>

                    <div>
                        <button onClick={this.generate}>Generate</button>
                    </div>
                </section>
            </main>
        );
    }
});

function draw() {
    React.render(<App/>, document.body);
}
draw();