// app.js (FULL)

// ---------------------- FIREBASE IMPORTS ----------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

import {

  getAuth,

  createUserWithEmailAndPassword,

  signInWithEmailAndPassword,

  signOut,

  onAuthStateChanged,

  sendPasswordResetEmail

} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {

  getFirestore,

  collection,

  doc,

  setDoc,

  addDoc,

  onSnapshot,

  query,

  orderBy,

  getDoc,

  updateDoc,

  deleteDoc,

  serverTimestamp

} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// ---------------------- FIREBASE CONFIG ----------------------

const firebaseConfig = {

  apiKey: "AIzaSyCMhwCdyBmC3037SScytAYGmiXXnFiwFbI",

  authDomain: "request-materials-4b168.firebaseapp.com",

  projectId: "request-materials-4b168",

  storageBucket: "request-materials-4b168.appspot.com",

  messagingSenderId: "1088278709255",

  appId: "1:1088278709255:web:138e1337bea754b21c16a2",

  measurementId: "G-F4FR8YJD99"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

// ---------------------- CLOUDINARY CONFIG ----------------------

const CLOUD_NAME = "dtmm8frik";

const UPLOAD_PRESET = "Crrd2025";

// ---------------------- DOM ELEMENTS ----------------------

const loginSection = document.getElementById("login-section");

const registerSection = document.getElementById("register-section");

const forgotSection = document.getElementById("forgot-section");

const authSection = document.getElementById("auth-section");

const appSection = document.getElementById("app-section");

const showRegister = document.getElementById("showRegister");

const showLogin = document.getElementById("showLogin");

const showForgot = document.getElementById("showForgot");

const backToLogin = document.getElementById("backToLogin");

const loginEmail = document.getElementById("loginEmail");

const loginPassword = document.getElementById("loginPassword");

const loginBtn = document.getElementById("loginBtn");

const registerName = document.getElementById("registerName");

const registerEmail = document.getElementById("registerEmail");

const registerPassword = document.getElementById("registerPassword");

const registerRole = document.getElementById("registerRole");

const gmCodeInput = document.getElementById("gmCode");

const registerBtn = document.getElementById("registerBtn");

const forgotEmail = document.getElementById("forgotEmail");

const forgotBtn = document.getElementById("forgotBtn");

const logoutBtn = document.getElementById("logoutBtn");

const requestDate = document.getElementById("requestDate");

const requestParticular = document.getElementById("requestParticular");

const requestUnit = document.getElementById("requestUnit");

const requestQty = document.getElementById("requestQty");

const requestImage = document.getElementById("requestImage");

const submitRequestBtn = document.getElementById("submitRequestBtn");

const progressBar = document.getElementById("progressBar");

const requestsList = document.getElementById("requestsList");

const gmFilters = document.getElementById("gmFilters");

const gmBackground = document.getElementById("gmBackground");

const bgUpload = document.getElementById("bgUpload");

const filterFromDate = document.getElementById("filterFromDate");

const filterToDate = document.getElementById("filterToDate");

const filterStatus = document.getElementById("filterStatus");

const applyFilterBtn = document.getElementById("applyFilterBtn");

const clearFilterBtn = document.getElementById("clearFilterBtn");

const toastContainer = document.getElementById("toast-container");

const imageModal = document.getElementById("imageModal");

const modalImg = document.getElementById("modalImg");

const closeModal = document.getElementById("closeModal");

const editModal = document.getElementById("editModal");

const editParticular = document.getElementById("editParticular");

const editUnit = document.getElementById("editUnit");

const editQty = document.getElementById("editQty");

const saveEditBtn = document.getElementById("saveEditBtn");

const cancelEditBtn = document.getElementById("cancelEditBtn");

const userNameDisplay = document.getElementById("userNameDisplay");

const scrollBtn = document.getElementById("scrollUpBtn");

// state for editing

let currentEditId = null;

// ---------------------- UTIL: TOAST ----------------------

function showToast(msg, type = "info", duration = 3500) {

  const t = document.createElement("div");

  t.className = `toast ${type}`;

  t.textContent = msg;

  toastContainer.appendChild(t);

  setTimeout(() => t.remove(), duration);

}

// ---------------------- NAV: show/hide auth sections ----------------------

showRegister.addEventListener("click", (e) => {

  e.preventDefault();

  loginSection.classList.add("hidden");

  forgotSection.classList.add("hidden");

  registerSection.classList.remove("hidden");

});

showLogin.addEventListener("click", (e) => {

  e.preventDefault();

  registerSection.classList.add("hidden");

  forgotSection.classList.add("hidden");

  loginSection.classList.remove("hidden");

});

showForgot?.addEventListener("click", (e) => {

  e.preventDefault();

  loginSection.classList.add("hidden");

  registerSection.classList.add("hidden");

  forgotSection.classList.remove("hidden");

});

backToLogin?.addEventListener("click", (e) => {

  e.preventDefault();

  forgotSection.classList.add("hidden");

  loginSection.classList.remove("hidden");

});

// toggle gm code input

registerRole.addEventListener("change", () => {

  gmCodeInput.classList.toggle("hidden", registerRole.value !== "GM");

});

// ---------------------- REGISTER ----------------------

registerBtn.addEventListener("click", async () => {

  const name = registerName.value.trim();

  const email = registerEmail.value.trim();

  const password = registerPassword.value.trim();

  const role = registerRole.value;

  const gmCode = gmCodeInput.value.trim();

  if (!name || !email || !password || !role) {

    return showToast("Please fill out all fields", "error");

  }

  if (role === "GM" && gmCode !== "CRRD") {

    return showToast("Invalid GM approval code!", "error");

  }

  try {

    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", userCred.user.uid), {

      name,

      email,

      role

    });

    showToast("Registration successful! Please login.", "success");

    // switch to login view

    registerSection.classList.add("hidden");

    loginSection.classList.remove("hidden");

  } catch (err) {

    showToast(err.message || "Registration failed", "error");

    console.error(err);

  }

});

