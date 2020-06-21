let timeout;

export function stopTimer(timeoutFunction) {
  clearTimeout(timeout);
  timeoutFunction();
}

export function debounceTimer(timeoutFunction, delay) {
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeoutFunction();
    }, delay);
  };
}
