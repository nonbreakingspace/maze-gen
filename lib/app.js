import React from "react";
import _ from "lodash";
import MazeComponent from "./components/maze";
import extendStateMixin from "./mixins/extend-state";

const defaultMazeConfig = {
    width: 25,
    height: 25,
    allowIslands: false,
    depthFirst: true
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

    addWidth(n) {
        this.extendStagedConfig({
            width: n + this.state.stagedMazeConfig.width
        });
    },

    setHeight(event) {
        this.extendStagedConfig({
            height: +event.target.value
        });
    },

    addHeight(n) {
        this.extendStagedConfig({
            height: n + this.state.stagedMazeConfig.height
        });
    },

    toggleIslands() {
        this.extendStagedConfig({
            allowIslands: !this.state.stagedMazeConfig.allowIslands
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
        var mazeContainerStyle = {
            position: "absolute",
            left: 100,
            right: 100,
            height: "100%"
        };

        var fillH = {height: "100%"};
        var stagedConfig = this.state.stagedMazeConfig;
        return (
            <main style={style}>
                <section style={{marginTop: 40, textAlign: "center"}}>
                    <MazeComponent {...this.state.currentMazeConfig} ref="maze"/>
                </section>

                <section>
                    <section  style={{marginTop: 20}}>
                        <article>
                            <label>Width:</label>
                            <button onClick={this.addWidth.bind(this, -1)}>-</button>
                            <input type="number" min="10" max="1000" value={stagedConfig.width} onChange={this.setWidth}/>
                            <button onClick={this.addWidth.bind(this, 1)}>+</button>
                        </article>
                        <aside>
                            <label onClick={this.toggleIslands}>Allow islands:</label>
                            <input type="checkbox" checked={!!stagedConfig.allowIslands} onChange={this.toggleIslands}/>
                        </aside>
                    </section>

                    <section style={{marginTop: 20}}>
                        <article>
                            <label>Height:</label>
                            <button onClick={this.addHeight.bind(this, -1)}>-</button>
                            <input type="number" min="10" max="1000" value={stagedConfig.height} onChange={this.setHeight}/>
                            <button onClick={this.addHeight.bind(this, 1)}>+</button>
                        </article>

                        <aside>
                            <label onClick={this.toggleDepthFirst}>Depth first:</label>
                            <input type="checkbox" checked={!!stagedConfig.depthFirst} onChange={this.toggleDepthFirst}/>
                        </aside>
                    </section>
                    <section style={{marginTop: 20}}>
                        <button onClick={this.generate}>Generate</button>
                    </section>
                </section>
            </main>
        );
    }
});

function draw() {
    React.render(<App/>, document.body);
}
draw();