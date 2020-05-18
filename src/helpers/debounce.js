function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const args = arguments;
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      timeout = null;
      if (!immediate) {
        func.apply(this, args);
      }
    }, wait);

    if (callNow) func.apply(this, args);
  };
}
export default debounce;
