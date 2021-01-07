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
                    window.location.pathname = '/index.html'
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
    http.onreadystatechange = function () {
        if (http.readyState == 4) {
            if (http.status != 201) {
                alert(JSON.parse(http.responseText)['message']);
            } else {
                window.location.pathname = '/index.html'
            }
        }
    }
}

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
                let posts = JSON.parse(http.responseText)['posts'];

            }
        }
    }
}


function editPost(){
    let http = new XMLHttpRequest();
    let url = '/api/admin/post/crud/:id';
    let request = {
        'post' : {
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
