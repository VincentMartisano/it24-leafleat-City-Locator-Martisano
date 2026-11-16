
// Initialize map
var map = L.map('map').setView([8.369, 124.865], 12);

// Add OpenStreetMap layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Default marker
var marker = L.marker([8.369, 124.865]).addTo(map);

marker.bindPopup("Manolo Fortich, Bukidnon").openPopup();

// Search city function
async function searchCity() {

    var city = document.getElementById("cityInput").value.trim();
    var message = document.getElementById("message");

    if (city === "") {
        message.innerHTML = "Please enter a city name!";
        return;
    }

    message.innerHTML = "Searching location...";

    try {
        var response = await fetch(
            "https://nominatim.openstreetmap.org/search?format=json&limit=1&q="
            + encodeURIComponent(city)
        );

        if (!response.ok) {
            throw new Error("Network error");
        }

        var data = await response.json();

        if (data.length === 0) {
            message.innerHTML = "Location not found. Try another city.";
            return;
        }

        var location = data[0];

        var lat = parseFloat(location.lat);
        var lon = parseFloat(location.lon);

        // Move map to searched location
        map.setView([lat, lon], 13);

        // Update marker
        marker.setLatLng([lat, lon]);

        marker.bindPopup(location.display_name).openPopup();

        // Display information
        document.getElementById("cityName").innerHTML =
            location.name || city;

        document.getElementById("country").innerHTML =
            location.display_name.split(", ").slice(-1)[0];

        document.getElementById("latitude").innerHTML = lat;
        document.getElementById("longitude").innerHTML = lon;

        message.innerHTML = "Location successfully found!";

    } catch (error) {
        message.innerHTML =
            "Unable to search. Please check your internet connection.";
    }
}

// Search when pressing Enter
document.getElementById("cityInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchCity();
    }
});
