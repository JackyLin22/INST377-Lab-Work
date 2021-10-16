async function windowActions() {
  const endpoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';
  const request = await fetch(endpoint);
  const cities = await request.json();
  const searchInput = document.querySelector('.search');
  const suggestions = document.querySelector('#search-result');
  console.log(cities);
  const mymap = L.map('mapid').setView([51.505, -0.09], 13);
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
    const matchArray = findMatches(event.target.value, cities);
    const html = matchArray.map(
      (search) => `<li><span>
        ${search.name}
        <br>${search.category}
            <br>${search.address_line_1}
            <br>${search.city}
            <br>${search.zip}<br>
            </span></li>`
    ).join('');
    suggestions.innerHTML = html;
    console.log('matches', matchArray);
  }

  searchInput.addEventListener('change', displayMatches);
  searchInput.addEventListener('keyup', (evt) => {
    if (searchInput.value === '' || searchInput.value === undefined) {
      suggestions.innerHTML = 0;
      suggestions.innerHTML = 'No results were found';
    } else {
      displayMatches(evt);
    }
  });
}

window.onload = windowActions;