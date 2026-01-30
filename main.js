const twoDigits = (num) => {
  num = num.trim();
  return num < 10 ? `0${num}` : `${num}`;
}

const textArea = document.getElementById('textarea');
const stateText = document.getElementById('stateText');
const p = document.getElementById('output');

const extractUserLogInfo = () => {
  const userArray = textArea.value
    .replace(/(<([^>]+)>)/ig, '\n')
    .split('\n')
    .filter(item => item.trim().length > 0);
  const result = [];

  for (let i = 0; i < userArray.length; i++) {
    if (userArray[i].length > 0 && (i + 1) <= userArray.length) {
      if (['h', 'min', 's'].includes(userArray[i + 1])) {
        switch(userArray[i + 1]) {
          case 'h':
            result.push(`${userArray[i]}h${userArray[i+2]}min${userArray[i+4]}s`); // format hhmmss
            result.push(`${twoDigits(userArray[i])}:${twoDigits(userArray[i+2])}:${twoDigits(userArray[i+4])}`); // format HH:MM:SS
            result.push((parseInt(userArray[i]) * 3600 + parseInt(userArray[i+2]) * 60 + parseInt(userArray[i+4])).toString()); // format seconds
            // result += `${userArray[i]}h${userArray[i+2]}min${userArray[i+4]}s;${twoDigits(userArray[i])}:${twoDigits(userArray[i+2])}:${twoDigits(userArray[i+4])}`
            i+=5;
            break;
          case 'min':
            result.push(`${userArray[i]}mins${userArray[i+2]}s`);
            result.push(`00:${twoDigits(userArray[i])}:${twoDigits(userArray[i+2])}`);
            result.push((parseInt(userArray[i]) * 60 + parseInt(userArray[i+2])).toString());
            i+=3;
            break;
          case 's':
            result.push(`${userArray[i]}s`);
            result.push(`00:00:${twoDigits(userArray[i])}`);
            result.push(parseInt(userArray[i]).toString());
            i+=1;
            break;
        }
      } else if (userArray[i] === "0" && (i + 2) < userArray.length && !!userArray[i + 2].trim().match(/^([1-9]|[1-3][0-9]) \w+ \d{4} \d{2}:\d{2}$/g)) {
        result.push(userArray[i]);
        result.push("00:00:00");
        result.push("0");
      } else {
        result.push(userArray[i]);
      }
    }
  }

  // result.splice(0, 0, "Date");
  // result.splice(1, 0, "Utilisateurs");
  // result.splice(2, 0, "Temps total");
  result.splice(3, 0, result[2]);
  // result.splice(4, 0, "Temps en secondes");
  // result.splice(5, 0, "Pages visitées");

  return result;
};

const formatCSV = (data) => {

  return data
    .reduce((acc, curr, i) => {
      if ((i + 1) % 6 === 0) {
        acc.push(curr + '\n');
      } else {
        acc.push(curr + ';');
      }
      return acc;
    }, [])
    .join('');
}

function copyFile() {
  const userArray = extractUserLogInfo();
  const userCSV = formatCSV(userArray);

  // const blob = new Blob([""], {
  //   type: "text/csv;charset=utf-8;"
  // });

  // const url = URL.createObjectURL(blob);
  // var link = document.createElement("a");
  // link.setAttribute("href", url);
  // link.setAttribute("download", `mylink_stats_${new Date().toLocaleDateString()}.xlsx`);
  // document.body.appendChild(link);
  // link.click();
  // document.body.removeChild(link);
  navigator.clipboard.writeText(userCSV);
  alert("Texte copié, collez-le dans un fichier .csv ou attendez le téléchargement du fichier.");
};