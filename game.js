        // ===== game.js =====
        // BRAINSTORM BATTLE - FINAL FIXED VERSION
        // WITH POWER-UP SYSTEM & HP REGENERATION
        // ALL POSITIONS AND SIZES ARE PRESERVED

        // ===== GLOBAL VARIABLES =====
        let animationFrameId = null;
        let lastTime = 0;
        let gameInitialized = false;
        let regenTimer = 0;
        const REGEN_INTERVAL = 20;
        const REGEN_AMOUNT = 5;



        // ===== QUESTION BANK (loaded from database) =====
        let questionBank = [];

        // ===== EMERGENCY QUESTIONS =====
        const emergencyQuestions = [
            { q: "⚠️ EMERGENCY! What does CPU stand for?", 
            choices: ["Central Processing Unit", "Computer Personal Unit", "Central Power Unit", "Core Processing Unit"], 
            correct: 0 },
            { q: "⚠️ CRITICAL! What is RAM?", 
            choices: ["Random Access Memory", "Read Only Memory", "Rapid Action Module", "Runtime Memory"], 
            correct: 0 },
            { q: "⚠️ URGENT! Which is a storage device?", 
            choices: ["SSD", "CPU", "GPU", "PSU"], 
            correct: 0 },
            { q: "⚠️ DANGER! What does HDD stand for?", 
            choices: ["Hard Disk Drive", "High Definition Display", "Hardware Data Driver", "Hybrid Digital Drive"], 
            correct: 0 },
            { q: "⚠️ WARNING! What does SSD stand for?", 
            choices: ["Solid State Drive", "Super Speed Disk", "System Storage Device", "Serial SATA Drive"], 
            correct: 0 },
            { q: "⚠️ EMERGENCY! What is the function of the motherboard?", 
            choices: ["Connect all components", "Process data", "Store files", "Supply power"], 
            correct: 0 },
            { q: "⚠️ QUICK! Which port is used for monitors?", 
            choices: ["HDMI", "USB", "Ethernet", "Audio jack"], 
            correct: 0 },
            { q: "⚠️ FAST! What does GPU stand for?", 
            choices: ["Graphics Processing Unit", "General Power Unit", "Graphics Port Utility", "Gaming Processor Unit"], 
            correct: 0 },
            { q: "⚠️ CRITICAL! What is an operating system?", 
            choices: ["Software that manages hardware", "A type of CPU", "Storage device", "Memory module"], 
            correct: 0 },
            { q: "⚠️ URGENT! What does PSU stand for?", 
            choices: ["Power Supply Unit", "Processing System Unit", "Primary Storage Unit", "Performance Support Unit"], 
            correct: 0 }
        ];

        // ===== ITEM SYSTEM =====
        const itemDatabase = {
            keyboard: { name: "Keyboard", icon: "⌨️", stage: 6 },
            mouse: { name: "Mouse", icon: "🖱️", stage: 7 },
            monitor: { name: "Monitor", icon: "🖥️", stage: 8 },
            cpu: { name: "CPU", icon: "⚙️", stage: 9 },
            avr: { name: "AVR", icon: "🔌", stage: 10 }
        };

        let inventory = {
            keyboard: false,
            mouse: false,
            monitor: false,
            cpu: false,
            avr: false
        };

        // ===== JAVA WORDS FOR STAGES 11-15 =====
        const javaWords = {
            11: ["public", "private", "static", "void", "class", "String", "int", "double", "boolean", "float", "if", "else", "for", "while", "return"],
            12: ["println", "print", "length", "equals", "compareTo", "toString", "valueOf", "charAt", "substring", "indexOf", "replace", "split", "trim", "toLowerCase", "toUpperCase", "append", "insert", "delete"],
            13: ["ArrayList", "LinkedList", "HashMap", "HashSet", "TreeMap", "Iterator", "Collection", "Comparator", "Comparable", "PriorityQueue", "Stack", "Queue", "Deque", "Vector", "Hashtable", "TreeSet", "LinkedHashMap", "LinkedHashSet", "EnumSet", "EnumMap"],
            14: ["synchronized", "Thread", "Runnable", "Callable", "Future", "Executor", "ExecutorService", "CompletableFuture", "CountDownLatch", "CyclicBarrier", "Semaphore", "Lock", "ReentrantLock", "ReadWriteLock", "Condition", "volatile", "transient", "serializable", "cloneable", "remote", "reflection", "annotation"],
            15: ["ArrayList", "LinkedList", "HashMap", "Hashtable", "ConcurrentHashMap", "ExecutorService", "CompletableFuture", "AtomicInteger", "AtomicLong", "AtomicBoolean", "CountDownLatch", "CyclicBarrier", "Semaphore", "ReentrantLock", "StampedLock", "servlet", "filter", "listener", "session", "cookie", "transaction", "persistence", "hibernate", "entity", "mapping"]
        };

        // ===== STAGE REQUIREMENTS =====
const stageRequirements = {
    11: { rpm: 15, words: 15, bossHP: 100, damagePerWord: 10, bossAttackDamage: 15, playerHP: 100 },
    12: { rpm: 18, words: 18, bossHP: 100, damagePerWord: 8, bossAttackDamage: 20, playerHP: 100 },
    13: { rpm: 20, words: 20, bossHP: 100, damagePerWord: 7, bossAttackDamage: 22, playerHP: 100 },
    14: { rpm: 23, words: 22, bossHP: 100, damagePerWord: 6, bossAttackDamage: 23, playerHP: 100 },
    15: { rpm: 25, words: 25, bossHP: 100, damagePerWord: 5, bossAttackDamage: 25, playerHP: 100 }
};

