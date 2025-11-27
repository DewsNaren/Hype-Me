(function () {
  const publicPages = [
    '', 'index.html','product-detail.html','product-list.html'
  ];

  const current = location.pathname.split('/').pop();

  const token = localStorage.getItem("token");


  if (!publicPages.includes(current) && !token) {
    document.write(`<meta http-equiv="refresh" content="0;url=index.html">`);
  }

  window.addEventListener("storage", (e) => {
    if (e.key === 'token' && !e.newValue) {
      location.replace("index.html");
    }
  });
})();


