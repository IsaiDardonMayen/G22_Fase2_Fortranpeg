import Visitor from "../visitor/Visitor.js";
import * as Syntax from "./SyntaxsTree.js"
import * as CST from "../visitor/CST.js"
export default class SyntaxsTreeVisitor extends Visitor {
    visitProducciones(node) {
        return node.expr.accept(this);
    }
	visitOpciones(node) {
        return node.exprs.map((expr) => node.accept(this));
    }
	visitUnion(node) {
       retur
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
        return new Syntax.Hoja(node.val, node.isCase)
    }
	visitClase(node) {}
	visitRango(node) {}
	visitParentesis(node) {}

}
   