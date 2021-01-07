function showInfo() {
    document.getElementById("posts").style.display = "none";
    document.getElementById("addButton").style.display = "none";
    document.getElementById("info").style.display = "inline-block";
}

function showPersonalPosts() {
    document.getElementById("info").style.display = "none";
    document.getElementById("posts").style.display = "inline-block";
    document.getElementById("addButton").style.display = "inline-block";
}

function signup() {
    let details = {
        "email": document.getElementById("email-signup").value,
        "password": document.getElementById("pass-signup").value,
    };
    if (details['password'] != document.getElementById("repass-signup").value) {
        alert('Password not match!')
    } else if (!document.getElementById("accept").checked) {
        alert('You should accept user agrement.');
    } else {
        let formBody = [];
        for (var property in details) {
            formBody.push(encodeURIComponent(property) + "=" + encodeURIComponent(details[property]));
        }
        let http = new XMLHttpRequest();
        let url = 'api/signup';
        let params = formBody.join("&");
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        http.send(params);
        http.onreadystatechange = function () {
            if (http.readyState == 4) {
                if (http.status != 201) {
                    alert(JSON.parse(http.responseText)['message']);
                } else {
                    getPersonalPosts()
                    window.location.pathname = './index.html'
                }
            }
        }
    }
}

function signin() {
    let details = {
        "email": document.getElementById("email-signin").value,
        "password": document.getElementById("pass-signin").value
    };
    let formBody = [];
    for (var property in details) {
        formBody.push(encodeURIComponent(property) + "=" + encodeURIComponent(details[property]));
    }
    let http = new XMLHttpRequest();
    let url = 'api/signin';
    let params = formBody.join("&");
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send(params);
    alert(2);
    http.onreadystatechange = function () {
        if (http.readyState == 4) {
            alert('ready')
            if (http.status != 201) {
                alert('here1')
                alert(JSON.parse(http.responseText)['message']);
            } else {
                alert('here3')
                getPersonalPosts();
                window.location.pathname = '/dashboard.html';
            }
        }
    }
}

function signout() {
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        let eqPos = cookie.indexOf("=");
        let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    window.location.pathname = '/index.html'
}

let posts;

function getPersonalPosts() {
    let http = new XMLHttpRequest();
    let url = 'api/admin/post/crud';
    http.open('GET', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function () {
        if (http.readyState == 4) {
            if (http.status != 200) {
                alert(JSON.parse(http.responseText)['message']);
            } else {
                posts = JSON.parse(http.responseText)['posts'];

            }
        }
    }
}

function getThisUserPosts() {
    for (var post of posts) {
        addPost(post.title, post.content)
    }
}


function addPost(title, content) {
    let postsPart = document.getElementById("postsSection")
    postsPart.innerHTML +=
        `<div class="col-sm-4" >
      <div class="card">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${content}</p>
            <ion-icon name="trash" type="button" data-toggle="modal" data-target="#deletePost"></ion-icon>
            <ion-icon name="pencil" type="button" data-toggle="modal" data-target="#editPost"></ion-icon>
          </div>
        </div>
    </div>`
}

function addHomePost(title, content) {
    let postsPart = document.getElementById("homePostsSection")
    postsPart.innerHTML +=
        `<div class="col-sm-4" >
      <div class="card">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${content}</p>
            <ion-icon name="trash" type="button" data-toggle="modal" data-target="#deletePost"></ion-icon>
            <ion-icon name="pencil" type="button" data-toggle="modal" data-target="#editPost"></ion-icon>
          </div>
        </div>
    </div>`
}

function getHomePosts() {
    let http = new XMLHttpRequest();
    let url = 'api/post';
    http.open('GET', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function () {
        if (http.readyState == 4) {
            if (http.status != 200) {
                alert(JSON.parse(http.responseText)['message']);
            } else {
                posts = JSON.parse(http.responseText)['posts'];
                for (var post of posts) {
                    addHomePost(post.title, post.content)
                }
            }
        }
    }
}




function editPost() {
    let http = new XMLHttpRequest();
    let url = '/api/admin/post/crud/:id';
    let request = {
        'post': {
            "title": document.getElementById("recipient-name").value,
            "content": document.getElementById("message-text").value
        }
    };
    let formBody = [];
    for (var property in details) {
        formBody.push(encodeURIComponent(property) + "=" + encodeURIComponent(details[property]));
    }
    let params = formBody.join("&");
    http.open('PUT', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send(params);
    http.onreadystatechange = function () {
        if (http.readyState == 4) {
            if (http.status != 201) {
                alert(JSON.parse(http.responseText)['message']);
            } else {
                window.location.pathname = '/dashboard.html'
            }
        }
    }

}
