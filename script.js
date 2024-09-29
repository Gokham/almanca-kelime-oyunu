const wordPairsDiv = document.getElementById("wordPairs");
const restartButton = document.getElementById("restartButton");
const scoreDisplay = document.getElementById("score");
const levelSelect = document.getElementById("level");
const messageDisplay = document.createElement("div"); // Mesaj için yeni bir div oluştur

let currentLevel = 1;
let score = 0;
let correctMatches = 0;

const levels = {
    1: [
        { turkish: "merhaba", german: "Hallo" },
        { turkish: "teşekkür ederim", german: "Danke" },
        { turkish: "lütfen", german: "Bitte" },
        { turkish: "evet", german: "Ja" },
        { turkish: "hayır", german: "Nein" },
        { turkish: "Ev", german: "das Haus" },
        { turkish: "Daire", german: "die Wohnung" },
        { turkish: "Balkon", german: "der Balkon" },
        { turkish: "Kapı", german: "die Tür" },
        { turkish: "Pencere", german: "das Fenster" },
        { turkish: "Zil", german: "die Klingel" },
        { turkish: "Araba", german: "das Auto" },
        { turkish: "Cep Telefonu", german: "das Handy" },
        { turkish: "Lamba", german: "die Lampe" },
        { turkish: "Adam", german: "der Mann" }
    ],
    2: [
        { turkish: "güzel", german: "Schön" },
        { turkish: "çirkin", german: "Hässlich" },
        { turkish: "büyük", german: "Groß" },
        { turkish: "küçük", german: "Klein" },
        { turkish: "hızlı", german: "Schnell" },
        { turkish: "yavaş", german: "Langsam" }
    ],
    3: [
        { turkish: "arkadaş", german: "Freund" },
        { turkish: "ev", german: "Haus" },
        { turkish: "kitap", german: "Buch" },
        { turkish: "masa", german: "Tisch" },
        { turkish: "sandalyem", german: "Stuhl" }
    ]
};

// Yıldızları oluşturmak için Canvas ayarları
const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
const starCount = 100;

function createStars() {
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.5 // Hız
        });
    }
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white'; // Yıldız rengi
        ctx.fill();
        star.y += star.speed; // Yıldızın aşağı doğru hareketi
        if (star.y > canvas.height) {
            star.y = 0; // Ekranın altından çıktığında tekrar yukarı çık
            star.x = Math.random() * canvas.width; // X konumunu değiştir
        }
    });
    requestAnimationFrame(drawStars);
}

createStars();
drawStars();

function createWordCards() {
    wordPairsDiv.innerHTML = ""; // Temizle
    const words = levels[currentLevel];
    const shuffledWords = [...words].sort(() => 0.5 - Math.random());

    // Türkçe kelimeleri göster ve Almanca kelimeleri kartlara ekle
    shuffledWords.forEach((word) => {
        const card = document.createElement("div");
        card.classList.add("word-card");
        card.innerText = word.turkish; // Türkçe kelimeleri göster
        card.dataset.german = word.german; // Almanca kelimeleri sakla
        card.addEventListener("click", () => handleCardClick(card));
        wordPairsDiv.appendChild(card);
    });

    correctMatches = 0; // Doğru eşleşmeler sıfırlanıyor
    score = 0; // Puan sıfırlanıyor
    scoreDisplay.innerText = "Puan: " + score;
    restartButton.style.display = "none"; // Tekrar oynama butonu gizli
    messageDisplay.innerHTML = ""; // Mesajı temizle
    wordPairsDiv.appendChild(messageDisplay); // Mesajı ekrana ekle
}

function handleCardClick(clickedCard) {
    const germanWord = clickedCard.dataset.german;

    // Doğru eşleşme kontrolü
    if (clickedCard.classList.contains('green') || clickedCard.classList.contains('red')) {
        return; // Eğer kart daha önce seçildiyse işleme devam etme
    }

    // Kullanıcıdan Almanca kelime seçimi
    let userAnswer = prompt(`Almanca karşılığını girin (Türkçe: ${clickedCard.innerText})`);

    // Yanlış cevap verdiğinde ikinci şans
    if (userAnswer && userAnswer.toLowerCase() !== germanWord.toLowerCase()) {
        userAnswer = prompt(`Yanlış! Bir kez daha deneyin (Türkçe: ${clickedCard.innerText})`);
    }

    // Kullanıcının cevabını kontrol et
    if (userAnswer && userAnswer.toLowerCase() === germanWord.toLowerCase()) {
        clickedCard.classList.add("green");
        score++;
        correctMatches++;
    } else {
        clickedCard.classList.add("red");
        alert(`Yanlış! Doğru cevap: ${germanWord}`);
    }

    scoreDisplay.innerText = "Puan: " + score;

    // Tüm doğru eşleşmeler yapıldığında
    if (correctMatches === levels[currentLevel].length) {
        restartButton.style.display = "block"; // Tekrar oynama butonunu göster
        messageDisplay.innerHTML = "<h2>SÜPERSİN! ŞİMDİ BİR SONRAKİ SEVİYEYE GEÇELİM!</h2>"; // Mesajı göster
    }
}

levelSelect.addEventListener("change", (e) => {
    if (correctMatches === levels[currentLevel].length) {
        currentLevel = parseInt(e.target.value);
        createWordCards(); // Kelime kartlarını oluştur
    } else {
        alert("Bir üst seviyeye geçmek için önce bu seviyedeki tüm kelimeleri doğru eşleştirmeniz gerekiyor!");
        levelSelect.value = currentLevel; // Seviye değişimini engelle
    }
});

restartButton.addEventListener("click", () => {
    createWordCards(); // Tekrar oynama butonuna tıklayınca kelime kartlarını yeniden oluştur
});

createWordCards(); // İlk kelime kartlarını oluştur
