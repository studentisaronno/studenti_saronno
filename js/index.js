// User data
fetch("/api/user")
    .then((res) => res.json())
    .then((user) => {
        document.getElementById("user-img").src = user.picture;
    });
