if('serviceWorker' in navigator) {
  console.log('serviceWorker available');
  navigator.serviceWorker.register('/pushupscounter/sw.js');
  console.log('serviceWorker registered');
} else {
  console.log('serviceWorker is not supported');
}
