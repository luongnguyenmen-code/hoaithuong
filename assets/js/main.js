// ==========================================
// 1. CẤU HÌNH FIREBASE
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyBLo3ngpAy-rkJI8oBDqZw249_OtehrOCM",
    authDomain: "thiepcuoi-hoaithuong.firebaseapp.com",
    projectId: "thiepcuoi-hoaithuong",
    storageBucket: "thiepcuoi-hoaithuong.firebasestorage.app",
    messagingSenderId: "6978309506",
    appId: "1:6978309506:web:590f35653391bf6d8a139b"
  };

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ==========================================
// 2. CẤU HÌNH MẶC ĐỊNH (GIỮ NGUYÊN CỦA BẠN)
// ==========================================
const defaultConfig = {
    background_color: "#8B1538",
    surface_color: "#ffffff",
    text_color: "#333333",
    primary_action_color: "#C41E3A",
    secondary_action_color: "#8B1538",
    bride_name: "Hoài Thương",
    groom_name: "Thanh Phong",
    wedding_date: "🤍 28-29/12/2025 🤍",
    invitation_title: "Trân Trọng Kính Mời",
    invitation_text: "Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng tôi. Chúng tôi rất mong được đón tiếp quý khách trong ngày trọng đại này.",
    event_time: "18:00 - 20:00",
    event_location: "Trung tâm Tiệc Cưới Palace",
    messages_title: "Sổ Lưu Bút"
};

let allMessages = [];

// ==========================================
// 3. XỬ LÝ DỮ LIỆU FIREBASE (THAY THẾ dataSdk)
// ==========================================

// Hàm khởi tạo lắng nghe dữ liệu từ Firebase
function initFirebase() {
    db.collection('wishes')
      .orderBy('created_at', 'desc')
      .onSnapshot((snapshot) => {
          allMessages = snapshot.docs.map(doc => {
              return { ...doc.data(), id: doc.id };
          });
          renderMessages();
      }, (error) => {
          console.error("Lỗi kết nối:", error);
      });
}

// Hàm gửi lời chúc lên Firebase
async function handleSubmitMessage(event) {
    event.preventDefault();

    const guestName = document.getElementById('guest-name').value.trim();
    const messageText = document.getElementById('message-text').value.trim();
    const submitBtn = document.getElementById('submit-btn');

    if (!guestName || !messageText) return;

    // Kiểm tra giới hạn local trước khi gửi (để giảm request không cần thiết)
    if (allMessages.length >= 999) {
        showToast("Đã đạt giới hạn lời chúc. Vui lòng liên hệ chủ sự kiện.");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Đang gửi...";

    try {
        await db.collection('wishes').add({
            guest_name: guestName,
            message: messageText,
            created_at: new Date().toISOString()
        });

        document.getElementById('message-form').reset();
        showToast("Đã gửi lời chúc thành công! ❤️");
    } catch (error) {
        console.error("Lỗi gửi tin:", error);
        showToast("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Gửi Lời Chúc 💝";
    }
}

// ==========================================
// 4. CÁC HÀM GIAO DIỆN (GIỮ NGUYÊN 100%)
// ==========================================

function renderMessages() {
    const container = document.getElementById('messages-container');

    if (allMessages.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-500 py-12">Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc! 💝</p>';
        return;
    }

    // Firebase đã sort rồi nhưng giữ lại sort client để chắc chắn
    const sortedMessages = [...allMessages].sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
    });

    container.innerHTML = sortedMessages.map(msg => {
        const date = new Date(msg.created_at);
        const formattedDate = date.toLocaleDateString('vi-VN');
        // Lấy màu từ config hiện tại
        const nameColor = window.elementSdk?.config?.primary_action_color || defaultConfig.primary_action_color;
        
        return `
            <div class="message-card">
                <div class="flex justify-between items-start mb-3">
                    <h4 class="font-semibold text-lg" style="color: ${nameColor};">${msg.guest_name}</h4>
                    <span class="text-sm text-gray-400">${formattedDate}</span>
                </div>
                <p class="text-gray-700 leading-relaxed">${msg.message}</p>
            </div>
        `;
    }).join('');
}

