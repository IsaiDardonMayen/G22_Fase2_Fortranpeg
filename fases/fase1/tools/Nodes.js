    const nodes = {
        
        Producciones: ['id', 'expr', 'alias'],
        Identificador: ['val'], 
        Opciones: ['exprs'],
        Union: ['exprs'],
        Expresion: ['expr', 'label', 'qty'],
        String: ['val', 'isCase'],
        Clase: ['chars', 'isCase'],
        Rango: ['bottom', 'top'],
        Parentesis: ['exp'],
          
    };

    export default nodes;