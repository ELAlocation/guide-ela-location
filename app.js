if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js"));
}

const whatsappNumber = "262693865294";

function openWhatsApp(message) {
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
}

const locationButton = document.getElementById("send-location");
if (locationButton) {
  locationButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n’est pas disponible sur cet appareil.");
      return;
    }

    const original = locationButton.querySelector("strong").textContent;
    locationButton.querySelector("strong").textContent = "Localisation en cours…";
    locationButton.disabled = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        openWhatsApp(`Bonjour ELA Location, voici ma position actuelle : ${mapLink}`);
        locationButton.querySelector("strong").textContent = original;
        locationButton.disabled = false;
      },
      () => {
        alert("Impossible d’obtenir votre position. Vérifiez que la géolocalisation est autorisée.");
        locationButton.querySelector("strong").textContent = original;
        locationButton.disabled = false;
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  });
}

if (typeof L !== "undefined" && document.getElementById("reunion-map")) {
  const map = L.map("reunion-map", { scrollWheelZoom: false }).setView([-21.13, 55.53], 10);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap"
  }).addTo(map);

  const places = [
    ["Piton de la Fournaise", -21.244, 55.708, "https://www.google.com/maps/search/?api=1&query=Piton+de+la+Fournaise"],
    ["Le Maïdo", -21.070, 55.388, "https://www.google.com/maps/search/?api=1&query=Le+Maïdo+La+Réunion"],
    ["L’Hermitage", -21.074, 55.223, "https://www.google.com/maps/search/?api=1&query=Plage+de+l'Hermitage+La+Réunion"],
    ["Grande Anse", -21.367, 55.549, "https://www.google.com/maps/search/?api=1&query=Plage+de+Grande+Anse+La+Réunion"],
    ["Langevin", -21.315, 55.640, "https://www.google.com/maps/search/?api=1&query=Cascade+de+Langevin+Grand+Galet"],
    ["Salazie", -21.027, 55.539, "https://www.google.com/maps/search/?api=1&query=Salazie+La+Réunion"],
    ["Cilaos", -21.135, 55.472, "https://www.google.com/maps/search/?api=1&query=Cilaos+La+Réunion"],
    ["Cap Méchant", -21.372, 55.707, "https://www.google.com/maps/search/?api=1&query=Cap+Méchant+La+Réunion"]
  ];

  places.forEach(([name, lat, lng, url]) => {
    L.marker([lat, lng]).addTo(map)
      .bindPopup(`<strong>${name}</strong><br><a href="${url}" target="_blank" rel="noopener">Ouvrir dans Google Maps →</a>`);
  });
}
