import { writeFileSync } from 'node:fs';
import path from 'node:path';
import nodes from './Nodos.js';

export function Generador() {
    const __dirname = path.dirname(require.main.filename);
    const classesDestination = '../lib/CST.js';
    const visitorDestination = '../lib/Interfaces/Visitor.js';
    

    // Generar la clase Visitor
    let codeString = `
// Auto-generated
class Visitor {
`;

    for (const node of Object.keys(nodes)) {
        codeString += `\tvisit${node}(node) {\n\t\tthrow new Error('visit${node} is not implemented');\n\t}\n`;
    }
    codeString += `}

module.exports = Visitor;
`;

    fs.writeFileSync(path.join(__dirname, visitorDestination), codeString);
    console.log('Generated Visitor class');

    // Función para generar argumentos de los constructores
    function printArgs(args, separator) {
        const argKeys = Object.keys(args);
        return argKeys
            .map((arg) => {
                const parts = args[arg].split('?');
                return parts.length > 1
                    ? `${arg} = null` // Valor por defecto para opcionales
                    : `${arg}`;
            })
            .join(separator);
    }

    // Generar las clases para los nodos
    codeString = `
// Auto-generated
const Visitor = require('./Interfaces/Visitor.js');

`;
    for (const [name, args] of Object.entries(nodes)) {
        const argKeys = Object.keys(args);
        codeString += `
class ${name} {
    constructor(${printArgs(args, ', ')}) {
        ${argKeys.map((arg) => `this.${arg} = ${arg};`).join('\n\t\t')}
    }

    accept(visitor) {
        if (visitor.visit${name}) {
            return visitor.visit${name}(this);
        }
        throw new Error('Visitor does not implement visit${name}');
    }
}

module.exports.${name} = ${name};
    `;
        console.log(`Generating ${name} node`);
    }

    fs.writeFileSync(path.join(__dirname, classesDestination), codeString);
    console.log('Done!');
}