function openInvitation() {
    document.getElementById('invitation-modal').classList.add('active');
}

function closeInvitation(event) {
    if (!event || event.target.id === 'invitation-modal') {
        document.getElementById('invitation-modal').classList.remove('active');
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('active');
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

function openEnvelope() {
    const envelope = document.getElementById('envelope');
    const openButton = document.getElementById('open-button');

    envelope.classList.add('open');
    openButton.style.display = 'none';

    createFallingElements();

    setTimeout(() => {
        const overlay = document.getElementById('envelope-overlay');
        overlay.classList.add('hidden');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 800);
    }, 3000);
}

function createFallingElements() {
    const container = document.getElementById('falling-petals');
    const numPetals = 20;
    const numSparkles = 15;

    for (let i = 0; i < numPetals; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (Math.random() * 3 + 4) + 's';
        petal.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(petal);

        setTimeout(() => petal.remove(), 8000);
    }

    for (let i = 0; i < numSparkles; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.animationDuration = (Math.random() * 2 + 3) + 's';
        sparkle.style.animationDelay = Math.random() * 1.5 + 's';
        container.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 6000);
    }
}

function addContinuousPetals() {
    setInterval(() => {
        const container = document.getElementById('falling-petals');
        if (!container || container.children.length > 30) return;

        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (Math.random() * 3 + 4) + 's';
        container.appendChild(petal);

        setTimeout(() => petal.remove(), 7000);
    }, 3000);
}

// ==========================================
// 5. LOGIC CHỈNH MÀU & SLIDER (GIỮ NGUYÊN)
// ==========================================

async function onConfigChange(config) {
    const backgroundColor = config.background_color || defaultConfig.background_color;
    const surfaceColor = config.surface_color || defaultConfig.surface_color;
    const textColor = config.text_color || defaultConfig.text_color;
    const primaryActionColor = config.primary_action_color || defaultConfig.primary_action_color;
    const secondaryActionColor = config.secondary_action_color || defaultConfig.secondary_action_color;

    document.querySelector('.hero-section').style.background = `linear-gradient(135deg, ${secondaryActionColor} 0%, ${primaryActionColor} 100%)`;

    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(btn => {
        btn.style.background = `linear-gradient(135deg, ${secondaryActionColor} 0%, ${primaryActionColor} 100%)`;
        btn.style.boxShadow = `0 4px 15px ${primaryActionColor}4D`;
    });

    const secondaryButtons = document.querySelectorAll('.btn-secondary');
    secondaryButtons.forEach(btn => {
        btn.style.color = primaryActionColor;
        btn.style.borderColor = primaryActionColor;
    });

    const headings = document.querySelectorAll('h2');
    headings.forEach(h => {
        h.style.color = secondaryActionColor;
    });

    const messageCards = document.querySelectorAll('.message-card');
    messageCards.forEach(card => {
        card.style.borderLeftColor = primaryActionColor;
        card.style.boxShadow = `0 2px 8px ${primaryActionColor}1A`;
    });

    document.querySelector('.invitation-content').style.borderColor = primaryActionColor;
    document.querySelector('.qr-code').style.borderColor = primaryActionColor;

    const qrRects = document.querySelectorAll('.qr-code g');
    qrRects.forEach(g => {
        g.setAttribute('fill', primaryActionColor);
    });

    document.getElementById('toast').style.background = primaryActionColor;

    document.getElementById('bride-name').textContent = config.bride_name || defaultConfig.bride_name;
    document.getElementById('groom-name').textContent = config.groom_name || defaultConfig.groom_name;
    document.getElementById('wedding-date').textContent = config.wedding_date || defaultConfig.wedding_date;

    document.getElementById('envelope-bride-name').textContent = config.bride_name || defaultConfig.bride_name;
    document.getElementById('envelope-groom-name').textContent = config.groom_name || defaultConfig.groom_name;
    document.getElementById('envelope-wedding-date').textContent = config.wedding_date || defaultConfig.wedding_date;
    document.getElementById('invitation-title').textContent = config.invitation_title || defaultConfig.invitation_title;
    document.getElementById('invitation-text').textContent = config.invitation_text || defaultConfig.invitation_text;
    document.getElementById('event-time').textContent = config.event_time || defaultConfig.event_time;
    document.getElementById('event-location').textContent = config.event_location || defaultConfig.event_location;
    document.getElementById('messages-title').textContent = config.messages_title || defaultConfig.messages_title;

    document.getElementById('modal-bride-name').textContent = config.bride_name || defaultConfig.bride_name;
    document.getElementById('modal-groom-name').textContent = config.groom_name || defaultConfig.groom_name;
    document.getElementById('modal-wedding-date').textContent = config.wedding_date || defaultConfig.wedding_date;
    document.getElementById('modal-event-time').textContent = config.event_time || defaultConfig.event_time;
    document.getElementById('modal-event-location').textContent = config.event_location || defaultConfig.event_location;
}

