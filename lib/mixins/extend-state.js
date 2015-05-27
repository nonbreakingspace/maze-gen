import _ from "lodash";

function curry2(fn) {
    return function(a, b) {
        return arguments.length > 1 ? fn(a, b) : (b) => fn(a, b);
    };
}

const extendStateMixin = {
    extendState(...sources) {
        this.setState(_.extend({}, this.state, ...sources));
    },

    eventToState: curry2(function(keyName, event) {
        event.preventDefault();
        this.extendState({
            [keyName]: event.target.value
        });
    }),

    plusState(key, value) {
        this.extendState({
            [key]: this.state[key] + value
        });
    },

    toggleStateKey(key) {
        this.extendState({
            [key]: !this.state[key]
        });
    }
};

export default extendStateMixin;