// Data Jadwal Piket per Hari
const jadwalPiket = {
    "Senin": [
        { nama: "Ahmad Fauzi", nim: "Absen 01", role: "Ketua Kelompok" },
        { nama: "Siti Aminah", nim: "Absen 02", role: "Anggota" },
        { nama: "Budi Santoso", nim: "Absen 03", role: "Anggota" },
        { nama: "Dewi Lestari", nim: "Absen 04", role: "Anggota" }
    ],
    "Selasa": [
        { nama: "Rizky Ramadhan", nim: "Absen 05", role: "Ketua Kelompok" },
        { nama: "Nurul Hidayah", nim: "Absen 06", role: "Anggota" },
        { nama: "Fajar Nugroho", nim: "Absen 07", role: "Anggota" },
        { nama: "Intan Permata", nim: "Absen 08", role: "Anggota" }
    ],
    "Rabu": [
        { nama: "Dimas Anggara", nim: "Absen 09", role: "Ketua Kelompok" },
        { nama: "Putri Melati", nim: "Absen 10", role: "Anggota" },
        { nama: "Bayu Pratama", nim: "Absen 11", role: "Anggota" },
        { nama: "Aulia Zahra", nim: "Absen 12", role: "Anggota" }
    ],
    "Kamis": [
        { nama: "Rehan Pratama", nim: "Absen 13", role: "Ketua Kelompok" },
        { nama: "Nabila Syakira", nim: "Absen 14", role: "Anggota" },
        { nama: "Yoga Pratama", nim: "Absen 15", role: "Anggota" },
        { nama: "Salsabila", nim: "Absen 16", role: "Anggota" }
    ],
    "Jumat": [
        { nama: "Zidan Alfarizi", nim: "Absen 17", role: "Ketua Kelompok" },
        { nama: "Tiara Anjani", nim: "Absen 18", role: "Anggota" },
        { nama: "Galih Wicaksono", nim: "Absen 19", role: "Anggota" },
        { nama: "Vira Amalia", nim: "Absen 20", role: "Anggota" }
    ]
};

// Pemetaan indeks hari JS (0=Minggu, 1=Senin, ..., 6=Sabtu)
const namaHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

document.addEventListener("DOMContentLoaded", () => {
    initClock();
    determineTodaySchedule();
    setupTabs();
});

// Live Clock Real-time
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

// Tentukan Jadwal Otomatis Berdasarkan Hari Ini
function determineTodaySchedule() {
    const now = new Date();
    const dayIndex = now.getDay(); // 0-6
    const currentDayName = namaHari[dayIndex];

    const todayTitle = document.getElementById("todayTitle");
    const todayDesc = document.getElementById("todayDesc");
    const dayBadge = document.getElementById("dayBadge");

    if (dayIndex === 0 || dayIndex === 6) {
        // Libur (Weekend)
        dayBadge.innerText = "Libur Sekolah";
        todayTitle.innerText = "Hari Ini Libur! 🎉";
        todayDesc.innerText = "Tidak ada jadwal piket hari ini. Selamat beristirahat dan nikmati akhir pekanmu!";
        
        // Tampilkan default hari Senin untuk tab
        renderPiketList("Senin");
        setActiveTab("Senin");
    } else {
        // Hari Sekolah Biasa
        dayBadge.innerText = `Piket Hari ${currentDayName}`;
        todayTitle.innerText = `Kelompok Piket: ${currentDayName}`;
        todayDesc.innerText = `Semangat membersihkan kelas untuk kenyamanan bersama hari ini ya! 💪`;
        
        renderPiketList(currentDayName);
        setActiveTab(currentDayName);
    }
}

// Render Data Piket ke HTML
function renderPiketList(day) {
    const piketList = document.getElementById("piketList");
    piketList.innerHTML = "";

    const data = jadwalPiket[day] || [];
    
    if(data.length === 0) {
        piketList.innerHTML = `<li class="piket-item" style="justify-content:center; color:var(--text-muted);">Tidak ada data piket.</li>`;
        return;
    }

    data.forEach((siswa, index) => {
        const initial = siswa.nama.charAt(0);
        const li = document.createElement("li");
        li.className = "piket-item";
        li.innerHTML = `
            <div class="piket-avatar">${initial}</div>
            <div class="piket-info" style="flex: 1;">
                <h4>${siswa.nama}</h4>
                <p>${siswa.nim}</p>
            </div>
            <span class="role" style="font-size:0.75rem; background:#e0e7ff; color:#4338ca; padding:4px 8px; border-radius:6px; font-weight:600;">${siswa.role}</span>
        `;
        piketList.appendChild(li);
    });
}

// Setup Navigasi Tab Hari
function setupTabs() {
    const buttons = document.querySelectorAll(".tab-btn");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const selectedDay = btn.getAttribute("data-day");
            setActiveTab(selectedDay);
            renderPiketList(selectedDay);
            
            // Ubah teks banner sedikit agar interaktif
            document.getElementById("dayBadge").innerText = `Jadwal ${selectedDay}`;
            document.getElementById("todayTitle").innerText = `Kelompok Piket: ${selectedDay}`;
            document.getElementById("todayDesc").innerText = `Berikut adalah daftar siswa yang bertugas piket pada hari ${selectedDay}.`;
        });
    });
}

function setActiveTab(day) {
    const buttons = document.querySelectorAll(".tab-btn");
    buttons.forEach(btn => {
        if(btn.getAttribute("data-day") === day) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}

// Fungsi Modal Foto Struktur Kelas
function openModal() {
    const modal = document.getElementById("photoModal");
    const modalImg = document.getElementById("imgModalTarget");
    const sourceImg = document.getElementById("structureImg");

    modal.style.display = "flex";
    modalImg.src = sourceImg.src;
}

function closeModal() {
    const modal = document.getElementById("photoModal");
    modal.style.display = "none";
         }
         
