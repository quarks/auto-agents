
let cum = 0, total = 1 - levelMover[0];
for (let lvl = 1; lvl <= this.depth; lvl++) {
	let nbrParts = (4 ** (lvl - 1)) * (lvl == 1 ? 1 : eccentricity);
	let pn = levelMover[lvl] / nbrParts;
	total += nbrParts * (pn * (pn - 1) / 2 + pn * cum);
	//console.log(`Level: ${lvl}  (Pop: ${levelPop[lvl]})  Avg part Pop: ${pn} `);
	cum += levelMover[lvl];
}

let max = levelMover[0] * (levelMover[0] - 1) / 2 - (levelMover[0] - 1);
let factor = total / max;
//console.log(total, nbrTests, max);
console.log(`Est total: ${Math.round(total)}     Max: ${max}        Metric: ${factor}`);