export const elements = {
    searchForm:  document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResult: document.querySelector('.results'),
    searchResultList: document.querySelector('.results__list'),
    searchResultPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
}

// separated from above, because it does not exist as element at the beginning
const elementsString = {
    loader: 'loader'  
}

export const showLoaderIndicator = (parent) => {
    const loader = `
        <div class='${elementsString.loader}'>
            <svg>
              <use href='img/icons.svg#icon-cw'></use>  
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
}

export const clearLoaderIndicator = () => {
    const loader = document.querySelector(`.${elementsString.loader}`);
    if (loader) { loader.parentElement.removeChild(loader) }
}