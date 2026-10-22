// Default Data Struktur Kelas & Piket
const defaultTeam = {
    wali: "Drs. Budi Santoso, M.Kom",
    ketua: "Ahmad Fauzi",
    wakil: "Siti Aminah",
    sekretaris: "Dewi Lestari",
    bendahara: "Rizky Ramadhan"
};

const defaultPiket = {
    "Senin": [
        { nama: "Ahmad Fauzi", nim: "Absen 01", role: "Ketua Kelompok" },
        { nama: "Siti Aminah", nim: "Absen 02", role: "Anggota" }
    ],
    "Selasa": [
        { nama: "Rizky Ramadhan", nim: "Absen 05", role: "Ketua Kelompok" },
        { nama: "Nurul Hidayah", nim: "Absen 06", role: "Anggota" }
    ],
    "Rabu": [
        { nama: "Dimas Anggara", nim: "Absen 09", role: "Ketua Kelompok" },
        { nama: "Putri Melati", nim: "Absen 10", role: "Anggota" }
    ],
    "Kamis": [
        { nama: "Rehan Pratama", nim: "Absen 13", role: "Ketua Kelompok" },
        { nama: "Nabila Syakira", nim: "Absen 14", role: "Anggota" }
    ],
    "Jumat": [
        { nama: "Zidan Alfarizi", nim: "Absen 17", role: "Ketua Kelompok" },
        { nama: "Tiara Anjani", nim: "Absen 18", role: "Anggota" }
    ]
};

const defaultPhoto = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80";

// Load dari localStorage atau pakai default
let currentTeam = JSON.parse(localStorage.getItem("classTeam")) || defaultTeam;
let jadwalPiket = JSON.parse(localStorage.getItem("classPiket")) || defaultPiket;
let currentPhoto = localStorage.getItem("classPhoto") || defaultPhoto;

let isEditMode = false;
let activeDayTab = "Senin";
const namaHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

document.addEventListener("DOMContentLoaded", () => {
    initClock();
    determineTodaySchedule();
    setupTabs();
    renderTeam();
    renderStructurePhoto();
});

// Live Clock
function initClock() {
    const timeText = document.getElementById("timeText");
    function update() {
        const now = new Date();
        const options = { weekday: 'long', hour: '2-digit', minute: '2-digit', second: '2-digit', day: 'numeric', month: 'short', year: 'numeric' };
        timeText.innerText = now.toLocaleDateString('id-ID', options);
    }
    update();
    setInterval(update, 1000);
}

// Hari Ini
function determineTodaySchedule() {
    const now = new Date();
    const dayIndex = now.getDay();
    const currentDayName = namaHari[dayIndex];

    if (dayIndex >= 1 && dayIndex <= 5) {
        activeDayTab = currentDayName;
        document.getElementById("dayBadge").innerText = `Piket Hari ${currentDayName}`;
        document.getElementById("todayTitle").innerText = `Kelompok Piket: ${currentDayName}`;
        document.getElementById("todayDesc").innerText = `Semangat membersihkan kelas hari ini ya! 💪`;
    } else {
        activeDayTab = "Senin";
        document.getElementById("dayBadge").innerText = "Libur Sekolah";
        document.getElementById("todayTitle").innerText = "Hari Ini Libur! 🎉";
        document.getElementById("todayDesc").innerText = "Tidak ada jadwal piket hari ini. Menampilkan jadwal hari Senin:";
    }
    renderPiketList(activeDayTab);
    setActiveTab(activeDayTab);
}

// Render Piket
function renderPiketList(day) {
    activeDayTab = day;
    const piketList = document.getElementById("piketList");
    piketList.innerHTML = "";

    const data = jadwalPiket[day] || [];
    if(data.length === 0) {
        piketList.innerHTML = `<li class="piket-item" style="justify-content:center; color:var(--text-muted);">Belum ada anggota piket.</li>`;
        return;
    }

    data.forEach((siswa, index) => {
        const initial = siswa.nama ? siswa.nama.charAt(0) : "?";
        const li = document.createElement("li");
        li.className = "piket-item";
        li.innerHTML = `
            <div class="piket-avatar">${initial}</div>
            <div class="piket-info">
                <h4>${siswa.nama}</h4>
                <p>${siswa.nim} - <span style="font-weight:600; color:var(--primary);">${siswa.role}</span></p>
            </div>
            ${isEditMode ? `<button class="btn-delete-item" onclick="deletePiket('${day}',${index})"><i class="fa-solid fa-trash"></i></button>` : ''}
        `;
        piketList.appendChild(li);
    });
}

