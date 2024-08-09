const dateToSeconds = (date) => {
    const res = date.split(/[a-z]+/g);
    res.pop()
    switch (res.length) {
        case 1: return parseInt(res[0]);
        case 2: return parseInt(res[0]) * 60 + parseInt(res[1]);
        case 3: return parseInt(res[0] * 3600) + parseInt(res[1] * 60) + parseInt(res[2]);
    };
};

const textArea = document.getElementById('textarea');
const stateText = document.getElementById('stateText');

const loadingText = document.getElementById('loadingText');

const organiseData = () => {
    const text = textArea.value.replace(/(<([^>]+)>)/ig, '\n').split('\n');
    const res = [];
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
    navigator.clipboard.writeText(formatCSV(data));
    alert("text copied");
};