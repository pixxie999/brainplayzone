// 스도쿠 게임 로직
let sudokuGrid = [];
let sudokuSolution = [];
let selectedCell = null;
let mistakes = 0;
let timerInterval = null;
let seconds = 0;
let currentDifficulty = 'easy';

// 스도쿠 생성기
function generateSudoku(difficulty) {
    // 완성된 스도쿠 생성
    const grid = Array(9).fill().map(() => Array(9).fill(0));
    fillGrid(grid);
    sudokuSolution = grid.map(row => [...row]);
    
    // 난이도별 빈 칸 개수
    const emptyCells = {
        easy: 30,
        medium: 40,
        hard: 50
    };
    
    // 랜덤하게 숫자 제거
    const removeCount = emptyCells[difficulty];
    let removed = 0;
    
    while (removed < removeCount) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        
        if (grid[row][col] !== 0) {
            grid[row][col] = 0;
            removed++;
        }
    }
    
    return grid;
}

// 백트래킹으로 스도쿠 채우기
function fillGrid(grid) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                // 숫자 순서 랜덤화
                shuffleArray(numbers);
                
                for (let num of numbers) {
                    if (isValid(grid, row, col, num)) {
                        grid[row][col] = num;
                        
                        if (fillGrid(grid)) {
                            return true;
                        }
                        
                        grid[row][col] = 0;
                    }
                }
                
                return false;
            }
        }
    }
    
    return true;
}

// 배열 섞기
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 유효성 검사
function isValid(grid, row, col, num) {
    // 행 검사
    for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num) return false;
    }
    
    // 열 검사
    for (let x = 0; x < 9; x++) {
        if (grid[x][col] === num) return false;
    }
    
    // 3x3 박스 검사
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[boxRow + i][boxCol + j] === num) return false;
        }
    }
    
    return true;
}

// 그리드 렌더링
function renderSudoku() {
    const gridElement = document.getElementById('sudoku-grid');
    gridElement.innerHTML = '';
    
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.className = 'sudoku-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            const value = sudokuGrid[row][col];
            
            if (value !== 0) {
                cell.textContent = value;
                
                // 초기 숫자는 수정 불가 (새 게임 시작 시에만 이 함수 호출됨)
                cell.classList.add('fixed');
            }
            
            cell.addEventListener('click', () => selectCell(row, col));
            gridElement.appendChild(cell);
        }
    }
}



// 셀 선택
function selectCell(row, col) {
    // 고정된 셀은 선택 불가
    const cells = document.querySelectorAll('.sudoku-cell');
    const index = row * 9 + col;
    
    if (cells[index].classList.contains('fixed')) {
        return;
    }
    
    // 이전 선택 해제
    cells.forEach(cell => cell.classList.remove('selected'));
    
    // 새로운 셀 선택
    cells[index].classList.add('selected');
    selectedCell = { row, col };
}

// 숫자 입력
function inputNumber(num) {
    if (!selectedCell) {
        alert('먼저 셀을 선택해주세요!');
        return;
    }
    
    const { row, col } = selectedCell;
    const cells = document.querySelectorAll('.sudoku-cell');
    const index = row * 9 + col;
    
    // 고정된 셀은 수정 불가
    if (cells[index].classList.contains('fixed')) {
        return;
    }
    
    // 숫자 입력
    sudokuGrid[row][col] = num;
    cells[index].textContent = num === 0 ? '' : num;
    
    // 오류 체크
    const wasError = cells[index].classList.contains('error');
    cells[index].classList.remove('error');

    if (num !== 0 && num !== sudokuSolution[row][col]) {
        cells[index].classList.add('error');
        if (!wasError) {
            mistakes++;
            document.getElementById('mistakes').textContent = mistakes;
        }
    }
    
    // 완성 체크
    if (isGridComplete()) {
        stopTimer();
        if (typeof gtag !== 'undefined') {
            gtag('event', 'game_complete', {
                game_type: 'sudoku',
                difficulty: currentDifficulty,
                time_spent: seconds,
                mistakes: mistakes
            });
        }
        setTimeout(() => {
            alert(`🎉 축하합니다! ${formatTime(seconds)}에 완료했습니다!`);
        }, 300);
    }
}

