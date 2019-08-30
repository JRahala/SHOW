// run certain functions when DOM Content is fully loaded 
// i.e. load recent chat?


// window.addEventListener('DOMContentLoaded', (event) => {

    //console.log('DOM fully loaded and parsed');

//});


function submit_function(){

    message_value = document.querySelector('#sending_box > input').value

    add_user_message(message_value);
    message_post(message_value);

}



function message_post(message_input) {

    url =  "https://westeurope.api.cognitive.microsoft.com/luis/v2.0/apps/52299411-b5d1-4b67-b6a0-57c0dfeea716?staging=true&verbose=true&timezoneOffset=60&subscription-key=7c5653808c2942b1a639845a51e874af&q=" + message_input;

    console.log(url)

    var request = new XMLHttpRequest();    
    var parameters = {};

    request.open("GET", url, true);                    
    //request.setRequestHeader("Authorization", 'EndpointKey caf4a59c12bf477aa3698bfcb2bffa5d');
    //request.setRequestHeader("Content-type", "application/json");                    

    request.onreadystatechange = function () { //Call a function when the state changes.
        if (request.readyState == 4 && request.status == 200) {

            console.log(request.responseText);
            sendPython(request.responseText); 

        }

        else{
            console.log(request.readyState, request.status);
        }
    }

    request.send(JSON.stringify(parameters));
}



function sendPython(sentiment){

    sentiment = JSON.parse(sentiment)
    console.log('yeeee')


    var request = new XMLHttpRequest();

    request.open("POST", 'http://localhost:5000/POST/', true); // connect to localhost 5000 server running on python
    request.setRequestHeader('Content-Type', 'application/json');

    request.onreadystatechange = function () {

        if (request.readyState == 4 && request.status == 200) {
         
            console.log(request.responseText);
            query_QnA(JSON.parse(request.responseText));
            
        }

        else{
    
            console.log('error')
            console.log(request.readyState, request.status);
        
        }

    }

    request.send(JSON.stringify(sentiment));


}


function query_QnA(JSON_object) {

    url = JSON_object.url
    query = JSON_object.query
    key = JSON_object.key


    var request = new XMLHttpRequest();
    var parameters = {

        'question': query,
        'top': 1 // number of replies sent back

    }

    request.open('POST', url, true)

    request.setRequestHeader("Authorization", key);
    request.setRequestHeader("Content-type", "application/json");                    
    
    request.onreadystatechange = function () { //Call a function when the state changes.
        if (request.readyState == 4 && request.status == 200) {

            console.log(JSON.parse(request.responseText).answers[0]); // actual response that is sent back
            add_recipient_message(JSON.parse(request.responseText).answers[0].answer); // textual response

        }

        else{
            console.log(request.readyState, request.status);
        }
    }

    request.send(JSON.stringify(parameters));

}



// combine the bottome two function into one


function add_user_message(message){

    msg_box = document.getElementById('message_box');

    container = document.createElement('div');
    container.classList.add('message_container');

    user_msg = document.createElement('div');
    user_msg.classList.add('user_message');
    user_msg.classList.add('message');

    Y_offset = document.querySelectorAll('.message').length * 5;
    user_msg.style.transform = 'translateY('+ Y_offset +'px)';

    user_msg.innerText = message;

    container.appendChild(user_msg);
    msg_box.appendChild(container);

}


function add_recipient_message(message){

    msg_box = document.getElementById('message_box');

    container = document.createElement('div');
    container.classList.add('message_container');

    user_msg = document.createElement('div');
    user_msg.classList.add('recipient_message');
    user_msg.classList.add('message');

    Y_offset = document.querySelectorAll('.message').length * 5;
    user_msg.style.transform = 'translateY('+ Y_offset +'px)';

    user_msg.innerText = message;

    container.appendChild(user_msg);
    msg_box.appendChild(container);

}