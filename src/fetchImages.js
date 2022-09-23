import axios from "axios"

// let searchQuery = '';
let page = 1;
async function fetchImages(searchQuery) {
    const { data } = await axios.get(`https://pixabay.com/api/?key=30087665-92eb3edde2a629aded169ee28&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
    incrementPage();
    return data;
}



function incrementPage() {
    page += 1;
}
function resetPage() {
    page = 1;
}
export { fetchImages,resetPage };