// ===== TYPING BATTLE STATE =====
let typingState = {
    active: false,
    stage: 11,
    words: [],
    currentWordIndex: 0,
    totalWords: 15,
    wordsTyped: 0,
    timeLeft: 10,
    timerInterval: null,
    startTime: null,
    rpm: 0,
    bossHP: 100,
    maxBossHP: 100,
    playerHP: 100,
    maxPlayerHP: 100,
    bossAttackDamage: 15,
    damagePerWord: 7,
    stageRPM: 15,
    message: "",
    attacker: null,
    pendingDamage: 0,
    waitingForNext: false,
    wordResults: [],
    currentWordResult: null
};



        // ===== EXPLANATION SCREENS =====
        let explanationState = {
            active: false,
            currentGroup: 1
        };

        // ===== CATCH GAME STATE =====
        let catchGameState = {
            active: false,
            requiredParts: [],
            collectedParts: [],
            fallingWords: [],
            countdown: 5,
            countdownActive: false,
            timer: 20,
            timerInterval: null,
            dropInterval: null,
            stageConfig: null,
            playerX: 120,
            playerY: 430,
            playerWidth: 60,
            playerHeight: 80,
            speed: 6,
            lightningActive: false,
            monsterFlash: false,
            monsterFlashTimer: 0,
            playerFlash: false,
            playerFlashTimer: 0,
            neededToWin: 3,
            correctCaught: 0,
            bubbles: [],
            bubbleSpawnTimer: 0,
            question: null,
            correctAnswer: null,
            wrongAnswers: [],
            lightningToMonster: {active: false, timer: 0},
            lightningToPlayer: {active: false, timer: 0},
            playerFlash: {active: false, timer: 0},
            monsterX: 900,
            playerFacing: 'right'
        };

        // ===== COMPUTER PARTS =====
        const computerPartsList = [
            { id: 'mouse', name: 'Mouse', emoji: '🖱️', image: 'mouse.png' },
            { id: 'keyboard', name: 'Keyboard', emoji: '⌨️', image: 'keyboard.png' },
            { id: 'monitor', name: 'Monitor', emoji: '🖥️', image: 'monitor.png' },
            { id: 'cpu', name: 'CPU', emoji: '⚙️', image: 'cpu.png' },
            { id: 'ram', name: 'RAM', emoji: '💾', image: 'ram.png' },
            { id: 'harddrive', name: 'Hard Drive', emoji: '💽', image: 'harddrive.png' },
            { id: 'usb', name: 'USB', emoji: '🔌', image: 'usb.png' },
            { id: 'speaker', name: 'Speaker', emoji: '🔊', image: 'speaker.png' },
            { id: 'printer', name: 'Printer', emoji: '🖨️', image: 'printer.png' },
            { id: 'motherboard', name: 'Motherboard', emoji: '🔌', image: 'motherboard.png' }
        ];

        const fakeWordsList = ['Table', 'Chair', 'Phone', 'Book', 'Pencil', 'Paper', 'Cup', 'Bag', 'Clock', 'Lamp'];

        const catchStagesConfig = [
            { stage: 6, partsCount: 3, speed: 1.5, fakeCount: 2, hpDamage: 5, label: 'Easy' },
            { stage: 7, partsCount: 4, speed: 1.2, fakeCount: 3, hpDamage: 5, label: 'Easy-Medium' },
            { stage: 8, partsCount: 4, speed: 1.0, fakeCount: 4, hpDamage: 8, label: 'Medium' },
            { stage: 9, partsCount: 5, speed: 0.8, fakeCount: 5, hpDamage: 8, label: 'Medium-Hard' },
            { stage: 10, partsCount: 5, speed: 0.7, fakeCount: 6, hpDamage: 10, label: 'Hard' }
        ];

        // ===== DOM ELEMENTS =====
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        canvas.width = 1100;
        canvas.height = 600;

        // ===== GAME STATE =====
        let state = {
            stage: 1,
            player: {
                hp: 100,
                maxHp: 100,
                energy: 0,
                maxEnergy: 60,
                x: 120,
                y: 430,
                width: 50,
                height: 70,
                vx: 0,
                vy: 0,
                grounded: true,
                attackCooldown: 0,
                invincible: 0,
                attackAnimation: 0,
                direction: 1,
                isMovingToAttack: false,
                attackTargetX: 0,
                originalX: 120,
                moveSpeed: 15,
                returningFromAttack: false,
                dodgeOffset: 0,
                dodgeTimer: 0,
                isAttacking: false,
                attackHoldTimer: 0,
                attackHoldDuration: 35
            },
            monster: {
                hp: 100,
                maxHp: 100,
                x: 900,
                y: 430,
                width: 45,
                height: 55,
                type: 'WEAK LVL 1',
                attackCooldown: 0,
                speed: 1.2,
                attackAnimation: 0,
                direction: -1,
                image: null,
                isMovingToAttack: false,
                attackTargetX: 0,
                originalX: 900,
                moveSpeed: 12,
                returningFromAttack: false,
                dodgeOffset: 0,
                dodgeTimer: 0
            },
            keys: {},
            gameActive: true,
            quizActive: true,
            combatActive: false,
            bossActive: false,
            quizAnswered: false,
            currentQuestion: null,
            usedQuestions: [],
            wrongQuestions: [],
            attackEffects: [],
            damageNumbers: [],
            screenShake: 0,
            streak: 0,
            currentGameScore: 0,
            completedStages: 0,
            timerSeconds: 30,
            timerActive: false,
            timerInterval: null,
            regenInterval: null,
            gravity: 0.5,
            jumpPower: -12,
            monsterImages: {},
            robot: {
                currentAnim: 'idle',
                currentFrame: 0,
                frameTimer: 0,
                facing: 'right'
            },
            attackInProgress: false,
            selectedCategory: 'hardware',
            emergencyActive: false,
            emergencyTimeLeft: 0,
            emergencyQuestion: null,
            emergencyAnswered: false,
            emergencyUsed: false,
            correctAnswersCount: 0,
            pendingDamage: null,
            attackComplete: false,
            typingBattleActive: false,
            isCatchStage: false,
            monsterDeathAnimation: {
                active: false,
                timer: 0,
                x: 0,
                y: 0,
                scale: 1,
                opacity: 1,
                explosionParticles: []
            },
            _advancing: false,
            _deathAnimationActive: false,
            _timeoutHandled: false,
            _playerDamagePending: false,
            _playerDamageAmount: 0
        };

        // ===== ROBOT IMAGES =====
        const robotImages = {
            idle: new Image(),
            walkD: [new Image(), new Image(), new Image(), new Image()],
            walkA: [new Image(), new Image(), new Image(), new Image()],
            jump: new Image(),
            attack: [new Image(), new Image(), new Image(), new Image()],
            catchSuccess: new Image()
        };

              function loadRobotImages() {
            robotImages.idle.onerror = () => console.log('Idle image not found');
            robotImages.idle.src = 'hero/robot_walk_D3.png';
            
            robotImages.attack[0].src = 'hero/attack1.png';
            robotImages.attack[1].src = 'hero/attack2.png';
            robotImages.attack[2].src = 'hero/attack3.png';
            robotImages.attack[3].src = 'hero/attack4.png';
            
            // ⭐ Catch success image — naka-taas ang sword + kidlat
            robotImages.catchSuccess.src = 'hero/catch_success.png';
            robotImages.catchSuccess.onerror = () => console.log('Catch success image not found');
            
            for (let i = 0; i < 4; i++) {
                robotImages.attack[i].onerror = () => console.log('Attack frame ' + (i+1) + ' not found');
            }
            
            for (let i = 0; i < 4; i++) {
                robotImages.walkD[i].src = '';
                robotImages.walkA[i].src = '';
            }
            robotImages.jump.src = '';
        }

        function loadMonsterImages() {
            for (let i = 1; i <= 15; i++) {
                const img = new Image();
                img.onerror = () => console.log(`stage${i}.png not found`);
                img.src = `character/stage${i}.png`;
                state.monsterImages[i] = img;
            }
        }

        // ============================================================
        //  FETCH QUESTIONS FROM DATABASE
        // ============================================================
        async function fetchQuestionsFromDB() {
            try {
                console.log('📥 Fetching questions from database...');
                
                const response = await fetch('get_questions.php');
                const data = await response.json();
                
                if (data.success && data.questions && data.questions.length > 0) {
                    questionBank = data.questions;
                    console.log(`✅ Loaded ${questionBank.length} questions from database`);
                    console.log(`   Hardware: ${questionBank.filter(q => q.category === 'hardware').length}`);
                    console.log(`   Software: ${questionBank.filter(q => q.category === 'software').length}`);
                    console.log(`   Parts: ${questionBank.filter(q => q.category === 'parts').length}`);
                    return true;
                } else {
                    console.error('❌ No questions found in database:', data);
                    return false;
                }
            } catch (error) {
                console.error('❌ Error fetching questions:', error);
                return false;
            }
        }

        // ===== AUDIO MANAGER =====
        const AudioManager = {
            music: null,
            sounds: {},
            musicVolume: 0.5,
            sfxVolume: 0.5,
            introMusic: null,
            initialized: false,
            
            init() {
                if (this.initialized) return;
                this.initialized = true;
                
                const savedMusic = localStorage.getItem('brainstorm_music_volume');
                const savedSfx = localStorage.getItem('brainstorm_sfx_volume');
                this.musicVolume = savedMusic ? parseFloat(savedMusic) : 0.5;
                this.sfxVolume = savedSfx ? parseFloat(savedSfx) : 0.5;
                
                console.log('🔊 AudioManager initialized');
                console.log('   Music Volume:', this.musicVolume);
                console.log('   SFX Volume:', this.sfxVolume);
                
                this.music = new Audio();
                this.music.loop = true;
                this.music.volume = this.musicVolume;
                
                const sounds = ['stage_clear', 'player_attack', 'monster_attack', 'correct', 'wrong', 'button_click', 'game_over', 'super_attack', 'super_ready', 'gameover'];
                
                sounds.forEach(sound => {
                    const audio = new Audio();
                    audio.volume = this.sfxVolume;
                    audio.preload = 'auto';
                    
                    // Check if file exists
                    audio.addEventListener('canplaythrough', function() {
                        console.log('✅ Sound loaded:', sound);
                    });
                    
                    audio.addEventListener('error', function(e) {
                        console.log('❌ Sound failed to load:', sound, e);
                    });
                    
                    audio.src = `audio/${sound}.mp3`;
                    this.sounds[sound] = audio;
                });
            },
            
            playSound(soundName) {
                if (!this.initialized) {
                    console.log('⚠️ AudioManager not initialized, initializing...');
                    this.init();
                }
                
                if (!this.sounds[soundName]) {
                    console.log('⚠️ Sound not found:', soundName);
                    return;
                }
                
                // Check volume
                if (this.sfxVolume <= 0) {
                    console.log('🔇 SFX Volume is 0, sound muted');
                    return;
                }
                
                try {
                    const soundClone = this.sounds[soundName].cloneNode();
                    soundClone.volume = this.sfxVolume;
                    
                    // Try to play
                    const playPromise = soundClone.play();
                    
                    if (playPromise !== undefined) {
                        playPromise.then(function() {
                            console.log('🔊 Playing sound:', soundName);
                        }).catch(function(error) {
                            console.log('⚠️ Cannot play sound:', soundName, error);
                            // Try fallback
                            tryFallbackPlay(soundName);
                        });
                    }
                } catch(e) {
                    console.log('❌ Sound error:', soundName, e);
                    tryFallbackPlay(soundName);
                }
            }
        };

        // Fallback: Create new audio element directly
        function tryFallbackPlay(soundName) {
            try {
                const audio = new Audio(`audio/${soundName}.mp3`);
                audio.volume = 0.5;
                audio.play().catch(() => {});
                console.log('🔊 Fallback playing:', soundName);
            } catch(e) {
                console.log('❌ Fallback failed:', soundName);
            }
        }

        // ===== SHUFFLE FUNCTION =====
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        // ===== EXPLANATION CONTENT =====
        const explanations = {
            1: {
                title: "📚 STAGES 1-5: COMPUTER BASICS",
                content: `
                    <h3>🎯 HOW TO PLAY:</h3>
                    <ul>
                        <li>Read the <span class="highlight-key">question</span> at the bottom</li>
                        <li>Choose answer by <span class="highlight-key">clicking</span> or pressing <span class="highlight-key">1,2,3,4</span></li>
                        <li>✅ <span style="color:#2ecc71">CORRECT</span> = +30 Energy</li>
                        <li>❌ <span style="color:#E0563F">WRONG</span> = Monster attacks you</li>
                        <li>⚔️ Click <span class="highlight-key">ATTACK</span> button to deal damage based on energy</li>
                        <li>⚡ <span style="color:#f1c40f">Full Energy = SUPER ATTACK!</span></li>
                        <li>⏱️ You have <span class="highlight-key">10seconds</span> per question</li>
                    </ul>
                    <h3>⌨️ CONTROLS:</h3>
                    <p><span class="highlight-key">1,2,3,4</span> - Answer choices</p>
                    <p>Click the answer buttons</p>
                    <p>Click <span class="highlight-key">ATTACK</span> button to deal damage</p>
                `
            },
            2: {
                title: "🎯 STAGES 6-10: CATCH THE PARTS",
                content: `
                    <h3>🎯 HOW TO PLAY:</h3>
                    <ul>
                        <li>Look at the <span class="highlight-key">computer parts</span> displayed above</li>
                        <li>Watch the countdown: <span class="highlight-key">5,4,3,2,1,GO!</span></li>
                        <li>Words will <span class="highlight-key">fall down</span> from the top</li>
                        <li><span style="color:#2ecc71">✅ Click the CORRECT parts</span> to collect them</li>
                        <li><span style="color:#E0563F">❌ Click the WRONG words</span> = you lose HP!</li>
                        <li>Collect all parts = <span style="color:#f1c40f">⚡ LIGHTNING ATTACK!</span></li>
                        <li>⏱️ You have <span class="highlight-key">20 seconds</span> per stage!</li>
                    </ul>
                    <h3>⌨️ CONTROLS:</h3>
                    <p><span class="highlight-key">A / D</span> - Move left/right</p>
                    <p><span class="highlight-key">Click</span> - Catch falling words</p>
                `
            },
            3: {
                title: "👾 STAGES 11-15: BOSS TYPING BATTLE",
                content: `
                    <h3>🎯 HOW TO PLAY:</h3>
                    <ul>
                        <li>Type the <span class="highlight-key">highlighted word</span> (yellow)</li>
                        <li>Press <span class="highlight-key">ENTER</span> to submit</li>
                        <li>⏱️ You have <span class="highlight-key">30 seconds</span> per word</li>
                        <li>📊 <span style="color:#f1c40f">RPM</span> (Words Per Minute) determines damage</li>
                    </ul>
                    <h3>📊 RPM REQUIREMENTS:</h3>
                    <p>Stage 11: <span class="highlight-key">10 WPM</span> | Stage 12: <span class="highlight-key">13 WPM</span></p>
                    <p>Stage 13: <span class="highlight-key">15 WPM</span> | Stage 14: <span class="highlight-key">20 WPM</span></p>
                    <p>Stage 15: <span class="highlight-key">25 WPM</span></p>
                    <h3>⚠️ REMEMBER:</h3>
                    <p>✅ Above RPM = You attack monster</p>
                    <p>❌ Below RPM = Monster attacks you</p>
                `
            }
        };

        function showExplanation(group) {
            explanationState.active = true;
            explanationState.currentGroup = group;
            document.getElementById('stageExplanation').classList.add('active');
            document.getElementById('explanationTitle').textContent = explanations[group].title;
            document.getElementById('explanationContent').innerHTML = explanations[group].content;
        }

        function hideExplanation() {
            document.getElementById('stageExplanation').classList.remove('active');
            explanationState.active = false;
        }

        function updateStageMode() {
            const s = state.stage;
            state.quizActive = s <= 5;
            state.combatActive = false;
            state.bossActive = s >= 11;
            state.isCatchStage = (s >= 6 && s <= 10);
            state.typingBattleActive = (s >= 11 && s <= 15);
            
            // ===== SHOW/HIDE ENERGY + ATTACK + TIMER SA DIFFERENT STAGES =====
            const energyContainer = document.getElementById('energyContainer');
            const attackBtnContainer = document.getElementById('attackBtnContainer');
            const regenContainer = document.getElementById('regenContainer');
            const timerContainer = document.getElementById('timerContainer');


            // ⭐ TANGGALIN ANG ATTACK BUTTON SA STAGES 6-10
const attackBtnWrapper = document.getElementById('attackBtnContainer');
if (attackBtnWrapper) {
    if (s >= 6 && s <= 10) {
        attackBtnWrapper.style.display = 'none';   // ← WALANG ATTACK sa Catch Game
    } else {
        attackBtnWrapper.style.display = 'block';  // ← Ipakita sa Stages 1-5
    }
}

// ⭐ TANGGALIN DIN ANG ENERGY BAR SA STAGES 6-15
if (energyContainer) {
    if (s >= 6) {
        energyContainer.style.display = 'none';
    } else {
        energyContainer.style.display = 'block';
    }
}
            

            
            // Background images
            const arenaBackground = document.getElementById('arenaBackground');
            if (arenaBackground) {
                if (s >= 11) {
                    arenaBackground.style.backgroundImage = "url('fild/stage11to15.jpg')";
                    arenaBackground.style.backgroundSize = "cover";
                    arenaBackground.style.backgroundPosition = "center";
                    arenaBackground.style.backgroundRepeat = "no-repeat";
                } else if (s >= 6) {
                    arenaBackground.style.backgroundImage = "url('fild/stage6to10.jpg')";
                    arenaBackground.style.backgroundSize = "cover";
                    arenaBackground.style.backgroundPosition = "center";
                    arenaBackground.style.backgroundRepeat = "no-repeat";
                } else {
                    arenaBackground.style.backgroundImage = "url('fild/stage1to5.jpg')";
                    arenaBackground.style.backgroundSize = "cover";
                    arenaBackground.style.backgroundPosition = "center";
                    arenaBackground.style.backgroundRepeat = "no-repeat";
                }
            }
            
            // Set monster HP
            let baseHp = 100;
            if (s === 1) baseHp = 100;
            else if (s === 2) baseHp = 110;
            else if (s === 3) baseHp = 120;
            else if (s === 4) baseHp = 130;
            else if (s === 5) baseHp = 140;
            else if (s === 6) baseHp = 150;
            else if (s === 7) baseHp = 165;
            else if (s === 8) baseHp = 180;
            else if (s === 9) baseHp = 200;
            else if (s === 10) baseHp = 220;
            else if (s >= 11) baseHp = 100;
            
            if (s <= 10) {
                state.monster.maxHp = baseHp;
                state.monster.hp = baseHp;
            }
            
            // Update monster type
            if (s === 15) state.monster.type = 'FINAL BOSS';
            else if (s >= 11) state.monster.type = `BOSS LVL ${s}`;
            else if (s >= 6) state.monster.type = `ANSWER GUARDIAN LVL ${s}`;
            else state.monster.type = `WEAK LVL ${s}`;
            
            // Update monster image
            if (state.monsterImages && state.monsterImages[s]) {
                state.monster.image = state.monsterImages[s];
            }
            
            // Update UI
            document.getElementById('monsterName').textContent = state.monster.type;
            
            let stageType = 'BASICS';
            if (s >= 6 && s <= 10) stageType = 'ANSWER CATCH';
            if (s >= 11) stageType = 'BOSS';
            document.getElementById('stageInfo').textContent = `STAGE ${s}/15 · ${stageType}`;
            
            // ===== SET MAX ENERGY PER STAGE =====
            let maxEnergy = 100;
            state.player.maxEnergy = maxEnergy;
            state.player.energy = Math.min(state.player.energy, maxEnergy);
            state.player.energy = Math.round(state.player.energy);
            updateEnergyDisplay();
            
            // ===== POSITIONS - PRESERVED =====
            state.monster.x = 900;
            state.monster.y = 600;
            state.monster.originalX = 900;
            
            state.player.x = 120;
            state.player.y = 600;
            state.player.originalX = 120;
            
            // Show/hide timers
            if (s <= 5) {
                document.getElementById('timer60').style.display = 'flex';
                document.getElementById('timer10').style.display = 'none';
                document.getElementById('quizOverlay').style.display = 'block';
            } else if (s >= 6 && s <= 10) {
                // ⭐ Stages 6-10: HIDE BOTH timers (may sariling timer na ang catch game)
                document.getElementById('timer60').style.display = 'none';
                document.getElementById('timer10').style.display = 'none';
                document.getElementById('quizOverlay').style.display = 'block';
            } else {
                document.getElementById('timer60').style.display = 'none';
                document.getElementById('timer10').style.display = 'none';
                document.getElementById('quizOverlay').style.display = 'block';
            }
            
            updateUI();
            updateAttackButton();
            
            // ===== UPDATE STAGE NUMBERS =====
            updateStageNumbers();
        }

    function loadNewQuestion() {
        // ⭐ I-RESET ANG CLASSNAME PARA SA QUIZ MODE (Stages 1-5)
        var quizChoices = document.getElementById('quizChoices');
        if (quizChoices) {
            quizChoices.className = 'quiz-choices';
            quizChoices.style.cssText = '';
        }
        
        // ⭐ I-SET ANG QUIZ PANEL HEIGHT PARA SA NORMAL QUIZ
        var quizPanel = document.getElementById('quizOverlay');
        if (quizPanel) {
            quizPanel.style.height = '160px';
            quizPanel.style.maxHeight = '160px';
            quizPanel.style.minHeight = '160px';
            quizPanel.style.overflow = 'hidden';
            
            // ⭐ ALISIN ANG 'typing-mode' CLASS PARA SA STAGES 1-5
            quizPanel.classList.remove('typing-mode');
        }
        
        const category = state.selectedCategory || 'hardware';
            let available = questionBank.filter(q => 
                q.category === category && 
                !state.usedQuestions.includes(q)
            );
            
            if (available.length === 0) {
                state.usedQuestions = [];
                available = questionBank.filter(q => q.category === category);
            }
            
            if (available.length === 0) {
                console.error('❌ No questions available!');
                return;
            }
            
            const question = available[Math.floor(Math.random() * available.length)];
            state.currentQuestion = question;
            state.usedQuestions.push(question);
            
            const choices = [...question.choices];
            const correctAnswer = question.choices[question.correct];
            for (let i = choices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [choices[i], choices[j]] = [choices[j], choices[i]];
            }
            const newCorrectIndex = choices.findIndex(c => c === correctAnswer);
            state.currentQuestion.randomizedChoices = choices;
            state.currentQuestion.randomizedCorrect = newCorrectIndex;
            
            const subjectMap = {
                'hardware': '🖥️ HARDWARE BASICS',
                'software': '📀 SOFTWARE BASICS',
                'parts': '🔌 COMPUTER PARTS'
            };
            document.getElementById('quizSubject').textContent = subjectMap[category] || 'HARDWARE BASICS';
            document.getElementById('quizQuestion').textContent = question.q;
            
            quizChoices.innerHTML = '';
choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice;
    btn.dataset.choice = i;
    
    // ⭐ KUNG MAHABA ANG TEXT — dagdagan ng specific class
    var textLength = choice.length;
    if (textLength > 20) {
        btn.classList.add('long-text');   // Para sa mas mahabang text
    }
    
    btn.addEventListener('click', function() {
        handleAnswer(parseInt(this.dataset.choice));
    });
    quizChoices.appendChild(btn);
});
            
            state.quizAnswered = false;
            state.attackInProgress = false;
            state.attackComplete = false;
            state._timeoutHandled = false;
            startTimer(10);   // ← 30 → 10
            

            
            updateAttackButton();
            console.log('📝 New question loaded:', question.q);
        }

        // ===== HANDLE ANSWER =====
        function handleAnswer(choiceIndex) {
            if (state.quizAnswered || !state.currentQuestion || state.attackInProgress) return;
            if (state.monster.hp <= 0) return;
            if (state.player.hp <= 0) return;
            
            stopTimer();
            
            const isCorrect = (choiceIndex === state.currentQuestion.randomizedCorrect);
            state.quizAnswered = true;
            
            const buttons = document.querySelectorAll('.choice-btn');
            buttons.forEach(btn => btn.classList.add('disabled'));
            
            if (buttons[state.currentQuestion.randomizedCorrect]) {
                buttons[state.currentQuestion.randomizedCorrect].classList.add('correct-highlight');
            }
            if (!isCorrect && buttons[choiceIndex]) {
                buttons[choiceIndex].classList.add('wrong-highlight');
            }
            
            if (isCorrect) {
                AudioManager.playSound('correct');
                state.correctAnswersCount++;
                
                var energyGain = state.player.energy >= 60 ? 40 : 30;
                var oldEnergy = state.player.energy;
                state.player.energy = Math.min(state.player.energy + energyGain, state.player.maxEnergy);
                state.player.energy = Math.round(state.player.energy);
                animateEnergyFill(oldEnergy, state.player.energy);
                showEnergyPopup(energyGain);
                showFeedback('⚡ +' + energyGain + ' Energy! (' + state.player.energy + '/' + state.player.maxEnergy + ')', '#4CAF50');
                updateUI();
                updateEnergyDisplay();
                updateAttackButton();
                
                setTimeout(function() {
                    state.timerSeconds = 10;   // ← 30 → 10
                    state.quizAnswered = false;
                    state.attackInProgress = false;
                    state._timeoutHandled = false;
                    loadNewQuestion();
                }, 800);
                
            } else {
                AudioManager.playSound('wrong');
                state.streak = 0;
                state.wrongQuestions.push(state.currentQuestion);
                
                let damage = 15 + Math.floor(Math.random() * 10);
                state.pendingDamage = damage;
                startMonsterAttack();
                showFeedback('❌ Wrong! Monster attacks! -' + damage + ' HP', '#ececec');
                AudioManager.playSound('monster_attack');
                updateUI();
                
                if (state.player.hp <= 0) {
                    setTimeout(function() { gameOver(); }, 500);
                    return;
                }
                
                setTimeout(function() {
                    state.timerSeconds = 10;   // ← 30 → 10
                    state.quizAnswered = false;
                    state.attackInProgress = false;
                    state._timeoutHandled = false;
                    loadNewQuestion();
                }, 1000);
            }
        }

        // ===== UPDATE ENERGY DISPLAY =====
        function updateEnergyDisplay() {
            // ⭐ HUWAG I-UPDATE ANG ENERGY SA STAGES 6-15
            if (state.stage >= 6) {
                const energyContainer = document.getElementById('energyContainer');
                if (energyContainer) energyContainer.style.display = 'none';
                return;
            }
            
            const energyContainer = document.getElementById('energyContainer');
            if (energyContainer) energyContainer.style.display = 'block';
            
            const energyFill = document.getElementById('energyFill');
            const energyText = document.getElementById('energyText');
            const superStatus = document.getElementById('superStatus');
            
            let currentEnergy = Math.round(state.player.energy);
            let maxEnergy = Math.round(state.player.maxEnergy);
            
            if (energyFill) {
                const percent = (currentEnergy / maxEnergy) * 100;
                energyFill.style.width = Math.min(percent, 100) + '%';
                
                if (percent >= 100) {
                    energyFill.style.background = 'linear-gradient(90deg, #FFD700, #FF6B00, #FFD700)';
                    energyFill.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.5)';
                    energyFill.classList.add('super-ready');
                } else if (percent >= 70) {
                    energyFill.style.background = 'linear-gradient(90deg, #FF9800, #FFD700)';
                    energyFill.classList.remove('super-ready');
                } else {
                    energyFill.style.background = 'linear-gradient(90deg, #4CAF50, #FF9800)';
                    energyFill.classList.remove('super-ready');
                }
            }
            
            if (energyText) {
                energyText.textContent = currentEnergy + '/' + maxEnergy;
                if (currentEnergy >= maxEnergy) {
                    energyText.style.color = '#FFD700';
                } else if (currentEnergy >= maxEnergy * 0.7) {
                    energyText.style.color = '#FF9800';
                } else {
                    energyText.style.color = '#4CAF50';
                }
            }
            
            if (superStatus) {
                if (currentEnergy >= maxEnergy) {
                    superStatus.textContent = '⚡ SUPER ATTACK READY!';
                    superStatus.style.color = '#FFD700';
                    superStatus.style.animation = 'superPulse 0.5s infinite';
                    superStatus.classList.add('super-ready');
                } else {
                    let needed = maxEnergy - currentEnergy;
                    superStatus.textContent = '💪 Need ' + needed + ' more energy for Super Attack!';
                    superStatus.style.color = '#aaa';
                    superStatus.style.animation = 'none';
                    superStatus.classList.remove('super-ready');
                }
            }
            
            updateAttackButton();
        }

        function animateEnergyFill(oldValue, newValue) {
            const energyFill = document.getElementById('energyFill');
            if (!energyFill) return;
            
            let roundedOld = Math.round(oldValue);
            let roundedNew = Math.round(newValue);
            let maxEnergy = Math.round(state.player.maxEnergy);
            
            energyFill.classList.add('filling');
            const percent = (roundedNew / maxEnergy) * 100;
            energyFill.style.width = Math.min(percent, 100) + '%';
            
            createEnergyParticles(energyFill);
            
            setTimeout(function() {
                energyFill.classList.remove('filling');
            }, 500);
        }

        function createEnergyParticles(element) {
            const rect = element.getBoundingClientRect();
            const container = document.querySelector('.arena-container');
            if (!container) return;
            
            for (let i = 0; i < 6; i++) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: absolute;
                    left: ${rect.left + 20 + Math.random() * (rect.width - 40)}px;
                    top: ${rect.top + 10 + Math.random() * (rect.height - 20)}px;
                    width: ${4 + Math.random() * 8}px;
                    height: ${4 + Math.random() * 8}px;
                    background: #4CAF50;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 50;
                    animation: energyParticle ${0.5 + Math.random() * 0.5}s ease-out forwards;
                `;
                container.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 1000);
            }
        }

        function showEnergyPopup(gain) {
            const container = document.querySelector('.arena-container');
            if (!container) return;
            
            const popup = document.createElement('div');
            popup.style.cssText = `
                position: absolute;
                top: 40%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #4CAF50;
                font-size: 2.5rem;
                font-weight: bold;
                z-index: 60;
                pointer-events: none;
                animation: energyPopup 1s ease-out forwards;
                text-shadow: 0 0 30px #4CAF50;
                font-family: 'Courier New', monospace;
            `;
            popup.textContent = `+${gain} ⚡`;
            container.appendChild(popup);
            
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
            }, 1000);
        }

        function showSuperReadyNotification() {
            const container = document.querySelector('.arena-container');
            if (!container) return;
            
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: absolute;
                top: 35%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #FFD700;
                font-size: 3rem;
                font-weight: bold;
                z-index: 60;
                pointer-events: none;
                animation: superReady 1s ease-out forwards;
                text-shadow: 0 0 40px #FFD700, 0 0 80px #FFD700;
                font-family: 'Courier New', monospace;
                background: rgba(0,0,0,0.5);
                padding: 20px 40px;
                border-radius: 20px;
                border: 3px solid #FFD700;
            `;
            notification.innerHTML = '⚡ SUPER READY! ⚡';
            container.appendChild(notification);
            
            const flash = document.createElement('div');
            flash.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(ellipse at center, rgba(255, 215, 0, 0.3), transparent 70%);
                z-index: 45;
                pointer-events: none;
                animation: superFlash 0.5s ease 2;
            `;
            container.appendChild(flash);
            
            AudioManager.playSound('super_ready');
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                if (flash.parentNode) {
                    flash.parentNode.removeChild(flash);
                }
            }, 1500);
        }

        function createSuperAttackEffect() {
            // ⭐ Simple na flash — mabilis lang, hindi mabigat
            const container = document.querySelector('.arena-container');
            if (!container) return;
            
            const flash = document.createElement('div');
            flash.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #FFD700;
                z-index: 45;
                pointer-events: none;
                opacity: 0.4;
                transition: opacity 0.3s ease;
            `;
            container.appendChild(flash);
            
            // Trigger fade
            requestAnimationFrame(() => {
                flash.style.opacity = '0';
            });
            
            setTimeout(() => {
                if (flash.parentNode) {
                    flash.parentNode.removeChild(flash);
                }
            }, 350);
        }



        function startTimer(seconds) {
            state.timerActive = true;
            state.timerSeconds = seconds || 10;   // ← 30 → 10
            state._timeoutHandled = false;
            
            if (state.timerInterval) clearInterval(state.timerInterval);
            
            state.timerInterval = setInterval(() => {
                if (!state.gameActive) return;
                state.timerSeconds--;
                
                if (state.stage <= 5) {
                    document.getElementById('timerDisplay60').textContent = state.timerSeconds;
                    const percent = (state.timerSeconds / 10) * 100;   // ← 30 → 10
                    document.getElementById('timerProgressFill60').style.width = Math.max(0, percent) + '%';
                    
                    if (state.timerSeconds <= 5) {   // ← 10 → 5 (warning kapag 5 seconds na lang)
                        document.getElementById('timer60').classList.add('timer-warning');
                    }
                    
                    if (state.timerSeconds <= 0 && !state.quizAnswered && state.currentQuestion && state.monster.hp > 0 && !state._timeoutHandled) {
                        clearInterval(state.timerInterval);
                        state.timerInterval = null;
                        state.timerActive = false;
                        handleTimeout();
                    }
                }
            }, 1000);
        }

        function stopTimer() {
            if (state.timerInterval) {
                clearInterval(state.timerInterval);
                state.timerInterval = null;
            }
            if (state.regenInterval) {
                clearInterval(state.regenInterval);
                state.regenInterval = null;
            }
            state.timerActive = false;
        }

        function handleTimeout() {
            if (state.attackInProgress) return;
            if (state.monster.hp <= 0) return;
            if (state.player.hp <= 0) return;
            if (state.quizAnswered) return;  // ← IBA ANG CHECK
            
            state._timeoutHandled = true;
            state.quizAnswered = true;
            document.querySelectorAll('.choice-btn').forEach(btn => btn.classList.add('disabled'));
            AudioManager.playSound('wrong');
            state.pendingDamage = 15;
            startMonsterAttack();
            showFeedback('⏰ TIME OUT! Monster attacks! -15 HP'); // ← Dagdag feedback
            
            setTimeout(function() {
                if (state.monster.hp > 0 && state.player.hp > 0) {
                    state.timerSeconds = 10;   // ← 30 → 10
                    state.quizAnswered = false;
                    state.attackInProgress = false;
                    state._timeoutHandled = false;
                    loadNewQuestion();
                }
            }, 1500);
        }

        // ===== ATTACK FUNCTIONS =====
        function createHitEffect(x, y, isPlayer) {
            for (let i = 0; i < 8; i++) {  // 5 → 8 particles
                state.attackEffects.push({
                    x: x + (Math.random() - 0.5) * 50,
                    y: y + (Math.random() - 0.5) * 50,
                    vx: (Math.random() - 0.5) * 6,
                    vy: (Math.random() - 0.5) * 6,
                    size: 4 + Math.random() * 10,
                    timer: 10 + Math.floor(Math.random() * 8),
                    isMonster: !isPlayer
                });
            }
        }

        function addDamageNumber(x, y, amount, isPlayer) {
            state.damageNumbers.push({
                x: x,
                y: y,
                amount: amount,
                isPlayer: isPlayer,
                timer: 30,
                vy: -2,
                vx: (Math.random() - 0.5) * 2
            });
        }

        // ⭐ HEAL number — green text na may "+"
        function addHealNumber(x, y, amount) {
            state.damageNumbers.push({
                x: x,
                y: y,
                amount: amount,
                isHeal: true,
                timer: 40,
                vy: -1.5,
                vx: 0
            });
        }

        function startPlayerAttack() {
            state.attackInProgress = true;
            state.player.isMovingToAttack = true;
            state.player.returningFromAttack = false;
            state.player.originalX = state.player.x;
            state.player.attackTargetX = state.monster.x - 99;
        }

        function startMonsterAttack() {
            state.attackInProgress = true;
            state.monster.isMovingToAttack = true;
            state.monster.returningFromAttack = false;
            state.monster.originalX = state.monster.x;
            state.monster.attackTargetX = state.player.x + 30;
        }






        // ===== UPDATE PHYSICS =====
        function updatePhysics(deltaTime) {
            // ⭐ SAFETY CHECK: Kung ang attack ay naka-lock ng sobrang tagal, i-reset
            if (state.attackInProgress) {
                state._attackTimer = (state._attackTimer || 0) + deltaTime;
                if (state._attackTimer > 5000) {
                    console.log('⚠️ Attack timeout — resetting');
                    state.attackInProgress = false;
                    state.player.isMovingToAttack = false;
                    state.player.returningFromAttack = false;
                    state.player.isAttacking = false;
                    state.monster.isMovingToAttack = false;
                    state.monster.returningFromAttack = false;
                    state.pendingDamage = null;
                    state._attackTimer = 0;
                    state.player.x = state.player.originalX || 120;
                    state.monster.x = state.monster.originalX || 900;
                }
            } else {
                state._attackTimer = 0;
            }
            
            // ⭐ Time-based movement
            const moveStep = Math.min(deltaTime / 16.67, 2);
            
            // ⭐ DODGE ANIMATION — hero
            if (state.player.dodgeTimer > 0) {
                state.player.dodgeTimer--;
                const progress = 1 - (state.player.dodgeTimer / 20);
                state.player.dodgeOffset = -30 * Math.sin(progress * Math.PI);
            } else {
                state.player.dodgeOffset = 0;
            }
            
            // ⭐ DODGE ANIMATION — monster
            if (state.monster.dodgeTimer > 0) {
                state.monster.dodgeTimer--;
                const progress = 1 - (state.monster.dodgeTimer / 20);
                state.monster.dodgeOffset = 30 * Math.sin(progress * Math.PI);
            } else {
                state.monster.dodgeOffset = 0;
            }
            
            // ============================================
            // ⭐ PHASE 1: MOVE TO ATTACK
            // ============================================
            if (state.player.isMovingToAttack) {
                const dx = state.player.attackTargetX - state.player.x;
                
                if (Math.abs(dx) < 5) {
                    state.player.x = state.player.attackTargetX;
                    state.player.isMovingToAttack = false;
                    
                    state.player.isAttacking = true;
                    state.player.attackHoldTimer = state.player.attackHoldDuration;
                    state.player.attackAnimation = 60;
                    
                    if (state.pendingDamage) {
                        state._playerDamagePending = true;
                        state._playerDamageAmount = state.pendingDamage;
                        
                        state.monster.dodgeOffset = 30;
                        state.monster.dodgeTimer = 20;
                    }
                } else {
                    if (dx > 0) {
                        state.player.x += state.player.moveSpeed * 2 * moveStep;
                        if (state.player.x > state.player.attackTargetX) state.player.x = state.player.attackTargetX;
                    } else {
                        state.player.x -= state.player.moveSpeed * 2 * moveStep;
                        if (state.player.x < state.player.attackTargetX) state.player.x = state.player.attackTargetX;
                    }
                }
            }
            
            // ============================================
            // ⭐ PHASE 2: ATTACK HOLD
            // ============================================
            if (state.player.isAttacking) {
                state.player.attackHoldTimer--;
                
                if (state.player.attackHoldTimer <= 0) {
                    state.player.isAttacking = false;
                    state.player.attackHoldTimer = 0;
                    state.player.attackAnimation = 0;
                    
                    if (state._playerDamagePending) {
                        const damage = state._playerDamageAmount;
                        
                        createHitEffect(state.monster.x, state.monster.y - 20, true);
                        addDamageNumber(state.monster.x, state.monster.y - 50, damage, true);
                        state.screenShake = 6;
                        AudioManager.playSound('player_attack');
                        state.monster.hp -= damage;
                        if (state.monster.hp < 0) state.monster.hp = 0;
                        
                        state._playerDamagePending = false;
                        state._playerDamageAmount = 0;
                        state.pendingDamage = null;
                        
                        console.log('⚔️ Damage applied after animation: -' + damage + ' HP');
                        
                        if (state.monster.hp <= 0 && !state.monsterDeathAnimation.active && !state._deathAnimationActive) {
                            startMonsterDeathAnimation();
                            return;
                        }
                    }
                    
                    state.player.returningFromAttack = true;
                }
            }
            
            // ============================================
            // ⭐ PHASE 3: RETURN
            // ============================================
            if (state.player.returningFromAttack) {
                const dx = state.player.originalX - state.player.x;
                
                if (Math.abs(dx) < 5) {
                    state.player.x = state.player.originalX;
                    state.player.returningFromAttack = false;
                    state.attackInProgress = false;
                    state._attackTimer = 0;
                    
                    if (state.typingBattleActive && typingState.active) {
                        setTimeout(function() {
                            continueTypingBattle();
                        }, 400);
                        return;
                    }
                    
                    if (state.stage <= 5 && state.monster.hp > 0 && !state.monsterDeathAnimation.active && !state._deathAnimationActive) {
                        setTimeout(function() {
                            state.timerSeconds = 10;
                            state._timeoutHandled = false;
                            loadNewQuestion();
                        }, 500);
                    }
                } else {
                    if (dx > 0) {
                        state.player.x += state.player.moveSpeed * 1.5 * moveStep;
                        if (state.player.x > state.player.originalX) state.player.x = state.player.originalX;
                    } else {
                        state.player.x -= state.player.moveSpeed * 1.5 * moveStep;
                        if (state.player.x < state.player.originalX) state.player.x = state.player.originalX;
                    }
                }
            }
            
            // ============================================
            // MONSTER ATTACK
            // ============================================
            if (state.monster.isMovingToAttack) {
                const dx = state.monster.attackTargetX - state.monster.x;
                
                if (Math.abs(dx) < 5) {
                    state.monster.x = state.monster.attackTargetX;
                    state.monster.isMovingToAttack = false;
                    state.monster.returningFromAttack = true;
                    state.monster.attackAnimation = 10;
                    
                    if (state.pendingDamage) {
                        if (state.player.invincible <= 0) {
                            createHitEffect(state.player.x, state.player.y - 20, false);
                            addDamageNumber(state.player.x, state.player.y - 50, state.pendingDamage, false);
                            state.player.invincible = 30;
                            state.screenShake = 6;
                            AudioManager.playSound('monster_attack');
                            state.player.hp -= state.pendingDamage;
                            if (state.player.hp < 0) state.player.hp = 0;
                            state.pendingDamage = null;
                            
                            state.player.dodgeOffset = -30;
                            state.player.dodgeTimer = 20;
                            
                            if (state.player.hp <= 0) {
                                setTimeout(function() { gameOver(); }, 500);
                                return;
                            }
                        } else {
                            state.pendingDamage = null;
                        }
                    }
                } else {
                    if (dx > 0) {
                        state.monster.x += state.monster.moveSpeed * 2 * moveStep;
                        if (state.monster.x > state.monster.attackTargetX) state.monster.x = state.monster.attackTargetX;
                    } else {
                        state.monster.x -= state.monster.moveSpeed * 2 * moveStep;
                        if (state.monster.x < state.monster.attackTargetX) state.monster.x = state.monster.attackTargetX;
                    }
                }
            }
            
            // ============================================
            // MONSTER RETURN
            // ============================================
            if (state.monster.returningFromAttack) {
                const dx = state.monster.originalX - state.monster.x;
                
                if (Math.abs(dx) < 5) {
                    state.monster.x = state.monster.originalX;
                    state.monster.returningFromAttack = false;
                    state.attackInProgress = false;
                    
                    if (state.typingBattleActive && typingState.active) {
                        setTimeout(function() {
                            continueTypingBattle();
                        }, 400);
                    }
                } else {
                    if (dx > 0) {
                        state.monster.x += state.monster.moveSpeed * 1.5 * moveStep;
                        if (state.monster.x > state.monster.originalX) state.monster.x = state.monster.originalX;
                    } else {
                        state.monster.x -= state.monster.moveSpeed * 1.5 * moveStep;
                        if (state.monster.x < state.monster.originalX) state.monster.x = state.monster.originalX;
                    }
                }
            }
            
            // ============================================
            // MONSTER DEATH ANIMATION
            // ============================================
            if (state.monsterDeathAnimation.active) {
                state.monsterDeathAnimation.timer--;
                state.monsterDeathAnimation.scale = 1 + (60 - state.monsterDeathAnimation.timer) * 0.02;
                state.monsterDeathAnimation.opacity = Math.max(0, state.monsterDeathAnimation.timer / 60);
                
                for (let i = state.monsterDeathAnimation.explosionParticles.length - 1; i >= 0; i--) {
                    const p = state.monsterDeathAnimation.explosionParticles[i];
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.2;
                    p.life--;
                    if (p.life <= 0) {
                        state.monsterDeathAnimation.explosionParticles.splice(i, 1);
                    }
                }
                
                if (state.monsterDeathAnimation.timer % 10 === 0 && state.monsterDeathAnimation.timer > 20) {
                    for (let i = 0; i < 5; i++) {
                        state.monsterDeathAnimation.explosionParticles.push({
                            x: state.monsterDeathAnimation.x + (Math.random() - 0.5) * 100,
                            y: state.monsterDeathAnimation.y + (Math.random() - 0.5) * 80,
                            vx: (Math.random() - 0.5) * 10,
                            vy: (Math.random() - 0.5) * 8 - 3,
                            size: 5 + Math.random() * 15,
                            color: 'hsl(' + (Math.random() * 60 + 20) + ', 100%, 50%)',
                            life: 20 + Math.random() * 20
                        });
                    }
                    state.screenShake = 8;
                }
                
                if (state.monsterDeathAnimation.timer <= 0) {
                    state.monsterDeathAnimation.active = false;
                    state._deathAnimationActive = false;
                    
                    console.log('🔄 Death animation ended, calling advanceStage()');
                    advanceStage();
                    return;
                }
                return;
            }
            
            // ============================================
            // EFFECTS & TIMERS
            // ============================================
            for (let i = state.attackEffects.length - 1; i >= 0; i--) {
                const e = state.attackEffects[i];
                if (e.vx) { e.x += e.vx; e.y += e.vy; }
                e.timer--;
                if (e.timer <= 0) state.attackEffects.splice(i, 1);
            }
            
            for (let i = state.damageNumbers.length - 1; i >= 0; i--) {
                const dn = state.damageNumbers[i];
                dn.y += dn.vy;
                dn.x += dn.vx;
                dn.vy += 0.1;
                dn.timer--;
                if (dn.timer <= 0) state.damageNumbers.splice(i, 1);
            }
            
            if (state.player.attackCooldown > 0) state.player.attackCooldown--;
            if (state.monster.attackCooldown > 0) state.monster.attackCooldown--;
            if (state.player.invincible > 0) state.player.invincible--;
            if (state.player.attackAnimation > 0) state.player.attackAnimation--;
            if (state.monster.attackAnimation > 0) state.monster.attackAnimation--;
        }

        // ============================================================
        //  MONSTER DEATH & STAGE ADVANCE - FIXED!
        // ============================================================



        function startMonsterDeathAnimation() {
            // ===== PREVENT DOUBLE TRIGGER =====
            if (state._deathAnimationActive) {
                console.log('⚠️ Death animation already active, skipping...');
                return;
            }
            
            state._deathAnimationActive = true;
            console.log('💀 Monster death animation started');
            
            state.monsterDeathAnimation.active = true;
            state.monsterDeathAnimation.timer = 60;
            state.monsterDeathAnimation.x = state.monster.x;
            state.monsterDeathAnimation.y = state.monster.y - 50;
            state.monsterDeathAnimation.scale = 1;
            state.monsterDeathAnimation.opacity = 1;
            
            state.monsterDeathAnimation.explosionParticles = [];
            for (let i = 0; i < 30; i++) {
                state.monsterDeathAnimation.explosionParticles.push({
                    x: state.monster.x + (Math.random() - 0.5) * 100,
                    y: state.monster.y - 30 + (Math.random() - 0.5) * 80,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10 - 3,
                    size: 5 + Math.random() * 15,
                    color: 'hsl(' + (Math.random() * 60 + 20) + ', 100%, 50%)',
                    life: 30 + Math.random() * 30
                });
            }
            
            // ⭐ TINANGGAL ANG SOUND DITO — NASA showStageClear() NA
        }

        function advanceStage() {
            if (state.stage >= 15) {
                showFinalVictory();
                return;
            }
            
            // ===== PREVENT MULTIPLE ADVANCES =====
            if (state._advancing) {
                console.log('⚠️ Advance already in progress, skipping...');
                return;
            }
            
            state._advancing = true;
            console.log(`📊 Stage ${state.stage} clear! Preparing for next...`);
            
            // ⭐ WAG i-increment ang stage dito — sa NEXT STAGE button na lang
            updateStageNumbers();
            showStageClear();
            
            // ===== RESET THE FLAG AFTER A DELAY =====
            setTimeout(function() {
                state._advancing = false;
                console.log('✅ Advance flag reset');
            }, 1500);
        }

        function showStageClear() {
    console.log(`🎉 Stage ${state.stage} clear!`);
    
    // ⭐ PATUGTUGIN ANG STAGE CLEAR SOUND SA LAHAT NG STAGES
    AudioManager.playSound('stage_clear');
    
    document.getElementById('stageClearScreen').classList.add('active');
    updateStageNumbers();
    
    // ⭐ I-INCREMENT ANG COMPLETED STAGES (ito ang bagong logic)
    state.completedStages = state.stage;
    
    // ⭐ I-COMPUTE ANG CURRENT GAME SCORE BASE SA COMPLETED STAGES
    state.currentGameScore = state.completedStages * 10;
    
    // ⭐ I-SAVE ANG CURRENT GAME SCORE SA DATABASE
    if (window.saveProgress) {
        window.saveProgress(state.stage, state.player.hp, state.currentGameScore, true);
    }
    
    console.log(`✅ Stage ${state.stage} completed! Lives: ${state.player.hp}, Score: ${state.currentGameScore} (Completed: ${state.completedStages})`);
}


