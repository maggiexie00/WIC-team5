



document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chat-box');
    const chatInput = document.getElementById('chat-input');

    chatInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const userMessage = chatInput.value;
            if (userMessage.trim() !== '') {
                addMessageToChat('user', userMessage);
                chatInput.value = '';
                getBotResponse(userMessage);
            }
        }
    });

    function addMessageToChat(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', `${sender}-message`);
        messageDiv.textContent = message;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function getBotResponse(message) {
        const apiKey = '00769ec18f914af8beefa3b804401b46';
        const url = `https://api.spoonacular.com/food/converse?text=${encodeURIComponent(message)}&apiKey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.answers && data.answers.length > 0) {
                    const botMessage = data.answers[0].text;
                    addMessageToChat('bot', botMessage);
                } else {
                    addMessageToChat('bot', "I'm not sure how to respond to that.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                addMessageToChat('bot', "Sorry, there was an error processing your request.");
            });
    }
});
