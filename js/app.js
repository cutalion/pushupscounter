if('serviceWorker' in navigator) {
  console.log('serviceWorker available');
  navigator.serviceWorker.register('/pushupscounter/sw.js');
  console.log('serviceWorker registered');
} else {
  console.log('serviceWorker is not supported');
}

document.addEventListener('DOMContentLoaded', (e) => {
  var counter = document.getElementById('counter');
  var count   = document.getElementById('count');
  var plus    = document.getElementById('plus');
  var minus   = document.getElementById('minus');

  plus.addEventListener('click', (e) => {
    let total = parseInt(counter.innerText)
    let amount = parseInt(count.value)

    if (isNaN(amount)) {
      console.log('Amount is NaN');
      return;
    }

    counter.innerText = total + amount;
  })

  minus.addEventListener('click', (e) => {
    let total = parseInt(counter.innerText)
    let amount = parseInt(count.value)

    if (isNaN(amount)) {
      console.log('Amount is NaN');
      return;
    }

    let result = total - amount
    counter.innerText = result < 0 ? 0 : result;
  })
});
