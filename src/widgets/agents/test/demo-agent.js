onmessage = function (event) {
  console.log('Message received from main script:', event.data);
  const result = event.data[0] * event.data[1]; // Example: multiply two numbers
  postMessage(result); // Send result back to the main script
};
