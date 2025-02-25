
//MNHN27jZKmzmaRYsX71DOei8e8Xj3TFXqRZFCg6W - codice personale
// sXypXBTu3UnfWhDfqZ6HKxVx2ckxgm4drQzfc2BB - codice musa
// https://api.nasa.gov/planetary/apod?date=today&api_key=MNHN27jZKmzmaRYsX71DOei8e8Xj3TFXqRZFCg6W


// DEFINAMO LE DATE IN MODO VARIABILE
let apiKey = 'MNHN27jZKmzmaRYsX71DOei8e8Xj3TFXqRZFCg6W'

let ready = Date.now();
let finish = convertMills(10);
function convertMills(number) {
    return ready - (number * 24 * 60 * 60 * 1000);
}

function checkCreate (millis) {
    let dating = new Date (millis);
    let [year, month, day] = [dating.getFullYear(), dating.getMonth() + 1, dating.getDate()];
    return `${year}-${month}-${day}`;
}

let start = checkCreate(finish);
let end = checkCreate(ready);


// let startDate = new date(ready);

// definiamo alcuni selettori
let Main = document.querySelector('.hero');
let picturesContain = document.querySelector('.containers');
let svuota = document.querySelector('.loading');
let svuota2 = document.querySelector('.loading2');

let url = `https://api.nasa.gov/planetary/apod?start_date=${start}&end_date=${end}&api_key=${apiKey}&thumbs=true`;
// let url = `mock/mock.json`;


let fetch1 = () => {
    let promise = fetch(url)
    .then(res => res.json())
    return promise;
}

let fetch2 = fetch1()
    .then(parameter => {
        // console.log(parameter)
        createToday(parameter.at(-1));
        createOTher(parameter.reverse().slice(1));
        
    })  

let createToday = (parameter) => {
    // console.log(parameter)
        svuota.innerHTML = '';

        //creo l'immagine di copertina
        let boxPrimary = document.querySelector('.primary');
        let newImg = document.createElement('img');

        if (parameter.media_type === 'video') {
            newImg.src = parameter.thumbnail_url;
        } else {
            newImg.src = parameter.url;
        }

        boxPrimary.append(newImg);
    
        //creo testo di fianco immagine
        let boxDiv = document.createElement('div');
        boxDiv.classList.add('hero-text');
        let newTitle = document.createElement('h3');
        newTitle.textContent = parameter.title;
        let newDescription = document.createElement('p');
        newDescription.textContent = parameter.explanation;
        let newCopyright = document.createElement('cite');
        newCopyright.textContent = parameter.copyright;
    
        boxDiv.append(newTitle, newDescription, newCopyright);
        boxPrimary.append(boxDiv);
}

let createOTher = (parameters) => {
    // console.log(parameters);
    svuota2.innerHTML = '';

    parameters.map(parameter => {
        let imgContainer = document.createElement('div');
        imgContainer.classList.add('container-image')
        let newImg = document.createElement('img');

        if (parameter.media_type === 'video') {
            newImg.src = parameter.thumbnail_url;
        } else {
            newImg.src = parameter.url;
        }
        imgContainer.append(newImg);
        picturesContain.append(imgContainer);

        imgContainer.addEventListener('click', () => {
            showModale(parameter);
        })
    }

    
)}


let showModale = (picture) => {
    
    let adverting = document.querySelector('.popupContainer');
    let closed = document.querySelector('.close');
    let modaleTitle = document.querySelector('.details-title');
    let modaleImg = document.querySelector('.details-img');
    let modaleDescription = document.querySelector('.details-description');
    let modaleCopyright = document.querySelector('.details-copy');

    modaleTitle.textContent = picture.title;
    modaleImg.src = picture.url;
    modaleDescription.textContent = picture.explanation;
    modaleCopyright.textContent = picture.copyright;

    adverting.style.display = "flex";

    closed.addEventListener('click', () => {
        adverting.style.display = "none";
    })
    window.addEventListener('click', (e) => {
        // console.log(e.target)
        if (e.target == adverting) {
            adverting.style.display = "none";
            
        }
    })
    window.addEventListener('keydown', (e) => {
        // console.log(e)
        if (e.key === 'Escape') {
            adverting.style.display = "none";
        }
        
    })

}



// DATI DI MARTE

let curiosityData = `https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json`;


let fetchCuriosityData = () => {
    let data = fetch(curiosityData)
    .then(res => res.json())
    .then(data => data.soles)
    
    return data;
}

fetchCuriosityData().then(
    res => {
        let marsWeatherData = [];
        for(let i = 0; i < 250; i++) {
            marsWeatherData.push(res[i])
        }
        return marsWeatherData;
    }
)
.then(data => {
    // console.log(data);
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(() => {myChart(data)});
    
    let today = data[0];
    document.querySelector('#mars-today').innerHTML = `
    <h2>Curiosity of today </h2>
    <p>This is my <em>${today.sol}</em> Martian day </p>
    <p>Today weather is ${today.atmo_opacity}!</p>
    `
})


let myChart = (weatherData) => {
    let formattedData = weatherData.map(data => {
        return [data.sol, +data.min_temp, +data.max_temp]
    })
    // console.log(formattedData)

    // let chartData = google.visualization.arrayToDataTable([
    // ['Date', 'Min', 'max']
    // ]);
    let chartData = [
    ['Date', 'Min', 'max']
    ];

    formattedData = formattedData.reverse();
    for(let data of formattedData) {
        chartData.push(data);
    }

    console.log(chartData);

    let finalData = new google.visualization.arrayToDataTable(chartData);

    let options = {
        title: 'Mars weather data',
        curveType: 'function',
        hAxis: {
            title: 'Soles'
        },
        vAxis: {
            title: 'Temp (Celsius)'
        },
        legend: { position: 'bottom' }
    };

    let chart = new google.visualization.LineChart(document.getElementById('mars-data'));
    chart.draw(finalData, options);

}


