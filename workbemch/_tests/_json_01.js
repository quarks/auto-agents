function preload() {
    jsondata_01 = loadStrings('data_01.txt');
}
function setup() {
    let p5canvas = createCanvas(440, 440);
    p5canvas.parent('sketch');

    readdata_01();
}

function readdata_01() {
    jsondata_01 = jsondata_01.join(' ');
    let obj = JSON.parse(jsondata_01);
    let data = obj.data;
    data.forEach(d => {
        let repel = Symbol.for(d.repel);
        console.log(repel, repel === OUTSIDE);
        let contour = [];
        d.contour.forEach(v => contour.push(Vector2D.from(v)));
        console.log(contour);
        let f = new Fence(contour, d.enclosed, repel);
        console.log(f);
    })


}

function vector_01() {
    let v0, v1, obj0, obj1, j$;
    console.log('Object containing named Vector2D');
    v0 = new Vector2D(24, 19);
    obj0 = { name: 'Position', vec: jsonVector2D(v0) };
    console.log(obj0);
    j$ = JSON.stringify(obj0);
    console.log(`Stringiified § ${j$} §`);
    obj1 = JSON.parse(j$);
    console.log(obj1.name, obj1.vec);
    v1 = Vector2D.from(obj1);
    console.log(Vector2D.from(obj1.vec));
    console.log('----------------------------------------------------------------------------------------------------------------')
}

function vector_02() {
    // Object containg 2 attributes etype : entity type and an array of Vector2D objects
    // representing
    let obj0, j$, array1 = [];
    let array = [new Vector2D(24, 19), new Vector2D(-10, 42), new Vector2D(88, -56), new Vector2D(-7, -6)];
    obj0 = { type: 'Fence', contour: jsonArrayVector2D(array) };
    j$ = JSON.stringify(obj0);
    console.log(`Stringiified version of ${obj0}`);
    console.log(j$);
    // {"type":"Fence","contour":[[24,19],[-10,42],[88,-56],[-7,-6]]} 
    obj1 = JSON.parse(j$);
    console.log('Parsed JSON text')
    console.log(obj1.type, obj1.contour);
    console.log(`Recreated Vector2D array`);
    obj1.contour.forEach(v => array1.push(Vector2D.from(v)));
    console.log(array1);
}

function symbol_01() {
    // We can get the symbol from its key
    let s = Symbol.for('bothsides')
    console.log(Symbol.keyFor(s));
    console.log(s === BOTH_SIDES);
}

function draw() {
    background(240, 210, 60)

}