

function loginForm(){
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log(username,password);

    fetch('http://localhost:3000/login' , {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body:JSON.stringify({
            username:username,
            password:password
        })
    }).then(response => response.text())   // read server response
    .then(data => {
        console.log("Server says:", data);
    })
    .catch(error => {
        console.error("Error:", error);
    });


}