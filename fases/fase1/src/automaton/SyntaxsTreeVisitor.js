import Visitor from "../visitor/Visitor.js";
import * as Syntax from "./SyntaxsTree.js"


export default class SyntaxsTreeVisitor extends Visitor {
    visitProducciones(node) {
        return node.expr.accept(this);
    }
	visitOpciones(node) {
        return node.exprs
        .map((expr) => node.accept(this))
        .reduce((subTree, curr) => new Syntax.Or(subTree, curr));
    }

	visitUnion(node) {
        return node.exprs
        .map((expr) => expr.accept(this))
        .reduce((subTree, curr) => new Syntax.Or(subTree, curr));
    }
	visitExpresion(node) {
        switch(node.qty){
            case "*":
                return new Syntax.ZeroOrMore(node,node.expr.accept(this))
            case "+":
                return new Syntax.OneOrMore(node,node.expr.accept(this))
            case "?":
                return new Syntax.Opcional(node,node.expr.accept(this))
            default:
                return node.expr.accept(this)
        }
    }
	visitString(node) {
        return new Syntax.Hoja(node.val)
    }
	visitClase(node) {
        return new Syntax.Hoja(node.chars.join(''))
    }
	visitRango(node) {
        return `${node.bottom}-${node.top}`;
    }
	visitIdentificador(node) {}
    visitPunto(node) {}
    visitFin(node) {}

}
   