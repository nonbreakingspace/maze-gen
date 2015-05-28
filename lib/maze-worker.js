export default mazeWorker;

function mazeWorker(config, callback) {
    var openNodes;
    var i;
    var child;
    var children = [];

    var grid = range(0, config.height + 1).map(function(y) {
        return range(0, config.width + 1).map(function(x) {
            return {
                x: x,
                y: y,
                children: [],
                parent: null
            };
        });
    });

    var nodes = grid.reduce(function(nodes, row) {
        return nodes.concat(row);
    }, []);

    nodes.forEach(function(node) {
        node.neighbors = getNeighbors(node);
    });

    addWalls();
    openNodes = getOpenNodes();
    for(i = 0; openNodes.length; i++) {
        child = connectNode(sample(openNodes));
        if(config.depthFirst) {
            while(child && child.neighbors.some(notConnected)) {
                child = connectNode(child);
            }
        }
        openNodes = getOpenNodes();
    }

    callback(grid);

    // fns
    function getNode(x, y) {
        return grid[y] ? grid[y][x] : null;
    }

    function addWalls() {
        var x;
        var y;
        var width = config.width + 1;
        var height = config.height + 1;
        
        for(x = 0; x < width - 1; x++) {
            connect(getNode(x, 0), getNode(x + 1, 0));
            connect(getNode(x, height - 1), getNode(x + 1, height - 1));
        }
        
        for(y = 0; y < height - 1; y++) {
            connect(getNode(0, y), getNode(0, y + 1));
            connect(getNode(width - 1, y), getNode(width - 1, y + 1));
        }
    }

    function range(a, b) {
        var r = [];
        while(a < b) {
            r.push(a);
            a++;
        }
        return r;
    }

    function sample(arr) {
        return arr[Math.floor(arr.length * Math.random())];
    }

    function getNeighbors(node) {
        var x = node.x;
        var y = node.y;
        return [
            getNode(x, y-1),
            getNode(x, y+1),
            getNode(x-1, y),
            getNode(x+1, y)
        ].filter(function(v) {
            return !!v;
        });
    }

    function connectNode(node) {
        var validChildren = node.neighbors.filter(notConnected);
        var child = sample(validChildren);
        connect(node, child);
        return child;
    }
    
    function connect(parent, child) {
        parent.children.push([child.x, child.y]);
        child.parent = [parent.x, parent.y];
        children.push(child);
    }

    function getOpenNodes() {
        var _nodes = config.allowIslands ? nodes : children;
        return _nodes.filter(function(node) {
            return node.neighbors.some(notConnected);
        });
    }

    function notConnected(node) {
        return !node.parent && !node.children.length;
    }
}