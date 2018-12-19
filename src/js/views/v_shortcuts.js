export const elements = {
    searchForm:  document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResult: document.querySelector('.results'),
    searchResultList: document.querySelector('.results__list')
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
    parent.insertAdjacentHTML('afterbegin', elementsString.loader);
}

export const clearLoaderIndicator = () => {
    const loader = document.querySelector(`${elementsString.loader}`);
    if (loader) { loader.parentElement.removeChild(loader) }
}