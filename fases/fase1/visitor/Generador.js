const fs = require('fs');
const path = require('path');
const nodes = require('./Nodos.js');

const __dirname = path.dirname(require.main.filename);
const classesDestination = '../src/lib/CST.js';
const visitorDestination = '../src/lib/Interfaces/Visitor.js';

let codeString = `
// Auto-generated
const Node = require('./Node');

class Visitor {
`;

for (const node of Object.keys(nodes)) {
    codeString += `\tvisit${node}(node) {\n\t\tthrow new Error("visit${node} not implemented");\n\t}\n`;
}
codeString += `}

module.exports = Visitor;
`;

fs.writeFileSync(path.join(__dirname, visitorDestination), codeString);
console.log('Generated visitor Interface');

function printArgs(args, separator) {
    const argKeys = Object.keys(args);
    return argKeys
        .map((arg) => {
            const parts = args[arg].split('?');
            return parts.length > 1
                ? `${arg} /* optional: ${parts[1]} */`
                : `${arg}`;
        })
        .join(separator);
}

codeString = `
// Auto-generated
const Node = require('./Interfaces/Node');
const Visitor = require('./Interfaces/Visitor');
`;

for (const [name, args] of Object.entries(nodes)) {
    const argKeys = Object.keys(args);
    codeString += `
class ${name} {
    ${argKeys.map((arg) => `this.${arg}; // Initialized later`).join('\n\t')}

    constructor(${printArgs(args, ', ')}) {
        ${argKeys.map((arg) => `this.${arg} = ${arg};`).join('\n\t\t')}
    }

    accept(visitor) {
        if (visitor.visit${name}) {
            return visitor.visit${name}(this);
        }
        throw new Error("Visitor method visit${name} not implemented");
    }
}

module.exports.${name} = ${name};
    `;
    console.log(`Generating ${name} node`);
}

fs.writeFileSync(path.join(__dirname, classesDestination), codeString);
console.log('Done!');
