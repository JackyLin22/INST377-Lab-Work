async function windowActions() {
  const endpoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';
  const request = await fetch(endpoint);
  const cities = await request.json();
  const searchInput = document.querySelector('.search');
  const suggestions = document.querySelector('#search-result');

  fetch(endpoint)
    .then((blob) => blob.json())
    .then((data) => cities.push(...data));

  function findMatches(wordToMatch, cities) {
    return cities.filter((place) => {
      const regex = new RegExp(wordToMatch, 'gi');
      return place.city.match(regex) || place.state.match(regex);
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