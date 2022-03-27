import { nodes } from "./beastsSkills.js";


var m0_graph = {
    "nodes": nodes.m0_nodes,
    "edges": [
        {
            "source": "a",
            "target": "b",
            "direction": "vertical"
        },
        {
            "source": "b",
            "target": "c",
            "direction": "vertical"
        },
        {
            "source": "a",
            "target": "d",
            "direction": "horizontal"
        },
        {
            "source": "d",
            "target": "e",
            "direction": "vertical"
        },
        {
            "source": "b",
            "target": "e",
            "direction": "horizontal"
        },
        {
            "source": "b",
            "target": "f",
            "direction": "diagonalDownRight"
        },
        {
            "source": "c",
            "target": "g",
            "direction": "diagonalDownLeft"
        }
    ]
}

var m1_graph = {
    "nodes": nodes.m1_nodes,
    "edges": [
        {
            "source": "a",
            "target": "b",
            "direction": "vertical"
        },
        {
            "source": "a",
            "target": "e",
            "direction": "horizontal"
        },
        {
            "source": "e",
            "target": "c",
            "direction": "horizontal"
        },
        {
            "source": "b",
            "target": "f",
            "direction": "diagonalDownRight"
        },
        {
            "source": "c",
            "target": "d",
            "direction": "vertical"
        },
        {
            "source": "d",
            "target": "f",
            "direction": "diagonalDownLeft"
        },
        {
            "source": "f",
            "target": "g",
            "direction": "horizontal"
        }
    ]
}

var m2_graph = {
    "nodes": nodes.m2_nodes,
    "edges": [
        {
            "source": "a",
            "target": "b",
            "direction": "vertical"
        },
        {
            "source": "b",
            "target": "c",
            "direction": "vertical"
        },
        {
            "source": "a",
            "target": "d",
            "direction": "horizontal"
        },
        {
            "source": "d",
            "target": "e",
            "direction": "horizontal"
        },
        {
            "source": "b",
            "target": "f",
            "direction": "diagonalDownRight"
        },
        {
            "source": "c",
            "target": "g",
            "direction": "diagonalDownLeft"
        }
    ]
}

var m3_graph = {
    "nodes": nodes.m3_nodes,
    "edges": [
        {
            "source": "a",
            "target": "b",
            "direction": "vertical"
        },
        {
            "source": "b",
            "target": "c",
            "direction": "vertical"
        },
        {
            "source": "c",
            "target": "d",
            "direction": "vertical"
        },
        {
            "source": "d",
            "target": "e",
            "direction": "vertical"
        },
        {
            "source": "e",
            "target": "f",
            "direction": "horizontal"
        },
        {
            "source": "f",
            "target": "g",
            "direction": "horizontal"
        }
    ]
}


var m4_graph = {
    "nodes": nodes.m4_nodes,
    "edges": [
        {
            "source": "a",
            "target": "b",
            "direction": "vertical"
        },
        {
            "source": "b",
            "target": "c",
            "direction": "vertical"
        },
        {
            "source": "a",
            "target": "d",
            "direction": "horizontal"
        },
        {
            "source": "d",
            "target": "e",
            "direction": "vertical"
        },
        {
            "source": "b",
            "target": "e",
            "direction": "horizontal"
        },
        {
            "source": "b",
            "target": "f",
            "direction": "diagonalDownRight"
        },
        {
            "source": "c",
            "target": "g",
            "direction": "diagonalDownRight"
        }
    ]
}


var m5_graph = {
    "nodes": nodes.m5_nodes,
    "edges": [
        {
            "source": "a",
            "target": "b",
            "direction": "vertical"
        },
        {
            "source": "b",
            "target": "c",
            "direction": "vertical"
        },
        {
            "source": "a",
            "target": "d",
            "direction": "horizontal"
        },
        {
            "source": "d",
            "target": "e",
            "direction": "vertical"
        },
        {
            "source": "b",
            "target": "e",
            "direction": "horizontal"
        },
        {
            "source": "b",
            "target": "f",
            "direction": "diagonalDownRight"
        },
        {
            "source": "c",
            "target": "g",
            "direction": "diagonalDownRight"
        }
    ]
}

export var beasts = {
    m0_graph,
    m1_graph,
    m2_graph,
    m3_graph,
    m4_graph,
    m5_graph,
}
