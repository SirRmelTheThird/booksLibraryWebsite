window.onload = () => {
    // LAST FOUR DIGITS
    const lastFourDigits = sessionStorage.getItem('lastFourDigits');
    document.getElementById('cardInfo').innerHTML = "Your credit card number ends in " + lastFourDigits;
    // REDIRECT TO HOMEPAGE
    setTimeout(() => {
        sessionStorage.removeItem('lastFourDigits');
        alert("Session Timed Out");
        location.replace("index.html");
    }, "100000");
};