// ---------------------- LOGIN ----------------------

loginBtn.addEventListener("click", async () => {

  const email = loginEmail.value.trim();

  const password = loginPassword.value.trim();

  if (!email || !password) return showToast("Enter email and password", "error");

  try {

    await signInWithEmailAndPassword(auth, email, password);

    showToast("Login successful!", "success");

  } catch (err) {

    showToast("Invalid email or password!", "error");

    console.error(err);

  }

});

// ---------------------- FORGOT PASSWORD ----------------------

forgotBtn.addEventListener("click", async () => {

  const email = forgotEmail.value.trim();

  if (!email) return showToast("Enter your email", "error");

  try {

    await sendPasswordResetEmail(auth, email);

    showToast("Password reset email sent. Check your inbox.", "success");

    forgotSection.classList.add("hidden");

    loginSection.classList.remove("hidden");

  } catch (err) {

    showToast(err.message || "Failed to send reset email", "error");

    console.error(err);

  }

});

// ---------------------- LOGOUT ----------------------

logoutBtn.addEventListener("click", async () => {

  await signOut(auth);

  showToast("Logged out successfully", "info");

});

// ---------------------- AUTH STATE CHANGE ----------------------

onAuthStateChanged(auth, async (user) => {

  if (user) {

    // fetch user record

    const snap = await getDoc(doc(db, "users", user.uid));

    const data = snap.exists() ? snap.data() : { name: "Unknown", role: "User" };

    authSection.classList.add("hidden");

    appSection.classList.remove("hidden");

    userNameDisplay.textContent = `👋 Welcome, ${data.name} (${data.role})`;

    gmFilters.classList.toggle("hidden", data.role !== "GM");

    gmBackground.classList.toggle("hidden", data.role !== "GM");

    requestDate.value = new Date().toLocaleDateString();

    // listen requests with role-aware rendering

    listenRequests(user.uid, data.role);

  } else {

    appSection.classList.add("hidden");

    authSection.classList.remove("hidden");

  }

});

// ---------------------- INPUT RESTRICTION ----------------------

requestUnit.addEventListener("input", () => {

  requestUnit.value = requestUnit.value.replace(/[^a-zA-Z\s]/g, "");

});

editUnit?.addEventListener("input", () => {

  editUnit.value = editUnit.value.replace(/[^a-zA-Z\s]/g, "");

});

// ---------------------- CLOUDINARY UPLOAD (XHR for progress) ----------------------

