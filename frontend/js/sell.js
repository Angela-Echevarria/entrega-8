const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";

let productCost = 0;
let productCount = 0;
let comissionPercentage = 0.13;
let MONEY_SYMBOL = "$";
let DOLLAR_CURRENCY = "Dólares (USD)";
let PESO_CURRENCY = "Pesos Uruguayos (UYU)";
let DOLLAR_SYMBOL = "USD ";
let PESO_SYMBOL = "UYU ";
let PERCENTAGE_SYMBOL = '%';
let MSG = "FUNCIONALIDAD NO IMPLEMENTADA";

// Actualizar costos de publicación
const updateTotalCosts = () => {
  const unitProductCostHTML = document.getElementById("productCostText");
  const comissionCostHTML = document.getElementById("comissionText");
  const totalCostHTML = document.getElementById("totalCostText");

  const unitCostToShow = MONEY_SYMBOL + productCost;
  const comissionToShow = Math.round((comissionPercentage * 100)) + PERCENTAGE_SYMBOL;
  const totalCostToShow = MONEY_SYMBOL + ((Math.round(productCost * comissionPercentage * 100) / 100) + parseInt(productCost));

  unitProductCostHTML.innerHTML = unitCostToShow;
  comissionCostHTML.innerHTML = comissionToShow;
  totalCostHTML.innerHTML = totalCostToShow;
};

document.addEventListener("DOMContentLoaded", (e) => {
  document.getElementById("productCountInput").addEventListener("change", function() {
    productCount = this.value;
    updateTotalCosts();
  });

  document.getElementById("productCostInput").addEventListener("change", function() {
    productCost = this.value;
    updateTotalCosts();
  });

  document.getElementById("goldradio").addEventListener("change", () => {
    comissionPercentage = 0.13;
    updateTotalCosts();
  });

  document.getElementById("premiumradio").addEventListener("change", () => {
    comissionPercentage = 0.07;
    updateTotalCosts();
  });

  document.getElementById("standardradio").addEventListener("change", () => {
    comissionPercentage = 0.03;
    updateTotalCosts();
  });

  document.getElementById("productCurrency").addEventListener("change", function() {
    if (this.value == DOLLAR_CURRENCY) {
      MONEY_SYMBOL = DOLLAR_SYMBOL;
    } else if (this.value == PESO_CURRENCY) {
      MONEY_SYMBOL = PESO_SYMBOL;
    }
    updateTotalCosts();
  });

  // Configuración Dropzone
  const dzoptions = {
    url: "/",
    autoQueue: false
  };
  const myDropzone = new Dropzone("div#file-upload", dzoptions);

  // Formulario de publicación
  const sellForm = document.getElementById("sell-info");

  sellForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const productNameInput = document.getElementById("productName");
    const productCategory = document.getElementById("productCategory");
    const productCost = document.getElementById("productCostInput");
    let infoMissing = false;

    // Quitar clases inválidas
    productNameInput.classList.remove('is-invalid');
    productCategory.classList.remove('is-invalid');
    productCost.classList.remove('is-invalid');

    // Validar campos
    if (productNameInput.value === "") {
      productNameInput.classList.add('is-invalid');
      infoMissing = true;
    }

    if (productCategory.value === "") {
      productCategory.classList.add('is-invalid');
      infoMissing = true;
    }

    if (productCost.value <= 0) {
      productCost.classList.add('is-invalid');
      infoMissing = true;
    }

    if (!infoMissing) {
      getJSONData(PUBLISH_PRODUCT_URL).then(resultObj => {
        const msgToShowHTML = document.getElementById("resultSpan");
        let msgToShow = "";

        if (resultObj.status === 'ok') {
          msgToShow = MSG;
          document.getElementById("alertResult").classList.add('alert-primary');
        } else if (resultObj.status === 'error') {
          msgToShow = MSG;
          document.getElementById("alertResult").classList.add('alert-primary');
        }

        msgToShowHTML.innerHTML = msgToShow;
        document.getElementById("alertResult").classList.add("show");
      });
    }
  });
});
