const quill = new Quill('#editor', {
    theme: 'snow'
});

const ws = new WebSocket('ws://localhost:8080');

ws.onopen = function() {
    console.log('Connected to server');
};

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data.type === 'text-change') {
        quill.updateContents(data.delta);
    } else if (data.type === 'cursor-update') {
        // Handle cursor update
    } else if (data.type === 'highlight') {
        // Handle text highlighting
    } else if (data.type === 'presence-update') {
        // Handle user presence indicators
    }
};

quill.on('text-change', function(delta, oldDelta, source) {
    if (source === 'user') {
        ws.send(JSON.stringify({ type: 'text-change', delta: delta }));
    }
});

// Other event listeners for cursor update, text highlighting, user presence indicators
