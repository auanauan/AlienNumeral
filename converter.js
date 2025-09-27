class AlienNumeralConverter {
    constructor() {
        // ตารางค่าของสัญลักษณ์มนุษย์ต่างดาวแต่ละตัว
        this.symbolValues = {
            'A': 1,
            'B': 5,
            'Z': 10,
            'L': 50,
            'C': 100,
            'D': 500,
            'R': 1000
        };
        // คู่สัญลักษณ์ที่ใช้การลบ (สัญลักษณ์เล็กมาก่อนสัญลักษณ์ใหญ่)
        this.subtractionPairs = {
            'AB': 4, // A อยู่หน้า B
            'AZ': 9, // A อยู่หน้า Z
            'ZL': 40, // Z อยู่หน้า L
            'ZC': 90, // Z อยู่หน้า C
            'CD': 400, // C อยู่หน้า D
            'CR': 900 // C อยู่หน้า R
        };
    }
    // ฟังก์ชันหลักสำหรับแปลงตัวเลขมนุษย์ต่างดาวเป็นตัวเลขปกติ
    convert(alienNumeral) {
        if (!alienNumeral || !this.isValidAlienNumeral(alienNumeral)) {
            throw new Error('Invalid Alien numeral');
        }
        let total = 0;
        let i = 0;
        while (i < alienNumeral.length) {
            // ตรวจสอบคู่การลบก่อน (เช่น AB, AZ)
            if (i < alienNumeral.length - 1) {
                const pair = alienNumeral.substring(i, i + 2);
                if (this.subtractionPairs.hasOwnProperty(pair)) {
                    total += this.subtractionPairs[pair];
                    i += 2;
                    continue;
                }
            }
            // สัญลักษณ์เดี่ยว
            const symbol = alienNumeral[i];
            if (this.symbolValues.hasOwnProperty(symbol)) {
                total += this.symbolValues[symbol];
                i++;
            }
            else {
                throw new Error(`Invalid symbol: ${symbol}`);
            }
        }
        return total;
    }
    // ฟังก์ชันสำหรับแยกย่อยการคำนวณให้ผู้ใช้เห็น
    getBreakdown(alienNumeral) {
        if (!alienNumeral || !this.isValidAlienNumeral(alienNumeral)) {
            return [];
        }
        const breakdown = [];
        let i = 0;
        while (i < alienNumeral.length) {
            // ตรวจสอบคู่การลบก่อน
            if (i < alienNumeral.length - 1) {
                const pair = alienNumeral.substring(i, i + 2);
                if (this.subtractionPairs.hasOwnProperty(pair)) {
                    breakdown.push({
                        symbol: pair,
                        value: this.subtractionPairs[pair],
                        operation: 'subtract'
                    });
                    i += 2;
                    continue;
                }
            }
            // สัญลักษณ์เดี่ยว
            const symbol = alienNumeral[i];
            if (this.symbolValues.hasOwnProperty(symbol)) {
                breakdown.push({
                    symbol: symbol,
                    value: this.symbolValues[symbol],
                    operation: 'add'
                });
                i++;
            }
            else {
                break;
            }
        }
        return breakdown;
    }
    // ตรวจสอบว่าสัญลักษณ์ที่ใส่มาถูกต้องหรือไม่
    isValidAlienNumeral(numeral) {
        const validSymbols = /^[ABZLCDR]+$/;
        return validSymbols.test(numeral);
    }
    // คืนค่าสัญลักษณ์ที่ใช้ได้ทั้งหมด
    getValidSymbols() {
        return Object.keys(this.symbolValues);
    }
}
class AlienUI {
    constructor() {
        this.converter = new AlienNumeralConverter();
        this.initializeElements();
        this.bindEvents();
    }
    initializeElements() {
        this.inputElement = document.getElementById('alien-input');
        this.resultValueElement = document.getElementById('result-value');
        this.breakdownElement = document.getElementById('breakdown');
        this.convertButton = document.getElementById('convert-btn');
        this.clickSound = document.getElementById('click-sound');
    }
    bindEvents() {
        // เมื่อกดปุ่มแปลง
        this.convertButton.addEventListener('click', () => {
            this.playClickSound();
            this.handleConvert();
        });
        // เมื่อกด Enter ในช่องใส่ข้อมูล
        this.inputElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.playClickSound();
                this.handleConvert();
            }
        });
        // แปลงตัวอักษรเป็นพิมพ์ใหญ่และตรวจสอบ
        this.inputElement.addEventListener('input', (e) => {
            const target = e.target;
            target.value = target.value.toUpperCase();
            this.validateInput(target.value);
        });
        // จัดการคลิกตัวอย่าง
        const examples = document.querySelectorAll('.example-item');
        examples.forEach(example => {
            example.addEventListener('click', () => {
                this.playClickSound();
                const exampleValue = example.getAttribute('data-example');
                if (exampleValue) {
                    this.inputElement.value = exampleValue;
                    this.handleConvert();
                    example.classList.add('clicked');
                    setTimeout(() => example.classList.remove('clicked'), 300);
                }
            });
        });
    }
    // เล่นเสียงคลิกเมื่อมีการกดปุ่ม
    playClickSound() {
        if (this.clickSound) {
            this.clickSound.currentTime = 0; // รีเซ็ตเสียงกลับไปเริ่มต้น
            this.clickSound.play().catch(() => {
                // จัดการข้อจำกัด autoplay ของเบราว์เซอร์
            });
        }
    }
    // ฟังก์ชันหลักสำหรับการแปลง
    handleConvert() {
        const input = this.inputElement.value.trim().toUpperCase();
        if (!input) {
            this.showError('กรุณาใส่ตัวเลขมนุษย์ต่างดาว');
            return;
        }
        try {
            const result = this.converter.convert(input);
            const breakdown = this.converter.getBreakdown(input);
            this.displayResult(result);
            this.displayBreakdown(breakdown);
            this.clearError();
        }
        catch (error) {
            this.showError(error instanceof Error ? error.message : 'การแปลงล้มเหลว');
        }
    }
    // ตรวจสอบข้อมูลที่ผู้ใช้ใส่ทันทีขณะพิมพ์
    validateInput(input) {
        const validSymbols = /^[ABZLCDR]*$/;
        if (!validSymbols.test(input)) {
            this.inputElement.classList.add('invalid');
        }
        else {
            this.inputElement.classList.remove('invalid');
        }
    }
    // แสดงผลลัพธ์พร้อมอนิเมชัน
    displayResult(result) {
        this.resultValueElement.textContent = result.toString();
        this.resultValueElement.classList.add('animate-result');
        setTimeout(() => {
            this.resultValueElement.classList.remove('animate-result');
        }, 600);
    }
    // แสดงรายละเอียดการแยกย่อยการคำนวณ
    displayBreakdown(breakdown) {
        if (breakdown.length === 0) {
            this.breakdownElement.innerHTML = '';
            return;
        }
        const breakdownHtml = breakdown.map((item, index) => {
            const operationSymbol = index === 0 ? '' : (item.operation === 'add' ? ' + ' : ' + ');
            return `<span class="breakdown-item ${item.operation}">
                ${operationSymbol}${item.symbol} (${item.value})
            </span>`;
        }).join('');
        this.breakdownElement.innerHTML = `<div class="breakdown-content">
            <span class="breakdown-label">การแยกย่อย:</span>
            ${breakdownHtml}
        </div>`;
    }
    // แสดงข้อความผิดพลาด
    showError(message) {
        this.resultValueElement.textContent = 'ผิดพลาด';
        const thaiMessage = message.includes('Invalid') ? 'กรุณาใส่สัญลักษณ์ที่ถูกต้อง (A, B, Z, L, C, D, R เท่านั้น)' : message;
        this.breakdownElement.innerHTML = `<div class="error-message">${thaiMessage}</div>`;
        this.inputElement.classList.add('error');
    }
    // ล้างข้อความผิดพลาด
    clearError() {
        this.inputElement.classList.remove('error', 'invalid');
    }
}
// คลาสสำหรับจัดการเพลงพื้นหลังและ visual equalizer
class MusicController {
    constructor() {
        this.isPlaying = false;
        this.currentSongIndex = 0;
        // รายชื่อเพลงที่มีใน assets
        this.songs = [
            { name: "Pikachu Beach", file: "assets/sounds/music/pikachu_beach.ogg" },
            { name: "Pokemon Jump", file: "assets/sounds/music/pokemon_jump.ogg" },
            { name: "Fallarbor Town", file: "assets/sounds/music/fallarbor_town.ogg" },
            { name: "Classic Battle", file: "assets/sounds/music/classic_battle.ogg" }
        ];
        this.initializeElements();
        this.bindEvents();
        this.setupMusic();
    }
    initializeElements() {
        this.backgroundMusic = document.getElementById('background-music');
        this.equalizerBox = document.getElementById('equalizer-box');
        this.equalizerLines = document.querySelectorAll('.equalizer-line');
    }
    bindEvents() {
        // เมื่อคลิก equalizer
        this.equalizerBox.addEventListener('click', () => {
            this.toggleMusic();
        });
    }
    setupMusic() {
        // สุ่มเพลงเมื่อเริ่มต้น
        this.randomizeSong();
        // ตั้งค่าระดับเสียงเริ่มต้น
        this.backgroundMusic.volume = 0.3;
        // จัดการเมื่อเพลงจบ
        this.backgroundMusic.addEventListener('ended', () => {
            this.nextSong();
        });
        // พยายามเล่นเพลงอัตโนมัติหลายครั้ง
        setTimeout(() => {
            this.forcePlayMusic();
        }, 500);
        // ลองเล่นอีกครั้งหลังจาก user มีปฏิสัมพันธ์กับหน้าเว็บ
        document.addEventListener('click', () => {
            if (!this.isPlaying) {
                this.forcePlayMusic();
            }
        }, { once: true });
    }
    // ฟังก์ชันสุ่มเพลง
    randomizeSong() {
        this.currentSongIndex = Math.floor(Math.random() * this.songs.length);
        const randomSong = this.songs[this.currentSongIndex];
        this.backgroundMusic.src = randomSong.file;
        console.log(`Random song selected: ${randomSong.name}`);
    }
    // ฟังก์ชันสำหรับบังคับเล่นเพลง
    forcePlayMusic() {
        this.backgroundMusic.play().then(() => {
            this.isPlaying = true;
            this.startEqualizer();
            console.log('Music started successfully');
        }).catch((error) => {
            console.log('Autoplay blocked by browser:', error);
            // ถ้า autoplay ถูกบล็อก ให้รอให้ user คลิกเอง
        });
    }
    toggleMusic() {
        if (this.isPlaying) {
            this.pauseMusic();
        }
        else {
            this.playMusic();
        }
    }
    playMusic() {
        this.backgroundMusic.play().then(() => {
            this.isPlaying = true;
            this.startEqualizer();
        }).catch(() => {
            // จัดการข้อจำกัด autoplay
            console.log('Cannot autoplay music');
        });
    }
    pauseMusic() {
        this.backgroundMusic.pause();
        this.isPlaying = false;
        this.stopEqualizer();
    }
    // เริ่มอนิเมชัน equalizer
    startEqualizer() {
        this.equalizerLines.forEach(line => {
            line.classList.add('running');
        });
    }
    // หยุดอนิเมชัน equalizer
    stopEqualizer() {
        this.equalizerLines.forEach(line => {
            line.classList.remove('running');
        });
    }
    nextSong() {
        this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
        const newSong = this.songs[this.currentSongIndex];
        // เปลี่ยนซอร์สเพลง
        this.backgroundMusic.src = newSong.file;
        // เล่นเพลงใหม่ถ้ากำลังเล่นอยู่
        if (this.isPlaying) {
            this.backgroundMusic.load();
            this.playMusic();
        }
    }
    // เมธอดสาธารณะสำหรับเล่นเพลงจากภายนอก
    startMusic() {
        if (!this.isPlaying) {
            this.playMusic();
        }
    }
}
// เริ่มต้นแอปพลิเคชันเมื่อ DOM โหลดเสร็จสมบูรณ์
document.addEventListener('DOMContentLoaded', () => {
    new AlienUI();
    new MusicController();
});
