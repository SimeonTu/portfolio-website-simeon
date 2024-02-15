function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

// Excluding the first row with the labels
let tableRowsNodeList = document.querySelectorAll('tr')
console.log(tableRowsNodeList);
let tableRows = Array.from(tableRowsNodeList).slice(1)
console.log(tableRows);

// between 0 and 6 months (15 778 463 seconds)
let randomNum = () => {
    let num = Number(getRandomInt(0, 15778463).toString().slice(getRandomInt(0, 2)))
    return num
}

for (let i = 0; i < tableRows.length; i++) {
    tableRows[i].querySelectorAll('td')[1].innerHTML = randomNum()
}

// max is n - 1 so 6 is actually 5
let randomTableData = tableRows[getRandomInt(0, tableRows.length)].querySelectorAll('td')[1]

let experience = Number(randomTableData.innerHTML)

setInterval(() => {
    randomTableData.innerHTML = experience += 1
}, 1000)