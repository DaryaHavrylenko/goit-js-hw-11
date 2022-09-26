import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import { fetchImages, resetPage } from "./fetchImagesAPI";
import LoadMoreBtn from "./onLoadMoreBtn";

let searchQuery = ''; 


let per_page = 40;
let page = 1;
let totalHits;


let ligthBox = new SimpleLightbox('.gallery a', {
captionDelay: 250,
});
      
const searchForm = document.querySelector('.search-form');
const input = document.querySelector('input');
const btnSubmit = document.querySelector('button');
const galleryItems = document.querySelector('.gallery');


const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});


searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onClickLoadMore)



function onSearch(e) {
    e.preventDefault();
    
  searchQuery = e.currentTarget.elements.searchQuery.value;
  
 if (searchQuery === '') {
   clearContainer();
   loadMoreBtn.hide();
    Notiflix.Notify.warning('Please, fill in the input field!');
    return;
  }

 loadMoreBtn.show();
  resetPage();
  clearContainer();
  onSubmit();
 
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
      <b> Comments
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


  ligthBox.refresh();
      
}

function onSubmit() {
   
  loadMoreBtn.disable();
  fetchImages(searchQuery).then(r => {
     if (r.total === 0) {
      loadMoreBtn.hide();
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }
      if (r.hits.length === 0) {
      loadMoreBtn.hide();
    Notiflix.Notify.info(
          `We're sorry, but you've reached the end of search results`
        );
        return;
    }

    let delta = Math.ceil(r.totalHits / per_page);
    
    if (page === delta) {
   loadMoreBtn.hide();
 Notiflix.Notify.info(
          `We're sorry, but you've reached the end of search results`
        );
    }

  renderMarkUp(r)
    loadMoreBtn.enable()
   
} ).catch(err => console.log(err));;
}


function clearContainer() {
  galleryItems.innerHTML = '';
}

async function onClickLoadMore() {
  page += 1;
  const r = await fetchImages(searchQuery);

  renderMarkUp(r);
  
    delta = Math.ceil(r.totalHits / per_page);
    
    if (page === delta) {
   loadMoreBtn.hide();
 Notiflix.Notify.info(
          `We're sorry, but you've reached the end of search results`
        );
    }

}