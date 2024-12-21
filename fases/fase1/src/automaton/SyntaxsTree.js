class Node{
    constructor(){
        this.firsts = null
        this.lasts= null
        this.nullable = null        
    }

    /**
     * @returns {number[]}
    */

    firstPos(){}
    /**
     * @returns {number[]}
    */
        
    lastPos(){}
    nullable(){}
}

class Hoja extends Node{
    pos;
    nullable;
    /**
     * 
     * @param {number}pos
    */
    constructor(pos){
        super()
        this.pos = pos
        this.nullable = false
    }
    /**
     * @returns {number[]}
    */

    firstPos(){
        return [this.pos]
    }
    /**
     * @returns {number[]}
    */

    lastPos(){
        return [this.pos]
    }
    /**
     * @returns {boolean}
    */

    nullable(){
        return false
    }
} 

class Concat extends Node{
    c1;
    c2;
    /**
     * 
     * @param {Node} c1 
     * @param {Node} c2 
     */
    constructor(c1, c2){
        super()
        this.c1 = c1
        this.c2 = c2
    }

    /**
     * @returns {number[]}
    */

    firstPos(){
        return this.c1.nullable() ? [...this.c1.firstPos(), ...this.c2.firstPos()] : this.c1.firstPos()
        
    }
    /**
     * @returns {number[]}
    */

    lastPos(){
        return this.c2.nullable() ? [...this.c1.lastPos(), ...this.c2.lastPos()] : this.c2.lastPos()
        
    }
    /**
     * @returns {boolean}
    */

    nullable(){
        return this.c1.nullable() && this.c2.nullable()
        
    }


    
}

class Or extends Node{
    c1;
    c2;
    /**
     * 
     * @param {Node} c1 
     * @param {Node} c2 
     */
    constructor(c1, c2){
        super()
        this.c1 = c1
        this.c2 = c2
    }
     /**
     * @returns {number[]}
    */

     firstPos(){
        return [...this.c1.firstPos(), ...this.c2.firstPos()]
        
    }
    /**
     * @returns {number[]}
    */

    lastPos(){
        return [...this.c1.lastPos(), ...this.c2.lastPos()]
        
    }
    /**
     * @returns {boolean}
    */

    nullable(){
        return this.c1.nullable() || this.c2.nullable()
        
    }

}

class ZeroOrMore extends Node{
    c1;
    /**
     * 
     * @param {Node} c1 
     */
    constructor(c1){
        super()
        this.c1 = c1
    }
     /**
     * @returns {number[]}
    */

     firstPos(){
        return this.c1.firstPos()
        
    }
    /**
     * @returns {number[]}
    */

    lastPos(){
        return this.c1.lastPos()
        
    }
    /**
     * @returns {boolean}
    */

    nullable(){
        return true
        
    }
}
class OneOrMore extends Node{
    c1;
    /**
     * 
     * @param {Node} c1 
     */
    constructor(c1){
        super()
        this.c1 = c1
    }
     /**
     * @returns {number[]}
    */

     firstPos(){
        return this.c1.firstPos()
        
    }
    /**
     * @returns {number[]}
    */

    lastPos(){
        return this.c1.lastPos()
        
    }
    /**
     * @returns {boolean}
    */

    nullable(){
        return false
        
    }
}
class Option extends Node{
    c1;
    /**
     * 
     * @param {Node} c1 
     */
    constructor(c1){
        super()
        this.c1 = c1
    }
     /**
     * @returns {number[]}
    */

     firstPos(){
        return this.c1.firstPos()
        
    }
    /**
     * @returns {number[]}
    */

    lastPos(){
        return this.c1.lastPos()
        
    }
    /**
     * @returns {boolean}
    */

    nullable(){
        return true
        
    }
}
