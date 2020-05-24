let elements = [
    { value: "1", type: "number", method: calculate },
    { value: "2", type: "number" },
    { value: "3", type: "number" },
    { value: "+", type: "operator" },
    { value: "4", type: "number" },
    { value: "5", type: "number" },
    { value: "6", type: "number" },
    { value: "-", type: "operator" },
    { value: "7", type: "number" },
    { value: "8", type: "number" },
    { value: "9", type: "number" },
    { value: "*", type: "operator" },
    { value: ".", type: "number" },
    { value: "0", type: "number" },
    { value: "=", type: "equals", id: "equals" },
    { value: "/", type: "operator" },
];

export default elements;