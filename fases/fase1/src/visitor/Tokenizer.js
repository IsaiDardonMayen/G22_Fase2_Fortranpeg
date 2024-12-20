import Visitor from './Visitor.js';

export default class Tokenizer extends Visitor {
    generateTokenizer(grammar) {
        return `
module tokenizer
    implicit none

contains
function nextSym(input, cursor) result(lexeme)
    character(len=*), intent(in) :: input
    integer, intent(inout) :: cursor
    character(len=:), allocatable :: lexeme

    if (cursor > len(input)) then
        allocate( character(len=3) :: lexeme )
        lexeme = "EOF"
        return
    end if

    ${grammar.map((produccion) => produccion.accept(this)).join('\n')}

    print *, "error lexico en col ", cursor, ', "'//input(cursor:cursor)//'"'
    lexeme = "ERROR"
end function nextSym
end module tokenizer 
        `;
    }

    visitProducciones(node) {
        return node.expr.accept(this);
    }
    visitIdentificador(node) {
        return `
    `;
    }
    visitOpciones(node) {
        return node.exprs[0].accept(this);
    }
    visitUnion(node) {
        return node.exprs[0].accept(this);
    }
    visitExpresion(node) {
        return node.expr.accept(this);
    }
    visitString(node) {
        return `
    if ("${node.val}" == input(cursor:cursor + ${node.val.length - 1
            })) then !Foo
        allocate( character(len=${node.val.length}) :: lexeme)
        lexeme = input(cursor:cursor + ${node.val.length - 1})
        cursor = cursor + ${node.val.length}
        return
    end if
    `;
    }
    visitParentesis(node) {
        // Divide node.exp en partes según algún criterio (por ejemplo, "/").
        const parts = node.exp.split("/");

        // Genera un bloque `if` para cada parte.
        const ifBlocks = parts
            .map((part) => `
    if ("${part.trim()}" == input(cursor:cursor + ${part.trim().length - 1
                })) then !Foo
        allocate( character(len=${part.trim().length}) :: lexeme)
        lexeme = input(cursor:cursor + ${part.trim().length - 1})
        cursor = cursor + ${part.trim().length}
        return
    end if
        `)
            .join("\n");

        return ifBlocks;
    }
    visitCorchetes(node) {
        // Aplanar el array completamente en caso de que tenga múltiples niveles.
    const parts = node.exp.flat(Infinity);

    // Variable para almacenar el resultado procesado.
    const processedParts = [];
    let tempString = ""; // Acumulador para elementos entre comillas.
    let insideQuotes = false; // Bandera para saber si estamos dentro de comillas.

    // Itera sobre los elementos para procesar comillas y corchetes.
    for (const part of parts) {
        if (part === '[' || part === ']') {
            // Si encontramos un corchete, lo agregamos directamente al array procesado.
            processedParts.push(part);
        } else if (part === '"') {
            // Cambia el estado de dentro/fuera de comillas.
            insideQuotes = !insideQuotes;
            if (!insideQuotes && tempString) {
                // Si cerramos comillas, agrega la cadena acumulada y reinicia `tempString`.
                processedParts.push(tempString);
                tempString = "";
            }
        } else if (insideQuotes) {
            // Acumula la cadena si estamos dentro de comillas.
            tempString += part;
        } else {
            // Agrega elementos fuera de las comillas directamente.
            processedParts.push(part);
        }
    }

    // Genera los bloques `if` con los datos procesados.
    const ifBlocks = processedParts
        .map((part, index) => {
            // Bloque para el primer elemento (corchete de apertura).
            if (index === 0 && part === "[") {
                return `
    if ("[" == input(cursor:cursor + 0)) then !Foo
        allocate( character(len=1) :: lexeme)
        lexeme = "["
        cursor = cursor + 1
        return
    end if
                `;
            }

            // Bloque para el último elemento (corchete de cierre).
            if (index === processedParts.length - 1 && part === "]") {
                return `
    if ("]" == input(cursor:cursor + 0)) then !Foo
        allocate( character(len=1) :: lexeme)
        lexeme = "]"
        cursor = cursor + 1
        return
    end if
                `;
            }

            // Bloques para elementos intermedios.
            return `
    if ("${part}" == input(cursor:cursor + ${part.length - 1})) then !Foo
        allocate( character(len=${part.length}) :: lexeme)
        lexeme = input(cursor:cursor + ${part.length - 1})
        cursor = cursor + ${part.length}
        return
    end if
            `;
        })
        .join("\n");

    return ifBlocks;

    }


}