// 그리드 완성 여부
function isGridComplete() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (sudokuGrid[row][col] !== sudokuSolution[row][col]) {
                return false;
            }
        }
    }
    return true;
}

// 난이도 변경
function changeDifficulty(difficulty) {
    currentDifficulty = difficulty;
    
    // 버튼 활성화 상태 변경
    const diffMap = { 'easy': 0, 'medium': 1, 'hard': 2 };
    document.querySelectorAll('.difficulty-btn').forEach((btn, index) => {
        if (index === diffMap[difficulty]) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    newSudokuGame();
}

// 새 게임
function newSudokuGame() {
    stopTimer();
    mistakes = 0;
    seconds = 0;
    selectedCell = null;
    
    document.getElementById('mistakes').textContent = '0';
    document.getElementById('timer').textContent = '00:00';
    
    sudokuGrid = generateSudoku(currentDifficulty);
    renderSudoku();
    startTimer();
}

// 타이머
function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        document.getElementById('timer').textContent = formatTime(seconds);
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function formatTime(secs) {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 힌트
function getHint() {
    if (!selectedCell) {
        // 랜덤 빈 셀 선택
        const emptyCells = [];
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (sudokuGrid[row][col] === 0 || sudokuGrid[row][col] !== sudokuSolution[row][col]) {
                    emptyCells.push({ row, col });
                }
            }
        }
        
        if (emptyCells.length === 0) return;
        
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        selectedCell = randomCell;
        selectCell(randomCell.row, randomCell.col);
    }
    
    const { row, col } = selectedCell;
    const correctNumber = sudokuSolution[row][col];
    
    inputNumber(correctNumber);
}

// 해답 확인
function checkSolution() {
    const cells = document.querySelectorAll('.sudoku-cell');
    let errors = 0;
    
    cells.forEach((cell, index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;
        
        cell.classList.remove('error');
        
        if (!cell.classList.contains('fixed')) {
            const value = sudokuGrid[row][col];
            if (value !== 0 && value !== sudokuSolution[row][col]) {
                cell.classList.add('error');
                errors++;
            }
        }
    });
    
    if (errors > 0) {
        alert(`❌ ${errors}개의 오류가 있습니다.`);
        return;
    }

    const hasEmpty = Array.from(cells).some((cell, index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;
        return !cell.classList.contains('fixed') && sudokuGrid[row][col] === 0;
    });

    if (hasEmpty) {
        alert('아직 빈 칸이 있습니다!');
    } else {
        alert('✅ 모든 답이 정확합니다!');
    }
}

// 키보드 입력
document.addEventListener('keydown', (e) => {
    if (!document.getElementById('sudoku-modal').classList.contains('active')) {
        return;
    }
    
    const key = e.key;
    
    if (key >= '1' && key <= '9') {
        inputNumber(parseInt(key));
    } else if (key === 'Delete' || key === 'Backspace' || key === '0') {
        inputNumber(0);
    } else if (key === 'ArrowUp' && selectedCell) {
        e.preventDefault();
        const newRow = Math.max(0, selectedCell.row - 1);
        selectCell(newRow, selectedCell.col);
    } else if (key === 'ArrowDown' && selectedCell) {
        e.preventDefault();
        const newRow = Math.min(8, selectedCell.row + 1);
        selectCell(newRow, selectedCell.col);
    } else if (key === 'ArrowLeft' && selectedCell) {
        e.preventDefault();
        const newCol = Math.max(0, selectedCell.col - 1);
        selectCell(selectedCell.row, newCol);
    } else if (key === 'ArrowRight' && selectedCell) {
        e.preventDefault();
        const newCol = Math.min(8, selectedCell.col + 1);
        selectCell(selectedCell.row, newCol);
    }
});
