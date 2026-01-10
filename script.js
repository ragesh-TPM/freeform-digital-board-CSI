// Get references to the canvas and add button
const canvas = document.getElementById('canvas');
const addPinBtn = document.getElementById('add-pin-btn');

// array to hold all the pins
let pins = [];

// load pins from localStorage when the page loads that will be helpful for viewing when needed
function loadPins() 
{
    const savedPins = localStorage.getItem('pins');
    if (savedPins) 
    {
        pins = JSON.parse(savedPins);
        // Recreate each pin on the canvas
        pins.forEach(pin => createPin(pin.id, pin.x, pin.y, pin.text));
    }
}

// Save pins to localStorage
function savePins() 
{
    localStorage.setItem('pins', JSON.stringify(pins));
}

// Function to create a new pin
function createPin(id, x, y, text) 
{
    // Create the pin div
    const pin = document.createElement('div');
    pin.className = 'pin';
    pin.id = id;
    pin.style.left = x + 'px';
    pin.style.top = y + 'px';
    
    // Create the editable text area
    const textArea = document.createElement('div');
    textArea.className = 'pin-text';
    textArea.contentEditable = true;
    textArea.textContent = text;
    
    // Add the text area to the pin
    pin.appendChild(textArea);
    
    // Add the pin to the canvas
    canvas.appendChild(pin);
    
    // Variables for dragging
    let isDragging = false;
    let offsetX, offsetY;
    
    // when mouse is pressed down on the pin, it should start dragging
    pin.addEventListener('mousedown', (e) => 
    {
        // If user clicks inside text, do not drag
        if (e.target.classList.contains('pin-text')) 
        {
            return;
        }

        isDragging = true;
        offsetX = e.clientX - pin.offsetLeft;
        offsetY = e.clientY - pin.offsetTop;
        e.preventDefault();
    });

    
    // When mouse moves, if dragging, move the pin
    document.addEventListener('mousemove', (e) => {
        if (isDragging) 
        {
            // Update the pin's position
            pin.style.left = (e.clientX - offsetX) + 'px';
            pin.style.top = (e.clientY - offsetY) + 'px';
        }
    });
    
    // When mouse is released, stop dragging and save
    document.addEventListener('mouseup', () => 
    {
        if (isDragging) 
        {
            isDragging = false;
            // Update the pin's position in the pins array
            const pinIndex = pins.findIndex(p => p.id === id);
            if (pinIndex !== -1) 
            {
                pins[pinIndex].x = parseInt(pin.style.left);
                pins[pinIndex].y = parseInt(pin.style.top);
                pins[pinIndex].text = textArea.textContent;
                savePins(); // Save to localStorage
            }
        }
    });
    
    // Save text changes when the user stops editing
    textArea.addEventListener('blur', () => 
    {
        const pinIndex = pins.findIndex(p => p.id === id);
        if (pinIndex !== -1) 
        {
            pins[pinIndex].text = textArea.textContent;
            savePins();
        }
    });
}

// Function to add a new pin
function addPin() 
{
    // Generate a unique ID
    const id = 'pin-' + Date.now();
    // Default position in the center
    const x = window.innerWidth / 2 - 100; // Center horizontally
    const y = window.innerHeight / 2 - 50; // Center vertically
    const text = 'New Pin'; // Default text
    
    // Add into pins array
    pins.push({ id, x, y, text });
    
    // Create the pin on the canvas
    createPin(id, x, y, text);
    
    // Save to localStorage
    savePins();
}

// Add event listener to the add button
addPinBtn.addEventListener('click', addPin);

// Load pins when the page loads
window.addEventListener('load', loadPins);