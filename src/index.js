// import axios from 'axios';
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

  try {
    const hits = await newApiServise.fetchArticles();

    if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    console.log('tp', newApiServise.totalP);
    console.log(newApiServise.page - 1);

    clearHitsContainer();
    appendHitsCard(hits);
    loadMoreBtn.classList.remove('is-hidden');

    searchForm.reset();
  } catch (Error) {
    console.log(Error);
  }
}

async function onLoadMore() {
  try {
    const hits = await newApiServise.fetchArticles();

    if (newApiServise.totalP === newApiServise.page - 1) {
      loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.info(
        'We are sorry, but you have reached the end of search results.'
      );
    }

    appendHitsCard(hits);
  } catch (Error) {
    console.log(Error);
  }
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
