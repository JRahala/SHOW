import flask, flask_cors, json

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# NotSevere, Severe

CHAT_BOTS = ['https://show-prototype.azurewebsites.net/qnamaker/knowledgebases/0db9d026-5ba2-4aba-b0c8-b563f08aa6d6/generateAnswer', 'https://show-prototype.azurewebsites.net/qnamaker/knowledgebases/54aa1bb5-9e8c-4a16-92ea-bc4fa01e0f48/generateAnswer'] # varying severity
CHAT_KEYS = ['EndpointKey 9352b604-1b1c-422a-a162-b0b891bfbc37', 'EndpointKey 9352b604-1b1c-422a-a162-b0b891bfbc37']


Intent_Sentiment = {

    'Happy': 0.4,
    'Want to Talk': 0.15,
    'None': -0.05,
    'Suicidal': -1.0,
    'Sadness': -0.4,
    'Bully others': -0.6,
    'Self-harm': -0.75,
    'Understanding': 0.3

}


def decide_chatbot(data):

    score = 0

    raw_intents = data['intents']

    for dictionary in raw_intents:

        if dictionary['intent'] in  Intent_Sentiment:
            score += dictionary['score'] * Intent_Sentiment[dictionary['intent']]


    if score > 0:
        return CHAT_BOTS[0], CHAT_KEYS[0]

    else:
        return CHAT_BOTS[1], CHAT_KEYS[1] 




@app.route('/POST/', methods = ['POST'])

def post_data():

    data = request.get_json()

    CHAT_BOT, CHAT_KEY = decide_chatbot(data) 

    return jsonify({'url': CHAT_BOT, 'key': CHAT_KEY, 'query': data['query']}) #{'hello':'world'}

    '''

    json_data = {
        
        'url': 'https://show-prototype.azurewebsites.net/qnamaker/knowledgebases/54aa1bb5-9e8c-4a16-92ea-bc4fa01e0f48/generateAnswer',
        'query': 'hello',
        'key': 'EndpointKey 9352b604-1b1c-422a-a162-b0b891bfbc37'
        
        }


    return jsonify(json_data)

    '''

app.run()