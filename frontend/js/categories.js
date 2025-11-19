const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";

const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";

let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

function sortCategories(criteria, array) {
  let result = [];
  
  if (criteria === ORDER_ASC_BY_NAME) {
    result = array.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  } else if (criteria === ORDER_DESC_BY_NAME) {
    result = array.sort((a, b) => {
      if (a.name > b.name) return -1;
      if (a.name < b.name) return 1;
      return 0;
    });
  } else if (criteria === ORDER_BY_PROD_COUNT) {
    result = array.sort((a, b) => {
      const aCount = parseInt(a.productCount);
      const bCount = parseInt(b.productCount);
      if (aCount > bCount) return -1;
      if (aCount < bCount) return 1;
      return 0;
    });
  }

  return result;
}

function setCatID(id) {
  localStorage.setItem("catID", id);
  window.location = "products.html";
}

function showCategoriesList() {
  let htmlContentToAppend = "";
  
  for (let i = 0; i < currentCategoriesArray.length; i++) {
    const category = currentCategoriesArray[i];
    const count = parseInt(category.productCount);
    const cumpleMin = minCount == undefined || count >= minCount;
    const cumpleMax = maxCount == undefined || count <= maxCount;

    if (cumpleMin && cumpleMax) {
      htmlContentToAppend += `
        <div onclick="setCatID(${category.id})" class="list-group-item list-group-item-action cursor-active">
          <div class="row">
            <div class="col-3">
              <img src="${category.imgSrc}" alt="${category.description}" class="img-thumbnail">
            </div>
            <div class="col">
              <div class="d-flex w-100 justify-content-between">
                <h4 class="mb-1">${category.name}</h4>
                <small class="text-muted">${category.productCount} artículos</small>
              </div>
              <p class="mb-1">${category.description}</p>
            </div>
          </div>
        </div>
      `;
    }
  }

  document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
}

function sortAndShowCategories(sortCriteria, categoriesArray) {
  currentSortCriteria = sortCriteria;

  if (categoriesArray != undefined) {
    currentCategoriesArray = categoriesArray;
  }

  currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);
  showCategoriesList();
}

document.addEventListener("DOMContentLoaded", (e) => {
  getJSONData(CATEGORIES_URL).then(resultObj => {
    if (resultObj.status === "ok") {
      currentCategoriesArray = resultObj.data;
      showCategoriesList();
    }
  });

  document.getElementById("sortAsc").addEventListener("click", () => {
    sortAndShowCategories(ORDER_ASC_BY_NAME);
  });

  document.getElementById("sortDesc").addEventListener("click", () => {
    sortAndShowCategories(ORDER_DESC_BY_NAME);
  });

  document.getElementById("sortByCount").addEventListener("click", () => {
    sortAndShowCategories(ORDER_BY_PROD_COUNT);
  });

  document.getElementById("clearRangeFilter").addEventListener("click", () => {
    document.getElementById("rangeFilterCountMin").value = "";
    document.getElementById("rangeFilterCountMax").value = "";
    minCount = undefined;
    maxCount = undefined;
    showCategoriesList();
  });

  document.getElementById("rangeFilterCount").addEventListener("click", () => {
    const minValue = document.getElementById("rangeFilterCountMin").value;
    const maxValue = document.getElementById("rangeFilterCountMax").value;

    if (minValue != undefined && minValue != "" && parseInt(minValue) >= 0) {
      minCount = parseInt(minValue);
    } else {
      minCount = undefined;
    }

    if (maxValue != undefined && maxValue != "" && parseInt(maxValue) >= 0) {
      maxCount = parseInt(maxValue);
    } else {
      maxCount = undefined;
    }

    showCategoriesList();
  });
});
