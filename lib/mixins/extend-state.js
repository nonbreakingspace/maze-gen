import _ from "lodash";

const extendStateMixin = {
    extendState(...sources) {
        this.setState(_.extend(_.clone(this.state), ...sources));
    }
};

export default extendStateMixin;