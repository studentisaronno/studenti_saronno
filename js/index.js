var headerPath =
    window.location.pathname === "/" ? "./html/header.html" : "header.html";
var footerPath =
    window.location.pathname === "/index.html"
        ? "./html/footer.html"
        : "footer.html";

console.log(window.location.pathname);

// const headerPath = "./html/header.html";
// const footerPath = "./html/footer.html";

var header = fetch(headerPath)
    .then((response) => response.text())
    .then((data) => {
        document.getElementById("header").innerHTML = data;
    });

var footer = fetch(footerPath)
    .then((response) => response.text())
    .then((data) => {
        document.getElementById("footer").innerHTML = data;
    });

Promise.all([header, footer])
    .then(() => {
        console.log("Header e Footer caricati con successo!");
    })
    .catch((error) => {
        console.error("Errore nel caricamento di Header o Footer:", error);
    });

console.log(window.location.pathname);

fetch("/api/user")
    .then((res) => res.json())
    .then((user) => {

        if (!user) return;

        document.getElementById("user-img").src = user.picture;
        console.log(user);
    });
