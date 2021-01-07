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

function getThisUserPosts(){
  let postsPart = document.getElementById("posts")
  for (var post of posts){
      addPost(post.title,post.content)
  }
}


function addPost(title, content){
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




function addNote(title, body, color, id) {
  var noteCard = document.createElement("div");
  noteCard.style.backgroundColor = color;

  var titleText = document.createTextNode(title);
  var noteTitle = document.createElement("h4");
  noteTitle.appendChild(titleText);
  noteTitle.style.marginTop = 0;

  var bodyText = document.createTextNode(body);
  var noteBody = document.createElement("span");
  noteBody.appendChild(bodyText);

  var noteFooter = document.createElement("div");
  noteFooter.style.display = "flex";
  noteFooter.style.flexDirection = "row";
  noteFooter.style.justifyContent = "center";
  noteFooter.style.marginLeft = 0;

  var pinButton = document.createElement("button");
  pinButton.addEventListener("click", (e) => {
    getNoteById(id);
    if(singleNote.pinned === false){
    postPin(title, body, color,id);
    addPinnedNote(title, body, color, id);
    }
  });
  var pinIcon = document.createElement("i");
  pinButton.className = "iconButton";
  pinIcon.className = "material-icons";
  var pinText = document.createTextNode("push_pin");
  pinIcon.appendChild(pinText);
  pinButton.appendChild(pinIcon);
  noteFooter.appendChild(pinButton);

  var archiveButton = document.createElement("button");
  archiveButton.addEventListener("click", (e) => {
    archiveNote(id);
    postArchive(title, body, color, id);
  });
  var archiveIcon = document.createElement("i");
  archiveButton.className = "iconButton";
  archiveIcon.className = "material-icons";
  var archiveText = document.createTextNode("archive");
  archiveIcon.appendChild(archiveText);
  archiveButton.appendChild(archiveIcon);
  noteFooter.appendChild(archiveButton);

  var binButton = document.createElement("button");
  binButton.addEventListener("click", (e) => {
    binNote(id);
    postBin(title, body, color, id);
  });
  var binIcon = document.createElement("i");
  binButton.className = "iconButton";
  binIcon.className = "material-icons";
  var binText = document.createTextNode("delete");
  binIcon.appendChild(binText);
  binButton.appendChild(binIcon);
  noteFooter.appendChild(binButton);

  noteCard.appendChild(noteTitle);
  noteCard.appendChild(noteBody);
  noteCard.appendChild(noteFooter);

  notesContainer.insertBefore(noteCard, notesContainer.firstChild);
}