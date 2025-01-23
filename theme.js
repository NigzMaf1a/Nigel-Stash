// Array of themes for body ID with corresponding background images
const themes = [
    { id: 'Mains', image: 'url(Uk12.jpg)', color: 'rgba(30,30,30,0.8)', label: 'Dark Gray' },
    { id: 'Remotz', image: 'url(Uk10.jpg)', color: 'rgba(45,55,45,0.8)', label: 'Greenish Gray' },
    { id: 'Tranz', image: 'url(Uk11.jpg)', color: 'rgba(60,60,60,0.8)', label: 'Slate Gray' },
    { id: 'Trapz', image: 'url(Uk8.jpg)', color: 'rgba(75,85,75,0.8)', label: 'Olive Gray' },
    { id: 'Chenj', image: 'url(Uk14.jpg)', color: 'rgba(90,90,90,0.8)', label: 'Medium Gray' },
    { id: 'Paton', image: 'url(Uk15.jpg)', color: 'rgba(70,80,70,0.8)', label: 'Forest Gray' },
    { id: 'Kepo', image: 'url(Uk17.jpg)', color: 'rgba(100,100,100,0.8)', label: 'Soft Gray' },
    { id: 'Mai', image: 'url(Uk18.jpg)', color: 'rgba(110,120,110,0.8)', label: 'Foggy Gray' },
    { id: 'Horror', image: 'url(Uk19.jpg)', color: 'rgba(120,120,120,0.8)', label: 'Light Gray' },
    { id: 'More1', image: 'url(Uk20.jpg)', color: 'rgba(140,140,140,0.8)', label: 'Ash Gray' },
    { id: 'More2', image: 'url(Uk21.jpg)', color: 'rgba(160,160,160,0.8)', label: 'Silver Gray' }
];

// Function to change the body theme
function changeTheme() {
    const body = document.body; // Get the body element

    // Get the current body ID
    const currentId = body.id;

    // Find the index of the current ID in the themes array
    let currentIndex = themes.findIndex(theme => theme.id === currentId);

    // If the current ID is not in the themes array, default to the first theme
    if (currentIndex === -1) {
        currentIndex = 0;
    } else {
        // Move to the next theme in the array, wrapping around to the start
        currentIndex = (currentIndex + 1) % themes.length;
    }

    // Set the new ID and change the Sidebar background
    body.id = themes[currentIndex].id;
    navTheme(themes[currentIndex].image, themes[currentIndex].color);
}

// Function to change the Sidebar background
function navTheme(image, color) {
    const sidebar = document.getElementById('Sidebar'); // Get the Sidebar element
    if (sidebar) {
        sidebar.style.backgroundImage = `linear-gradient(${color}, ${color}), ${image}`; // Set the background with gradient
    }

    // Also apply to body
    document.body.style.backgroundImage = `linear-gradient(${color}, ${color}), ${image}`; // Set body background

    // Change the top-strip background color
    const topStrip = document.querySelector('.top-strip'); // Get the top-strip element
    if (topStrip) {
        topStrip.style.backgroundColor = color + ' !important'; // Set the top-strip color to match the theme color
    }
}

// Automatically change the theme every 5 seconds
setInterval(changeTheme, 10000);
