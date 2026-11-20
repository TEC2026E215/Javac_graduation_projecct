document.addEventListener("DOMContentLoaded", () => {
    const bookingList = document.getElementById("bookingList");

/＊－－－－－－－－－－－－－－－－－－－－－－－－－－－－－サンプル－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－＊/

    const bookings = [
        { id: 1, status: "予約確定", date: "2026年11月21日（土）" },
        { id: 2, status: "予約確定", date: "2026年11月25日（水）" },
        { id: 3, status: "予約確定", date: "2026年12月02日（水）" }
    ];

/＊－－－－－－－－－－－－－－－－－－－－－－－－－－－－－サンプル－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－＊/

    if (!bookingList) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeBookings = bookings.filter((item) => {
        const match = item.date.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
        if (!match) return false;
        const bookingDate = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
        return bookingDate >= today;
    });

    if (activeBookings.length === 0) {
        bookingList.innerHTML = '<p class="booking-empty">現在予約はありません。</p>';
        return;
    }

    activeBookings.forEach((item) => {
        const card = document.createElement("a");
        card.className = "booking-card";

        const badge = document.createElement("span");
        badge.className = "booking-badge";
        badge.textContent = item.status;

        const date = document.createElement("span");
        date.className = "booking-date";
        date.textContent = item.date;

        const arrow = document.createElement("i");
        arrow.className = "fa-solid fa-chevron-right booking-arrow";

        card.appendChild(badge);
        card.appendChild(date);
        card.appendChild(arrow);
        bookingList.appendChild(card);
    });
});