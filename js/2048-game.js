// 2048 게임 로직
let grid2048 = [];
let score2048 = 0;
let bestScore2048 = 0;
let gameOver = false;

// 로컬 스토리지에서 최고 점수 불러오기
function loadBestScore() {
    const saved = localStorage.getItem('best-score-2048');
    bestScore2048 = saved ? parseInt(saved) : 0;
    document.getElementById('best-2048').textContent = bestScore2048;
}

// 최고 점수 저장
function saveBestScore() {
    if (score2048 > bestScore2048) {
        bestScore2048 = score2048;
        localStorage.setItem('best-score-2048', bestScore2048);
        document.getElementById('best-2048').textContent = bestScore2048;
    }
}

// 새 게임 초기화
function new2048Game() {
    grid2048 = Array(4).fill().map(() => Array(4).fill(0));
    score2048 = 0;
    gameOver = false;
    
    document.getElementById('score-2048').textContent = '0';
    loadBestScore();
    
    // 초기 타일 2개 생성
    addRandomTile();
    addRandomTile();
    
    render2048Grid();
}

// 랜덤 타일 추가
function addRandomTile() {
    const emptyCells = [];
    
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (grid2048[row][col] === 0) {
                emptyCells.push({ row, col });
            }
        }
    }
    
    if (emptyCells.length === 0) return;
    
    const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid2048[row][col] = Math.random() < 0.9 ? 2 : 4;
}

// 그리드 렌더링
function render2048Grid() {
    const gridElement = document.getElementById('grid-2048');
    gridElement.innerHTML = '';
    
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const tile = document.createElement('div');
            tile.className = 'tile-2048';
            
            const value = grid2048[row][col];
            if (value !== 0) {
                tile.textContent = value;
                tile.dataset.value = value;
            }
            
            gridElement.appendChild(tile);
        }
    }
}

// 이동 로직
function move(direction) {
    if (gameOver) return;
    
    let moved = false;
    const oldGrid = grid2048.map(row => [...row]);
    
    switch (direction) {
        case 'left':
            moved = moveLeft();
            break;
        case 'right':
            moved = moveRight();
            break;
        case 'up':
            moved = moveUp();
            break;
        case 'down':
            moved = moveDown();
            break;
    }
    
    if (moved) {
        addRandomTile();
        render2048Grid();
        updateScore();
        
        if (checkWin()) {
            setTimeout(() => {
                alert('🎉 축하합니다! 2048 타일을 만들었습니다!\n계속 플레이할 수 있습니다.');
            }, 300);
        }
        
        if (checkGameOver()) {
            gameOver = true;
            saveBestScore();
            setTimeout(() => {
                alert(`게임 오버! 최종 점수: ${score2048}`);
            }, 300);
        }
    }
}

// 왼쪽 이동
function moveLeft() {
    let moved = false;
    
    for (let row = 0; row < 4; row++) {
        const line = grid2048[row].filter(cell => cell !== 0);
        const merged = [];
        
        for (let i = 0; i < line.length; i++) {
            if (i < line.length - 1 && line[i] === line[i + 1]) {
                merged.push(line[i] * 2);
                score2048 += line[i] * 2;
                i++;
            } else {
                merged.push(line[i]);
            }
        }
        
        while (merged.length < 4) {
            merged.push(0);
        }
        
        for (let col = 0; col < 4; col++) {
            if (grid2048[row][col] !== merged[col]) {
                moved = true;
            }
            grid2048[row][col] = merged[col];
        }
    }
    
    return moved;
}

// 오른쪽 이동
function moveRight() {
    let moved = false;
    
    for (let row = 0; row < 4; row++) {
        const line = grid2048[row].filter(cell => cell !== 0).reverse();
        const merged = [];
        
        for (let i = 0; i < line.length; i++) {
            if (i < line.length - 1 && line[i] === line[i + 1]) {
                merged.push(line[i] * 2);
                score2048 += line[i] * 2;
                i++;
            } else {
                merged.push(line[i]);
            }
        }
        
        while (merged.length < 4) {
            merged.push(0);
        }
        
        merged.reverse();
        
        for (let col = 0; col < 4; col++) {
            if (grid2048[row][col] !== merged[col]) {
                moved = true;
            }
            grid2048[row][col] = merged[col];
        }
    }
    
    return moved;
}

