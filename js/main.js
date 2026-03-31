// 모달 제어
function openGame(gameType) {
    const modal = document.getElementById(`${gameType}-modal`);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (gameType === 'sudoku') {
        newSudokuGame();
    } else if (gameType === '2048') {
        new2048Game();
    }

    if (typeof gtag !== 'undefined') {
        gtag('event', 'game_start', { game_type: gameType });
    }
}

function closeGame(gameType) {
    const modal = document.getElementById(`${gameType}-modal`);
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.game-modal.active').forEach(modal => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
});

// 랭킹 탭 전환
function showRanking(type) {
    document.getElementById('ranking-sudoku').style.display = type === 'sudoku' ? 'table' : 'none';
    document.getElementById('ranking-2048').style.display = type === '2048' ? 'table' : 'none';

    document.querySelectorAll('.ranking-tab').forEach((btn, i) => {
        btn.classList.toggle('active', (i === 0 && type === 'sudoku') || (i === 1 && type === '2048'));
    });
}

// Google Analytics (GA4) - 실제 사용 시 측정 ID 변경 필요
// window.dataLayer = window.dataLayer || [];
// function gtag(){dataLayer.push(arguments);}
// gtag('js', new Date());
// gtag('config', 'G-XXXXXXXXXX');
