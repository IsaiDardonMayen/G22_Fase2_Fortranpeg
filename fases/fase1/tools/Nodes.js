    const nodes = {
        Producciones: ['id', 'expr', 'alias'],
        Identificador: ['val'], 
        Opciones: ['exprs'],
        Union: ['exprs'],
        Expresion: ['expr', 'label', 'qty'],
        String: ['val', 'isCase'],
        Parentesis: ['exp'],
        
        
    };

    export default nodes;