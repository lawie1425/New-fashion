function handleGoogleSignup() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then(result => {
        alert("Signed in as " + result.user.email);
        window.location.href = 'index.html';
      })
      .catch(error => {
        alert("Error: " + error.message);
      });
  }
  