// Render Struktur Pengurus Inti
function renderTeam() {
    const container = document.getElementById("coreTeamList");
    const rolesMap = [
        { key: "wali", label: "Wali Kelas" },
        { key: "ketua", label: "Ketua Kelas" },
        { key: "wakil", label: "Wakil Ketua" },
        { key: "sekretaris", label: "Sekretaris" },
        { key: "bendahara", label: "Bendahara" }
    ];

    container.innerHTML = "";
    rolesMap.forEach(item => {
        const nameVal = currentTeam[item.key] || "-";
        const div = document.createElement("div");
        div.className = "team-item";
        div.innerHTML = `
            <span class="role">${item.label}</span>
            <div class="name-container">
                <span class="name">${nameVal}</span>
                <button class="btn-edit-mini" id="btn_edit_${item.key}" style="display: ${isEditMode ? 'flex' : 'none'};" onclick="openEditTeamModal('${item.key}', '${item.label}', '${nameVal}')">
                    <i class="fa-solid fa-pen"></i>
                </button>
            </div>
        `;
        container.appendChild(div);
    });
}

function renderStructurePhoto() {
    const imgEl = document.getElementById("structureImg");
    imgEl.src = currentPhoto;
}

// Toggle Mode Edit Global
function toggleEditMode() {
    isEditMode = !isEditMode;
    const btn = document.getElementById("editModeBtn");
    const addPiketDiv = document.getElementById("addPiketContainer");
    const overlayLabel = document.getElementById("overlayLabel");

    if (isEditMode) {
        btn.classList.add("active");
        btn.innerHTML = `<i class="fa-solid fa-check"></i> Selesai Edit`;
        addPiketDiv.style.display = "block";
        overlayLabel.innerText = "Klik untuk Ganti Foto Struktur";
    } else {
        btn.classList.remove("active");
        btn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Mode Edit`;
        addPiketDiv.style.display = "none";
        overlayLabel.innerText = "Klik untuk Perbesar Foto";
    }

    renderTeam();
    renderPiketList(activeDayTab);
}

// Tab Navigasi Hari
function setupTabs() {
    const buttons = document.querySelectorAll(".tab-btn");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const selectedDay = btn.getAttribute("data-day");
            setActiveTab(selectedDay);
            renderPiketList(selectedDay);
        });
    });
}

function setActiveTab(day) {
    document.querySelectorAll(".tab-btn").forEach(btn => {
        if(btn.getAttribute("data-day") === day) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}

// --- MODAL & FORM HANDLERS ---
function handlePhotoClick() {
    if (isEditMode) {
        document.getElementById("changePhotoModal").style.display = "flex";
        document.getElementById("photoUrlInput").value = currentPhoto;
    } else {
        const modal = document.getElementById("photoModal");
        const modalImg = document.getElementById("imgModalTarget");
        modal.style.display = "flex";
        modalImg.src = currentPhoto;
    }
}

function closeModal() {
    document.getElementById("photoModal").style.display = "none";
}

function closeChangePhotoModal() {
    document.getElementById("changePhotoModal").style.display = "none";
}

function saveNewPhoto(e) {
    e.preventDefault();
    const newUrl = document.getElementById("photoUrlInput").value;
    currentPhoto = newUrl;
    localStorage.setItem("classPhoto", currentPhoto);
    renderStructurePhoto();
    closeChangePhotoModal();
}

// Edit Team Member
function openEditTeamModal(key, label, currentName) {
    document.getElementById("editTeamModal").style.display = "flex";
    document.getElementById("editRoleKey").value = key;
    document.getElementById("labelEditRoleTitle").innerText = `Edit Nama ${label}`;
    document.getElementById("editNameInput").value = currentName;
}

function closeEditTeamModal() {
    document.getElementById("editTeamModal").style.display = "none";
}

function saveTeamMember(e) {
    e.preventDefault();
    const key = document.getElementById("editRoleKey").value;
    const newName = document.getElementById("editNameInput").value;
    
    currentTeam[key] = newName;
    localStorage.setItem("classTeam", JSON.stringify(currentTeam));
    
    renderTeam();
    closeEditTeamModal();
}

// Tambah / Hapus Piket
function openAddPiketModal() {
    document.getElementById("editPiketModal").style.display = "flex";
    document.getElementById("piketNameInput").value = "";
    document.getElementById("piketInfoInput").value = "";
    document.getElementById("piketRoleInput").value = "Anggota";
}

function closeAddPiketModal() {
    document.getElementById("editPiketModal").style.display = "none";
}

function saveNewPiket(e) {
    e.preventDefault();
    const name = document.getElementById("piketNameInput").value;
    const info = document.getElementById("piketInfoInput").value;
    const role = document.getElementById("piketRoleInput").value;

    if (!jadwalPiket[activeDayTab]) {
        jadwalPiket[activeDayTab] = [];
    }

    jadwalPiket[activeDayTab].push({ nama: name, nim: info, role: role });
    localStorage.setItem("classPiket", JSON.stringify(jadwalPiket));

    renderPiketList(activeDayTab);
    closeAddPiketModal();
}

function deletePiket(day, index) {
    if (confirm("Yakin ingin menghapus siswa ini dari jadwal piket?")) {
        jadwalPiket[day].splice(index, 1);
        localStorage.setItem("classPiket", JSON.stringify(jadwalPiket));
        renderPiketList(day);
    }
}
