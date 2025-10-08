document.addEventListener('DOMContentLoaded', () => {

    const checkCard = document.getElementById('checkCard');
    checkCard.addEventListener('click', (event) => {
        event.preventDefault();
        
        // VALIDATION
        const card = validateCard();
        const date = validateDate();
        const sort = validateSort();

        // SEND DATA ONCE ALL DATA IS VALID
        if (card && date && sort) {
            sendData();
        }
        else {
            event.preventDefault();
        }
    });

    function validateCard() {
        //  GET CARD NUMBER
        const cardNum = document.getElementById('card').value;

        // PATTERN
        pattern = /^5[1-5][0-9]{14}$/;

        // RETURN TRUE IF CARD NUMBER IS VAILD
        if (cardNum.match(pattern)){
            // REMOVE ERROR MSG
            document.getElementById('cardError').innerHTML = "";
            return true;
        } else {
            // DISPLAY ERROR MSG
            document.getElementById('cardError').innerHTML = "Invalid Card";
            return false;
        }
    }

    function validateDate() {
        //  GET DATE 
        const date = document.getElementById('date').value;

        // SPLIT YEAR AND MONTH
        const expDate = date.split('-');
        const expYear = parseInt(expDate[0]);
        const expMonth = parseInt(expDate[1]);

        // GET CURRENT DATE
        const currentYear = new Date().getFullYear(); 
        const currentMonth = new Date().getMonth() + 1;

        // RETURN TRUE IF EXPIRED DATE IS VALID
        if (((expYear - currentYear) > 0 && (expYear - currentYear) < 5) || (expYear === currentYear) && (expMonth - currentMonth) > 0){
            // REMOVE ERROR MSG
            document.getElementById('dateError').innerHTML = "";
            return true;
        } else {
            // DISPLAY ERROR MSG
            document.getElementById('dateError').innerHTML = "Card Expired or Invalid Date";
            return false;
        }
    }

    function validateSort() {
        //  GET CVV 
        const sortCode = document.getElementById('sort').value;

        // PATTERN
        pattern = /^[0-9]{3,4}$/;

        // RETURN TRUE IF SORT CODE IS VALID
        if (sortCode.match(pattern)){
            // REMOVE ERROR MSG
            document.getElementById('sortError').innerHTML = "";
            return true;
        } else {
            // DISPLAY ERROR MSG
            document.getElementById('sortError').innerHTML = "Invalid Sort Code"
            return false;
        }
    }

    function sendData() {
        // GET DATA
        const card = parseInt(document.getElementById('card').value);
        const date = document.getElementById('date').value;
        const expDate = date.split('-');
        const year = parseInt(expDate[0]);
        const month = parseInt(expDate[1]);
        const sort = String(document.getElementById('sort').value);

        //  SEND DATA TO API
        fetch("https://mudfoot.doc.stu.mmu.ac.uk/node/api/creditcard", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "master_card": card,
                "exp_year" : year,
                "exp_month" : month,
                "cvv_code" : sort,
            })
        })
        // HANDLE RESPONSE
        .then((response) => {
            if(response.status === 200){
                return response.json();
            }else if(response.status === 400){
                throw "Bad Request";
            }else{
                throw "Something went wrong";
            }
        })
        // HANDLE RETREIVED DATA
        .then((resJson) => {
            // PATTERN
            const pattern = /^[0-9]{12}/;

            // STORE LAST FOUR DIGITS AND REPLACE REST WITH *
            const fullCard = resJson.data.master_card.toString();
            const lastFourDigits = fullCard.replace(pattern, "**** **** **** ");
            sessionStorage.setItem('lastFourDigits', lastFourDigits);

            // DISPLAY MESSAGE
            document.getElementById('message').innerHTML = resJson.message; 

            // REDIRECT AFTER 1.5 SECONDS
            setTimeout(() => {
                location.replace("success.html");
              }, "1500");
        })
        // THROW LAST RESORT ERROR
        .catch((error) => {
            alert(error);
        });
    }
});
