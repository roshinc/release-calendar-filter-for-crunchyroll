//firefox addon has a bug(?) where it can't get window
window.requestAnimationFrame = window.requestAnimationFrame.bind(window);
window.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
window.addEventListener = window.addEventListener.bind(window);