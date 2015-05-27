import React from "react";
import MazeComponent from "./components/maze";
import extendStateMixin from "./mixins/extend-state";

var App = React.createClass({
    mixins: [extendStateMixin],

    getInitialState() {
        return {
            width: 40,
            height: 38,
            allowIslands: false,
            depthFirst: true
        };
    },

    render: function() {
        var {width, height, allowIslands, depthFirst} = this.state;
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

        return (
            <main style={style}>
                <section style={{marginTop: 20, textAlign: "center"}}>
                    <MazeComponent
                        width={width}
                        height={height}
                        allowIslands={allowIslands}
                        depthFirst={depthFirst}
                    />
                </section>
                <hr/>
                <section>
                    <section  style={{marginTop: 20}}>
                        <article>
                            <label>Width:</label>
                            <button onClick={this.plusState.bind(this, "width", -1)}>-</button>
                            <input type="number" min="10" max="1000" value={this.state.width} readonly={true}/>
                            <button onClick={this.plusState.bind(this, "width", 1)}>+</button>
                        </article>
                        <aside>
                            <label>Allow islands:</label>
                            <input type="checkbox" checked={!!this.state.allowIslands} onChange={this.toggleStateKey.bind(this, "allowIslands")}/>
                        </aside>
                    </section>

                    <section style={{marginTop: 20}}>
                        <article>
                            <label>Height:</label>
                            <button onClick={this.plusState.bind(this, "height", -1)}>-</button>
                            <input type="number" min="10" max="1000" value={this.state.height} readonly={true}/>
                            <button onClick={this.plusState.bind(this, "height", 1)}>+</button>
                        </article>

                        <aside>
                            <label>Depth first:</label>
                            <input type="checkbox" checked={!!this.state.depthFirst} onChange={this.toggleStateKey.bind(this, "depthFirst")}/>
                        </aside>
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