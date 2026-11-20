// 画面が読み込まれたとき、URLに「error」が含まれていたらエラーメッセージを出す
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('error')) {
        document.getElementById('err').textContent = 'ユーザーIDまたはパスワードが正しくありません。';
        document.getElementById('err').style.color = 'red'; // 赤文字にする場合
    }
});