function gameOver() {
    state.gameActive = false;
    
    // ⭐ I-SAVE ANG TAMANG SCORE BAGO MAG-GAME OVER
    // Base sa completedStages, hindi sa current stage
    if (window.saveProgress && typeof state !== 'undefined') {
        window.saveProgress(state.stage, state.player.hp, state.currentGameScore, true);
    }
    
    // ⭐ PLAY GAME OVER SOUND
    AudioManager.playSound('gameover');
    document.getElementById('gameOverScreen').classList.add('active');
}

        function showFinalVictory() {
            // ⭐ I-update ang score para sa Stage 15
            state.completedStages = 15;
            state.currentGameScore = 150;
            
            // ⭐ I-save ang progress sa database
            if (window.saveProgress) {
                window.saveProgress(15, state.player.hp, 150, true);
            }
            
            console.log('🏆 Final Victory! Score saved: 150');
            
            // ⭐ I-play muna ang victory video
            playVictoryVideo();
        }

        // ⭐ VICTORY VIDEO — I-play bago ang congratulation screen
        function playVictoryVideo() {
            var videoContainer = document.getElementById('victoryVideoContainer');
            var video = document.getElementById('victoryVideo');
            
            if (!videoContainer || !video) {
                // Kung wala ang video elements, diretso sa victory screen
                console.log('⚠️ Victory video not found — showing victory screen directly');
                document.getElementById('finalVictoryScreen').classList.add('active');
                createConfetti();
                return;
            }
            
            console.log('🎬 Playing victory video...');
            
            // ⭐ Ipakita ang video container
            videoContainer.style.display = 'flex';
            
            // ⭐ I-reset ang video
            video.currentTime = 0;
            video.muted = false;    // May sound
            video.volume = 0.7;
            
            // ⭐ I-play ang video
            var playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise.then(function() {
                    console.log('▶️ Victory video playing...');
                }).catch(function(error) {
                    console.log('⚠️ Video autoplay blocked:', error);
                    // Kung blocked, i-play pa rin nang naka-mute
                    video.muted = true;
                    video.play().catch(function(e) {
                        console.log('❌ Cannot play video even muted:', e);
                        // Kung hindi pa rin, diretso sa victory screen
                        videoContainer.style.display = 'none';
                        document.getElementById('finalVictoryScreen').classList.add('active');
                        createConfetti();
                    });
                });
            }
            
            // ⭐ Kapag tapos na ang video, ipakita ang congratulation screen
            video.onended = function() {
                console.log('✅ Victory video finished — showing victory screen');
                
                // Itago ang video
                videoContainer.style.display = 'none';
                
                // Ipakita ang final victory screen
                document.getElementById('finalVictoryScreen').classList.add('active');
                createConfetti();
            };
            
            // ⭐ Handle video errors
            video.onerror = function(e) {
                console.log('❌ Victory video error:', e);
                // Kung may error, diretso sa victory screen
                videoContainer.style.display = 'none';
                document.getElementById('finalVictoryScreen').classList.add('active');
                createConfetti();
            };
        }

        function createConfetti() {
            const container = document.getElementById('confetti');
            if (!container) return;
            container.innerHTML = '';
            const colors = ['#f1c40f', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#e67e22'];
            for (let i = 0; i < 100; i++) {
                const piece = document.createElement('div');
                piece.className = 'confetti-piece';
                piece.style.left = Math.random() * 100 + '%';
                piece.style.animationDelay = Math.random() * 3 + 's';
                piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
                piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                piece.style.width = (Math.random() * 10 + 5) + 'px';
                piece.style.height = (Math.random() * 15 + 10) + 'px';
                piece.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
                container.appendChild(piece);
            }
        }

        // ===== UI UPDATE =====
        function updateUI() {
            const playerFill = document.getElementById('playerHealthFill');
            const monsterFill = document.getElementById('monsterHealthFill');
            const playerStats = document.getElementById('playerStats');
            const monsterStats = document.getElementById('monsterStats');
            
            if (playerFill) {
                playerFill.style.width = (state.player.hp / state.player.maxHp) * 100 + '%';
            }
            if (monsterFill) {
                monsterFill.style.width = (state.monster.hp / state.monster.maxHp) * 100 + '%';
            }
            if (playerStats) {
                playerStats.textContent = Math.floor(state.player.hp) + '/' + state.player.maxHp;
            }
            if (monsterStats) {
                monsterStats.textContent = Math.floor(state.monster.hp) + '/' + state.monster.maxHp;
            }
        }

        function showFeedback(text, color) {
            const hint = document.getElementById('combatHint');
            if (!hint) return;
            hint.textContent = text;
            hint.style.color = color || '#FFFFFF';
            hint.style.display = 'block';
            clearTimeout(hint._timeout);
            hint._timeout = setTimeout(function() {
                hint.style.display = 'none';
            }, 2000);
        }

        // ===== DRAW FUNCTION =====
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            let shakeX = 0, shakeY = 0;
            if (state.screenShake > 0) {
                shakeX = (Math.random() - 0.5) * state.screenShake;
                shakeY = (Math.random() - 0.5) * state.screenShake;
                state.screenShake--;
            }
            
            ctx.save();
            ctx.translate(shakeX, shakeY);
            
            ctx.strokeStyle = 'rgba(209, 116, 210, 0.05)';
            ctx.lineWidth = 1;
            for (let x = 0; x < canvas.width; x += 50) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += 50) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
            ctx.strokeStyle = 'rgba(209, 116, 210, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, canvas.height - 30);
            ctx.lineTo(canvas.width, canvas.height - 30);
            ctx.stroke();
            
            if (state.monsterDeathAnimation.active) {
                ctx.save();
                ctx.globalAlpha = state.monsterDeathAnimation.opacity;
                ctx.translate(state.monsterDeathAnimation.x, state.monsterDeathAnimation.y);
                ctx.scale(state.monsterDeathAnimation.scale, state.monsterDeathAnimation.scale);
                
                if (state.monster.image && state.monster.image.complete) {
                    ctx.drawImage(state.monster.image, -state.monster.width, -state.monster.height, state.monster.width * 2, state.monster.height * 2);
                } else {
                    ctx.fillStyle = '#8B0000';
                    ctx.fillRect(-state.monster.width/2, -state.monster.height, state.monster.width, state.monster.height);
                }
                ctx.restore();
                
                // ⭐ Optimized — isang save/restore
                if (state.monsterDeathAnimation.explosionParticles.length > 0) {
                    ctx.save();
                    for (let p of state.monsterDeathAnimation.explosionParticles) {
                        ctx.globalAlpha = p.life / 50;
                        ctx.fillStyle = p.color;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size * (p.life / 50), 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.restore();
                }
                
                if (state.monsterDeathAnimation.timer > 30) {
                    ctx.save();
                    ctx.font = 'bold 40px "Courier New", monospace';
                    ctx.fillStyle = '#ffaa00';
                    ctx.shadowColor = '#ff0000';
                    ctx.shadowBlur = 20;
                    ctx.globalAlpha = (state.monsterDeathAnimation.timer - 30) / 30;
                    ctx.textAlign = 'center';
                    ctx.fillText('💥 BOOM! 💥', canvas.width/2, 150);
                    ctx.restore();
                }
                
                ctx.restore();
                return;
            }
            
            // ===== DRAW MONSTER =====
            ctx.save();
            const mx = state.monster.x;
            const my = state.monster.y;
            const mw = state.monster.width * 3.0;
            const mh = state.monster.height * 3.0;
            
            if (state.monster.image && state.monster.image.complete) {
                ctx.shadowColor = '#ff0000';
                ctx.shadowBlur = 20;
                
                // ⭐ I-FLIP ANG MONSTER PARA SA STAGE 11 LANG
                var flipMonster = (state.stage === 11 || state.stage === 13);
                
                if (flipMonster) {
                    // I-flip — i-mirror ang image horizontally
                    ctx.save();
                    ctx.translate(mx + state.monster.dodgeOffset, my - mh);
                    ctx.scale(-1, 1);   // ← Ito ang nag-flip
                    ctx.drawImage(state.monster.image, -mw/2, 0, mw, mh);
                    ctx.restore();
                } else {
                    // Normal drawing — walang flip
                    ctx.drawImage(state.monster.image, mx - mw/2 + state.monster.dodgeOffset, my - mh, mw, mh);
                }
                
                ctx.shadowBlur = 0;
                
                // ⭐ Hit flash — puting flash kapag tinamaan
                if (state.monster.attackAnimation > 0) {
                    ctx.save();
                    ctx.globalAlpha = state.monster.attackAnimation / 20;
                    ctx.fillStyle = '#FFFFFF';
                    ctx.beginPath();
                    ctx.arc(mx, my - mh/2, mh/2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            }
            else {
                const gradient2 = ctx.createRadialGradient(mx, my - mh/2, 0, mx, my - mh/2, mh/2);
                if (state.monster.hp > 50) {
                    gradient2.addColorStop(0, '#8B0000');
                    gradient2.addColorStop(1, '#4a0000');
                } else if (state.monster.hp > 25) {
                    gradient2.addColorStop(0, '#B22222');
                    gradient2.addColorStop(1, '#5a0000');
                } else {
                    gradient2.addColorStop(0, '#ff6b6b');
                    gradient2.addColorStop(1, '#8B0000');
                }
                ctx.fillStyle = gradient2;
                ctx.shadowColor = '#ff0000';
                ctx.shadowBlur = 20;
                ctx.beginPath();
                ctx.arc(mx, my - mh/2, mh/2, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
                
                ctx.fillStyle = '#FFD700';
                ctx.shadowColor = '#FFD700';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(mx - 20, my - mh/2 - 10, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(mx + 20, my - mh/2 - 10, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
                
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.arc(mx - 17, my - mh/2 - 5, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(mx + 23, my - mh/2 - 5, 5, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
            
            // ===== DRAW PLAYER =====
            ctx.save();
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 10;
            
            let currentImg = robotImages.idle;
            
            if (state.player.attackAnimation > 0) {
                // attackAnimation: 30 → 0
const progress = 1 - (state.player.attackAnimation / 50);

// Custom timing — iba't ibang tagal bawat frame
let attackFrame;
if (progress < 0.20) {
    attackFrame = 0;   // Wind-up (0.00 – 0.20) — mabilis
} else if (progress < 0.45) {
    attackFrame = 1;   // Impact (0.20 – 0.45) — mabilis
} else if (progress < 0.75) {
    attackFrame = 2;   // Overhead (0.45 – 0.75) — mas matagal
} else {
    attackFrame = 3;   // Ground strike (0.75 – 1.00) — pinakamatagal
}

currentImg = robotImages.attack[attackFrame] || robotImages.idle;
            } else if (state.robot.currentAnim === 'walkD') {
                currentImg = robotImages.walkD[state.robot.currentFrame] || robotImages.idle;
            } else if (state.robot.currentAnim === 'walkA') {
                currentImg = robotImages.walkA[state.robot.currentFrame] || robotImages.idle;
            } else if (state.robot.currentAnim === 'jump') {
                currentImg = robotImages.jump;
            }
            
            const playerScale = 2.5;
            const pw = 70 * playerScale;
            const ph = 90 * playerScale;
            
            // ⭐ Dodge trail — hero (kapag nag-dodge)
            if (state.player.dodgeTimer > 0) {
                ctx.save();
                ctx.globalAlpha = state.player.dodgeTimer / 40;
                ctx.fillStyle = '#4FC3F7';
                ctx.beginPath();
                ctx.arc(state.player.x + state.player.dodgeOffset * 1.5, state.player.y - 50, 15, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            
if (currentImg && currentImg.complete) {
    ctx.save();
    
    // ⭐ LUNGE + ROTATE kapag umaatake
    let lungeX = 0;
    let rotateAngle = 0;
    
if (state.player.attackAnimation > 0) {
    const swingProgress = 1 - (state.player.attackAnimation / 50);   // ← 50 na
    lungeX = Math.sin(swingProgress * Math.PI) * 40;
    rotateAngle = Math.sin(swingProgress * Math.PI) * 0.4;
}
    
    ctx.translate(
        state.player.x + state.player.dodgeOffset + lungeX,
        state.player.y
    );
    ctx.rotate(rotateAngle);
    
    ctx.drawImage(currentImg, -pw/2, -ph, pw, ph);
    ctx.restore();
}
            
            
            else {
                ctx.fillStyle = '#3f567F';
                ctx.fillRect(state.player.x + state.player.dodgeOffset - 25, state.player.y - 45, 50, 55);
                ctx.fillStyle = '#D174D2';
                ctx.beginPath();
                ctx.arc(state.player.x + state.player.dodgeOffset, state.player.y - 55, 18, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(state.player.x + state.player.dodgeOffset - 7, state.player.y - 58, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(state.player.x + state.player.dodgeOffset + 7, state.player.y - 58, 5, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.shadowBlur = 0;
            ctx.restore();

            state.damageNumbers.forEach(function(dn) {
                ctx.save();
                ctx.globalAlpha = dn.timer / 30;
                
                // ⭐ Kung HEAL (positive) — green text na may "+"
                if (dn.isHeal) {
                    ctx.fillStyle = '#2ecc71';
                    ctx.shadowColor = '#2ecc71';
                    ctx.shadowBlur = 15;
                    ctx.font = 'bold 28px "Courier New", monospace';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('+' + dn.amount, dn.x, dn.y);
                } else {
                    // Normal damage (negative)
                    ctx.fillStyle = dn.isPlayer ? '#ffff00' : '#ff0000';
                    ctx.shadowColor = dn.isPlayer ? '#ffaa00' : '#ff6666';
                    ctx.shadowBlur = 10;
                    ctx.font = 'bold 24px "Courier New", monospace';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('-' + dn.amount, dn.x, dn.y);
                }
                ctx.restore();
            });
            
            // ⭐ Optimized — isang save/restore lang para sa LAHAT ng particles
            if (state.attackEffects.length > 0) {
                ctx.save();
                state.attackEffects.forEach(function(e) {
                    ctx.globalAlpha = e.timer / 10 * 0.7;
                    ctx.fillStyle = e.isMonster ? '#E0563F' : '#FFFFFF';
                    ctx.beginPath();
                    ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
                    ctx.fill();
                });
                ctx.restore();
            }
            
// ⭐ EPIC SWORD SLASH EFFECT
if (state.player.attackAnimation > 0) {
    const slashProgress = 1 - (state.player.attackAnimation / 50);
    
    ctx.save();
    ctx.globalAlpha = slashProgress * 0.9;
    
    // Unang slash (puti)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 8;
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 30;
    ctx.lineCap = 'round';
    
    const slashX = state.player.x + 80;
    const slashY = state.player.y - 50;
    const radius = 80;
    const startAngle = -Math.PI / 2 + slashProgress * Math.PI * 1.5;
    const endAngle = startAngle + Math.PI / 3;
    
    ctx.beginPath();
    ctx.arc(slashX, slashY, radius, startAngle, endAngle);
    ctx.stroke();
    
    // Pangalawang slash (ginto)
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(slashX, slashY, radius - 15, startAngle + 0.2, endAngle - 0.2);
    ctx.stroke();
    
    // Sparkles sa impact point
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 20;
    for (let i = 0; i < 5; i++) {
        const sparkleAngle = Math.random() * Math.PI * 2;
        const sparkleDist = 20 + Math.random() * 30;
        const sx = slashX + Math.cos(sparkleAngle) * sparkleDist;
        const sy = slashY + Math.sin(sparkleAngle) * sparkleDist;
        ctx.beginPath();
        ctx.arc(sx, sy, 2 + Math.random() * 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
}
            
            // ⭐ Slash effect — kapag umaatake ang monster
            if (state.monster.attackAnimation > 0) {
                const slashProgress = 1 - (state.monster.attackAnimation / 10);
                ctx.save();
                ctx.globalAlpha = slashProgress * 0.8;
                ctx.strokeStyle = '#E0563F';
                ctx.lineWidth = 4;
                ctx.shadowColor = '#FF0000';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                const slashX = state.monster.x - 60;
                const slashY = state.monster.y - 50;
                const radius = 60;
                const startAngle = Math.PI - slashProgress * Math.PI;
                const endAngle = startAngle - Math.PI / 4;
                ctx.arc(slashX, slashY, radius, startAngle, endAngle);
                ctx.stroke();
                ctx.restore();
            }
            
            ctx.restore();
        }

        // ===== ATTACK BUTTON FUNCTIONS =====
        function updateAttackButton() {
            const attackBtn = document.getElementById('attackBtn');
            const attackStatus = document.getElementById('attackStatus');
            
            if (!attackBtn) return;
            
            let currentEnergy = Math.round(state.player.energy);
            let maxEnergy = Math.round(state.player.maxEnergy);
            let energyPercent = (currentEnergy / maxEnergy) * 100;
            
            let energySpan = attackBtn.querySelector('.attack-energy');
            let newText = '⚡ ' + currentEnergy + '/' + maxEnergy;
            if (energySpan) {
                energySpan.textContent = newText;
            } else {
                attackBtn.innerHTML = '<span class="attack-icon">⚔️</span><span class="attack-label">ATTACK</span><span class="attack-energy">' + newText + '</span>';
            }
            
            attackBtn.classList.remove('level-1', 'level-2', 'level-3', 'level-4', 'level-5', 'super-ready', 'disabled');
            attackBtn.disabled = false;
            attackBtn.style.pointerEvents = 'auto';
            attackBtn.style.opacity = '1';
            attackBtn.style.cursor = 'pointer';
            
            const canAttack = currentEnergy > 0 && state.monster.hp > 0 && state.player.hp > 0 && !state.attackInProgress;
            
            if (!canAttack) {
                attackBtn.classList.add('disabled');
                attackBtn.disabled = true;
                attackBtn.style.pointerEvents = 'none';
                attackBtn.style.opacity = '0.3';
                if (attackStatus) {
                    if (state.attackInProgress) attackStatus.textContent = '⏳ Attacking...';
                    else if (state.monster.hp <= 0) attackStatus.textContent = '💀 Monster defeated!';
                    else if (state.player.hp <= 0) attackStatus.textContent = '💀 You are defeated!';
                    else attackStatus.textContent = 'No energy';
                    attackStatus.className = 'attack-status';
                }
                return;
            }
            
            if (currentEnergy >= maxEnergy) {
                attackBtn.classList.add('super-ready');
                let label = attackBtn.querySelector('.attack-label');
                let icon = attackBtn.querySelector('.attack-icon');
                if (icon) icon.textContent = '💥';
                if (label) {
                    label.textContent = 'SUPER ATTACK';
                    label.style.color = '#FFD700';
                    label.style.textShadow = '0 0 10px #FFD700';
                }
                if (attackStatus) {
                    attackStatus.textContent = '⚡ SUPER ATTACK READY! ⚡';
                    attackStatus.className = 'attack-status super';
                }
                return;
            }
            
            let label = attackBtn.querySelector('.attack-label');
            let icon = attackBtn.querySelector('.attack-icon');
            if (icon) icon.textContent = '⚔️';
            if (label) {
                label.textContent = 'ATTACK';
                label.style.color = '';
                label.style.textShadow = '';
            }
            
            if (energyPercent >= 75) {
                attackBtn.classList.add('level-5');
                if (attackStatus) { attackStatus.textContent = '⚡ HIGH POWER! (' + currentEnergy + '/' + maxEnergy + ')'; attackStatus.className = 'attack-status high'; }
            } else if (energyPercent >= 50) {
                attackBtn.classList.add('level-4');
                if (attackStatus) { attackStatus.textContent = '🔶 POWERFUL! (' + currentEnergy + '/' + maxEnergy + ')'; attackStatus.className = 'attack-status'; }
            } else if (energyPercent >= 25) {
                attackBtn.classList.add('level-3');
                if (attackStatus) { attackStatus.textContent = '🔷 Charged (' + currentEnergy + '/' + maxEnergy + ')'; attackStatus.className = 'attack-status'; }
            } else {
                attackBtn.classList.add('level-2');
                if (attackStatus) { attackStatus.textContent = '🔹 Low Energy (' + currentEnergy + '/' + maxEnergy + ')'; attackStatus.className = 'attack-status ready'; }
            }
        }

        // ===== HANDLE ATTACK BUTTON CLICK =====
        window.handleAttackClick = function() {
            if (state.attackInProgress) {
                console.log('⚠️ Attack already in progress');
                return;
            }
            if (state.monster.hp <= 0) {
                console.log('⚠️ Monster already dead');
                return;
            }
            if (state.player.hp <= 0) {
                console.log('⚠️ Player already dead');
                return;
            }
            if (state.player.energy <= 0) {
                console.log('⚠️ No energy');
                return;
            }
            
            let currentEnergy = Math.round(state.player.energy);
            let maxEnergy = Math.round(state.player.maxEnergy);
            let damage = 0;
            
            // ===== SUPER ATTACK: FULL ENERGY = ONE HIT KILL =====
            if (currentEnergy >= maxEnergy) {
                damage = state.monster.hp;
                showFeedback('💥💥💥 ONE HIT KILL! 💥💥💥', '#FFD700');
                AudioManager.playSound('super_attack');
                createSuperAttackEffect();
            } 
            // ===== NORMAL ATTACK: ENERGY = DAMAGE (1:1 ratio) =====
            else {
                damage = currentEnergy;   // ⭐ 30 energy = 30 damage
                showFeedback('⚔️ Attack! -' + damage + ' HP', '#4FC3F7');
            }
            
            if (damage > state.monster.hp) damage = state.monster.hp;
            if (damage < 1) damage = 1;
            
            // ⭐ I-SET ANG DAMAGE BAGO I-ZERO ANG ENERGY
            state.pendingDamage = damage;
            state.player.energy = 0;
            state.streak++;
            
            // ⭐ I-SET ANG ATTACK FLAG
            state.attackInProgress = true;
            state.player.isMovingToAttack = true;
            state.player.returningFromAttack = false;
            state.player.originalX = state.player.x;
            state.player.attackTargetX = state.monster.x - 99;
            
            state.screenShake = 4;
            
            console.log('⚔️ Attack! Damage:', damage, '(Energy spent:', currentEnergy + ')');
            
            updateUI();
            updateEnergyDisplay();
            updateAttackButton();
        };



        // ===== GAME LOOP =====
        function gameLoop() {
            if (!state.gameActive) {
                animationFrameId = null;
                return;
            }
            
            const now = performance.now();
            if (lastTime === 0) lastTime = now;
            const deltaTime = now - lastTime;
            lastTime = now;
            
            if (state.isCatchStage && catchGameState.active) {
                updateCatchGame(deltaTime);
                drawCatchGame();
            } else {
                updatePhysics(deltaTime);
                draw();
            }
            
            updateUI();
            updateEnergyDisplay();  // ← Ito na ang tumatawag ng updateAttackButton()
            
            animationFrameId = requestAnimationFrame(gameLoop);
        }

        // ===== CATCH GAME FUNCTIONS =====
        function startCatchGame() {
            const s = state.stage;
            catchGameState.neededToWin = 3 + Math.max(0, s-6);
            if (catchGameState.neededToWin > 5) catchGameState.neededToWin = 5;
            catchGameState.correctCaught = 0;
            catchGameState.timer = 999;   // ← Malaking number para hindi mag-trigger
            catchGameState.bubbles = [];
            catchGameState.bubbleSpawnTimer = 0;
                    catchGameState.playerWidth = 120;
        catchGameState.playerHeight = 140;
        catchGameState.speed = 8;
        catchGameState.playerX = 120;
        catchGameState.playerY = GROUND_Y - -20;   // ← I-adjust para pantay sa monster
            catchGameState.lightningToMonster = {active: false, timer: 0};
            catchGameState.lightningToPlayer = {active: false, timer: 0};
            catchGameState.monsterFlash = {active: false, timer: 0};
            catchGameState.playerFlash = {active: false, timer: 0};
            catchGameState.monsterX = 900;
            
            state.player.hp = state.player.maxHp;
            state.monster.hp = state.monster.maxHp;
            updateUI();
            
            let questionPool = questionBank.filter(function(q) { return q.category === 'hardware' || q.category === 'parts'; });
            let randomQ = questionPool[Math.floor(Math.random() * questionPool.length)];
            catchGameState.question = randomQ;
            catchGameState.correctAnswer = randomQ.choices[randomQ.correct];
            catchGameState.wrongAnswers = randomQ.choices.filter(function(_, idx) { return idx !== randomQ.correct; });
            
            var quizOverlay = document.getElementById('quizOverlay');
            var quizSubject = document.getElementById('quizSubject');
            var quizQuestion = document.getElementById('quizQuestion');
            var quizChoices = document.getElementById('quizChoices');
            var stageInfo = document.getElementById('stageInfo');
            var monsterName = document.getElementById('monsterName');
            var combatHint = document.getElementById('combatHint');
            
            quizOverlay.style.display = 'block';
            quizOverlay.classList.remove('emergency-mode');
            quizSubject.innerHTML = '⚡ ANSWER CATCH MODE';
            quizQuestion.innerHTML = randomQ.q;
            quizChoices.innerHTML = '\
                <div style="width:100%; display:flex; justify-content:center; margin-bottom:12px;">\
                    <div style="display:flex; gap:20px; align-items:center; background:rgba(65,38,83,0.88); border:2px solid var(--purple-light); border-radius:30px; padding:8px 18px; color:white; font-size:1rem;">\
                        <div>🎯 Goal: <span id="catchCorrect">0</span>/' + catchGameState.neededToWin + '</div>\
                    </div>\
                </div>\
                <div style="width:100%; text-align:center; color:var(--yellow); font-size:0.95rem; margin-bottom:12px;">\
                    Same color lahat ng bubbles. Basahin ang tanong at hulihin ang tamang sagot.\
                </div>\
                <div style="margin-top:10px; display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">\
                    <button id="btnLeft" style="padding:12px 24px; min-width:170px; font-size:1.05rem; border-radius:40px; background:var(--purple-dark); border:3px solid var(--purple-light); color:white; cursor:pointer; font-weight:bold;">⬅ LEFT (A)</button>\
                    <button id="btnRight" style="padding:12px 24px; min-width:170px; font-size:1.05rem; border-radius:40px; background:var(--purple-dark); border:3px solid var(--purple-light); color:white; cursor:pointer; font-weight:bold;">RIGHT (D) ➡</button>\
                </div>\
            ';
            
            function setKey(key, val) {
                state.keys[key] = val;
                state.keys[key.toLowerCase()] = val;
                state.keys[key.toUpperCase()] = val;
                if (key === 'a') state.keys['KeyA'] = val;
                if (key === 'd') state.keys['KeyD'] = val;
            }
            var btnLeft = document.getElementById('btnLeft');
            var btnRight = document.getElementById('btnRight');

            var bindHoldButton = function(button, key) {
                if (!button) return;
                var press = function(e) {
                    if (e) e.preventDefault();
                    setKey(key, true);
                };
                var release = function(e) {
                    if (e) e.preventDefault();
                    setKey(key, false);
                };

                button.addEventListener('mousedown', press);
                button.addEventListener('mouseup', release);
                button.addEventListener('mouseleave', release);
                button.addEventListener('touchstart', press, { passive: false });
                button.addEventListener('touchend', release, { passive: false });
                button.addEventListener('touchcancel', release, { passive: false });
            };

            bindHoldButton(btnLeft, 'a');
            bindHoldButton(btnRight, 'd');
            
            document.getElementById('catchCorrect').textContent = catchGameState.correctCaught;
            if (stageInfo) stageInfo.textContent = 'STAGE ' + state.stage + '/15 · ANSWER CATCH';
            if (monsterName) monsterName.textContent = 'ANSWER GUARDIAN LVL ' + state.stage;
            if (combatHint) {
                combatHint.textContent = 'A / D OR LEFT / RIGHT TO MOVE';
                combatHint.style.display = 'block';
            }
            
            stopTimer();
        
        // ⭐ GUMAWA NG COUNTDOWN ELEMENT
        var countdownEl = document.createElement('div');
        countdownEl.id = 'catchCountdown';
        countdownEl.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 8rem;
            font-weight: bold;
            color: #ff0000;
            text-shadow: 0 0 40px #ff0000, 0 0 80px #ff0000;
            z-index: 100;
            font-family: 'Courier New', monospace;
            pointer-events: none;
        `;
        document.querySelector('.arena-container').appendChild(countdownEl);
        
        var countdownValue = 5;
        countdownEl.textContent = countdownValue;
        
        var countdownInterval = setInterval(function() {
            countdownValue--;
            
            if (countdownValue > 0) {
                countdownEl.textContent = countdownValue;
                countdownEl.style.animation = 'none';
                void countdownEl.offsetWidth;
                countdownEl.style.animation = 'countdownPop 1s ease-out';
            } else if (countdownValue === 0) {
                countdownEl.textContent = 'GO!';
                countdownEl.style.color = '#ff0000';
                countdownEl.style.textShadow = '0 0 40px #ff0000, 0 0 80px #ff0000';
            } else {
                clearInterval(countdownInterval);
                if (countdownEl.parentNode) {
                    countdownEl.parentNode.removeChild(countdownEl);
                }
                // ⭐ Simulan ang game pagkatapos ng countdown
                startCatchGameTimer();
                catchGameState.active = true;
            }
        }, 1000);
    }

function startCatchGameTimer() {
    // ⭐ WALANG TIMER — tuloy-tuloy lang ang laro
    // Hindi na kailangan ang countdown o game over sa timer
    // Ang laro ay matatapos lang kapag:
    //   1. Na-collect lahat ng correct parts (PANALO)
    //   2. Namatay ang player (TALO)
    
    if (catchGameState.timerInterval) {
        clearInterval(catchGameState.timerInterval);
        catchGameState.timerInterval = null;
    }
    
    console.log('✅ Catch game started — WALANG timer');
}

        function spawnBubble() {
            var isCorrect = Math.random() < 0.38;
            var text;
            if (isCorrect) {
                text = catchGameState.correctAnswer;
            } else {
                var randomIndex = Math.floor(Math.random() * catchGameState.wrongAnswers.length);
                text = catchGameState.wrongAnswers[randomIndex];
            }
            var bubbleWidth = Math.max(120, Math.min(210, text.length * 9 + 34));
            var bubbleHeight = 44;
            var x = Math.random() * (canvas.width - bubbleWidth - 120) + 60;
            var y = 62;
        var bubble = {
            x: x,
            y: y,
            width: bubbleWidth,
            height: bubbleHeight,
            text: text,
            correct: isCorrect,
            speed: 0.8 + Math.random() * 0.4 + ((state.stage - 6) * 0.06)  // ← 0.8-1.2 lang
        };
            catchGameState.bubbles.push(bubble);
        }

        function updateCatchGame(deltaTime) {
            if (catchGameState.lightningToMonster.active) {
                catchGameState.lightningToMonster.timer -= deltaTime;
                if (catchGameState.lightningToMonster.timer <= 0) {
                    catchGameState.lightningToMonster.active = false;
                }
            }
            if (catchGameState.lightningToPlayer.active) {
                catchGameState.lightningToPlayer.timer -= deltaTime;
                if (catchGameState.lightningToPlayer.timer <= 0) {
                    catchGameState.lightningToPlayer.active = false;
                }
            }
            if (catchGameState.monsterFlash.active) {
                catchGameState.monsterFlash.timer -= deltaTime;
                if (catchGameState.monsterFlash.timer <= 0) {
                    catchGameState.monsterFlash.active = false;
                }
            }
            if (catchGameState.playerFlash.active) {
                catchGameState.playerFlash.timer -= deltaTime;
                if (catchGameState.playerFlash.timer <= 0) {
                    catchGameState.playerFlash.active = false;
                }
            }

            catchGameState.playerY = GROUND_Y - -20;

            var moveLeft = state.keys['a'] || state.keys['A'] || state.keys['KeyA'] || state.keys['arrowleft'] || state.keys['ArrowLeft'] || state.keys['←'];
            var moveRight = state.keys['d'] || state.keys['D'] || state.keys['KeyD'] || state.keys['arrowright'] || state.keys['ArrowRight'] || state.keys['→'];

            if (moveLeft) {
                catchGameState.playerX -= catchGameState.speed;
                if (catchGameState.playerX < 40) catchGameState.playerX = 40;
                catchGameState.playerFacing = 'left';   // ⭐ Naka-face sa kaliwa
            }
            if (moveRight) {
                catchGameState.playerX += catchGameState.speed;
                var maxPlayerX = canvas.width - catchGameState.playerWidth - 40;
                if (catchGameState.playerX > maxPlayerX) {
                    catchGameState.playerX = maxPlayerX;
                }
                catchGameState.playerFacing = 'right';  // ⭐ Naka-face sa kanan
            }
            
            catchGameState.bubbleSpawnTimer += deltaTime;
            if (catchGameState.bubbleSpawnTimer > 1100) {
                spawnBubble();
                catchGameState.bubbleSpawnTimer = 0;
            }
            
            for (var i = catchGameState.bubbles.length - 1; i >= 0; i--) {
                var b = catchGameState.bubbles[i];
                b.y += b.speed;
                
                if (checkCollision(
                    b.x, b.y, b.width, b.height,
                    catchGameState.playerX, catchGameState.playerY, catchGameState.playerWidth, catchGameState.playerHeight
                )) {
                    if (b.correct) {
                        catchGameState.correctCaught++;
                        var catchCorrectEl = document.getElementById('catchCorrect');
                        if (catchCorrectEl) catchCorrectEl.textContent = catchGameState.correctCaught;
                        AudioManager.playSound('correct');
                        catchGameState.lightningToMonster.active = true;
                        catchGameState.lightningToMonster.timer = 320;
                        catchGameState.monsterFlash.active = true;
                        catchGameState.monsterFlash.timer = 1000;
                        
                        var energyGain = state.player.energy >= 60 ? 40 : 30;
                        var oldEnergy = state.player.energy;
                        state.player.energy = Math.min(state.player.energy + energyGain, state.player.maxEnergy);
                        state.player.energy = Math.round(state.player.energy);
                        animateEnergyFill(oldEnergy, state.player.energy);
                        showEnergyPopup(energyGain);
                        
                        // ⭐ BAWASAN ANG MONSTER HP KAPAG TAMA ANG NAKUHA
                        var damagePerCatch = Math.ceil(state.monster.maxHp / catchGameState.neededToWin);
                        state.monster.hp -= damagePerCatch;
                        if (state.monster.hp < 0) state.monster.hp = 0;
                        
                        // ⭐ I-PAKITA ANG DAMAGE NUMBER SA MONSTER
                        addDamageNumber(catchGameState.monsterX, state.monster.y - 80, damagePerCatch, true);
                        
                        // ⭐ MALINAW NA FEEDBACK: ✅ TAMA!
                                                // ⭐ CHECK EMOJI LANG KAPAG TAMA
                        showFeedback('✅ -' + damagePerCatch + ' HP', '#2ecc71');
                        
                        updateUI();
                        updateEnergyDisplay();
                        updateAttackButton();
                        
                        if (catchGameState.correctCaught >= catchGameState.neededToWin) {
                            endCatchGame(true);
                            return;
                        }
                    } else {
                        state.player.hp -= 15;
                        if (state.player.hp < 0) state.player.hp = 0;
                        AudioManager.playSound('wrong');
                        catchGameState.lightningToPlayer.active = true;
                        catchGameState.lightningToPlayer.timer = 320;
                        catchGameState.playerFlash.active = true;
                        catchGameState.playerFlash.timer = 1000;
                        
                        // ⭐ MALINAW NA FEEDBACK: ❌ MALI!
                                               // ⭐ X EMOJI LANG KAPAG MALI
                        showFeedback('❌ -15 HP', '#ef4444');
                        
                        updateUI();
                        if (state.player.hp <= 0) {
                            endCatchGame(false);
                            return;
                        }
                    }
                    catchGameState.bubbles.splice(i, 1);
                    continue;
                }
                
                if (b.y > canvas.height + 20) {
                    catchGameState.bubbles.splice(i, 1);
                }
            }
        }

        function checkCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
            return (x1 < x2 + w2 &&
                    x1 + w1 > x2 &&
                    y1 < y2 + h2 &&
                    y1 + h1 > y2);
        }

        function endCatchGame(victory) {
            catchGameState.active = false;
            if (catchGameState.timerInterval) clearInterval(catchGameState.timerInterval);
            catchGameState.timerInterval = null;
            var combatHint = document.getElementById('combatHint');
            if (combatHint) combatHint.style.display = 'none';
            
            if (victory) {
                var itemMap = {6:'keyboard', 7:'mouse', 8:'monitor', 9:'cpu', 10:'avr'};
                var itemKey = itemMap[state.stage];
                if (itemKey && !inventory[itemKey]) {
                    inventory[itemKey] = true;
                    saveInventory();
                }
                showStageClear();
            } else {
                gameOver();
            }
        }

        function drawCatchGame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.save();


            var monsterScale = 2.5;
            var monsterWidth = state.monster.width * monsterScale;
            var monsterHeight = state.monster.height * monsterScale;
            var monsterLeft = catchGameState.monsterX - monsterWidth / 2;
            var monsterTop = state.monster.y - monsterHeight;
            var monsterHeadCenterX = catchGameState.monsterX;
            var monsterHeadCenterY = monsterTop + 40;

            ctx.shadowColor = 'rgba(255, 189, 89, 0.55)';
            ctx.shadowBlur = 14;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            if (state.monster.image && state.monster.image.complete) {
                ctx.drawImage(state.monster.image, monsterLeft, monsterTop, monsterWidth, monsterHeight);
            } else {
                ctx.fillStyle = '#D174D2';
                ctx.fillRect(monsterLeft, monsterTop, monsterWidth, monsterHeight);
            }

            if (catchGameState.monsterFlash.active) {
                ctx.save();
                
                // ⭐ Red tint sa aktwal na monster pixels lang
                const flashAlpha = Math.abs(Math.sin(Date.now() / 100)) * 0.6 + 0.4;
                ctx.globalAlpha = flashAlpha;
                
                // I-drawing muna ang monster image
                if (state.monster.image && state.monster.image.complete) {
                    ctx.drawImage(state.monster.image, monsterLeft, monsterTop, monsterWidth, monsterHeight);
                    
                    // Tapos i-fill ang red sa aktwal na alpha pixels
                    ctx.globalCompositeOperation = 'source-atop';
                    ctx.fillStyle = '#ef4444';
                    ctx.fillRect(monsterLeft, monsterTop, monsterWidth, monsterHeight);
                }
                
                ctx.globalAlpha = 1;
                ctx.globalCompositeOperation = 'source-over';
                ctx.restore();
            }
            ctx.restore();

            catchGameState.bubbles.forEach(function(b) {
                var centerX = b.x + b.width / 2;
                var centerY = b.y + b.height / 2;

                ctx.save();
                ctx.shadowColor = 'rgba(209, 116, 210, 0.45)';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.roundRect(b.x, b.y, b.width, b.height, 24);
                ctx.fillStyle = 'rgba(65, 38, 83, 0.88)';
                ctx.fill();
                ctx.restore();

                ctx.beginPath();
                ctx.roundRect(b.x, b.y, b.width, b.height, 24);
                ctx.fillStyle = 'rgba(99, 71, 132, 0.92)';
                ctx.fill();
                ctx.strokeStyle = '#D174D2';
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.fillStyle = 'rgba(255,255,255,0.18)';
                ctx.beginPath();
                ctx.roundRect(b.x + 10, b.y + 6, b.width - 20, 10, 10);
                ctx.fill();

                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = 'bold 12px "Courier New", monospace';
                ctx.fillStyle = 'white';
                ctx.shadowColor = 'black';
                ctx.shadowBlur = 3;
                drawCatchBubbleText(b.text, centerX, centerY, b.width - 22, 13);
                ctx.shadowBlur = 0;
            });

            catchGameState.playerY = GROUND_Y - -20;
            var playerHeadCenterX = catchGameState.playerX + catchGameState.playerWidth / 2;
            var playerHeadCenterY = catchGameState.playerY + 30;

            if (catchGameState.lightningToMonster.active) {
                drawLightning(
                    playerHeadCenterX,
                    playerHeadCenterY,
                    monsterHeadCenterX,
                    monsterHeadCenterY,
                    '#2ecc71' 
                );
            }
            if (catchGameState.lightningToPlayer.active) {
                drawLightning(
                    monsterHeadCenterX,
                    monsterHeadCenterY,
                    playerHeadCenterX,
                    playerHeadCenterY,
                    '#ef4444'
                );
            }

            ctx.save();
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 4;
            ctx.shadowOffsetY = 4;
            
            // ⭐ Piliin ang image base sa estado
            var pImg = robotImages.idle;
            if (catchGameState.lightningToMonster.active && robotImages.catchSuccess && robotImages.catchSuccess.complete) {
                // ✅ Tama ang catch — naka-taas ang sword + kidlat
                pImg = robotImages.catchSuccess;
            }
            
            if (pImg && pImg.complete) {
                // ⭐ I-flip base sa direction
                if (catchGameState.playerFacing === 'left') {
                    // I-flip pakanan (naka-face sa kaliwa)
                    ctx.save();
                    ctx.translate(catchGameState.playerX + catchGameState.playerWidth, catchGameState.playerY);
                    ctx.scale(-1, 1);
                    ctx.drawImage(pImg, 0, 0, catchGameState.playerWidth, catchGameState.playerHeight);
                    ctx.restore();
                } else {
                    // Normal — naka-face sa kanan
                    ctx.drawImage(
                        pImg,
                        catchGameState.playerX,
                        catchGameState.playerY,
                        catchGameState.playerWidth,
                        catchGameState.playerHeight
                    );
                }
            } else {
                ctx.fillStyle = '#0891b2';
                ctx.fillRect(
                    catchGameState.playerX,
                    catchGameState.playerY,
                    catchGameState.playerWidth,
                    catchGameState.playerHeight
                );
            }

    if (catchGameState.playerFlash.active) {
        ctx.save();
        
        // ⭐ Red tint sa aktwal na hero pixels lang
        const flashAlpha = Math.abs(Math.sin(Date.now() / 100)) * 0.6 + 0.4;
        ctx.globalAlpha = flashAlpha;
        ctx.globalCompositeOperation = 'source-atop';
        
        // ⭐ I-drawing ang parehong image sa parehong posisyon
        const pImg = robotImages.idle;
        if (pImg && pImg.complete) {
            // Unang i-drawing ang image
            ctx.drawImage(
                pImg,
                catchGameState.playerX,
                catchGameState.playerY,
                catchGameState.playerWidth,
                catchGameState.playerHeight
            );
            
            // Tapos i-fill ang red sa aktwal na alpha pixels ng image
            ctx.globalCompositeOperation = 'source-atop';
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(
                catchGameState.playerX,
                catchGameState.playerY,
                catchGameState.playerWidth,
                catchGameState.playerHeight
            );
        }
        
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        ctx.restore();
    }

}   // ← ⭐ ITO ANG KULANG NA BRACE — isara ang drawCatchGame()

function drawCatchBubbleText(text, centerX, centerY, maxWidth, lineHeight) {
    var words = text.split(' ');
    var lines = [];
    var currentLine = '';

    for (var word of words) {
        var testLine = currentLine ? currentLine + ' ' + word : word;
        if (ctx.measureText(testLine).width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }
    if (currentLine) lines.push(currentLine);

    var visibleLines = lines.slice(0, 2);
    var startY = centerY - ((visibleLines.length - 1) * lineHeight) / 2;
    visibleLines.forEach(function(line, index) {
        ctx.fillText(line, centerX, startY + (index * lineHeight));
    });
}

        function drawLightning(x1, y1, x2, y2, color) {
            ctx.save();
            ctx.lineWidth = 6;
            ctx.strokeStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 18;
            ctx.lineCap = 'round';

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            var segments = 7;
            var dx = x2 - x1;
            var dy = y2 - y1;
            for (var i = 1; i < segments; i++) {
                var t = i / segments;
                var px = x1 + dx * t + (Math.random() - 0.5) * 34;
                var py = y1 + dy * t + (Math.random() - 0.5) * 24;
                ctx.lineTo(px, py);
            }
            ctx.lineTo(x2, y2);
            ctx.stroke();

            ctx.lineWidth = 2;
            ctx.strokeStyle = 'white';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            for (var i = 1; i < segments; i++) {
                var t = i / segments;
                var px = x1 + dx * t + (Math.random() - 0.5) * 18;
                var py = y1 + dy * t + (Math.random() - 0.5) * 12;
                ctx.lineTo(px, py);
            }
            ctx.lineTo(x2, y2);
            ctx.stroke();

            ctx.restore();
        }

        // ===== TYPING BATTLE FUNCTIONS =====
        function startTypingBattle(stage) {
            if (stage < 11 || stage > 15) return;
            
            var req = stageRequirements[stage];
            state.typingBattleActive = true;
            typingState.active = true;
            typingState.stage = stage;
            typingState.words = javaWords[stage].slice();
            typingState.totalWords = req.words;
            typingState.currentWordIndex = 0;
            typingState.bossHP = req.bossHP;
            typingState.maxBossHP = req.bossHP;
            typingState.playerHP = req.playerHP;
            typingState.maxPlayerHP = req.playerHP;
            typingState.bossAttackDamage = req.bossAttackDamage;
            typingState.damagePerWord = req.damagePerWord;
            typingState.stageRPM = req.rpm;
            
            // ⭐ I-RESET ANG WORD RESULTS
            typingState.wordResults = [];
            typingState.currentWordResult = null;
            
            state.monster.hp = req.bossHP;
            state.monster.maxHp = req.bossHP;
            state.player.hp = req.playerHP;
            state.player.maxHp = req.playerHP;
            
            shuffleArray(typingState.words);
            setupTypingBattleUI();
            
            setTimeout(function() {
                nextTypingWord();
            }, 500);
        }

    function setupTypingBattleUI() {
        var quizChoices = document.getElementById('quizChoices');
        quizChoices.innerHTML = '';
        quizChoices.className = 'typing-area';
        
        // ⭐ I-ADJUST ANG QUIZ PANEL HEIGHT PARA SA TYPING BATTLE
        var quizPanel = document.getElementById('quizOverlay');
        if (quizPanel) {
            quizPanel.style.height = 'auto';
            quizPanel.style.maxHeight = 'none';
            quizPanel.style.minHeight = '160px';
            quizPanel.style.overflow = 'visible';
            
            // ⭐ IDAGDAG ANG 'typing-mode' CLASS PARA SA CSS ADJUSTMENT
            quizPanel.classList.add('typing-mode');
        }
        
        document.getElementById('quizSubject').textContent = '⌨️ JAVA TYPING BATTLE';
        document.getElementById('quizQuestion').textContent = '';
        
        updateTypingDisplay();
    }

        function updateTypingDisplay() {
            if (!typingState.active) return;
            
            var quizChoices = document.getElementById('quizChoices');
            if (!quizChoices) return;
            
            var fontSize = '1rem';
            if (typingState.totalWords >= 25) fontSize = '0.85rem';
            else if (typingState.totalWords >= 20) fontSize = '0.9rem';
            
            // ⭐ BUILD WORD LIST — may kulay base sa tama/mali
            var wordsHTML = '<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; margin-bottom: 12px; padding: 4px;">';
            
            for (var i = 0; i < typingState.words.length; i++) {
                var word = typingState.words[i];
                var isCurrent = (i === typingState.currentWordIndex);
                var isCompleted = (i < typingState.currentWordIndex);
                
                var bgColor = '#3f567F';
                var textColor = '#ffffff';
                var borderColor = '#D174D2';
                var extraStyle = '';
                
                if (isCompleted) {
                    // ⭐ CHECK KUNG TAMA O MALI ANG WORD NA ITO
                    var wordResult = typingState.wordResults[i];
                    
                    if (wordResult === 'correct') {
                        // ✅ TAMA + NA-REACH ANG RPM — GREEN
                        bgColor = '#2ecc71';
                        borderColor = '#ffffff';
                    } else {
                        // ❌ MALI O HINDI NA-REACH ANG RPM — RED
                        bgColor = '#ef4444';
                        borderColor = '#ffffff';
                    }
                    extraStyle = 'opacity: 0.9;';
                } else if (isCurrent) {
                    bgColor = '#f1c40f';
                    textColor = '#000000';
                    borderColor = '#ffffff';
                    extraStyle = 'transform: scale(1.05); box-shadow: 0 0 15px #f1c40f;';
                }
                
                wordsHTML += '<div style="background: ' + bgColor + '; color: ' + textColor + '; border: 2px solid ' + borderColor + '; border-radius: 16px; padding: 5px 9px; font-size: ' + fontSize + '; font-weight: bold; ' + extraStyle + ' transition: all 0.3s; margin: 2px; white-space: nowrap;">' + word + '</div>';
            }
            wordsHTML += '</div>';
            
            var currentWord = typingState.words[typingState.currentWordIndex] || '';
            
            // ⭐ BUILD FULL HTML
            var fullHTML = '<div style="width: 100%; text-align: center; color: white; font-family: \'Courier New\', monospace;">';
            fullHTML += wordsHTML;
            fullHTML += '<div style="font-size: 1.2rem; margin-bottom: 8px; color: #f1c40f;">➡️ Current word: <span style="background: #f1c40f; padding: 5px 15px; border-radius: 20px; color: #000000; font-weight: bold;">' + currentWord + '</span></div>';
            fullHTML += '<div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #2ecc71; font-size: 1.1rem;">';
            fullHTML += '<div>Time: <span id="typingTimer">' + typingState.timeLeft + '</span>s</div>';
            fullHTML += '<div>RPM: <span id="typingRPM">0</span> / <span id="typingRPMNeed">' + typingState.stageRPM + '</span></div>';
            fullHTML += '<div>Words: ' + (typingState.currentWordIndex + 1) + '/' + typingState.totalWords + '</div>';
            fullHTML += '</div>';
            fullHTML += '<input type="text" id="typingInput" style="width: 100%; padding: 12px; font-size: 1.3rem; background: #3f567F; border: 3px solid #D174D2; color: white; border-radius: 40px; text-align: center; font-family: \'Courier New\', monospace;" placeholder="Type here and press ENTER..." autocomplete="off">';
            fullHTML += '</div>';
            
            quizChoices.innerHTML = fullHTML;
            
            var typingInput = document.getElementById('typingInput');
            if (typingInput) {
                typingInput.addEventListener('keydown', handleTypingKeyDown);
                setTimeout(function() {
                    typingInput.focus();
                }, 50);
            }
        }

        function handleTypingKeyDown(e) {
            // ⭐ SPACE ang submit key imbes na ENTER
            if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                if (!typingState.waitingForNext) {
                    handleTypingSubmit();
                }
            }
        }
        function handleTypingSubmit() {
            var typingInput = document.getElementById('typingInput');
            if (!typingInput) return;
            
            var typed = typingInput.value.trim();
            if (typed === '') return;
            
            if (typingState.timerInterval) {
                clearInterval(typingState.timerInterval);
            }
            
            var endTime = Date.now();
            var timeTaken = (endTime - typingState.startTime) / 1000;
            var currentWord = typingState.words[typingState.currentWordIndex];
            
            var result = calculateTypingDamage(typed, currentWord, timeTaken);
            
            // ⭐ I-SAVE ANG RESULT PARA SA WORD COLOR
            typingState.currentWordResult = (result.attacker === "player") ? 'correct' : 'wrong';
            
            // ⭐ TINANGGAL NA ANG TYPING MESSAGE
            
            typingInput.disabled = true;
            typingState.waitingForNext = true;
            typingState.attacker = result.attacker;
            typingState.pendingDamage = result.attackDamage;
            state.pendingDamage = result.attackDamage;
            
            // ⭐ I-CLEAR ANG INPUT BOX
            typingInput.value = '';
            
            if (result.attacker === "player") {
                startPlayerAttack();
            } else {
                startMonsterAttack();
            }
        }

        function calculateTypingDamage(typed, correct, timeInSeconds) {
            var rpm = calculateRPM(typed, timeInSeconds);
            var rpmEl = document.getElementById('typingRPM');
            if (rpmEl) rpmEl.textContent = rpm;
            
            if (typed.toLowerCase() !== correct.toLowerCase()) {
                return {
                    damage: 0,
                    attacker: "monster",
                    attackDamage: typingState.bossAttackDamage,
                    rpm: rpm,
                    message: "❌ Wrong word! Monster attacks!"
                };
            }
            
            if (rpm < typingState.stageRPM) {
                return {
                    damage: 0,
                    attacker: "monster",
                    attackDamage: typingState.bossAttackDamage,
                    rpm: rpm,
                    message: '⚠️ Below ' + typingState.stageRPM + ' RPM! Monster attacks!'
                };
            }
            
            var errors = 0;
            for (var i = 0; i < correct.length; i++) {
                if (i >= typed.length || typed[i] !== correct[i]) {
                    errors++;
                }
            }
            
            if (errors === 0) {
                return {
                    damage: typingState.damagePerWord,
                    attacker: "player",
                    attackDamage: typingState.damagePerWord,
                    rpm: rpm,
                    message: '✅ Perfect! +' + typingState.damagePerWord + ' damage!'
                };
            } else if (errors <= 2) {
                var damage = Math.floor(typingState.damagePerWord * 0.6);
                return {
                    damage: damage,
                    attacker: "player",
                    attackDamage: damage,
                    rpm: rpm,
                    message: '⚠️ ' + errors + ' error(s)! +' + damage + ' damage!'
                };
            } else {
                var damage = Math.floor(typingState.damagePerWord * 0.3);
                return {
                    damage: damage,
                    attacker: "player",
                    attackDamage: damage,
                    rpm: rpm,
                    message: '⚠️ ' + errors + ' errors! +' + damage + ' damage!'
                };
            }
        }

        function calculateRPM(typedText, timeInSeconds) {
            if (timeInSeconds <= 0) return 0;
            var minutes = timeInSeconds / 60;
            var words = typedText.length / 5;
            return Math.round(words / minutes);
        }

function nextTypingWord() {
    if (!typingState.active) return;
    
    typingState.waitingForNext = false;
    typingState.timeLeft = 10;   // ← 5 → 10 SECONDS
    typingState.startTime = Date.now();
    
    updateTypingDisplay();
    
    var typingInput = document.getElementById('typingInput');
    if (typingInput) {
        typingInput.disabled = false;
        typingInput.focus();
    }
    
    startTypingTimer();
}

        function startTypingTimer() {
            if (typingState.timerInterval) {
                clearInterval(typingState.timerInterval);
            }
            
            typingState.timerInterval = setInterval(function() {
                if (typingState.waitingForNext) return;
                typingState.timeLeft--;
                
                var timerEl = document.getElementById('typingTimer');
                if (timerEl) {
                    timerEl.textContent = typingState.timeLeft;
                    if (typingState.timeLeft <= 3) {   // ← 10 → 3 (warning kapag 3 seconds na lang)
                        timerEl.style.color = '#ff0000';
                    } else {
                        timerEl.style.color = '#2ecc71';
                    }
                }
                
                if (typingState.timeLeft <= 0) {
                    clearInterval(typingState.timerInterval);
                    handleTypingTimeout();
                }
            }, 1000);
        }

        function handleTypingTimeout() {
            var typingInput = document.getElementById('typingInput');
            if (typingInput) typingInput.disabled = true;
            typingState.waitingForNext = true;
            

            
            typingState.attacker = "monster";
            typingState.pendingDamage = typingState.bossAttackDamage;
            state.pendingDamage = typingState.bossAttackDamage;
            startMonsterAttack();
        }

function continueTypingBattle() {
    if (!typingState.active) return;
    
    if (typingState.attacker === "player") {
        typingState.bossHP -= typingState.pendingDamage;
        state.monster.hp = typingState.bossHP;
    } else {
        typingState.playerHP -= typingState.pendingDamage;
        state.player.hp = typingState.playerHP;
    }
    
    // ⭐ I-SAVE ANG RESULT NG WORD BAGO MAG-INCREMENT
    if (typingState.currentWordResult) {
        typingState.wordResults[typingState.currentWordIndex] = typingState.currentWordResult;
        typingState.currentWordResult = null;
    }
    
    typingState.currentWordIndex++;
    typingState.wordsTyped++;
    
    updateUI();
    
    // ⭐ CHECK MUNA KUNG PATAY NA ANG BOSS O PLAYER
    if (typingState.bossHP <= 0) {
        endTypingBattle(true);
        return;
    }
    
    if (typingState.playerHP <= 0) {
        endTypingBattle(false);
        return;
    }
    
    // ⭐ KUNG NAUBOS NA ANG WORDS PERO BUHAY PA ANG BOSS — I-LOOP ANG WORDS
    if (typingState.currentWordIndex >= typingState.words.length) {
        console.log('🔄 Words exhausted — looping word list!');
        
        // I-reset ang currentWordIndex
        typingState.currentWordIndex = 0;
        
        // I-shuffle ulit ang words para hindi predictable
        shuffleArray(typingState.words);
        
        // I-reset ang totalWords counter para sa display
        typingState.totalWords = typingState.totalWords + typingState.words.length;
    }
    
    nextTypingWord();
}

        function endTypingBattle(victory) {
            typingState.active = false;
            state.typingBattleActive = false;
            
            if (typingState.timerInterval) {
                clearInterval(typingState.timerInterval);
            }
            
            var typingInput = document.getElementById('typingInput');
            if (typingInput) typingInput.disabled = true;
            
            // ⭐ I-RESET ANG QUIZ PANEL HEIGHT
            var quizPanel = document.getElementById('quizOverlay');
            if (quizPanel) {
                quizPanel.style.height = '160px';
                quizPanel.style.maxHeight = '160px';
                quizPanel.style.minHeight = '160px';
                quizPanel.style.overflow = 'hidden';
            }
            
            if (victory) {
                setTimeout(function() {
                    resetQuizPanel();
                    
                    // ⭐ Stage 11-15: I-update ang score at i-save
                    if (typingState.stage >= 11 && typingState.stage <= 15) {
                        state.completedStages = typingState.stage;
                        state.currentGameScore = state.completedStages * 10;
                        
                        // ⭐ I-save ang progress sa database
                        if (window.saveProgress) {
                            window.saveProgress(typingState.stage, state.player.hp, state.currentGameScore, true);
                        }
                        
                        console.log('💾 Score saved: ' + state.currentGameScore + ' (Stage ' + typingState.stage + ')');
                        
                        // ⭐ Kung Stage 15, ipakita ang final victory
                        if (typingState.stage === 15) {
                            setTimeout(function() {
                                showFinalVictory();
                            }, 2000);
                        } else {
                            showStageClear();
                        }
                    }
                }, 2000);
            } else {

                setTimeout(function() {
                    resetQuizPanel();
                    gameOver();
                }, 2000);
            }
        }

        function resetQuizPanel() {
        // ⭐ I-RESET ANG QUIZ PANEL HEIGHT
        var quizPanel = document.getElementById('quizOverlay');
        if (quizPanel) {
            quizPanel.style.height = '160px';
            quizPanel.style.maxHeight = '160px';
            quizPanel.style.minHeight = '160px';
            quizPanel.style.overflow = 'hidden';
            
            // ⭐ ALISIN ANG 'typing-mode' CLASS
            quizPanel.classList.remove('typing-mode');
        }
        
        document.getElementById('quizOverlay').style.display = 'block';
            document.getElementById('quizSubject').textContent = '🖥️ HARDWARE BASICS';
            document.getElementById('quizQuestion').textContent = 'What is the function of the motherboard?';
            document.getElementById('quizChoices').innerHTML = '\
                <button class="choice-btn">Connect all components</button>\
                <button class="choice-btn">Process data</button>\
                <button class="choice-btn">Store files</button>\
                <button class="choice-btn">Supply power</button>\
            ';
        }

        // ===== INVENTORY FUNCTIONS =====
        function saveInventory() {
            localStorage.setItem('brainstorm_inventory', JSON.stringify(inventory));
            updateInventoryDisplay();
        }

        function updateInventoryDisplay() {
            var inventoryDiv = document.getElementById('inventoryDisplay');
            if (!inventoryDiv) return;
            
            var html = '<div class="inventory-title">🎒 INVENTORY</div><div class="inventory-items">';
            for (var key in inventory) {
                var item = itemDatabase[key];
                if (inventory[key]) {
                    html += '<div class="inventory-item owned" title="' + item.name + '">' + item.icon + '</div>';
                } else {
                    html += '<div class="inventory-item missing" title="' + item.name + '">❓</div>';
                }
            }
            html += '</div>';
            inventoryDiv.innerHTML = html;
        }

        function showItemAnimation(itemKey) {
            var item = itemDatabase[itemKey];
            var container = document.getElementById('itemAnimation');
            if (!container) return;
            
            container.innerHTML = '';
            var popup = document.createElement('div');
            popup.className = 'item-popup';
            popup.innerHTML = '\
                <div class="item-icon">' + item.icon + '</div>\
                <div class="item-name">' + item.name + '</div>\
                <div class="item-message">ITEM OBTAINED!</div>\
            ';
            container.appendChild(popup);
            container.classList.add('active');
            
            setTimeout(function() {
                container.classList.remove('active');
                container.innerHTML = '';
            }, 3000);
        }

        // ===== GATE FUNCTIONS (DISABLED) =====
        function checkGateBeforeBoss() {
            // ⭐ Dire-diretso na sa typing battle — walang gate screen
            startTypingBattle(state.stage);
        }

        // Gate screen removed — hindi na kailangan
        function showGateScreen() {
            // Dire-diretso sa typing battle
            startTypingBattle(state.stage);
        }
        // Gate click handlers removed — hindi na kailangan

        // ============================================================
        //  VIDEO INTRO FUNCTIONS - FIXED FOR 33-SECOND VIDEO
        // ============================================================

        let introVideoStarted = false;
        let introVideoEnded = false;
        let introSkipClicked = false;

        function playIntroVideoOnly() {
            console.log('🎬 Playing intro video (33 seconds)...');
            
            var introContainer = document.getElementById('introVideoContainer');
            var introVideo = document.getElementById('introVideo');
            var introMusic = document.getElementById('introMusic');
            
            // Reset flags
            introVideoStarted = false;
            introVideoEnded = false;
            introSkipClicked = false;
            
            // Show intro
            introContainer.style.display = 'flex';
            introContainer.classList.add('active');
            
            // ⭐ IMPORTANT: Force reload video to ensure clean start
            introVideo.load();
            
            // ⭐ Play background music
            if (introMusic) {
                var savedVolume = localStorage.getItem('brainstorm_music_volume');
                introMusic.volume = savedVolume ? parseFloat(savedVolume) : 0.3;
                introMusic.currentTime = 0;
                introMusic.play().catch(function(e) {
                    console.log('🔇 Music autoplay blocked');
                });
            }
            
            // ⭐ REMOVED: No auto-skip timeout!
            
            // ⭐ ONLY start game when video actually ends
            introVideo.onended = function() {
                console.log('✅ Intro video finished naturally (33 seconds complete)');
                if (!introSkipClicked && !introVideoEnded) {
                    introVideoEnded = true;
                    startGameAfterVideo();
                }
            };
            
            // ⭐ Handle video errors - DON'T skip immediately, try to recover
            introVideo.onerror = function(e) {
                console.log('⚠️ Intro video error:', e);
                // Only skip if it's a fatal error (not a loading hiccup)
                if (introVideo.error && introVideo.error.code === 4) { // MEDIA_ERR_SRC_NOT_SUPPORTED
                    console.log('❌ Video file not found or unsupported - starting game');
                    if (!introSkipClicked && !introVideoEnded) {
                        introVideoEnded = true;
                        startGameAfterVideo();
                    }
                }
                // Otherwise, let the video keep trying to load
            };
            
            // ⭐ Try to play video
            var playPromise = introVideo.play();
            
            if (playPromise !== undefined) {
                playPromise.then(function() {
                    console.log('▶️ Intro video playing...');
                    introVideoStarted = true;
                }).catch(function(error) {
                    console.log('⚠️ Autoplay blocked:', error);
                    // Show click-to-play overlay
                    showClickToPlayOverlay();
                });
            }
            
            // ⭐ Handle waiting/buffering - Don't skip, just wait
            introVideo.addEventListener('waiting', function() {
                console.log('⏳ Video buffering...');
            });
            
            introVideo.addEventListener('canplay', function() {
                console.log('✅ Video ready to play');
            });
        }

        // ===== SHOW CLICK TO PLAY OVERLAY =====
        function showClickToPlayOverlay() {
            var overlay = document.getElementById('clickToPlayOverlay');
            if (overlay) {
                overlay.style.display = 'flex';
                overlay.addEventListener('click', function playOnClick() {
                    var introVideo = document.getElementById('introVideo');
                    var introMusic = document.getElementById('introMusic');
                    
                    introVideo.play().catch(function() {});
                    if (introMusic) introMusic.play().catch(function() {});
                    
                    overlay.style.display = 'none';
                    overlay.removeEventListener('click', playOnClick);
                });
            }
        }

        // ===== SKIP BUTTON =====
        document.querySelector('.video-skip')?.addEventListener('click', function() {
            console.log('⏭️ User clicked SKIP');
            
            if (introSkipClicked) return; // Prevent double skip
            introSkipClicked = true;
            
            var introVideo = document.getElementById('introVideo');
            var introMusic = document.getElementById('introMusic');
            var introContainer = document.getElementById('introVideoContainer');
            
            // Stop music
            if (introMusic) {
                introMusic.pause();
                introMusic.currentTime = 0;
            }
            
            // Stop video
            introVideo.pause();
            
            // Hide intro
            introContainer.style.display = 'none';
            introContainer.classList.remove('active');
            
            // Start game
            startGameAfterVideo();
        });

        // ===== START GAME AFTER VIDEO =====
        function startGameAfterVideo() {
            // Prevent multiple calls
            if (window._gameStarting) return;
            window._gameStarting = true;
            
            console.log('🎮 Starting game...');
            
            var introContainer = document.getElementById('introVideoContainer');
            var introVideo = document.getElementById('introVideo');
            var introMusic = document.getElementById('introMusic');
            
            // Stop intro music
            if (introMusic) {
                introMusic.pause();
                introMusic.currentTime = 0;
            }
            
            // Stop video
            introVideo.pause();
            
            // Hide intro
            introContainer.style.display = 'none';
            introContainer.classList.remove('active');
            
            // ⭐ Show game container
            var gameContainer = document.getElementById('gameContainer');
            if (gameContainer) {
                gameContainer.style.display = 'flex';
                gameContainer.classList.add('active');
                console.log('✅ Game container shown');
            }
            
            // Load assets
            loadRobotImages();
            loadMonsterImages();
            
            // Initialize game state
            state.gameActive = true;
            state.stage = 1;
            state.player.hp = 100;
            state.player.maxHp = 100;
            state.player.energy = 0;
            state.player.maxEnergy = 100;
            state.monster.hp = 100;
            state.monster.maxHp = 100;
            
            updateStageMode();
            
            // Show explanation after a short delay
            setTimeout(function() {
                showExplanation(1);
            }, 500);
            
            // Start game loop if not already running
            if (!gameInitialized) {
                gameInitialized = true;
                gameLoop();
            }
            
            // Reset flag after a moment
            setTimeout(function() {
                window._gameStarting = false;
            }, 1000);
        }

        // ===== SKIP BUTTON (User-initiated skip) =====
        document.querySelector('.video-skip')?.addEventListener('click', function() {
            var introVideo = document.getElementById('introVideo');
            var introMusic = document.getElementById('introMusic');
            var introContainer = document.getElementById('introVideoContainer');
            
            // Stop intro music
            if (introMusic) {
                introMusic.pause();
                introMusic.currentTime = 0;
            }
            
            // Stop video
            introVideo.pause();
            
            // Hide intro
            introContainer.style.display = 'none';
            introContainer.classList.remove('active');
            
            // Start game
            startGameAfterVideo();
        });

document.getElementById('playBtn')?.addEventListener('click', function() {
    // ⭐ I-SET ANG PLAYER ONLINE
    const savedUser = localStorage.getItem('game_user');
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            if (user && user.id) {
                fetch(API_URL + 'set_online.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: user.id })
                }).then(() => console.log('✅ Player set to ONLINE (PLAY)'));
            }
        } catch(e) {}
    }
    
    // ⭐ I-RESET ANG CURRENT GAME SCORE AT COMPLETED STAGES BAGO MAG-START NG BAGONG GAME
    if (typeof state !== 'undefined') {
        state.currentGameScore = 0;
        state.completedStages = 0;
        state.stage = 1;
    }
    document.getElementById('startMenu')?.classList.remove('active');
    document.getElementById('categoryScreen')?.classList.add('active');
});

        document.getElementById('hardwareBtn')?.addEventListener('click', function() {
            state.selectedCategory = 'hardware';
            document.querySelectorAll('.category-btn').forEach(function(b) { b.classList.remove('selected'); });
            this.classList.add('selected');
        });

        document.getElementById('softwareBtn')?.addEventListener('click', function() {
            state.selectedCategory = 'software';
            document.querySelectorAll('.category-btn').forEach(function(b) { b.classList.remove('selected'); });
            this.classList.add('selected');
        });

        document.getElementById('partsBtn')?.addEventListener('click', function() {
            state.selectedCategory = 'parts';
            document.querySelectorAll('.category-btn').forEach(function(b) { b.classList.remove('selected'); });
            this.classList.add('selected');
        });

        document.getElementById('startGameBtn')?.addEventListener('click', function() {
            // Check kung may napiling topic
            const selected = document.querySelector('.category-btn.selected');
            if (!selected) {
                alert('Please select a topic first!');
                return;
            }
            
            console.log('🎮 START GAME button clicked!');
            document.getElementById('categoryScreen')?.classList.remove('active');
            playIntroVideoOnly();
        });

        document.getElementById('explanationOkBtn')?.addEventListener('click', function() {
            console.log('✅ OKAY, START! clicked');
            hideExplanation();
            
            // ===== START THE GAME =====
            if (state.stage <= 5) {
                console.log('📚 Starting Stage 1-5 Quiz Mode');
                updateStageMode();
                loadNewQuestion();
            } else if (state.stage >= 6 && state.stage <= 10) {
                console.log('🎯 Starting Stage 6-10 Catch Mode');
                updateStageMode();
                startCatchGame();
            } else if (state.stage >= 11 && state.stage <= 15) {
                console.log('👾 Starting Stage 11-15 Typing Battle');
                updateStageMode();
                checkGateBeforeBoss();
            }
        });
        document.getElementById('nextStageBtn')?.addEventListener('click', function() {
            document.getElementById('stageClearScreen')?.classList.remove('active');
            
            state._advancing = false;
            
            // ⭐ +30 HP reward kapag nanalo ng stage
            const healAmount = 30;
            const oldHp = state.player.hp;
            state.player.hp = Math.min(state.player.hp + healAmount, state.player.maxHp);
            const actualHeal = state.player.hp - oldHp;
            
            updateUI();
            console.log(`💚 HP restored +${actualHeal} → ${state.player.hp}/${state.player.maxHp}`);
            
            // ⭐ Ipakita ang HEAL number sa screen
            addHealNumber(state.player.x, state.player.y - 100, actualHeal);
            
            // ⭐ Ipakita ang feedback message
            if (actualHeal > 0) {
                showFeedback(`💚 +${actualHeal} HP Restored!`, '#2ecc71');
            } else {
                showFeedback(`💚 HP Already Full!`, '#2ecc71');
            }
            
state.stage++;
state.correctAnswersCount = 0;
state.wrongQuestions = [];
state.streak = 0;
// ⭐ HUWAG I-UPDATE ANG currentGameScore DITO — sa showStageClear() lang
state.quizAnswered = false;
            state.attackInProgress = false;
            state.monsterDeathAnimation.active = false;
            state.isCatchStage = false;
            state.typingBattleActive = false;
            catchGameState.active = false;
            typingState.active = false;
            
            state.player.energy = 0;
            state.player.maxEnergy = 100;
            updateEnergyDisplay();
            
            state.player.x = 120;
            state.player.y = 430;
            state.monster.x = 900;
            state.monster.y = 430;
            state.player.originalX = 120;
            state.monster.originalX = 900;
            
            if (state.stage === 6) {
                showExplanation(2);
                return;
            } else if (state.stage === 11) {
                showExplanation(3);
                return;
            }
            
            updateStageMode();
            
            if (state.stage <= 5) {
                loadNewQuestion();
            } else if (state.stage >= 6 && state.stage <= 10) {
                startCatchGame();
            } else if (state.stage >= 11 && state.stage <= 15) {
                checkGateBeforeBoss();
            }
        });

document.getElementById('menuBtn')?.addEventListener('click', function() {
    if (confirm('Return to main menu?')) {
        window._isReloading = true;  // ← I-SET BAGO MAG-RELOAD
        location.reload();
    }
});

        document.getElementById('homeFromClearBtn')?.addEventListener('click', function() {
        window._isReloading = true;  // ← I-SET BAGO MAG-RELOAD
       location.reload();
        });

document.getElementById('homeFromGameOverBtn')?.addEventListener('click', function() {
    window._isReloading = true;  // ← I-SET BAGO MAG-RELOAD
    location.reload();
});

document.getElementById('victoryHomeBtn')?.addEventListener('click', function() {
    window._isReloading = true;  // ← I-SET BAGO MAG-RELOAD
    location.reload();
});

document.getElementById('tryAgainBtn')?.addEventListener('click', function() {
    // ⭐ I-RESET ANG CURRENT GAME SCORE AT COMPLETED STAGES BAGO MAG-RELOAD
    if (typeof state !== 'undefined') {
        state.currentGameScore = 0;
        state.completedStages = 0;
        state.stage = 1;
    }
    window._isReloading = true;
    location.reload();
});

document.getElementById('howToPlayBtn')?.addEventListener('click', function() {
    // ⭐ I-SET ANG PLAYER ONLINE
    const savedUser = localStorage.getItem('game_user');
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            if (user && user.id) {
                fetch(API_URL + 'set_online.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: user.id })
                }).then(() => console.log('✅ Player set to ONLINE (HOW TO PLAY)'));
            }
        } catch(e) {}
    }
    
    var panel = document.getElementById('howToPanel');
    if (panel) panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
});

document.getElementById('settingsBtn')?.addEventListener('click', function() {
    // ⭐ I-SET ANG PLAYER ONLINE
    const savedUser = localStorage.getItem('game_user');
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            if (user && user.id) {
                fetch(API_URL + 'set_online.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: user.id })
                }).then(() => console.log('✅ Player set to ONLINE (SETTINGS)'));
            }
        } catch(e) {}
    }
    
    var panel = document.getElementById('settingsPanel');
    if (panel) panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
});

        document.getElementById('saveSettingsBtn')?.addEventListener('click', function() {
            alert('Settings saved!');
            document.getElementById('settingsPanel').style.display = 'none';
        });

        document.getElementById('closeSettingsBtn')?.addEventListener('click', function() {
            document.getElementById('settingsPanel').style.display = 'none';
        });



        // ⭐ DISABLED — custom modal na ang gumagana (nasa HTML)
// Ang lumang confirm() ay tinanggal para gumana ang custom modal
console.log('✅ Old logout listener disabled — using custom modal from HTML');

        canvas.addEventListener('click', function(e) {
            if (!state.isCatchStage || !catchGameState.active) return;
            var rect = canvas.getBoundingClientRect();
            var scaleX = canvas.width / rect.width;
            var scaleY = canvas.height / rect.height;
            var x = (e.clientX - rect.left) * scaleX;
            var y = (e.clientY - rect.top) * scaleY;
        });

        // ===== SILENT CHEAT CODE: petalino + inoy + pastrana + abcde =====
        let cheatBuffer = '';
        let cheatBuffer2 = '';
        let cheatBuffer3 = '';
        let cheatBuffer4 = '';

        document.addEventListener('keydown', function(e) {
            state.keys[e.key] = true;
            state.keys[e.code] = true;
            
            // ===== SILENT CHEAT DETECTION =====
            if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
                var key = e.key.toLowerCase();
                
                // ===== CHEAT #1: petalino = FULL ENERGY =====
                cheatBuffer += key;
                if (cheatBuffer.length > 8) {
                    cheatBuffer = cheatBuffer.slice(-8);
                }
                
                if (cheatBuffer === 'petalino') {
                    cheatBuffer = '';
                    
                    state.player.energy = state.player.maxEnergy;
                    state.player.energy = Math.round(state.player.energy);
                    
                    updateEnergyDisplay();
                    updateAttackButton();
                    animateEnergyFill(0, state.player.energy);
                    
                    console.log('⚡ Energy refilled silently.');
                }
                
                // ===== CHEAT #2: inoy = SKIP TO STAGE 6 =====
                cheatBuffer2 += key;
                if (cheatBuffer2.length > 4) {
                    cheatBuffer2 = cheatBuffer2.slice(-4);
                }
                
                if (cheatBuffer2 === 'inoy') {
                    cheatBuffer2 = '';
                    
                    state.stage = 6;
                    state.correctAnswersCount = 0;
                    state.wrongQuestions = [];
                    state.streak = 0;
                    state.quizAnswered = false;
                    state.attackInProgress = false;
                    state.monsterDeathAnimation.active = false;
                    state.isCatchStage = false;
                    state.typingBattleActive = false;
                    catchGameState.active = false;
                    typingState.active = false;
                    
                    state.player.energy = 0;
                    state.player.maxEnergy = 100;
                    updateEnergyDisplay();
                    
                    state.player.x = 120;
                    state.player.y = 430;
                    state.monster.x = 900;
                    state.monster.y = 430;
                    state.player.originalX = 120;
                    state.monster.originalX = 900;
                    
                    stopTimer();
                    
                    updateStageMode();
                    showExplanation(2);
                    
                    console.log('🚀 Skipped to Stage 6.');
                }
                
                // ===== CHEAT #3: pastrana = SKIP TO STAGE 11 =====
                cheatBuffer3 += key;
                if (cheatBuffer3.length > 8) {
                    cheatBuffer3 = cheatBuffer3.slice(-8);
                }
                
                if (cheatBuffer3 === 'pastrana') {
                    cheatBuffer3 = '';
                    
                    // SILENT: Skip to Stage 11
                    state.stage = 11;
                    state.correctAnswersCount = 0;
                    state.wrongQuestions = [];
                    state.streak = 0;
                    state.quizAnswered = false;
                    state.attackInProgress = false;
                    state.monsterDeathAnimation.active = false;
                    state.isCatchStage = false;
                    state.typingBattleActive = false;
                    catchGameState.active = false;
                    typingState.active = false;
                    
                    state.player.energy = 0;
                    state.player.maxEnergy = 100;
                    updateEnergyDisplay();
                    
                    state.player.x = 120;
                    state.player.y = 430;
                    state.monster.x = 900;
                    state.monster.y = 430;
                    state.player.originalX = 120;
                    state.monster.originalX = 900;
                    
                    stopTimer();
                    
                    updateStageMode();
                    showExplanation(3);
                    
                    console.log('🚀 Skipped to Stage 11.');
                }
                
                // ===== CHEAT #4: abcde = SKIP TO STAGE 15 =====
                cheatBuffer4 += key;
                if (cheatBuffer4.length > 5) {
                    cheatBuffer4 = cheatBuffer4.slice(-5);
                }
                
                if (cheatBuffer4 === 'abcde') {
                    cheatBuffer4 = '';
                    
                    // SILENT: Skip to Stage 15
                    state.stage = 15;
                    state.correctAnswersCount = 0;
                    state.wrongQuestions = [];
                    state.streak = 0;
                    state.quizAnswered = false;
                    state.attackInProgress = false;
                    state.monsterDeathAnimation.active = false;
                    state.isCatchStage = false;
                    state.typingBattleActive = false;
                    catchGameState.active = false;
                    typingState.active = false;
                    
                    state.player.energy = 0;
                    state.player.maxEnergy = 100;
                    updateEnergyDisplay();
                    
                    state.player.x = 120;
                    state.player.y = 430;
                    state.monster.x = 900;
                    state.monster.y = 430;
                    state.player.originalX = 120;
                    state.monster.originalX = 900;
                    
                    stopTimer();
                    
                    updateStageMode();
                    showExplanation(3);
                    
                    console.log('🚀 Skipped to Stage 15.');
                }
            }
            
            // AYUSIN NATIN ITO: Kapag 'a' o 'd' lang, i-prevent lang natin kung nasa catch game tayo
            if ((e.key === 'a' || e.key === 'A' || e.key === 'd' || e.key === 'D') && state.isCatchStage) {
                e.preventDefault();
            }
            
            if (e.key >= '1' && e.key <= '4' && state.stage <= 5) {
                var index = parseInt(e.key) - 1;
                var buttons = document.querySelectorAll('.choice-btn');
                if (buttons[index] && !buttons[index].classList.contains('disabled')) {
                    buttons[index].click();
                }
            }
        });

        document.addEventListener('keyup', function(e) {
            state.keys[e.key] = false;
            state.keys[e.code] = false;
        });

        // ============================================================
        //  STAGE NUMBERS INDICATOR
        // ============================================================
        function updateStageNumbers() {
            const container = document.getElementById('stageNumbers');
            if (!container) return;
            
            const currentStage = state.stage || 1;
            const totalStages = 15;
            
            let html = '';
            for (let i = 1; i <= totalStages; i++) {
                let className = 'stage-number';
                
                if (i === currentStage) {
                    className += ' active';
                } else if (i < currentStage) {
                    className += ' completed';
                } else {
                    className += ' locked';
                }
                
                html += `<div class="${className}">${i}</div>`;
            }
            
            container.innerHTML = html;
        }

        // ============================================================
        //  LEADERBOARD BUTTON (Start Menu)
        // ============================================================
        document.addEventListener('DOMContentLoaded', function() {
            const leaderboardBtn = document.getElementById('leaderboardMenuBtn'); // <-- Ito na!
            const overlay = document.getElementById('playerLeaderboardOverlay');
            const content = document.getElementById('playerLeaderboardContent');
            const closeBtn = document.getElementById('closePlayerLeaderboardBtn');

            if (leaderboardBtn && overlay) {
                leaderboardBtn.addEventListener('click', async function() { // <-- Ito na din!
                    overlay.style.display = 'flex';
                    content.innerHTML = '<div style="text-align: center; color: #888; padding: 20px;">Loading leaderboard...</div>';

                    try {
                        const response = await fetch(API_URL + 'leaderboard.php');
                        const data = await response.json();

                        if (data.success && data.players.length > 0) {
                            // ... (kung ano man ang nasa loob, okay na yun basta nakapalit na ang variable)
                        }
                    } catch (error) {
                        console.error("❌ Leaderboard Error:", error);
                        content.innerHTML = '<div style="text-align: center; color: #ff6b6b; padding: 20px;">Error loading leaderboard. Check XAMPP.</div>';
                    }
                });
            }
        });

        // ============================================================
        //  TOP BAR LEADERBOARD BUTTON (Once lang)
        // ============================================================
        document.addEventListener('DOMContentLoaded', function() {
            const topBarBtn = document.getElementById('leaderboardBtnSmall');
            const mainBtn = document.getElementById('leaderboardMenuBtn');

            if (topBarBtn && mainBtn) {
                topBarBtn.addEventListener('click', function() {
                    mainBtn.click();
                });
            }
        });

        // ===== INIT =====
        const GROUND_Y = 430;

        AudioManager.init();
        loadRobotImages();
        loadMonsterImages();
        updateInventoryDisplay();




   document.getElementById('startMenu')?.classList.add('active');

// ============================================================
//  HEARTBEAT — Every 5 seconds
//  Para manatiling ONLINE ang player habang bukas ang tab
// ============================================================
setInterval(function() {
    const savedUser = localStorage.getItem('game_user');
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            if (user && user.id) {
                fetch(API_URL + 'heartbeat.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: user.id })
                })
                .then(function(res) { return res.json(); })
                .then(function(data) {
                    if (data.success) {
                        console.log('💓 Heartbeat sent:', data.time);
                    }
                })
                .catch(function(e) {
                    console.log('💔 Heartbeat failed:', e);
                });
            }
        } catch(e) {}
    }
}, 5000); // ⭐ 5 seconds

console.log('💓 Heartbeat system started — every 5 seconds');

        // ⭐ I-FETCH ANG QUESTIONS MULA SA DATABASE
        fetchQuestionsFromDB().then(success => {
            if (success) {
                console.log('✅ Questions ready — game can start!');
            } else {
                console.error('❌ Failed to load questions — using empty bank');
            }
        });


// ============================================================
//  BEFOREUNLOAD — MAG-OFFLINE LANG KAPAG TOTOONG LOGOUT O CLOSE
//  HUWAG MAG-OFFLINE KAPAG REFRESH / F5 / HARD REFRESH
// ============================================================
let _allowOffline = false; // ⭐ Flag — naka-false by default

// ⭐ Function para i-set ang flag bago mag-logout o mag-close
window.allowOfflineOnUnload = function() {
    _allowOffline = true;
    console.log('✅ Offline on unload allowed');
};

// ============================================================
//  BEFOREUNLOAD — HUWAG MAG-OFFLINE KAPAG REFRESH
//  Ang offline ay via heartbeat timeout (30 seconds walang heartbeat)
// ============================================================
window.addEventListener('beforeunload', function() {
    // ⭐ WALANG OFFLINE SA REFRESH — heartbeat system na ang bahala
    console.log('🔄 Page unloading — heartbeat will timeout in 30s');
});

        console.log('🎮 BRAINSTORM BATTLE v4.0 FINAL!');
        console.log('📚 Stages 1-5: Quiz Battle');
        console.log('🎯 Stages 6-10: Catch the Parts');
        console.log('⌨️ Stages 11-15: Typing Battle');


        // ===== SAFE ATTACK BUTTON BINDING =====
        document.addEventListener('DOMContentLoaded', function() {
            const attackBtn = document.getElementById('attackBtn');
            if (attackBtn) {
                attackBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.handleAttackClick();
                });
                console.log('✅ Attack button bound safely');
            }
        });



        // ⭐ FORCE DELETE REGEN CONTAINER
setTimeout(function() {
    var regenEl = document.getElementById('regenContainer');
    if (regenEl && regenEl.parentNode) {
        regenEl.parentNode.removeChild(regenEl);
        console.log('✅ Regen container deleted!');
    }
}, 1000);

        gameLoop();