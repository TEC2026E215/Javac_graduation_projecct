const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth() + 1;

const mockData = {
    "2026/10": {
        1: 'ok', 2: 'ok', 3: 'ok', 4: 'ng', 5: 'ok', 
        6: 'ok', 7: 'ok', 8: 'ok', 9: 'ok', 10: 'ok', 
        11: 'ok', 12: 'ok', 13: 'ok', 14: 'ok', 15: 'ok', 
        16: 'ok', 17: 'ok', 18: 'ok', 19: 'ok', 20: 'ok', 
        21: 'ok', 22: 'ok', 23: 'ok', 24: 'ok', 25: 'ok', 
        26: 'ok', 27: 'ok', 28: 'ok', 29: 'ok', 30: 'ok', 31: 'ok'
    },
    "2026/11": {
        1: 'ng', 2: 'ok', 3: 'ok', 4: 'ok', 5: 'ok',
        6: 'ok', 7: 'ng', 8: 'ok', 9: 'ok', 10: 'ok'
    }
};

function renderCalendar() {
    const monthYearEl = document.getElementById('monthYear');
    const container = document.getElementById('daysContainer');
    if (!monthYearEl || !container) return;

    monthYearEl.textContent = `${currentYear}/${currentMonth}`;
    container.innerHTML = '';

    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const startDayOfWeek = firstDay.getDay();

    const lastDay = new Date(currentYear, currentMonth, 0);
    const totalDays = lastDay.getDate();

    for (let i = 0; i < startDayOfWeek; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('grid-item');
        container.appendChild(emptyCell);
    }

    const monthKey = `${currentYear}/${currentMonth}`;
    const monthData = mockData[monthKey] || {};

    for (let day = 1; day <= totalDays; day++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-item', 'day-cell');

        const numDiv = document.createElement('div');
        numDiv.classList.add('day-num');
        numDiv.textContent = day;
        cell.appendChild(numDiv);

        const status = monthData[day] || 'ok'; 
        const statusDiv = document.createElement('div');
        statusDiv.classList.add('status-icon');
        
        if (status === 'ok') {
            statusDiv.textContent = '○';
            statusDiv.classList.add('status-ok', 'selectable');
            statusDiv.onclick = () => alert(`${currentYear}年${currentMonth}月${day}日が選択されました。`);
        } else if (status === 'ng') {
            statusDiv.textContent = '×';
            statusDiv.classList.add('status-ng');
        }
        cell.appendChild(statusDiv);

        container.appendChild(cell);
    }
}

function changeMonth(offset) {
    currentMonth += offset;
    if (currentMonth > 12) {
        currentMonth = 1;
        currentYear += 1;
    } else if (currentMonth < 1) {
        currentMonth = 12;
        currentYear -= 1;
    }
    renderCalendar();
}

document.addEventListener('DOMContentLoaded', () => {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) prevBtn.addEventListener('click', () => changeMonth(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changeMonth(1));

    renderCalendar();
});
