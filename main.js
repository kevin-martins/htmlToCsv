const dateToSeconds = (date) => {
    const res = date.split(/[a-z]+/g);
    res.pop()
    if (res[0] === "0") return 0;
    switch (res.length) {
        case 1: return parseInt(res[0]);
        case 2: return parseInt(res[0]) * 60 + parseInt(res[1]);
        case 3: return parseInt(res[0] * 3600) + parseInt(res[1] * 60) + parseInt(res[2]);
        default: return 0;
    };
};

const textArea = document.getElementById('textarea');
const stateText = document.getElementById('stateText');
let res = [];

// const generateTable = (csvString) => {
//     const tableBody = document.getElementById('table-body');
//     tableBody.innerHTML = ''; // Clear existing rows
//     const lines = csvString.split('\n');
//     console.log(lines);
//     for (let line of lines) {
//         if (line.trim() === '') continue;
//         const cells = line.split(';');
//         console.log(cells);
//         const row = document.createElement('tr');
//         const cell = document.createElement('td');
//         for (let cellValue of cells) {
//             cell.innerHTML = cellValue;
//             console.log(cellValues);
//             row.appendChild(cell);
//         }
//         tableBody.appendChild(row);
//     }
// }

const organiseData = () => {
    const text = textArea.value.replace(/(<([^>]+)>)/ig, '\n').split('\n');
    res = [];
    const length = text.length;
    for (let i = 0; i < length; i++) {
        if (text[i].length > 0) {
            if (i+1 < length && ['h', 'min', 's'].includes(text[i + 1])) {
                let date = "";
                switch(text[i+1]) {
                    case 'h':
                        date += `${text[i]}${text[i+1]}${text[i+2].trim()}${text[i+3]}${text[i+4].trim()}${text[i+5]}`;
                        i+=5;
                        break;
                    case 'min':
                        date += `${text[i]}${text[i+1]}${text[i+2].trim()}${text[i+3]}`;
                        i+=3;
                        break;
                    case 's':
                        date += `${text[i]}${text[i+1]}`;
                        i+=1;
                        break;
                }
                res.push(dateToSeconds(date));
                res.push(date);
            } else {
                res.push(text[i]);
            }
        }
    }
    if (res[2] !== "Temps en secondes") {
        res.splice(2, 0, "Temps en secondes");
    }
    console.log(res);
    return res;
}

const formatCSV = (data) => {
    let toCsv = "";
    for (let i = 0, j = 1; i < data.length; i++, j++) {
        if (j % 5 !== 0) {
            toCsv += (data[i] + ';');
        } else {
            toCsv += (data[i] + '\n');
        }
    }
    return toCsv;
}

function copyFile() {
    const data = organiseData();
    const csvContent = formatCSV(data);
    // generateTable(csvContent);
    navigator.clipboard.writeText(csvContent);
    alert("text copied");
};