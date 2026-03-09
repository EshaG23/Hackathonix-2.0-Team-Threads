let videoStream = null;
let capturedBlob = null;

// Load and display user coin count
async function loadUserCoinCount() {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch("/api/user-coins", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    if (res.ok) {
      const data = await res.json();
      document.getElementById("coinCount").textContent = data.coins || 0;
    }
  } catch (err) {
    console.error("Error loading coins:", err);
  }
}

// Load lakes and user coin count
window.onload = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/";
    return;
  }

  const res = await fetch("/api/lakes");
  const lakes = await res.json();

  const select = document.getElementById("lake");
  select.innerHTML = `<option value="">-- Select Lake --</option>`;

  Object.keys(lakes).forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });

  // Load user coin count
  await loadUserCoinCount();
};

// -----------------------------
// Get Location
// -----------------------------
function getLocation() {
  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      document.getElementById("lat").value = lat.toFixed(6);
      document.getElementById("lng").value = lng.toFixed(6);

      if (window.updateMapVisualization) {
        window.updateMapVisualization();
      }
    },
    () => alert("Location permission denied")
  );
}

// -----------------------------
// Open Webcam (Desktop)
// -----------------------------
async function openWebcam() {
  try {
    videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.getElementById("video");
    video.srcObject = videoStream;
    video.style.display = "block";
  } catch (err) {
    alert("Webcam access denied");
  }
}

// -----------------------------
// Capture Photo from Webcam
// -----------------------------
function capturePhoto() {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");

  canvas.style.display = "block";
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob(blob => {
    capturedBlob = blob;
  }, "image/jpeg");

  // Stop camera
  if (videoStream) {
    videoStream.getTracks().forEach(track => track.stop());
    video.style.display = "none";
  }
}

// -----------------------------
// Submit Report
// -----------------------------
async function submitReport() {
  const lake = document.getElementById("lake").value;
  const lat = document.getElementById("lat").value;
  const lng = document.getElementById("lng").value;

  let imageFile = capturedBlob;

  // If webcam not used, fallback to upload
  if (!imageFile) {
    const upload = document.getElementById("imageUpload").files[0];
    if (!upload) {
      alert("Please capture or upload an image");
      return;
    }
    imageFile = upload;
  }

  if (!lake || !lat || !lng) {
    alert("Fill all fields");
    return;
  }

  const formData = new FormData();
  formData.append("lake", lake);
  formData.append("latitude", lat);
  formData.append("longitude", lng);
  formData.append("image", imageFile);

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
    return;
  }

  const res = await fetch("/submit-report", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token
    },
    body: formData
  });

  if (res.status === 401) {
    alert("Session expired. Please login again.");
    localStorage.removeItem("token");
    window.location.href = "/";
    return;
  }

  const data = await res.json();

  if (!res.ok) {
    if (data.distance_m) {
      alert(
        `❌ You are too far from the lake.\nDistance: ${data.distance_m} meters`
      );
    } else {
      alert(data.error || "Submission failed");
    }
    return;
  }


  alert("✅ Report submitted successfully! +1 🪙 Coin earned!");
  
  // Update coin count
  await loadUserCoinCount();
  
  // Reset form
  document.getElementById("lake").value = "";
  document.getElementById("lat").value = "";
  document.getElementById("lng").value = "";
  document.getElementById("imageUpload").value = "";
  capturedBlob = null;
  document.getElementById("previewContainer").classList.add('hidden');
}
