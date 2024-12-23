import Visitor from './Visitor.js';
import { Expresion, Rango } from './CST.js';

export default class Tokenizer extends Visitor {
    generateTokenizer(grammar) {
        return `
module parser
implicit none

contains
subroutine parse(input)
    integer ::cursor
    character(len=:), allocatable :: lexeme
    character(len=:), intent(inout), allocatable :: input

    cursor = 1
    do while (lexeme /= "EOF" .and. lexeme /= "ERROR")
        lexeme = nextSym(input, cursor)
        print *, lexeme
    end do


end subroutine parse
function nextSym(input, cursor) result(lexeme)
    character(len=*), intent(in) :: input
    integer, intent(inout) :: cursor
    character(len=:), allocatable :: lexeme
    integer :: i

    if (cursor > len(input)) then
        allocate( character(len=3) :: lexeme )
        lexeme = "EOF"
        return
    end if

    ${grammar.map((produccion) => produccion.accept(this)).join('\n')}

    print *, "error lexico en col ", cursor, ', "'//input(cursor:cursor)//'"'
    lexeme = "ERROR"
end function nextSym
end module parser 
        `;
    }

    visitProducciones(node) {
        return node.expr.accept(this);
    }
    visitIdentificador(node) {
        return '';
    }
    visitOpciones(node) {
        return node.exprs.map((node) => node.accept(this)).join('\n');
    }
    visitUnion(node) {
        return node.exprs.map((node) => node.accept(this)).join('\n');
    }
    visitExpresion(node) {
        return node.expr.accept(this);
    }
    visitString(node) {
        return `
    if ("${node.val}" == input(cursor:cursor + ${node.val.length - 1})) then
        allocate( character(len=${node.val.length}) :: lexeme)
        lexeme = input(cursor:cursor + ${node.val.length - 1})
        cursor = cursor + ${node.val.length}
        return
    end if
    `;
    }

    generateCaracteres(chars) {

        if (chars.length === 0) return '';
        // si viene un " ", "\t", "\n", "\r" entonces se debe de hacer un if especial
        return `
    if (findloc([${chars
        .map((char) => `"${char}"`)
        .join(', ')}], input(i:i), 1) > 0) then
        lexeme = input(cursor:i)
        cursor = i + 1
        return
    end if
        `;
    }

    visitClase(node) {
        return `
    i = cursor
    ${this.generateCaracteres(
        node.chars.filter((node) => typeof node === 'string')
    )}
    ${node.chars
        .filter((node) => node instanceof Rango)
        .map((range) => range.accept(this))
        .join('\n')}
        `;
    }

    visitRango(node) {
        return `
    if (input(i:i) >= "${node.bottom}" .and. input(i:i) <= "${node.top}") then
        lexeme = input(cursor:i)
        cursor = i + 1
        return
    end if
        `;
    }

    visitParentesis(node) {
        console.log("ESTAMOS EN PARENTESIS;",node.expr);
        return node.expr.accept(this);
    }
    visitPunto(node) {
        return '';
    }
    visitFin(node) {
        return '';
    }

    visitWhiteSpace(node) {
        console.log("ESTAMOS EN WHITESPACE",node);
        return '';
    }


}