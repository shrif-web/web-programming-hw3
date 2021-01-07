function showInfo() {
    document.getElementById("posts").style.display = "none";
    document.getElementById("info").style.display = "block";
    document.getElementById("main-section").style.justifyContent = "center";
  }

  function showPersonalPosts() {
    document.getElementById("info").style.display = "none";
    document.getElementById("posts").style.display = "block";
    document.getElementById("main-section").style.justifyContent = "right";

  }