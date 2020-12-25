class LogicGate {
    constructor(id, requires) {
        this.id = id;
        this.requires = requires;
        this._inputs = [];
    }

    // virtual
    output(inputs) {
        return null;
    }
}

class AndGate extends LogicGate {
    constructor(id) {
        super(id, 2);
    }

    output(inputs) {
        if (inputs.length != 2) {
            return null;
        }
        return inputs[0] && inputs[1];
    }
}

class OrGate extends LogicGate {
    constructor(id) {
        super(id, 2);
    }

    output(inputs) {
        if (inputs.length != 2) {
            return null;
        }
        return inputs[0] || inputs[1];
    }
}

class XorGate extends LogicGate {
    constructor(id) {
        super(id, 2);
    }

    output(inputs) {
        if (inputs.length != 2) {
            return null;
        }
        return (inputs[0] && !inputs[1]) || (!inputs[0] && inputs[1]);
    }
}

class NotGate extends LogicGate {
    constructor(id) {
        super(id, 1);
    }

    output(inputs) {
        if (inputs.length != 1) {
            return null;
        }
        return !inputs[0];
    }
}

class NandGate extends LogicGate {
    constructor(id) {
        super(id, 2);
    }

    output(inputs) {
        if (inputs.length != 2) {
            return null;
        }
        return !(inputs[0] && inputs[1]);
    }
}

class NorGate extends LogicGate {
    constructor(id) {
        super(id, 2);
    }

    output(inputs) {
        if (inputs.length != 2) {
            return null;
        }
        return !(Inputs[0] || inputs[1]);
    }
}

class XnorGate extends LogicGate {
    constructor(id) {
        super(id, 2);
    }

    output(inputs) {
        if (inputs.length != 2) {
            return null;
        }
        return (inputs[0] && inputs[1]) || (!inputs[0] && !inputs[1]);
    }
}

class ToggleSwitch extends LogicGate {
    constructor(id) {
        super(id, 0);
        this.current_output = false;
    }

    set_output(new_output) {
        this.current_output = new_output;
    }

    output(inputs) {
        if (inputs.length != 0) {
            return null;
        }
        return this.current_output;
    }
}

class LED extends LogicGate {
    constructor(id) {
        super(id, 1);
        this.is_on = false;
    }

    output(inputs) {
        if (inputs.length != 1) {
            return null;
        }
        this.is_on = inputs[0];
        return null;
    }
}

class FakeGate extends LogicGate {
    constructor(id) {
        super(id, 0);
    }

    output(inputs) {
        return null;
    }
}

class Manager {
    constructor() {
        this.gates = [];
        this.adjacency_list = [];
        this.last_outputs = [];
        this._add_void_gate();
    }

    reset() {
        this.gates = [];
        this.adjacency_list = []; // maps "to -> from"
        this.last_outputs = [];
        this._add_void_gate();
    }

    _add_void_gate() {
        const void_gate = new FakeGate(-1);
        this.gates.push(void_gate);
        this.adjacency_list.push([]); // has no conections
        this.last_outputs.push(false);
        const gate_id = this.gates.length - 1;
        void_gate.id = gate_id; // update gate id
    }

    add_gate(gate) {
        this.gates.push(gate);
        this.adjacency_list.push([]); // has no inputs
        this.last_outputs.push(false); // initial output is 0
        const gate_id = this.gates.length - 1;
        gate.id = gate_id; // update gate id
        this.adjacency_list[0].push(gate_id); // connects to void gate
        return gate_id;
    }

    connect_gates(from_gate_id, to_gate_id) {
        const adj = this.adjacency_list[to_gate_id];
        for (let connected of adj) {
            if (connected == from_gate_id) {
                return; // skip if from_gate is already connected
            }
        }
        adj.push(from_gate_id);
    }

    // returns true if a connection is actually deleted.
    // returns false if no connections are deleted.
    disconnect_gates(from_gate_id, to_gate_id) {
        const adj = this.adjacency_list[to_gate_id];
        const n_adj = adj.length;
        for (let i=0; i<n_adj; i++) {
            if (adj[i] == from_gate_id) {
                adj.splice(1, i);
                return true;
            }
        }
        return false;
    }

    // generate outputs from gates using previous outputs
    generate_new_output() {
        const n_gates = this.gates.length;
        const new_outputs = [];
        for (let i=0; i<n_gates; i++) {
            const gate = this.gates[i];
            const new_output = gate.output(
                this.adjacency_list[i]
                    .map(i => this.last_outputs[i])
            );
            console.log(gate.id + " is calculated (size of input is " + this.adjacency_list[i]
            .map(i => this.last_outputs[i]).length +")");
            new_outputs.push(new_output);
        }
        return new_outputs;
    }

    update_outputs(new_outputs) {
        this.last_outputs = new_outputs;
    }
}

const sw = new ToggleSwitch(-1);
const not1 = new NotGate(-1);
const not2 = new NotGate(-1);
const led = new LED(-1);
const man = new Manager();
const not1_id = man.add_gate(not1);
const not2_id = man.add_gate(not2);
const sw_id = man.add_gate(sw);
const led_id = man.add_gate(led);
sw.set_output(true);
man.connect_gates(sw_id, not1_id);
man.connect_gates(not1_id, not2_id);
man.connect_gates(not2_id, led_id);
let outputs;
const show_status = () => {
    console.log("LED is " + led.is_on);
    console.log(outputs);
};
console.log("first");
outputs = man.last_outputs;
show_status();

console.log("interation 1");
outputs = man.generate_new_output();
show_status();
man.update_outputs(outputs);

console.log("iteration 2");
outputs = man.generate_new_output();
show_status();
man.update_outputs(outputs);

console.log("iteration 3");
outputs = man.generate_new_output();
show_status();
man.update_outputs(outputs);

console.log("iteration 4");
outputs = man.generate_new_output();
show_status();
man.update_outputs(outputs);
