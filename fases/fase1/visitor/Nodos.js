const Nodes ={
    Grammar: {
        productions: 'Production[]',
    },
    Production: {
        id: 'Identifier',
        options: 'Options',
    },
    Options: {
        expressions: 'Union[]',
    },
    Union: {
        head: 'Expression',
        tail: 'Expression[]',
    },
    Expression: {
        label: '?Label',
        modifiers: '?Modifiers',
        baseExpression: 'BaseExpression',
        quantifier: '?Quantifier',
    },
    Label: {
        id: 'Identifier',
    },
    Modifiers: {
        values: 'string[]', // Represents modifiers like "$", "@", etc.
    },
    BaseExpression: {
        value: 'ExpressionNode',
    },
    ExpressionNode: {
        value: 'Identifier | Literal | Group | Bracket | Dot | Negation',
    },
    Group: {
        expressions: 'Options',
    },
    Bracket: {
        ranges: 'Range[]',
    },
    Range: {
        start: 'Character',
        end: 'Character',
    },
    Character: {
        value: 'string',
    },
    Dot: {},
    Negation: {},
    Literal: {
        value: 'string',
    },
    Quantifier: {
        value: 'string | RangeQuantifier | OptionsQuantifier',
    },
    RangeQuantifier: {
        min: '?number',
        max: '?number',
    },
    OptionsQuantifier: {
        min: '?number',
        max: '?number',
        options: 'Options',
    },
    Identifier: {
        value: 'string',
    },
    Number: {
        value: 'number',
    },
};

export default Nodes;