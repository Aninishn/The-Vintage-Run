// Burger Menu
const navMenu = document.querySelector(".nav__menu"),
  navToggle = document.querySelector(".nav__toggle"),
  navClose = document.querySelector(".nav__close");

// Show menu
navToggle.addEventListener("click", () => {
  navMenu.classList.add("show-menu");
  navToggle.style.display = "none";
});

// Hide menu
navClose.addEventListener("click", () => {
  navMenu.classList.remove("show-menu");
  navToggle.style.display = "block";
});

const navLinks = document.querySelectorAll(".nav__link");

navLinks.forEach((n) =>
  n.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  })
);

// SWIPER
const swiperHome = new Swiper(".home__swiper", {
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    renderBullet: (index, className) => {
      return (
        '<span class="' +
        className +
        '">' +
        String(index + 1).padStart(2, "0") +
        "</span>"
      );
    },
  },
});

// CHANGE BACKGROUND HEADER
const bgHeader = () => {
  const header = document.getElementById("header");
  if (window.scrollY >= 50) {
    header.classList.add("bg-header");
  } else {
    header.classList.remove("bg-header");
  }
};
window.addEventListener("scroll", bgHeader);

// Car Details Modal Elements
const carDetailsModal = document.getElementById("car-details-modal");
const carModalCloseBtn = document.getElementById("car-modal-close");
const modalTitle = carDetailsModal.querySelector(".car-modal__title");
const modalImageContainer = carDetailsModal.querySelector(
  ".car-modal__image-container"
);
const modalYear = carDetailsModal.querySelector(".car-modal__year");
const modalEngine = carDetailsModal.querySelector(".car-modal__engine");
const modalHorsepower = carDetailsModal.querySelector(".car-modal__horsepower");
const modalTopSpeed = carDetailsModal.querySelector(".car-modal__top-speed");
const modalAcceleration = carDetailsModal.querySelector(
  ".car-modal__acceleration"
);
const modalDescription = carDetailsModal.querySelector(
  ".car-modal__description"
);

function openCarModal() {
  carDetailsModal.classList.add("show-modal");
  document.body.style.overflow = "hidden"; // Prevent scrolling of background
}

// Function to close the modal
function closeCarModal() {
  carDetailsModal.classList.remove("show-modal");
  document.body.style.overflow = "";
  // Clear previous data for next open
  modalTitle.textContent = "";
  modalImageContainer.innerHTML = "";
  modalYear.textContent = "";
  modalEngine.textContent = "";
  modalHorsepower.textContent = "";
  modalTopSpeed.textContent = "";
  modalAcceleration.textContent = "";
  modalDescription.textContent = "";
}

carModalCloseBtn.addEventListener("click", closeCarModal);

carDetailsModal.addEventListener("click", (event) => {
  if (event.target === carDetailsModal) {
    closeCarModal();
  }
});

// API
async function fetchAPIData() {
  const res = await fetch("/data/car.json");
  if (!res.ok) throw new Error("API fetch failed");
  return res.json();
}

async function getAllCars() {
  const data = await fetchAPIData();
  return data.endpoints.find((e) => e.path === "/cars")?.response_example || [];
}

async function getCarById(carId) {
  const data = await fetchAPIData();
  const cars =
    data.endpoints.find((e) => e.path === "/cars")?.response_example || [];
  let car = cars.find((c) => c.id === carId);

  if (!car) {
    const fallback = data.endpoints.find(
      (e) => e.path === "/cars/{id}"
    )?.response_example;
    if (fallback?.id === carId) car = fallback;
  }

  return car || null;
}

function setText(el, value, suffix = "", fallback = "N/A") {
  el.textContent = value ? `${value}${suffix}` : fallback;
}

// DISPLAY CARS
async function displayCarList() {
  try {
    const cars = await getAllCars();
    const container = document.querySelector(".models__container");
    container.innerHTML = "";

    cars.forEach((car) => {
      const card = document.createElement("article");
      card.className = "models__card";
      card.dataset.carId = car.id;

      card.innerHTML = `
        <img src="${car.image_url}" alt="${car.name}" class="models__img" />
        <div class="models__gradient"></div>
        <div class="models__data">
          <h3 class="models__name">${car.name}</h3>
          <span class="models__info">${car.top_speed_kmh} km/h</span>
        </div>
      `;

      card.addEventListener("click", () => showCarModal(car.id));
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error displaying car list:", err);
  }
}

// CAR MODAL DISPLAY

async function showCarModal(carId) {
  try {
    const car = await getCarById(carId);
    if (!car) {
      alert("Car details not found.");
      return;
    }

    setText(modalTitle, car.name);
    setText(modalYear, car.year);
    setText(modalEngine, car.engine);
    setText(modalHorsepower, car.horsepower);
    setText(modalTopSpeed, car.top_speed_kmh, " km/h");
    setText(modalAcceleration, car.acceleration_0_100_s, " s");

    const customDescriptions = {
      "car-001":
        "Born in '64, the Porsche 901 paved the way for the legendary 911. Understated, yet undeniably iconic. A rebel in a tailored suit.",
      "car-002":
        "The Miura P400 SV wasn't just a car — it was a movement. The wild child of the '70s, made for speed, style, and stealing hearts.",
      "car-003":
        "The 1963 Corvette C2 Sting Ray: muscular, mysterious, and made for adrenaline. It didn't just drive — it roared into history.",
    };

    const description = customDescriptions[car.id] || car.description;
    setText(modalDescription, description, "", "No description available.");

    modalImageContainer.innerHTML = "";

    (car.images?.length ? car.images : [car.image_url]).forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = car.name;
      img.onerror = () => {
        img.src = "https://placehold.co/600x400?text=Image+Not+Found";
      };
      modalImageContainer.appendChild(img);
    });

    openCarModal();
  } catch (err) {
    console.error("Error loading car modal:", err);
    alert("Failed to load car details.");
  }
}

// FORM

document.querySelector(".contact__form")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name")?.value.trim();
  const email = document.getElementById("email")?.value.trim();

  if (!name || !email) {
    alert("Please fill in both name and email.");
    return;
  }

  console.log("Simulating subscription:", { name, email });
  alert(`Thank you for subscribing, ${name}!`);

  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
});

displayCarList();
