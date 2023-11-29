chrome.storage.sync.get(['enable', 'sutlac_mode', 'symbol_input', 'value_input', 'currency_input'], function (result) {
    document.querySelector('#status').checked = (result.enable ?? true);
    document.querySelector('#sutlacMode').checked = (result.sutlac_mode ?? false);
    document.querySelector('#symbolInput').value = (result.symbol_input ?? "🍚");
    document.querySelector('#valueInput').value = (result.value_input ?? 100.0);
    document.querySelector('#currencyInput').value = (result.currency_input ?? 'Sütlaç');
});

document.querySelector('#status').addEventListener('change', function () {
    chrome.storage.sync.set({enable: this.checked});
});
document.querySelector('#sutlacMode').addEventListener('change', function () {
    chrome.storage.sync.set({sutlac_mode: this.checked});
});
document.getElementById("saveButton").addEventListener("click", function () {
    saveAndReload();
  });

  function saveAndReload() {
    var symbolInput = document.getElementById("symbolInput").value;
    var valueInput = document.getElementById("valueInput").value;
    var currencyInput = document.getElementById("currencyInput").value;
    
    if (parseFloat(valueInput) === 0) {
        alert("Lütfen değeri 0'dan farklı bir değer girin.");
        return;
      }

    chrome.storage.sync.set({
        symbol_input: symbolInput,
        value_input: valueInput,
        currency_input: currencyInput
      }, function () {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else {
          chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.reload(tabs[0].id);
          });
        }
      });
  }