if (window.elementSdk) {
    window.elementSdk.init({
        defaultConfig,
        onConfigChange,
        mapToCapabilities: (config) => ({
            recolorables: [
                {
                    get: () => config.background_color || defaultConfig.background_color,
                    set: (value) => {
                        window.elementSdk.config.background_color = value;
                        window.elementSdk.setConfig({ background_color: value });
                    }
                },
                {
                    get: () => config.surface_color || defaultConfig.surface_color,
                    set: (value) => {
                        window.elementSdk.config.surface_color = value;
                        window.elementSdk.setConfig({ surface_color: value });
                    }
                },
                {
                    get: () => config.text_color || defaultConfig.text_color,
                    set: (value) => {
                        window.elementSdk.config.text_color = value;
                        window.elementSdk.setConfig({ text_color: value });
                    }
                },
                {
                    get: () => config.primary_action_color || defaultConfig.primary_action_color,
                    set: (value) => {
                        window.elementSdk.config.primary_action_color = value;
                        window.elementSdk.setConfig({ primary_action_color: value });
                    }
                },
                {
                    get: () => config.secondary_action_color || defaultConfig.secondary_action_color,
                    set: (value) => {
                        window.elementSdk.config.secondary_action_color = value;
                        window.elementSdk.setConfig({ secondary_action_color: value });
                    }
                }
            ],
            borderables: [],
            fontEditable: undefined,
            fontSizeable: undefined
        }),
        mapToEditPanelValues: (config) => new Map([
            ["bride_name", config.bride_name || defaultConfig.bride_name],
            ["groom_name", config.groom_name || defaultConfig.groom_name],
            ["wedding_date", config.wedding_date || defaultConfig.wedding_date],
            ["invitation_title", config.invitation_title || defaultConfig.invitation_title],
            ["invitation_text", config.invitation_text || defaultConfig.invitation_text],
            ["event_time", config.event_time || defaultConfig.event_time],
            ["event_location", config.event_location || defaultConfig.event_location],
            ["messages_title", config.messages_title || defaultConfig.messages_title]
        ])
    });
}

// Slider functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.slider-dot');
let slideInterval;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        dots[i].classList.remove('active');
    });

    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
    resetSlideInterval();
}

function goToSlide(index) {
    showSlide(index);
    resetSlideInterval();
}

function autoSlide() {
    showSlide(currentSlide + 1);
}

function resetSlideInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(autoSlide, 5000);
}

// Touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

const sliderContainer = document.querySelector('.slider-container');
if (sliderContainer) {
    sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    sliderContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        changeSlide(1);
    }
    if (touchEndX > touchStartX + 50) {
        changeSlide(-1);
    }
}

document.body.addEventListener("click", function () {
    const player = document.getElementById('player');
    if (player && player.paused) {
        player.play();
    }
});

const openBtn = document.getElementById('open-button');
if (openBtn) {
    openBtn.addEventListener('click', openEnvelope);
}

// ==========================================
// 6. KHỞI CHẠY (THAY THẾ initializeApp CŨ)
// ==========================================
initFirebase(); // <-- Thay thế dòng initializeApp() cũ
addContinuousPetals();
slideInterval = setInterval(autoSlide, 5000);