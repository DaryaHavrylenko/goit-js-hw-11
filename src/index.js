import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import { fetchImages, resetPage } from "./fetchImages";


const searchForm = document.querySelector('.search-form');

const input = document.querySelector('input');

const btnSubmit = document.querySelector('button');
const galleryItems = document.querySelector('.gallery');
const btnLoadMore = document.querySelector(".load-more");

searchForm.addEventListener('submit', onSearch);
btnLoadMore.addEventListener('click', onLoadMore)



  function onSearch(e) {
    e.preventDefault();
    searchQuery = e.currentTarget.elements.searchQuery.value;
    resetPage();
    fetchImages(searchQuery).then(r => renderMarkUp(r)).catch(err => console.log(err));
    
    }
 

     function renderMarkUp(r) {
const markUp = r.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
  return `<div class="photo-card">
    <a class="gallery__item" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
  <p class="info-item">
      <b>Likes<span class="likes">${likes}</span></b>
    </p>
    <p class="info-item">
      <b>Views<span class="views">${views}</span></b>
    </p>
    <p class="info-item">
      <b>Comments<span class="comments">${comments}</span></b>
    </p>
    <p class="info-item">
      <b>Downloads<span class="downloads">${downloads}</span></b>
    </p>
  </div>
</div>`;
}).join('');
galleryItems.innerHTML = markUp;
}

function onLoadMore() {
fetchImages(searchQuery);
}


