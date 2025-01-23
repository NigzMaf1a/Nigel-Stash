document.addEventListener("DOMContentLoaded", function () {
    const topStrip = document.querySelector(".top-strip");
    const colors = [
        "rgba(0, 0, 128, 0.8)",  // Deep blue
        "rgba(0, 26, 122, 0.8)",
        "rgba(0, 51, 116, 0.8)",
        "rgba(0, 76, 110, 0.8)",
        "rgba(0, 102, 102, 0.8)", // Blue-greenish
        "rgba(0, 128, 96, 0.8)",
        "rgba(0, 153, 89, 0.8)",
        "rgba(0, 179, 83, 0.8)",
        "rgba(0, 204, 77, 0.8)",  // Greenish-blue
        "rgba(0, 230, 70, 0.8)",
        "rgba(13, 230, 57, 0.8)",
        "rgba(38, 230, 51, 0.8)",
        "rgba(64, 230, 45, 0.8)",
        "rgba(89, 230, 38, 0.8)",
        "rgba(115, 230, 32, 0.8)",
        "rgba(140, 230, 26, 0.8)", // Midway green
        "rgba(166, 230, 19, 0.8)",
        "rgba(191, 230, 13, 0.8)",
        "rgba(217, 230, 6, 0.8)",
        "rgba(242, 230, 0, 0.8)"  // Bright green
    ];
    
    let colorIndex = 0;

    function changeColor() {
        topStrip.style.backgroundColor = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;
    }

    // Set the color change interval
    setInterval(changeColor, 5000);
});
  