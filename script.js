const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function showContent(page) {
  window.scrollTo({ top: 0, behavior: 'instant'});
  if (page === 'results') {
    resultsNav.classList.remove('hidden');
    favoritesNav.classList.add('hidden');
  } else {
    resultsNav.classList.add('hidden');
    favoritesNav.classList.remove('hidden');
  }
  loader.classList.add('hidden');
}

function createDOMNodes(page) {
  const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
  currentArray.forEach(result => {
    // card container
    const card = document.createElement('div');
    card.classList.add('card');
    // link
    const link = document.createElement('a');
    link.href = result.hdurl
    link.title = 'View Full Image';
    link.target = '_blank';
    // image
    const image = document.createElement('img');
    image.src = result.url;
    image.alt = 'NASA Picture of the Day';
    image.loading = 'lazy';
    image.classList.add('card-img-top');
    // add img to anchor
    link.appendChild(image);
    // add anchor to card
    card.appendChild(link);
    // card body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    // h5
    const h5 = document.createElement('h5');
    h5.classList.add('card-title');
    h5.textContent = result.title;
    // add h5 to card body
    cardBody.appendChild(h5);
    // add to favorites
    const favorite = document.createElement('p');
    favorite.classList.add('clickable');
    if (page === 'results') {
      favorite.textContent = 'Add to Favorites';
      favorite.setAttribute('onclick', `saveFavorite('${result.url}')`);
    } else {
      favorite.textContent = 'Remove Favorite';
      favorite.setAttribute('onclick', `removeFavorite('${result.url}')`);
    }
    // add favorite to card body
    cardBody.appendChild(favorite);
    // card text
    const cardText = document.createElement('p');
    cardText.classList.add('card-text');
    cardText.textContent = result.explanation;
    // add card text to card body
    cardBody.appendChild(cardText);
    // text muted
    const textMuted = document.createElement('small');
    textMuted.classList.add('text-muted');
    // strong
    const strong = document.createElement('strong');
    strong.textContent = result.date;
    // add strong to text muted
    textMuted.appendChild(strong);
    // copyright info
    if (result.copyright) {
      const copyrightInfo = document.createElement('span');
      copyrightInfo.textContent = ` ${result.copyright}`;
      // add copyright info to text muted
      textMuted.appendChild(copyrightInfo);
    }
    // add text muted to card body
    cardBody.appendChild(textMuted);
    // add card body to card
    card.appendChild(cardBody);
    // add card to images container
    imagesContainer.appendChild(card);
  });
}

function updateDOM(page) {
  // get favorites fromm localStorage
  if (localStorage.getItem('nasaFavorites')) {
    favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
  };
  imagesContainer.textContent = '';
  createDOMNodes(page);
  showContent(page);
};

// get 10 images from NASA API
async function getNasaPictures() {
  // show loader
  loader.classList.remove('hidden');
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    updateDOM('results');
  } catch(error) {
      console.log(error);
  }
};

// add result to favorites
function saveFavorite(itemUrl) {
  resultsArray.forEach(item => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      // show confirmation
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      // set favorites in localStorage
      localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    }
  })
}

// remove item from favorites
function removeFavorite(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    // set favorites in localStorage
    localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    updateDOM('favorites');
  }
}

// on load
getNasaPictures();