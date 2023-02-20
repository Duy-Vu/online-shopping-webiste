/**
 * TODO: 8.4 Register new user
 *       - Handle registration form submission
 *       - Prevent registration when password and passwordConfirmation do not match
 *       - Use createNotification() function from utils.js to show user messages of
 *       - error conditions and successful registration
 *       - Reset the form back to empty after successful registration
 *       - Use postOrPutJSON() function from utils.js to send your data back to server
 */

document.getElementById("btnRegister").addEventListener("click", (event) => {
    event.preventDefault();
    const password = document.getElementById('password').value;
    const passwordConfirmation = document.getElementById('passwordConfirmation').value;
    if (password === passwordConfirmation) {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const registerUser = {
            name: name,
            email: email,
            password: password
        };
        document.getElementById("register-form").reset();
        return postOrPutJSON('/api/register', 'POST', registerUser);
    } else{
        document.getElementById("password").value = "";
        document.getElementById("passwordConfirmation").value = "";
        return createNotification('Password is not matching!', 'notifications-container', false);
    }
});