async function uploadImage(file) {

  if (!file) return null;

  const fd = new FormData();

  fd.append("file", file);

  fd.append("upload_preset", UPLOAD_PRESET);

  const progressInner = progressBar.querySelector("div");

  progressBar.classList.remove("hidden");

  progressInner.style.width = "0%";

  return new Promise((resolve) => {

    const xhr = new XMLHttpRequest();

    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`);

    xhr.upload.onprogress = (e) => {

      if (e.lengthComputable) {

        const percent = (e.loaded / e.total) * 100;

        progressInner.style.width = percent + "%";

      }

    };

    xhr.onload = () => {

      progressBar.classList.add("hidden");

      try {

        const res = JSON.parse(xhr.responseText);

        resolve(res.secure_url || null);

      } catch (err) {

        console.error("Upload parse error", err);

        resolve(null);

      }

    };

    xhr.onerror = (err) => {

      progressBar.classList.add("hidden");

      console.error("Upload error", err);

      resolve(null);

    };

    xhr.send(fd);

  });

}

// ---------------------- SUBMIT REQUEST ----------------------

submitRequestBtn.addEventListener("click", async () => {

  const user = auth.currentUser;

  if (!user) return showToast("Please login first", "error");

  const particular = requestParticular.value.trim();

  const unit = requestUnit.value.trim();

  const qty = requestQty.value.trim();

  const file = requestImage.files[0];

  if (!particular || !unit || !qty) {

    return showToast("Please fill all request fields", "error");

  }

  showToast("Uploading image (if provided)...", "info");

  const imageUrl = await uploadImage(file);

  try {

    const userSnap = await getDoc(doc(db, "users", user.uid));

    const userData = userSnap.exists() ? userSnap.data() : { name: "Unknown", role: "User" };

    await addDoc(collection(db, "requests"), {

      date: requestDate.value,

      particular,

      unit,

      qty,

      imageUrl: imageUrl || null,

      status: "Pending",

      userId: user.uid,

      userName: userData.name,

      userRole: userData.role,

      timestamp: serverTimestamp()

    });

    showToast("Request submitted!", "success");

    // clear form

    requestParticular.value = "";

    requestUnit.value = "";

    requestQty.value = "";

    requestImage.value = "";

  } catch (err) {

    showToast(err.message || "Failed to submit request", "error");

    console.error(err);

  }

});

// ---------------------- LISTEN REQUESTS (all users can view all requests) ----------------------

let activeRequestsUnsub = null;

function listenRequests(uid, role) {

  // detach previous listener if exists

  if (activeRequestsUnsub) {

    activeRequestsUnsub();

    activeRequestsUnsub = null;

  }

  const q = query(collection(db, "requests"), orderBy("timestamp", "desc"));

  activeRequestsUnsub = onSnapshot(q, (snapshot) => {

    requestsList.innerHTML = "";

    snapshot.forEach((docSnap) => {

      const data = docSnap.data();

      const id = docSnap.id;

      // FILTERS (if GM filter UI is used)

      const from = filterFromDate.value ? new Date(filterFromDate.value) : null;

      const to = filterToDate.value ? new Date(filterToDate.value) : null;

      const statusFilter = filterStatus.value || "All";

      let dateValid = true;

      if (from && to) {

        const reqDate = new Date(data.date);

        dateValid = reqDate >= from && reqDate <= to;

      }

      const statusValid = statusFilter === "All" || data.status === statusFilter;

      if (!(dateValid && statusValid)) return;

      // Build UI element

      const div = document.createElement("div");

      div.className = "request-item";

      // Keep consistent format

      div.innerHTML = `

        <p><b>Date:</b> ${data.date}</p>

        <p><b>Item:</b> ${escapeHtml(data.particular)}</p>

        <p><b>Unit:</b> ${escapeHtml(data.unit)}</p>

        <p><b>Qty:</b> ${escapeHtml(String(data.qty))}</p>

        ${data.imageUrl ? `<p><img src="${data.imageUrl}" class="request-img" style="max-width:120px;cursor:pointer;border-radius:8px;"/></p>` : ""}

        <p><b>Status:</b> <span style="color:${data.status === "Approved" ? "green" : data.status === "Disapproved" ? "orange" : "gray"}">${data.status}</span></p>

        <p><b>Requested by:</b> ${escapeHtml(data.userName)}</p>

      `;

      const btnContainer = document.createElement("div");

      btnContainer.className = "request-buttons";

      // GM actions

      if (role === "GM") {

        const approveBtn = document.createElement("button");

        approveBtn.className = "approve";

        approveBtn.textContent = "Approve";

        approveBtn.onclick = async () => {

          try {

            await updateDoc(doc(db, "requests", id), { status: "Approved" });

            showToast("Request Approved", "success");

          } catch (err) {

            showToast("Failed to approve", "error");

            console.error(err);

          }

        };

        const disapproveBtn = document.createElement("button");

        disapproveBtn.className = "disapprove";

        disapproveBtn.textContent = "Disapprove";

        disapproveBtn.onclick = async () => {

          try {

            await updateDoc(doc(db, "requests", id), { status: "Disapproved" });

            showToast("Request Disapproved", "error");

          } catch (err) {

            showToast("Failed to disapprove", "error");

            console.error(err);

          }

        };

        btnContainer.append(approveBtn, disapproveBtn);

      }

      // Owner actions (edit/delete) - only if user is owner and status pending

      if (data.userId === uid) {

        if (data.status === "Pending") {

          const editBtn = document.createElement("button");

          editBtn.className = "edit";

          editBtn.textContent = "Edit";

          editBtn.onclick = () => openEditModal(id, data);

          const deleteBtn = document.createElement("button");

          deleteBtn.className = "delete";

          deleteBtn.textContent = "Delete";

          deleteBtn.onclick = async () => {

            if (!confirm("Delete this request?")) return;

            try {

              await deleteDoc(doc(db, "requests", id));

              showToast("Request deleted", "info");

            } catch (err) {

              showToast("Failed to delete", "error");

              console.error(err);

            }

          };

          btnContainer.append(editBtn, deleteBtn);

        } else {

          // if approved/disapproved, allow delete only? (we'll prevent delete after approved/disapproved as safer)

        }

      }

      div.appendChild(btnContainer);

      requestsList.appendChild(div);

      // image fullscreen modal

      const img = div.querySelector(".request-img");

      if (img) {

        img.addEventListener("click", () => {

          modalImg.src = img.src;

          imageModal.classList.remove("hidden");

        });

      }

    });

  });

}

// ---------------------- ESCAPE HTML (to avoid injection in innerHTML) ----------------------

function escapeHtml(unsafe) {

  return String(unsafe)

    .replaceAll("&", "&amp;")

    .replaceAll("<", "&lt;")

    .replaceAll(">", "&gt;")

    .replaceAll('"', "&quot;")

    .replaceAll("'", "&#039;");

}

// ---------------------- IMAGE MODAL CLOSE ----------------------

closeModal.addEventListener("click", () => imageModal.classList.add("hidden"));

imageModal.addEventListener("click", (e) => { if (e.target === imageModal) imageModal.classList.add("hidden"); });

// ---------------------- FILTER BUTTONS ----------------------

applyFilterBtn.addEventListener("click", async () => {

  const user = auth.currentUser;

  if (!user) return;

  // re-fetch user role and re-run listener (listener itself uses UI filter values)

  const snap = await getDoc(doc(db, "users", user.uid));

  listenRequests(user.uid, snap.exists() ? snap.data().role : "User");

  showToast("Filter applied", "info");

});

clearFilterBtn.addEventListener("click", async () => {

  filterFromDate.value = "";

  filterToDate.value = "";

  filterStatus.value = "All";

  const user = auth.currentUser;

  if (!user) return;

  const snap = await getDoc(doc(db, "users", user.uid));

  listenRequests(user.uid, snap.exists() ? snap.data().role : "User");

});

// ---------------------- SCROLL UP ----------------------

window.addEventListener("scroll", () => {

  scrollBtn.style.display = window.scrollY > 200 ? "block" : "none";

});

scrollBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ---------------------- GM BACKGROUND UPLOAD ----------------------

bgUpload.addEventListener("change", async () => {

  const file = bgUpload.files[0];

  if (!file) return;

  const url = await uploadImage(file);

  if (url) {

    document.body.style.backgroundImage = `url(${url})`;

    showToast("Background updated!", "success");

  } else {

    showToast("Background update failed", "error");

  }

});

// ---------------------- EDIT MODAL HANDLING ----------------------

function openEditModal(id, data) {

  currentEditId = id;

  editParticular.value = data.particular || "";

  editUnit.value = data.unit || "";

  editQty.value = data.qty || "";

  editModal.classList.remove("hidden");

}

cancelEditBtn.addEventListener("click", () => {

  currentEditId = null;

  editModal.classList.add("hidden");

});

saveEditBtn.addEventListener("click", async () => {

  if (!currentEditId) return showToast("No request selected", "error");

  const particular = editParticular.value.trim();

  const unit = editUnit.value.trim();

  const qty = editQty.value.trim();

  if (!particular || !unit || !qty) return showToast("Fill all fields", "error");

  try {

    // only update particular/unit/qty and keep status/timestamp

    await updateDoc(doc(db, "requests", currentEditId), {

      particular,

      unit,

      qty,

      // optional: mark edited timestamp - but spec didn't request it

    });

    showToast("Request updated", "success");

    editModal.classList.add("hidden");

    currentEditId = null;

  } catch (err) {

    showToast("Update failed", "error");

    console.error(err);

  }

});

// close edit modal by clicking outside

editModal.addEventListener("click", (e) => { if (e.target === editModal) editModal.classList.add("hidden"); });

// ---------------------- CLEANUP BEFORE EXIT (optional) ----------------------

window.addEventListener("beforeunload", () => {

  if (activeRequestsUnsub) activeRequestsUnsub();

});

// ---------------------- END OF FILE ----------------------