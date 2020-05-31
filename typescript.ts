let hi: number;
let iddo;
iddo = 3;
let lucky = 23;

type hi = string | number;
let hello:hi = "3";
add("1", "2");
let add = (n1: number, n2: number):number =>  {
    return n1 + n2;
}

let role: [number, string] = [1, "asdf"]
type person = {
    name: string; 
    age: number;
}

let ido:person = {
    name: "sdad",
    age: 5,
}

let shaked:unknown = "d";
shaked.charAt(0);