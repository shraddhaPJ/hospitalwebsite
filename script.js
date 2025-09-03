<<<<<<< HEAD
// ===============================
// Mobile Menu Toggle
// ===============================
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('mainNav');

menuBtn.addEventListener('click', () => {
  nav.classList.toggle('hidden');
});

// ===============================
// Modal (Enquiry Form) Control
// ===============================
function openModal() {
  document.getElementById("enquiryModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("enquiryModal").classList.add("hidden");
}
=======
// ===============================
// Mobile Menu Toggle
// ===============================
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('mainNav');

menuBtn.addEventListener('click', () => {
  nav.classList.toggle('hidden');
});

// ===============================
// Modal (Enquiry Form) Control
// ===============================
function openModal() {
  document.getElementById("enquiryModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("enquiryModal").classList.add("hidden");
}
>>>>>>> 024d697dae75a8a9a8717d54452901f5408fa756
