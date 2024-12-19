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
       if (${node.val}) then
        integer :: start, stop
        start = cursor
        do while (cursor <= len(input) .and. &
                  (input(cursor:cursor) >= 'a' .and. input(cursor:cursor) <= 'z' .or. &
                   input(cursor:cursor) >= 'A' .and. input(cursor:cursor) <= 'Z' .or. &
                   input(cursor:cursor) >= '0' .and. input(cursor:cursor) <= '9'))
            cursor = cursor + 1
        end do
        stop = cursor - 1
        allocate( character(len=stop - start + 1) :: lexeme )
        lexeme = input(start:stop)
        return
    end if
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
    if ("${node.val}" == input(cursor:cursor + ${
            node.val.length - 1
        })) then !Foo
        allocate( character(len=${node.val.length}) :: lexeme)
        lexeme = input(cursor:cursor + ${node.val.length - 1})
        cursor = cursor + ${node.val.length}
        return
    end if
    `;
    }

    
}