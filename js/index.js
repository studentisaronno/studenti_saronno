// User data
fetch("/api/user")
    .then((res) => res.json())
    .then((user) => {
        if (user) {
            document.getElementById("user-img").src = user.picture;
        } else {
            document.getElementById("user-img").src = "../svgs/user.svg";
        }
    });
