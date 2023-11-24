let extensionExecuted = false;

async function replaceDiscountPrices() {

  if (extensionExecuted) {
    return;
  }

    // Sayfadaki çevrilmesini istediğin kısımların <div> elementlerini seç
    const discountOriginalPrice = document.querySelectorAll('.discount_original_price');
    const discountElements = document.querySelectorAll('.discount_final_price');
    const gameAreaDlcPrice = document.querySelectorAll('.game_area_dlc_price');
    const price = document.querySelectorAll('.price');

    const exchangeRate = await getExchangeRate();
    
    discountElements.forEach((element) => {        
        element.textContent = changeText(element.textContent, exchangeRate)
    });
    discountOriginalPrice.forEach((element) => {        
      element.textContent = changeText(element.textContent, exchangeRate)      
    });
    price.forEach((element) => {        
      element.textContent = changeText(element.textContent, exchangeRate)      
    });
    gameAreaDlcPrice.forEach((element) => {

      if (element.querySelectorAll('.discount_prices').length==0) 
        return;
    
      element.textContent = changeText(element.textContent, exchangeRate);
    
    });

    extensionExecuted = true;
  }

  function changeText( originalContent, exchangeRate) {
    const matches = originalContent.match(/(\D+)([\d.]+)/);
      if (matches && matches.length === 3) {
        const currencySymbol = '₺';
        const amount = parseFloat(matches[2]);
        if (!isNaN(amount)) {
          const convertedAmount = (amount * exchangeRate).toFixed(2);
          const convertedContent = currencySymbol + ' ' + convertedAmount + ' TL';
          return convertedContent;
        }
      }
      return originalContent;
  }

  async function getExchangeRate() {
    const apiKey = ''; 
    try {
      const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
      if (!response.ok) {
        throw new Error('Unable to get exchange rate: ' + response.status);
      }
  
      const data = await response.json();
      const exchangeRate = data.conversion_rates.TRY;
      
      return exchangeRate;
    } catch (error) {
      console.error('Unable to get exchange rate:', error.message);
      return null;
    }
  }

replaceDiscountPrices();

var observer = new MutationObserver(replaceDiscountPrices);
observer.observe(document.body, { subtree: false, childList: true });