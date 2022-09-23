import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import { fetchImages, resetPage } from "./fetchImages";
import LoadMoreBtn from "./onLoadMoreBtn";


const searchForm = document.querySelector('.search-form');

const input = document.querySelector('input');
const btnSubmit = document.querySelector('button');
const galleryItems = document.querySelector('.gallery');
// const btnLoadMore = document.querySelector(".load-more");

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});


searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchButtonOnLoadMore)

let searchQuery = ''; 

function onSearch(e) {
    e.preventDefault();
    
  searchQuery = e.currentTarget.elements.searchQuery.value;
  
 if (searchQuery === '') {
    clearContainer();
    Notiflix.Notify.warning('Please, fill in the input field!');
    return;
  }
 
 loadMoreBtn.show();
  resetPage();
  clearContainer();
  fetchButtonOnLoadMore();
    
    }
 

function renderMarkUp(r) {
 
   const markUp = r["hits"].map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => 
   `<div class="photo-card">
    <a class="gallery__item" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
  <p class="info-item">
      <b>Likes
      <span class="likes">${likes}</span>
      </b>
    </p>
    <p class="info-item">
      <b>Views
      <span class="views">${views}</span>
      </b>
    </p>
    <p class="info-item">
      <b>Comments
      <span class="comments">${comments}</span>
      </b>
    </p>
    <p class="info-item">
      <b>Downloads
      <span class="downloads">${downloads}</span>
      </b>
    </p>
  </div>
</div>

`
).join('');
       galleryItems.insertAdjacentHTML('beforeend', markUp);

      new SimpleLightbox('.gallery a', {
captionDelay: 250,
      });
      
}


function clearContainer() {
  galleryItems.innerHTML = '';
}

function fetchButtonOnLoadMore() {
  loadMoreBtn.disable();
  fetchImages(searchQuery).then(r => {
    if (r["hits"].length === 0) {
      loadMoreBtn.hide();
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }
    // if (r["hits"].length === r.totalHits.length - 1) {
    //   loadMoreBtn.disable();
    //   Notiflix.Notify.failure('Were sorry, but youve reached the end of search results.');
    //   return;
    // }
  renderMarkUp(r)
  loadMoreBtn.enable()
} ).catch(err => console.log(err));;
}