// 위로 이동
function moveUp() {
    let moved = false;
    
    for (let col = 0; col < 4; col++) {
        const line = [];
        for (let row = 0; row < 4; row++) {
            if (grid2048[row][col] !== 0) {
                line.push(grid2048[row][col]);
            }
        }
        
        const merged = [];
        for (let i = 0; i < line.length; i++) {
            if (i < line.length - 1 && line[i] === line[i + 1]) {
                merged.push(line[i] * 2);
                score2048 += line[i] * 2;
                i++;
            } else {
                merged.push(line[i]);
            }
        }
        
        while (merged.length < 4) {
            merged.push(0);
        }
        
        for (let row = 0; row < 4; row++) {
            if (grid2048[row][col] !== merged[row]) {
                moved = true;
            }
            grid2048[row][col] = merged[row];
        }
    }
    
    return moved;
}

// 아래로 이동
function moveDown() {
    let moved = false;
    
    for (let col = 0; col < 4; col++) {
        const line = [];
        for (let row = 3; row >= 0; row--) {
            if (grid2048[row][col] !== 0) {
                line.push(grid2048[row][col]);
            }
        }
        
        const merged = [];
        for (let i = 0; i < line.length; i++) {
            if (i < line.length - 1 && line[i] === line[i + 1]) {
                merged.push(line[i] * 2);
                score2048 += line[i] * 2;
                i++;
            } else {
                merged.push(line[i]);
            }
        }
        
        while (merged.length < 4) {
            merged.push(0);
        }
        
        for (let row = 0; row < 4; row++) {
            if (grid2048[3 - row][col] !== merged[row]) {
                moved = true;
            }
            grid2048[3 - row][col] = merged[row];
        }
    }
    
    return moved;
}

// 점수 업데이트
function updateScore() {
    document.getElementById('score-2048').textContent = score2048;
    saveBestScore();
}

// 승리 체크
function checkWin() {
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (grid2048[row][col] === 2048) {
                return true;
            }
        }
    }
    return false;
}

// 게임 오버 체크
function checkGameOver() {
    // 빈 칸이 있으면 계속 가능
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (grid2048[row][col] === 0) {
                return false;
            }
        }
    }
    
    // 합칠 수 있는 타일이 있는지 체크
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const current = grid2048[row][col];
            
            // 오른쪽 체크
            if (col < 3 && grid2048[row][col + 1] === current) {
                return false;
            }
            
            // 아래쪽 체크
            if (row < 3 && grid2048[row + 1][col] === current) {
                return false;
            }
        }
    }
    
    return true;
}

// 키보드 이벤트
document.addEventListener('keydown', (e) => {
    if (!document.getElementById('2048-modal').classList.contains('active')) {
        return;
    }
    
    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            move('left');
            break;
        case 'ArrowRight':
            e.preventDefault();
            move('right');
            break;
        case 'ArrowUp':
            e.preventDefault();
            move('up');
            break;
        case 'ArrowDown':
            e.preventDefault();
            move('down');
            break;
    }
});

// 터치 이벤트 (모바일)
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    if (!document.getElementById('2048-modal').classList.contains('active')) {
        return;
    }
    
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    if (!document.getElementById('2048-modal').classList.contains('active')) {
        return;
    }
    // 2048 모달이 열려있으면 모달 전체에서 스크롤 방지
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchend', (e) => {
    if (!document.getElementById('2048-modal').classList.contains('active')) {
        return;
    }
    
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, false);

function handleSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    const threshold = 50;
    
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // 수평 스와이프
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                move('right');
            } else {
                move('left');
            }
        }
    } else {
        // 수직 스와이프
        if (Math.abs(diffY) > threshold) {
            if (diffY > 0) {
                move('down');
            } else {
                move('up');
            }
        }
    }
}
