import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import NewApiServise from './news-servise';
import makeCard from './template/makeCard.hbs';

const searchForm = document.querySelector('#search-form');
const saerchButton = searchForm.querySelector('button');
const inputEl = searchForm.querySelector('input');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const newApiServise = new NewApiServise();

loadMoreBtn.classList.add('is-hidden');
searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();
  clearHitsContainer();
  loadMoreBtn.classList.add('is-hidden');

  newApiServise.query = inputEl.value;

  if (newApiServise.query.trim() === '') {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  newApiServise.resetPage();
  await newApiServise.fetchArticles().then(hits => {
    if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    console.log(newApiServise.totalP);
    console.log(newApiServise.totalHits);

    clearHitsContainer();
    appendHitsCard(hits);
    loadMoreBtn.classList.remove('is-hidden');

    searchForm.reset();
  });
}
// console.log(newApiServise.pages);

async function onLoadMore() {
  await newApiServise.fetchArticles().then(appendHitsCard);
}

function appendHitsCard(hits) {
  galleryEl.insertAdjacentHTML('beforeend', makeCard(hits));
  new SimpleLightbox('.gallery a', {
    captionDelay: 250,
    captionPosition: 'bottom',
    captionsData: 'alt',
    navText: ['<~', '~>'],
  });
}

function clearHitsContainer() {
  galleryEl.innerHTML = '';
}
