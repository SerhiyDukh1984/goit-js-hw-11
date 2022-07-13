const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '28585306-e4853ffc00a22ab5f0bd1fbb4';

export default class NewApiServise {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.total = 0;
    this.pages = this.totalhits / 40;
  }

  fetchArticles() {
    const URL = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;

    return fetch(URL)
      .then(response => response.json())
      .then(({ hits }) => {
        this.page += 1;
        this.total += hits.length;

        return hits;
      });
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  resetPage() {
    this.page = 1;
    this.total = 0;
  }
}

// .then(data => {
//         this.totalPages = Math.ceil(data.totalHits / 40);
//         this.totalHits = data.totalHits;

//         return data.hits;
//       })
