async function windowActions() {
  const endpoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';
  const request = await fetch(endpoint);
  const cities = await request.json();
  const searchInput = document.querySelector('.search');
  const suggestions = document.querySelector('#search-result');
  let storematchArray = [];
  console.log(cities);
  const mymap = L.map('mapid').setView([38.89, -77.04], 10);
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoic2Ftc29uam9zZXBoMjUiLCJhIjoiY2t1b2Y0OGoxMDRvZjJva2IzYzVlemJ6dSJ9.jkhey_GJUGycclVWyny8JA'
  }).addTo(mymap);

  // fetch(endpoint)
  //   .then((blob) => blob.json())
  //   .then((data) => cities.push(...data));

  function findMatches(wordToMatch, cities) {
    return cities.filter((place) => {
      console.log(place);
      const regex = new RegExp(wordToMatch, 'gi');
      return place.city.match(regex) || place.zip.match(regex);
    });
  }

  // function numberWithCommas(x) {
  //   return x.toString().replace(/\B(?=(\d{3}) + (?!\d))/g, ',');
  // }

  function displayMatches(event) {
    console.log('match val', event.value);
    let matchArray = findMatches(event.target.value, cities);
    matchArray = matchArray.slice(0, 5);
    const html = matchArray.map(
      (search) => `<li><span class='restaurant'>
        ${search.name}
        <br>${search.category}
            <br>${search.address_line_1}
            <br>${search.city}
            <br>${search.zip}<br>
            </span></li>`
    ).join('');
    suggestions.innerHTML = html;
    console.log('matches', matchArray);
    storematchArray = matchArray;
  }

  function reveal() {
    map(storematchArray);
  }

  function control(e) {
    if (e.keyCode === 13) {
      reveal();
    }
  }

  function map(matchArray) {
    let count = 0;
    mymap.eachLayer(Layer => {
      if (Layer._latlng !== undefined) {
        Layer.remove();
      }
    });
    matchArray.forEach(element => {
      const long = element.geocoded_column_1.coordinates[0];
      const lat = element.geocoded_column_1.coordinates[1];
      if (count === 0) {
        mymap.panTo([lat, long]);
      }
      count++;
      L.marker([lat, long]).addTo(mymap);
    });
    // L.marker([coordArray[0][1], coordArray[0][0]]).addTo(mymap);
    // L.marker([coordArray[0][2], coordArray[0][1]]).addTo(mymap);
  }

  document.addEventListener('keyup', control);
  Click = document.querySelector('.Submit');
  Click.addEventListener('click', reveal);
  searchInput.addEventListener('change', displayMatches);
  searchInput.addEventListener('keyup', (evt) => {
    if (searchInput.value === '' || searchInput.value === undefined) {
      suggestions.innerHTML = 0;
      storematchArray = [];
      suggestions.innerHTML = 'No results were found';
    } else {
      displayMatches(evt);
    }
    Click.addEventListener('click', reveal);
  });
}

window.onload = windowActions;