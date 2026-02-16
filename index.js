/* Questa è un riga di test scritta da Elisa per far vedere ad Alessia come funziona Git */

if (window.location.pathname === '/index.html') {

    fetch('./header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
        });

    fetch('./footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        });
} else {
    fetch('../header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
        });

    fetch('../footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        });

    }
    
console.log(window.location.pathname);