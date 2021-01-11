let allPosts = [];
let myPosts = [];
let currentId;
var user_email;

function showInfo() {
    document.getElementById("posts-section").style.display = "none";
    document.getElementById("addButton").style.display = "none";
    document.getElementById("info-section").style.display = "inline-block";
    document.getElementById("info-button").style.backgroundColor =
        "rgba(94, 35, 35, 0.327)";
    document.getElementById("posts-button").style.backgroundColor =
        "transparent";
}

function showPersonalPosts() {
    document.getElementById("info-section").style.display = "none";
    document.getElementById("posts-section").style.display = "grid";

    for (post of document.getElementById("posts-section").childNodes) {
        post.style.width = "100%";
        post.style.height = "100%";
    }
    document.getElementById("addButton").style.display = "inline-block";
    document.getElementById("info-button").style.backgroundColor =
        "transparent";
    document.getElementById("posts-button").style.backgroundColor =
        "rgba(94, 35, 35, 0.327)";
}

function signup() {
    let details = {
        email: document.getElementById("email-signup").value,
        password: document.getElementById("pass-signup").value,
    };
    if (details["password"] != document.getElementById("repass-signup").value) {
        alert("Password not match!");
    } else if (!document.getElementById("accept").checked) {
        alert("You should accept user agrement.");
    } else {
        let formBody = [];
        for (var property in details) {
            formBody.push(
                encodeURIComponent(property) +
                    "=" +
                    encodeURIComponent(details[property])
            );
        }
        let http = new XMLHttpRequest();
        let url = "api/signup";
        let params = formBody.join("&");
        http.open("POST", url, true);
        http.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
        );
        http.send(params);
        http.onreadystatechange = function () {
            if (http.readyState == 4) {
                if (http.status != 201) {
                    alert(JSON.parse(http.responseText)["message"]);
                } else {
                    window.location.pathname = "./index.html";
                    getPersonalPosts();
                }
            }
        };
    }
}

function signin() {
    let details = {
        email: document.getElementById("email-signin").value,
        password: document.getElementById("pass-signin").value,
    };
    let formBody = [];
    for (var property in details) {
        formBody.push(
            encodeURIComponent(property) +
                "=" +
                encodeURIComponent(details[property])
        );
    }
    console.log(details);
    let http = new XMLHttpRequest();
    let url = "api/signin";
    let params = formBody.join("&");
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send(params);
    http.onreadystatechange = function () {
        if (http.readyState == 4) {
            if (http.status != 201) {
                alert(JSON.parse(http.responseText)["message"]);
            } else {
                //user_email = details["email"];
                localStorage.setItem("user_email", details["email"]);
                window.location.pathname = "./dashboard.html";      
                getPersonalPosts();
            }
        }
    };
}

function signout() {
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        let eqPos = cookie.indexOf("=");
        let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    window.location.pathname = "./index.html";
}

function getPersonalPosts() {
    document.getElementById("user-email").placeholder = window.localStorage.getItem("user_email");
    let http = new XMLHttpRequest();
    let url = "api/admin/post/crud";
    http.open("GET", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send();
    http.onreadystatechange = function () {
        if (http.readyState == 4) {
            if (http.status != 200) {
                alert(JSON.parse(http.responseText)["message"]);
            } else {
                myPosts = JSON.parse(http.responseText)["posts"];
                getThisUserPosts();
            }
        }
    };
}

function getThisUserPosts() {
    let postsPart = document.getElementById("posts-section");
    postsPart.innerHTML = "";
    for (let post of myPosts) {
        addPostOnScreen(post.title, post.content, post.id);
    }
}

function addPost() {
    let title = document.getElementById("recipient-name").value;
    let content = document.getElementById("message-text").value;
    let details = {
        title: title,
        content: content,
    };
    let formBody = [];
    for (var property in details) {
        formBody.push(
            encodeURIComponent(property) +
                "=" +
                encodeURIComponent(details[property])
        );
    }
    let http = new XMLHttpRequest();
    let url = "api/admin/post/crud";
    let params = formBody.join("&");
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send(params);
    http.onreadystatechange = function () {
        if (http.readyState == 4) {
            if (http.status != 201) {
                alert(JSON.parse(http.responseText)["message"]);
            } else {
                addPostOnScreen(
                    title,
                    content,
                    JSON.parse(http.responseText)["id"]
                );
            }
        }
    };
}

function addPostOnScreen(title, content, id) {
    let postsPart = document.getElementById("posts-section");
    postsPart.innerHTML += `<div card-id="${id}" class="card">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${content}</p>
            <span>
            <ion-icon onclick="updateCurrentId(this)" name="trash" type="button" data-toggle="modal" data-target="#deletePost"></ion-icon>
            <ion-icon onclick="updateCurrentId(this)" name="pencil" type="button" data-toggle="modal" data-target="#editPost"></ion-icon>
            </span>
          </div>
    </div>`;
}

function addHomePost(title, content) {
    let postsPart = document.getElementById("homePostsSection");
    let mainSection = postsPart.parentNode;
    mainSection.style.marginRight = "0";
    postsPart.innerHTML += `
      <div class="card">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${content}</p>
          </div>
        </div>
`;
}

function getHomePosts() {
    let http = new XMLHttpRequest();
    let url = "api/post/";
    http.open("GET", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send(null);
    http.onreadystatechange = function () {
        if (http.readyState == 4) {
            if (http.status != 200) {
                alert(JSON.parse(http.responseText)["message"]);
            } else {
                allPosts = JSON.parse(http.responseText)["posts"];
                for (var post of allPosts) {
                    addHomePost(post.title, post.content);
                }
            }
        }
    };
}

function updateCurrentId(element) {
    let post = element.parentNode.parentNode;
    currentId = post.getAttribute("card-id");
    console.log(currentId);
}

function editPost() {
    let http = new XMLHttpRequest();
    let url = `api/admin/post/crud/${currentId}`;
    let request = {
        title: document.getElementById("recipient-name2").value,
        content: document.getElementById("message-text2").value,
    };
    let formBody = [];
    for (var property in request) {
        formBody.push(
            encodeURIComponent(property) +
                "=" +
                encodeURIComponent(request[property])
        );
    }
    let params = formBody.join("&");
    http.open("PUT", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send(params);
    http.onreadystatechange = function () {
        if (http.readyState == 4) {
            if (http.status != 204) {
                alert(JSON.parse(http.responseText)["message"]);
            } else {
                window.location.pathname = "./dashboard.html";
                window.location.reload();
            }
        }
    };
}

function deletePost() {
    let http = new XMLHttpRequest();
    let url = `/api/admin/post/crud/${currentId}`;
    http.open("DELETE", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send(null);
    http.onreadystatechange = function () {
        if (http.readyState == 4) {
            if (http.status != 204) {
                console.log(http.responseText);
                alert(JSON.parse(http.responseText)["message"]);
            } else {
                window.location.pathname = "./dashboard.html";
                deletePostFromScreen();
            }
        }
    };
}

function deletePostFromScreen() {
    postsSections = document.getElementById("posts-section");
    posts = document.getElementById("posts-section").childNodes;
    let i = 0;
    console.log(postsSections);
    for (let p of posts) {
        id = p.getAttribute("card-id");
        console.log(p);
        console.log(id);
        if (id == currentId) {
            postsSections.removeChild(posts[i]);
            return;
        }
        i++;
    }
}
