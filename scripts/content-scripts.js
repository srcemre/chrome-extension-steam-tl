let extensionExecuted = false;

const classList = [
  '.discount_final_price',
  '.discount_original_price',
  '.game_area_dlc_price',
  '.price',
  '#header_wallet_balance',
  '.account_name',
  '.game_area_purchase_game_dropdown_menu_item_text',
  '#search_suggestion_contents .match_subtitle',
  '.sale_price',
  '.normal_price',
  '.market_commodity_orders_header_promote',
  '#orders_histogram .jqplot-xaxis-tick',
  '#pricehistory .jqplot-yaxis-tick',
  '.salepreviewwidgets_StoreSalePriceBox_Wh0L8',
  '.salepreviewwidgets_StoreOriginalPrice_1EKGZ'
];

async function replaceDiscountPrices() {

  const isEnabled = (await chrome.storage.sync.get('enable')).enable ?? true
  const isSutlacMode = (await chrome.storage.sync.get('sutlac_mode')).sutlac_mode ?? false;

  var symbol = (await chrome.storage.sync.get('symbol_input')).symbol_input ?? "🍚";
  var symbolValue = (await chrome.storage.sync.get('value_input')).value_input ?? 100
  var symbolCurrency = (await chrome.storage.sync.get('currency_input')).currency_input ?? "Sütlaç";

  symbol = symbol !== "" ? symbol : "🍚";
  symbolValue = symbolValue !== "" ? symbolValue : 100;
  symbolCurrency = symbolCurrency !== "" ? symbolCurrency : "Sütlaç";

  const exchangeRate = await getExchangeRate();

  if (!isEnabled) {
    return;
  }

  var observer = new MutationObserver(() => {
    const elements = document.querySelectorAll(classList);
    if (!isSutlacMode) {

      elements.forEach((element) => {
        
    if (element.classList.contains('discount_original_price') || element.classList.contains('salepreviewwidgets_StoreOriginalPrice_1EKGZ'))
    return;

        const matches = element.textContent.match(/(\D+)([\d.]+)/);
        if (!matches || matches[1].includes("₺")) {
          return;
        }
        element.textContent = changeText(matches, exchangeRate);
      });
    } else {

      elements.forEach((element) => {

        
    if (element.classList.contains('discount_original_price') || element.classList.contains('salepreviewwidgets_StoreOriginalPrice_1EKGZ'))
    return;
  
        const matches = element.textContent.match(/(\D+)([\d.]+)/);
        if (!matches || matches[1].includes(symbol)) {
          return;
        }
        element.textContent = sutlacMode(matches, exchangeRate, symbol, symbolValue, symbolCurrency);
      });
    }

  });
  observer.observe(document.body, { subtree: true, childList: true });

}

function changeText(matches, exchangeRate) {
  if (matches && matches.length === 3) {
    const currencySymbol = '₺';
    const currencySymbolName = 'TL';
    const amount = parseFloat(matches[2]);
    if (!isNaN(amount)) {
      const convertedAmount = (amount * exchangeRate).toFixed(2);
      const convertedContent = currencySymbol + ' ' + convertedAmount + ' ' + currencySymbolName;
      return convertedContent;
    }
  }
  return matches[0];
}

function sutlacMode(matches, exchangeRate, symbol, symbolValue, symbolCurrency) {
  if (matches && matches.length === 3) {
    const currencySymbol = symbol;
    const currencySymbolName = symbolCurrency;
    const amount = parseFloat(matches[2]);
    if (!isNaN(amount)) {
      const convertedAmount = ((amount * exchangeRate) / symbolValue).toFixed(1);
      const convertedContent = currencySymbol + ' ' + convertedAmount + ' ' + symbolCurrency;
      return convertedContent;
    }
  }
  return matches[0];
}


async function getExchangeRate() {

  try {
    const response = await fetch(`https://api.binance.com/api/v1/ticker/price?symbol=USDTTRY`);
    if (!response.ok) {
      throw new Error('Unable to get exchange rate: ' + response.status);
    }

    const data = await response.json();
    exchangeRate = data.price;
    return exchangeRate;
  } catch (error) {
    console.log('Unable to get exchange rate:', error.message);
    return 0;
  }
}

replaceDiscountPrices();