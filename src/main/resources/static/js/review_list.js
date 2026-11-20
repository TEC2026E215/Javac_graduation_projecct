

const resultBarEl = document.getElementById("resultBar");
const reviewListEl = document.getElementById("reviewList");
const resultCountEl = document.getElementById("resultCount");
const detailModal = document.getElementById("detailModal");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");
const sortSelect = document.getElementById("sortSelect");

function normalizeText(value) {
    return String(value ?? "")
        .normalize("NFKC")
        .toLowerCase()
        .trim();
}

function escapeHtml(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function searchReviews() {
    const keywords = normalizeText(document.getElementById("searchKeyword").value)
        .split(/\s+/)
        .filter(Boolean);
    const industry = document.getElementById("searchIndustry").value;
    const location = normalizeText(document.getElementById("searchLocation").value);
    const minSalary = Number(document.getElementById("searchSalary").value) || 0;
    const phase = document.getElementById("searchPhase").value;
    const format = document.getElementById("searchFormat").value;
    const sortType = sortSelect.value;

    const filtered = sampleReviews.filter(item => {
        const searchableText = normalizeText([
            item.company,
            item.industry,
            item.location,
            item.phase,
            item.format,
            item.atmosphere,
            item.questions,
            item.advice
        ].join(" "));

        const matchKeywords = keywords.every(kw => searchableText.includes(kw));
        const matchIndustry = !industry || item.industry === industry;
        const matchLocation = !location || normalizeText(item.location).includes(location);
        const matchSalary = item.salary >= minSalary;
        const matchPhase = !phase || item.phase === phase;
        const matchFormat = !format || item.format === format;

        return matchKeywords && matchIndustry && matchLocation && matchSalary && matchPhase && matchFormat;
    });

    if (sortType === "salaryDesc") {
        filtered.sort((a, b) => b.salary - a.salary);
    } else {
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    renderReviews(filtered);
}

function renderReviews(data) {
    resultBarEl.classList.remove("hidden");
    reviewListEl.classList.remove("hidden");
    resultCountEl.textContent = data.length;
    reviewListEl.innerHTML = "";

    if (data.length === 0) {
        reviewListEl.innerHTML = '<div class="empty-message">条件に一致する体験談が見つかりませんでした。検索条件を変更してお試しください。</div>';
        return;
    }

    data.forEach(item => {
        const card = document.createElement("article");
        card.className = "review-card";
        card.innerHTML = `
            <div class="card-top">
                <div>
                    <span class="badge badge-industry">${escapeHtml(item.industry)}</span>
                    <span class="badge badge-phase">${escapeHtml(item.phase)}</span>
                    <span class="badge badge-format">${escapeHtml(item.format)}</span>
                </div>
                <span class="post-date">${escapeHtml(item.date)} 投稿</span>
            </div>
            <h3 class="company-name">${escapeHtml(item.company)}</h3>
            <div class="company-sub">
                <span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(item.location)}</span>
                <span><i class="fas fa-yen-sign"></i> 初任給：${item.salary.toLocaleString()}円</span>
            </div>
            <div class="card-preview">
                <p><strong>【質問内容】</strong>${escapeHtml(item.questions.replace(/\n/g, " / "))}</p>
                <p><strong>【アドバイス】</strong>${escapeHtml(item.advice)}</p>
            </div>
            <div class="card-footer">
                <span class="detail-link">詳細を見る <i class="fas fa-chevron-right"></i></span>
            </div>
        `;
        card.addEventListener("click", () => openModal(item));
        reviewListEl.appendChild(card);
    });
}

function openModal(item) {
    document.getElementById("modalCompany").textContent = item.company;
    document.getElementById("modalMeta").innerHTML = `
        <span><strong>業界：</strong>${escapeHtml(item.industry)}</span>
        <span><strong>所在地：</strong>${escapeHtml(item.location)}</span>
        <span><strong>初任給：</strong>${item.salary.toLocaleString()}円</span>
        <span><strong>選考フェーズ：</strong>${escapeHtml(item.phase)}</span>
        <span><strong>形式：</strong>${escapeHtml(item.format)}</span>
    `;
    document.getElementById("modalAtmosphere").textContent = item.atmosphere;
    document.getElementById("modalQuestions").textContent = item.questions;
    document.getElementById("modalAdvice").textContent = item.advice;
    detailModal.classList.add("active");
}

searchBtn.addEventListener("click", searchReviews);
sortSelect.addEventListener("change", searchReviews);

["searchKeyword", "searchLocation"].forEach(id => {
    document.getElementById(id).addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            searchReviews();
        }
    });
});

resetBtn.addEventListener("click", () => {
    document.getElementById("searchKeyword").value = "";
    document.getElementById("searchIndustry").value = "";
    document.getElementById("searchLocation").value = "";
    document.getElementById("searchSalary").value = "0";
    document.getElementById("searchPhase").value = "";
    document.getElementById("searchFormat").value = "";
    sortSelect.value = "newest";
    resultBarEl.classList.add("hidden");
    reviewListEl.classList.add("hidden");
    reviewListEl.innerHTML = "";
});

document.getElementById("closeModalBtn").addEventListener("click", () => {
    detailModal.classList.remove("active");
});
detailModal.addEventListener("click", (e) => {
    if (e.target === detailModal) {
        detailModal.classList.remove("active");
    }
});

const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollY > 200) {
        scrollTopBtn.classList.add("show");
    } else {
        scrollTopBtn.classList.remove("show");
    }
});

scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});



/*-----------------------以下サンプル--------------------------*/
const sampleReviews = [
    {
        id: 1,
        company: "トヨタ自動車株式会社",
        industry: "メーカー",
        location: "愛知県豊田市",
        salary: 260000,
        phase: "1次面接",
        format: "オンライン",
        date: "2026-11-18",
        atmosphere: "所要時間は約40分。人事社員1名との1対1で、終始穏やかでこちらの話を丁寧に引き出してくれました。",
        questions: "・学生時代に最も力を入れて取り組んだこと\n・自動車業界および当社を志望する理由\n・チームで目標達成した経験と自身の役割",
        advice: "モビリティカンパニーへの変革について自分なりの意見を持っておくと深掘りに対応しやすいです。"
    },
    {
        id: 2,
        company: "ソニーグループ株式会社",
        industry: "メーカー",
        location: "東京都港区",
        salary: 295000,
        phase: "2次面接・3次面接",
        format: "オンライン",
        date: "2026-11-17",
        atmosphere: "現場社員2名との面接で所要時間は50分。技術的な知見や個人の強みについてかなり深く掘り下げられました。",
        questions: "・研究内容の概要と新規性について\n・ソニーで実現したいプロジェクト\n・壁にぶつかった際の乗り越え方",
        advice: "専門外の面接官にも分かりやすく研究や取り組みの価値を伝える練習をしておくことが重要です。"
    },
    {
        id: 3,
        company: "三菱商事株式会社",
        industry: "商社",
        location: "東京都千代田区",
        salary: 325000,
        phase: "最終面接",
        format: "対面",
        date: "2026-11-16",
        atmosphere: "役員クラスの社員3名との面接で約30分。重厚な雰囲気はありますが、圧迫感はなく本質的な質問が続きました。",
        questions: "・なぜ総合商社なのか、なぜ三菱商事なのか\n・これまでで最も大きな挫折経験\n・海外駐在や異なる環境での適応力について",
        advice: "自分の原体験とビジネスへの想いを一貫したストーリーで語れるように整理しておきましょう。"
    },
    {
        id: 4,
        company: "三井物産株式会社",
        industry: "商社",
        location: "東京都千代田区",
        salary: 325000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-11-15",
        atmosphere: "中堅社員2名と約40分。対話形式でテンポが良く、素の人間性を見ようとしている印象を受けました。",
        questions: "・周囲からどのような人だと言われるか\n・挑戦と創造を体現したエピソード\n・関心のある事業分野とその理由",
        advice: "用意した原稿を読むのではなく、面接官とのキャッチボールを楽しむ姿勢が好まれます。"
    },
    {
        id: 5,
        company: "伊藤忠商事株式会社",
        industry: "商社",
        location: "東京都港区",
        salary: 320000,
        phase: "1次面接",
        format: "オンライン",
        date: "2026-11-14",
        atmosphere: "人事担当者1名と約30分。非常にハキハキとした雰囲気で、結論から簡潔に答えることが求められました。",
        questions: "・学生時代の取り組みとそこから得た学び\n・他社ではなく伊藤忠を選ぶ決め手\n・タフな状況で粘り強くやり抜いた経験",
        advice: "短い時間で多くの質問が飛んでくるため、1回答30秒〜1分程度で端的にまとめる練習が必須です。"
    },
    {
        id: 6,
        company: "住友商事株式会社",
        industry: "商社",
        location: "東京都千代田区",
        salary: 315000,
        phase: "グループディスカッション",
        format: "対面",
        date: "2026-11-13",
        atmosphere: "学生6名・社員2名で合計60分。協調性を重んじる穏やかな空気の中で議論が進みました。",
        questions: "テーマ：『新規事業として参入すべき成長領域を1つ選定し、戦略を立案せよ』",
        advice: "論点を整理し、チーム全体の意見を統合する役割を意識すると高評価につながります。"
    },
    {
        id: 7,
        company: "丸紅株式会社",
        industry: "商社",
        location: "東京都千代田区",
        salary: 310000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-11-12",
        atmosphere: "現場社員2名と約40分。個人の価値観や仕事に対する熱量を丁寧に確認するスタイルでした。",
        questions: "・人生で大切にしている軸は何か\n・過去の失敗から学んで行動を変えた経験\n・入社後5年で成し遂げたいこと",
        advice: "OB・OG訪問で聞いた社員の働き方や社風を具体的に引用すると説得力が増します。"
    },
    {
        id: 8,
        company: "株式会社三菱UFJ銀行",
        industry: "金融",
        location: "東京都千代田区",
        salary: 265000,
        phase: "1次面接",
        format: "オンライン",
        date: "2026-11-11",
        atmosphere: "行員1名と約35分。非常に誠実で落ち着いた対応で、緊張をほぐしてから本題に入ってくれました。",
        questions: "・金融業界およびメガバンクを志望する理由\n・学生時代に周囲を巻き込んで行動した経験\n・自身の強みと弱み",
        advice: "なぜ他のメガバンクではなく三菱UFJ銀行なのか、事業戦略の違いを踏まえて言語化しておくと良いです。"
    },
    {
        id: 9,
        company: "株式会社三井住友銀行",
        industry: "金融",
        location: "東京都千代田区",
        salary: 265000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-11-10",
        atmosphere: "中堅行員1名と約40分。論理的思考力と行動力の根拠を鋭く深掘りされる場面がありました。",
        questions: "・目標達成のために自ら工夫した施策\n・法人営業において重要だと思うこと\n・ストレス耐性や逆境への向き合い方",
        advice: "エピソードの「なぜその行動をとったのか」という動機の部分を深く掘り下げて準備してください。"
    },
    {
        id: 10,
        company: "株式会社日立フィナンシャルグループ",
        industry: "金融",
        location: "東京都千代田区",
        salary: 265000,
        phase: "グループディスカッション",
        format: "オンライン",
        date: "2026-11-09",
        atmosphere: "学生5名・社員1名で50分。オンラインでも発言しやすいよう最初にアイスブレイクがありました。",
        questions: "テーマ：『地方企業のDX推進を金融機関としてどのように支援するか』",
        advice: "銀・信・証の連携という強みを意識した提案ができると、企業理解のアピールにもなります。"
    },
    {
        id: 11,
        company: "日本生命保険相互会社",
        industry: "金融",
        location: "大阪府大阪市",
        salary: 255000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-11-08",
        atmosphere: "人事社員1名と約40分。人柄や誠実さを重視しており、終始温かく頷きながら聞いてくれました。",
        questions: "・生命保険業界への志望理由\n・誰かのために粘り強く尽くした経験\n・全国転勤に対する考え方",
        advice: "お客様や仲間と信頼関係を築いたエピソードを具体的に話すと非常に好印象です。"
    },
    {
        id: 12,
        company: "東京海上日動火災保険株式会社",
        industry: "金融",
        location: "東京都千代田区",
        salary: 280000,
        phase: "最終面接",
        format: "対面",
        date: "2026-11-07",
        atmosphere: "役員2名と約30分。穏やかな雰囲気ながらも、志望の本気度やリーダーシップを確かめる質問が中心でした。",
        questions: "・損害保険の社会的意義についてどう考えるか\n・困難な状況で周りを牽引した経験\n・他社の選考状況",
        advice: "社員訪問を通じて感じた「人の魅力」を自分の言葉で語れるようにしておくと強いです。"
    },
    {
        id: 13,
        company: "野村證券株式会社",
        industry: "金融",
        location: "東京都中央区",
        salary: 275000,
        phase: "1次面接",
        format: "オンライン",
        date: "2026-11-06",
        atmosphere: "社員1名と約30分。テンポが速くエネルギッシュな面接官で、明確な意志表示が求められました。",
        questions: "・証券業界で働きたい理由\n・高い目標を掲げて達成した経験\n・最近の気になる経済ニュース",
        advice: "日経新聞などで最近のマーケット動向を1つ選び、自分の意見までセットで答えられるようにしましょう。"
    },
    {
        id: 14,
        company: "大和証券株式会社",
        industry: "金融",
        location: "東京都千代田区",
        salary: 270000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-11-05",
        atmosphere: "現場社員1名と約35分。対話重視で、こちらの質問にも丁寧に本音で答えてくれました。",
        questions: "・チームワークを発揮して成果を出した経験\n・リテール営業とホールセールどちらに関心があるか\n・自分の長所と短所",
        advice: "「人が好き」「成長意欲が高い」という点を裏付ける具体例を用意しておくとスムーズです。"
    },
    {
        id: 15,
        company: "NTTデータグループ",
        industry: "IT・通信",
        location: "東京都江東区",
        salary: 275000,
        phase: "1次面接",
        format: "オンライン",
        date: "2026-11-04",
        atmosphere: "現場SE1名と約45分。ロジカルな質問が多いですが、威圧感は全くなく丁寧な印象でした。",
        questions: "・SIer業界を志望する理由\n・プロジェクトを進める上で大切にしていること\n・ITを使って解決したい社会課題",
        advice: "文系・理系問わず、チームで物事を成し遂げたプロセスを論理的に説明することが大切です。"
    },
    {
        id: 16,
        company: "日本電信電話株式会社（NTT）",
        industry: "IT・通信",
        location: "東京都千代田区",
        salary: 285000,
        phase: "2次面接・3次面接",
        format: "オンライン",
        date: "2026-11-03",
        atmosphere: "管理職社員2名と約45分。IOWN構想やグローバル展開など視座の高い質問が飛んできました。",
        questions: "・通信インフラの未来についてどう考えるか\n・自身の専門性を当社でどう活かせるか\n・新しい環境で周囲を巻き込んだ経験",
        advice: "事業会社（ドコモやデータなど）ではなく持ち株会社を志望する理由を明確にしておく必要があります。"
    },
    {
        id: 17,
        company: "株式会社NTTドコモ",
        industry: "IT・通信",
        location: "東京都千代田区",
        salary: 275000,
        phase: "最終面接",
        format: "対面",
        date: "2026-11-02",
        atmosphere: "役員2名・人事1名と約35分。終始和やかで、入社後のキャリアイメージについてすり合わせるような面接でした。",
        questions: "・スマートライフ領域で手がけてみたいサービス\n・学生時代に最も苦労したことと乗り越え方\n・希望する職種と勤務地",
        advice: "通信だけでなく金融やエンタメなど非通信領域への関心も示すと幅の広さをアピールできます。"
    },
    {
        id: 18,
        company: "KDDI株式会社",
        industry: "IT・通信",
        location: "東京都千代田区",
        salary: 280000,
        phase: "2次面接・3次面接",
        format: "オンライン",
        date: "2026-11-01",
        atmosphere: "現場社員2名と約40分。フランクで話しやすく、挑戦心を歓迎してくれる雰囲気でした。",
        questions: "・既存の枠にとらわれず新しいことに挑戦した経験\n・KDDIの事業で興味がある領域\n・チーム内で意見が割れた際の調整方法",
        advice: "「通信を核とした事業拡大」の戦略を理解し、自分がどの領域で貢献したいか具体的に話すと良いです。"
    },
    {
        id: 19,
        company: "ソフトバンク株式会社",
        industry: "IT・通信",
        location: "東京都港区",
        salary: 285000,
        phase: "1次面接",
        format: "オンライン",
        date: "2026-10-31",
        atmosphere: "人事担当者1名と約30分。スピード感があり、変化を楽しめる人材かどうかを見られていると感じました。",
        questions: "・AIやテクノロジーを活用して実現したいこと\n・変化の激しい環境で成果を出した経験\n・ソフトバンクの強みと課題",
        advice: "「情報革命で人々を幸せに」という理念に共感する理由を自分の経験と結びつけて話しましょう。"
    },
    {
        id: 20,
        company: "富士通株式会社",
        industry: "IT・通信",
        location: "東京都港区",
        salary: 280000,
        phase: "2次面接・3次面接",
        format: "オンライン",
        date: "2026-10-30",
        atmosphere: "事業部社員1名・人事1名と約45分。パーパス経営やDX支援に関する考え方を丁寧に聞かれました。",
        questions: "・Uvanceの取り組みで関心のある分野\n・顧客の課題を特定して解決に導いた経験\n・自身の強みを仕事でどう活かすか",
        advice: "単なるシステム開発ではなく「社会課題解決企業」としての側面を強調すると響きやすいです。"
    },
    {
        id: 21,
        company: "日本電気株式会社（NEC）",
        industry: "IT・通信",
        location: "東京都港区",
        salary: 275000,
        phase: "1次面接",
        format: "オンライン",
        date: "2026-10-29",
        atmosphere: "現場社員1名と約40分。穏やかで誠実な方が多く、質問の意図も分かりやすく伝えてくれました。",
        questions: "・生体認証やAI技術などの社会実装について興味あること\n・学生時代に粘り強く取り組んだエピソード\n・志望職種を選んだ理由",
        advice: "職種別採用の要素が強いため、希望コースの業務内容をしっかり調べておくことが重要です。"
    },
    {
        id: 22,
        company: "楽天グループ株式会社",
        industry: "IT・通信",
        location: "東京都世田谷区",
        salary: 300000,
        phase: "2次面接・3次面接",
        format: "オンライン",
        date: "2026-10-28",
        atmosphere: "現場マネージャー1名と約40分。ビジネス視点や主体性、英語学習への意欲などが確認されました。",
        questions: "・楽天エコシステムの強みと改善点\n・自ら課題を発見し周りを動かした経験\n・英語でのコミュニケーションに対する意欲",
        advice: "サービスを実際に使った上での具体的な改善提案を用意しておくと非常に喜ばれます。"
    },
    {
        id: 23,
        company: "LINEヤフー株式会社",
        industry: "IT・通信",
        location: "東京都千代田区",
        salary: 305000,
        phase: "2次面接・3次面接",
        format: "オンライン",
        date: "2026-10-27",
        atmosphere: "現場エンジニア・企画職2名と約50分。ユーザー視点の深さとプロダクトへの愛着が問われました。",
        questions: "・日常的に使っているサービスとそのUI/UXの分析\n・データに基づいて意思決定をした経験\n・入社後に作ってみたい機能やサービス",
        advice: "「なぜその機能がユーザーに刺さるのか」を定量・定性の両面から語れるようにしておきましょう。"
    },
    {
        id: 24,
        company: "株式会社サイバーエージェント",
        industry: "IT・通信",
        location: "東京都渋谷区",
        salary: 310000,
        phase: "最終面接",
        format: "対面",
        date: "2026-10-26",
        atmosphere: "役員1名と約30分。非常にフランクで本質的な対話ができ、素直さと成長意欲が重視されていました。",
        questions: "・将来どのようなビジネスパーソンになりたいか\n・自分の弱みをどう克服してきたか\n・メディア・広告・ゲームのどの領域に興味があるか",
        advice: "背伸びせず等身大の言葉で「なぜ挑戦したいのか」を熱量高く伝えることが大切です。"
    },
    {
        id: 25,
        company: "株式会社リクルート",
        industry: "サービス・インフラ",
        location: "東京都千代田区",
        salary: 315000,
        phase: "2次面接・3次面接",
        format: "オンライン",
        date: "2026-10-25",
        atmosphere: "現場社員1名と約45分。「なぜ？」「具体的には？」と徹底的に深掘りされますが、非常に納得感のある対話でした。",
        questions: "・人生で最もエネルギーを注いだ出来事とその動機\n・あなたは何を大事にして生きているか\n・リクルートで成し遂げたいこと",
        advice: "「圧倒的当事者意識」と「自ら機会を創り出す姿勢」を自分の過去の選択から語れるようにしてください。"
    },
    {
        id: 26,
        company: "株式会社キーエンス",
        industry: "メーカー",
        location: "大阪府大阪市",
        salary: 330000,
        phase: "1次面接",
        format: "対面",
        date: "2026-10-24",
        atmosphere: "社員1名と約20分。説得ロールプレイングと簡潔な質疑応答があり、論理性と観察力が見られました。",
        questions: "・1分間で身近なモノの魅力を説得するロールプレイング\n・目標達成のために工夫した行動\n・なぜコンサルではなくメーカー営業なのか",
        advice: "相手のニーズを素早く把握し、メリットを簡潔に伝える練習をしておくと当日落ち着いて対応できます。"
    },
    {
        id: 27,
        company: "株式会社日立製作所",
        industry: "メーカー",
        location: "東京都千代田区",
        salary: 275000,
        phase: "2次面接・3次面接",
        format: "オンライン",
        date: "2026-10-23",
        atmosphere: "事業部部長クラス2名と約45分。社会イノベーション事業への理解とグローバル志向が確認されました。",
        questions: "・Lumadaを活用したビジネスについてどう考えるか\n・異なるバックグラウンドを持つ人と協働した経験\n・希望する事業領域でのキャリアプラン",
        advice: "非常に事業領域が広いため、自分がどのセクターで何をしたいのか絞って話すと説得力が出ます。"
    },
    {
        id: 28,
        company: "パナソニック株式会社",
        industry: "メーカー",
        location: "大阪府門真市",
        salary: 265000,
        phase: "1次面接",
        format: "オンライン",
        date: "2026-10-22",
        atmosphere: "人事1名・現場1名と約40分。温厚で話しやすい雰囲気で、ものづくりへの想いを丁寧に聞いてくれました。",
        questions: "・くらしのアップデートに向けて提案したいこと\n・学生時代にチームで乗り越えた課題\n・職種志望の理由",
        advice: "事業会社制移行後の各社の特徴を把握し、志望カンパニーの製品や技術に触れておくと良いです。"
    },
    {
        id: 29,
        company: "三菱電機株式会社",
        industry: "メーカー",
        location: "東京都千代田区",
        salary: 265000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-10-21",
        atmosphere: "技術系管理職2名と約45分。研究内容や基礎学力、誠実な仕事への向き合い方が重視されていました。",
        questions: "・研究の目的と社会への応用可能性\n・FAや社会インフラ分野への関心\n・意見が対立したときの合意形成の方法",
        advice: "地道にコツコツと課題を解決したエピソードや、誠実さを伝えるエピソードが好まれます。"
    },
    {
        id: 30,
        company: "株式会社デンソー",
        industry: "メーカー",
        location: "愛知県刈谷市",
        salary: 265000,
        phase: "2次面接・3次面接",
        format: "オンライン",
        date: "2026-10-20",
        atmosphere: "現場社員2名と約45分。電動化や自動運転に対する熱意と技術的な好奇心を深く聞かれました。",
        questions: "・自動車部品メーカーの中でもデンソーを志望する理由\n・研究で直面した技術的課題と解決策\n・将来挑戦したい領域（環境・安心）",
        advice: "「環境」と「安心」の2大軸について、自分の専門性がどう貢献できるか具体的に語れると強いです。"
    },
    {
        id: 31,
        company: "本田技研工業株式会社（Honda）",
        industry: "メーカー",
        location: "東京都港区",
        salary: 265000,
        phase: "最終面接",
        format: "対面",
        date: "2026-10-19",
        atmosphere: "役員2名と約40分。人間尊重やワイガヤの文化が感じられる、非常にフランクで熱い面接でした。",
        questions: "・あなたにとっての「夢」や実現したいことは何か\n・周囲と徹底的に議論して物事を進めた経験\n・Hondaの製品や挑戦で好きなところ",
        advice: "「自分はこうしたい」という強い主体性とオリジナリティのある意見を臆せず伝えることが大切です。"
    },
    {
        id: 32,
        company: "日産自動車株式会社",
        industry: "メーカー",
        location: "神奈川県横浜市",
        salary: 265000,
        phase: "1次面接",
        format: "オンライン",
        date: "2026-10-18",
        atmosphere: "人事担当者1名と約35分。グローバルな視点やダイバーシティへの適応力について質問がありました。",
        questions: "・EVや自動運転の普及に向けた課題と解決策\n・多様なメンバーと協力して成果を出した経験\n・英語力や海外勤務への意欲",
        advice: "日産の技術的強み（e-POWERやプロパイロットなど）への理解を深めておくと話が弾みます。"
    },
    {
        id: 33,
        company: "株式会社村田製作所",
        industry: "メーカー",
        location: "京都府長岡京市",
        salary: 260000,
        phase: "2次面接・3次面接",
        format: "オンライン",
        date: "2026-10-17",
        atmosphere: "技術社員2名と約45分。落ち着いた雰囲気で、研究のプロセスや本質的な理解度を丁寧に確認されました。",
        questions: "・電子部品業界を志望する理由\n・研究でうまくいかなかったときの原因分析方法\n・将来どのようなエンジニアになりたいか",
        advice: "BtoB企業ならではの「社会を裏側から支える魅力」に共感していることを伝えると好印象です。"
    },
    {
        id: 34,
        company: "東京エレクトロン株式会社",
        industry: "メーカー",
        location: "東京都港区",
        salary: 315000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-10-16",
        atmosphere: "現場社員2名と約45分。半導体製造装置のリーディングカンパニーとしての誇りと高い視座を感じました。",
        questions: "・半導体業界の今後の成長性と当社の役割\n・高い目標に対して執着心を持って取り組んだ経験\n・グローバルな環境で働くことへの想い",
        advice: "半導体の前工程における当社のシェアや強みを理解し、挑戦意欲をしっかりアピールしましょう。"
    },
    {
        id: 35,
        company: "信越化学工業株式会社",
        industry: "メーカー",
        location: "東京都千代田区",
        salary: 285000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-10-15",
        atmosphere: "管理職社員2名と約40分。派手さはないものの、堅実で論理的な質問が多く本質を見極めようとしていました。",
        questions: "・素材メーカーを志望する理由\n・少数精鋭の環境で主体的に動いた経験\n・研究内容とその工夫点",
        advice: "塩ビや半導体シリコンウエハーなど世界トップシェア事業の強さを自分の言葉で説明できるようにしておきましょう。"
    },
    {
        id: 36,
        company: "三菱ケミカル株式会社",
        industry: "メーカー",
        location: "東京都千代田区",
        salary: 265000,
        phase: "1次面接",
        format: "オンライン",
        date: "2026-10-14",
        atmosphere: "人事1名・現場1名と約40分。穏やかで話しやすい空気感で、化学の力で社会課題を解決したい想いを聞かれました。",
        questions: "・総合化学メーカーの中でも当社を選ぶ理由\n・チームで意見が対立した際の解決プロセス\n・サステナビリティに関して関心のあるテーマ",
        advice: "素材が最終製品にどう使われているか、バリューチェーン全体を意識した視点を持つと良いです。"
    },
    {
        id: 37,
        company: "旭化成株式会社",
        industry: "メーカー",
        location: "東京都千代田区",
        salary: 265000,
        phase: "2次面接・3次面接",
        format: "オンライン",
        date: "2026-10-13",
        atmosphere: "現場社員2名と約45分。マテリアル・住宅・ヘルスケアの3領域にまたがる多様性を歓迎する雰囲気でした。",
        questions: "・希望する領域とそこで実現したいこと\n・変化を恐れず新しいことに挑戦したエピソード\n・自身の強みと弱み",
        advice: "「昨日まで世界になかったものを。」というグループスローガンに合う挑戦エピソードを用意すると良いです。"
    },
    {
        id: 38,
        company: "花王株式会社",
        industry: "メーカー",
        location: "東京都中央区",
        salary: 260000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-10-12",
        atmosphere: "社員2名と約45分。消費者視点の鋭さと「よきモノづくり」へのこだわりが強く問われました。",
        questions: "・花王製品の中で好きな商品とその理由・改善点\n・本質的な課題を見抜いて行動した経験\n・ESG経営に対する考え方",
        advice: "普段使っている日用品を「なぜこのパッケージなのか、なぜこの価格なのか」と分析しておくと役立ちます。"
    },
    {
        id: 39,
        company: "株式会社資生堂",
        industry: "メーカー",
        location: "東京都港区",
        salary: 260000,
        phase: "グループディスカッション",
        format: "オンライン",
        date: "2026-10-11",
        atmosphere: "学生6名・社員2名で60分。洗練された雰囲気で、感性と論理性のバランスが見られていました。",
        questions: "テーマ：『Z世代に向けた新しいスキンケアブランドのコンセプトとプロモーション施策を立案せよ』",
        advice: "ターゲット顧客のインサイトを深く掘り下げ、ブランド価値と結びつけた提案ができると高評価です。"
    },
    {
        id: 40,
        company: "サントリーホールディングス株式会社",
        industry: "メーカー",
        location: "東京都港区",
        salary: 270000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-10-10",
        atmosphere: "社員2名と約40分。「やってみなはれ」の精神通り、失敗を恐れず挑戦した経験や人間味を深く見られました。",
        questions: "・人生で最も「やってみなはれ」を発揮したエピソード\n・周囲を笑顔や元気にさせた経験\n・サントリーのブランドで挑戦したいこと",
        advice: "綺麗にまとまった優等生的な回答よりも、泥臭く熱中したリアルな体験談が好まれます。"
    },
    {
        id: 41,
        company: "アサヒビール株式会社",
        industry: "メーカー",
        location: "東京都墨田区",
        salary: 260000,
        phase: "1次面接",
        format: "オンライン",
        date: "2026-10-09",
        atmosphere: "人事担当者1名と約35分。明るく活気があり、コミュニケーションのしやすさが際立っていました。",
        questions: "・飲料・酒類業界を志望する理由\n・周りを巻き込んで大きな成果を出した経験\n・スマートドリンキングの取り組みへの印象",
        advice: "営業現場での巻き込み力や、多様な価値観を受け入れる柔軟性をアピールすると効果的です。"
    },
    {
        id: 42,
        company: "キリンホールディングス株式会社",
        industry: "メーカー",
        location: "東京都中野区",
        salary: 265000,
        phase: "2次面接・3次面接",
        format: "オンライン",
        date: "2026-10-08",
        atmosphere: "社員2名と約40分。CSV経営やヘルスサイエンス領域への取り組みについて深く質問されました。",
        questions: "・食と健康の領域でキリンが果たすべき役割\n・課題解決のために粘り強く工夫したエピソード\n・チームでの自身の立ち位置",
        advice: "酒類・飲料だけでなく医薬・ヘルスサイエンス事業とのシナジーについて理解しておくと差がつきます。"
    },
    {
        id: 43,
        company: "味の素株式会社",
        industry: "メーカー",
        location: "東京都中央区",
        salary: 265000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-10-07",
        atmosphere: "社員2名と約45分。穏やかで知的な雰囲気で、アミノ酸のはたらきによる社会貢献への想いが問われました。",
        questions: "・食と健康の課題解決に向けて興味のある事業\n・新しいアイデアを形にした経験\n・グローバルに働くことへのイメージ",
        advice: "調味料だけでなく電子材料やバイオ・ファイン事業など、技術力の高さを理解しておくと良いです。"
    },
    {
        id: 44,
        company: "明治ホールディングス株式会社",
        industry: "メーカー",
        location: "東京都中央区",
        salary: 255000,
        phase: "1次面接",
        format: "オンライン",
        date: "2026-10-06",
        atmosphere: "人事1名と約35分。親しみやすく丁寧な面接官で、日常の食生活や健康への意識についても話しました。",
        questions: "・食品業界の中で明治を志望する理由\n・学生時代に継続して努力したこと\n・健康に関して普段意識していること",
        advice: "乳製品や菓子、栄養食品など幅広い商品群の中で、自分がどう価値を広げたいか具体的に語りましょう。"
    },
    {
        id: 45,
        company: "日清食品株式会社",
        industry: "メーカー",
        location: "東京都新宿区",
        salary: 265000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-10-05",
        atmosphere: "社員2名と約40分。ユニークな発想力や遊び心、常識を覆す突破力を求める質問が多かったです。",
        questions: "・最近面白いと思ったプロモーションや商品\n・既存のやり方を変えて成功した経験\n・完全メシなどの新領域をどう広めるか",
        advice: "「HUNGRY TO WIN」の精神に合う、尖ったアイデアや独自の視点を1つ用意しておくと盛り上がります。"
    },
    {
        id: 46,
        company: "株式会社電通",
        industry: "マスコミ・広告",
        location: "東京都港区",
        salary: 295000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-10-04",
        atmosphere: "現場社員2名と約40分。非常に鋭くクリエイティブな質問が多く、柔軟な思考力と人間力が試されました。",
        questions: "・最近心を動かされた体験やコンテンツ\n・答えのない課題に対してどうアプローチするか\n・あなたが周囲に与えられる価値は何か",
        advice: "広告の枠を超えたビジネスプロデュースの視点と、自分ならではの「偏愛」や強みを語れるようにしましょう。"
    },
    {
        id: 47,
        company: "株式会社博報堂",
        industry: "マスコミ・広告",
        location: "東京都港区",
        salary: 290000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-10-03",
        atmosphere: "社員2名と約45分。「生活者発想」を体現する人の観察眼や、個性・粒立ちを大切にする空気がありました。",
        questions: "・最近の若者の行動で面白いと感じる変化\n・チームで異なる意見を組み合わせて新しい案を作った経験\n・博報堂で実現したいプロジェクト",
        advice: "「消費者」ではなく「生活者」として人々を深く観察したエピソードを用意すると非常に響きます。"
    },
    {
        id: 48,
        company: "株式会社ADKマーケティング・ソリューションズ",
        industry: "マスコミ・広告",
        location: "東京都港区",
        salary: 270000,
        phase: "1次面接",
        format: "オンライン",
        date: "2026-10-02",
        atmosphere: "人事・現場社員2名と約40分。フランクで話しやすく、顧客に寄り添う誠実さと企画力が見られました。",
        questions: "・総合広告会社の中でADKを志望する理由\n・周囲を巻き込んで企画を実行した経験\n・好きなエンタメやコンテンツとその理由",
        advice: "アニメ・コンテンツビジネスやデータドリブンマーケティングなど、ADKの強みを押さえておきましょう。"
    },
    {
        id: 49,
        company: "日本放送協会（NHK）",
        industry: "マスコミ・広告",
        location: "東京都渋谷区",
        salary: 265000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-10-01",
        atmosphere: "職員2名と約40分。公共放送としての使命感や、現場で一次情報を足で稼ぐ粘り強さが問われました。",
        questions: "・今最も取材・発信したい社会テーマ\n・異なる意見を持つ人の話を丁寧に聞いた経験\n・全国勤務に対する考え方",
        advice: "最近のニュースについて多角的な視点から自分の考えを述べられるように準備しておくと良いです。"
    },
    {
        id: 50,
        company: "株式会社日本テレビ放送網",
        industry: "マスコミ・広告",
        location: "東京都港区",
        salary: 285000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-09-30",
        atmosphere: "社員2名と約35分。エンタメから報道まで幅広く、人を惹きつける熱量と行動力が見られました。",
        questions: "・最近見た番組や配信コンテンツの分析\n・ゼロから何かを生み出して人を喜ばせた経験\n・希望する職種（制作・報道・ビジネスなど）",
        advice: "テレビ離れと言われる中で、配信やIPビジネスを含めた未来のテレビ局像を語れると強いです。"
    },
    {
        id: 51,
        company: "株式会社TBSテレビ",
        industry: "マスコミ・広告",
        location: "東京都港区",
        salary: 285000,
        phase: "1次面接",
        format: "オンライン",
        date: "2026-09-29",
        atmosphere: "社員2名と約30分。短時間で自分の個性や企画の切り口を分かりやすく伝える力が試されました。",
        questions: "・1分間で自己PRと作りたい企画のプレゼン\n・学生時代に最も熱狂したこと\n・TBSのコンテンツで好きなもの",
        advice: "ドラマやバラエティ、報道などTBSの強みと自分のやりたいことを結びつけて端的に話しましょう。"
    },
    {
        id: 52,
        company: "株式会社フジテレビジョン",
        industry: "マスコミ・広告",
        location: "東京都港区",
        salary: 280000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-09-28",
        atmosphere: "社員2名と約35分。明るく自由な社風が感じられ、発想の面白さやタフさが確認されました。",
        questions: "・今世の中で流行っているものを1つ分析してください\n・ピンチをチャンスに変えた経験\n・どんな人と一緒に働きたいか",
        advice: "エンターテインメントを通じて世の中にどんなポジティブな影響を与えたいか熱く語ると良いです。"
    },
    {
        id: 53,
        company: "株式会社テレビ朝日",
        industry: "マスコミ・広告",
        location: "東京都港区",
        salary: 285000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-09-27",
        atmosphere: "社員2名と約35分。情報番組・報道・スポーツ・エンタメそれぞれの視点から鋭い質問がありました。",
        questions: "・気になるニュースとその背景についての見解\n・粘り強く交渉して実現させた経験\n・配信プラットフォームと地上波の連携について",
        advice: "自分が現場で泥臭く動き回れる人間であることを具体的な行動エピソードで示しましょう。"
    },
    {
        id: 54,
        company: "株式会社テレビ東京",
        industry: "マスコミ・広告",
        location: "東京都港区",
        salary: 280000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-09-26",
        atmosphere: "社員2名と約40分。他局とは違う独自路線へのこだわりと、少ない予算でも工夫して面白いものを作る姿勢が問われました。",
        questions: "・テレ東ならではの企画を1つ提案してください\n・制約がある中で工夫して成果を出した経験\n・経済報道とバラエティどちらに関心があるか",
        advice: "他局と同じことをするのではなく、ニッチでも深く刺さる企画の切り口を用意しておくと非常に好評です。"
    },
    {
        id: 55,
        company: "株式会社講談社",
        industry: "マスコミ・広告",
        location: "東京都文京区",
        salary: 280000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-09-25",
        atmosphere: "編集者・社員2名と約40分。本や漫画、カルチャーへの深い愛情と、ヒットを生み出す企画力が問われました。",
        questions: "・最近読んで面白かった本・漫画とその魅力の言語化\n・あなたが編集者ならどんな企画を立てるか\n・デジタル時代における出版社の役割",
        advice: "「好き」という気持ちだけでなく、それをどうビジネスや読者拡大につなげるかという視点が重要です。"
    },
    {
        id: 56,
        company: "株式会社集英社",
        industry: "マスコミ・広告",
        location: "東京都千代田区",
        salary: 285000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-09-24",
        atmosphere: "社員2名と約40分。作品や作家に寄り添う情熱と、グローバルIP展開への意識が確認されました。",
        questions: "・集英社の作品で人生に影響を与えたもの\n・誰かの魅力を引き出して輝かせた経験\n・配属希望部署とそこでやりたいこと",
        advice: "作家やクリエイターと信頼関係を築ける「伴走力」や「傾聴力」をアピールすると響きやすいです。"
    },
    {
        id: 57,
        company: "株式会社KADOKAWA",
        industry: "マスコミ・広告",
        location: "東京都千代田区",
        salary: 270000,
        phase: "1次面接",
        format: "オンライン",
        date: "2026-09-23",
        atmosphere: "社員1名と約35分。メディアミックス展開やデジタル戦略についての理解と、コンテンツへの熱意が見られました。",
        questions: "・IPを多角的に展開するKADOKAWAの強みについて\n・企画を形にして発信した経験\n・海外市場で日本のコンテンツをどう広めるか",
        advice: "出版・映像・ゲーム・Webサービスの連動を意識した企画アイデアを持っておくと強いアピールになります。"
    },
    {
        id: 58,
        company: "株式会社日本経済新聞社",
        industry: "マスコミ・広告",
        location: "東京都千代田区",
        salary: 280000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-09-22",
        atmosphere: "記者・ビジネス部門社員2名と約40分。経済動向への関心と、事実を正確に掘り下げる姿勢が問われました。",
        questions: "・最近注目している経済トピックとその理由\n・一次情報を取りに行って真相を確かめた経験\n・デジタルメディアとしての今後の成長戦略",
        advice: "日経電子版の機能やビジネスモデルにも目を向け、報道とビジネスの両面から語れるようにしておきましょう。"
    },
    {
        id: 59,
        company: "東日本旅客鉄道株式会社（JR東日本）",
        industry: "サービス・インフラ",
        location: "東京都渋谷区",
        salary: 255000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-09-21",
        atmosphere: "社員2名と約40分。安全への強い使命感と、駅や街づくりを通じた地域活性化への想いが確認されました。",
        questions: "・JR東日本グループで挑戦したい事業領域\n・ルールや安全を守りつつ改善を行った経験\n・現地現物で課題解決に取り組んだエピソード",
        advice: "鉄道輸送だけでなく、Suica経済圏や品川開発などの生活サービス・不動産事業への理解も欠かせません。"
    },
    {
        id: 60,
        company: "東海旅客鉄道株式会社（JR東海）",
        industry: "サービス・インフラ",
        location: "愛知県名古屋市",
        salary: 260000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-09-20",
        atmosphere: "管理職社員2名と約40分。日本の大動脈を支える責任感と、規律ある誠実な対応が重視されていました。",
        questions: "・日本の大動脈を担う使命についてどう考えるか\n・リニア中央新幹線開業後の未来像\n・チームで一つの目標をやり遂げた経験",
        advice: "現場業務の重要性を理解し、着実に信頼を積み重ねられる人物であることを丁寧に伝えましょう。"
    },
    {
        id: 61,
        company: "西日本旅客鉄道株式会社（JR西日本）",
        industry: "サービス・インフラ",
        location: "大阪府大阪市",
        salary: 250000,
        phase: "1次面接",
        format: "オンライン",
        date: "2026-09-19",
        atmosphere: "人事担当者1名と約35分。非常に丁寧で誠実な対応で、地域共生や安全意識について深く聞かれました。",
        questions: "・西日本エリアの地域活性化に向けてできること\n・周囲と協力して困難を乗り越えた経験\n・志望コースを選んだ理由",
        advice: "安全を最優先とする企業文化への深い理解と、地域に根ざしたまちづくりへの関心をアピールしましょう。"
    },
    {
        id: 62,
        company: "全日本空輸株式会社（ANA）",
        industry: "サービス・インフラ",
        location: "東京都港区",
        salary: 255000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-09-18",
        atmosphere: "社員2名と約40分。チームスピリットと挑戦心、お客様視点のホスピタリティが感じられる面接でした。",
        questions: "・航空業界の中でANAを志望する理由\n・チームで最高のパフォーマンスを出すために意識したこと\n・非航空事業（マイル・商社機能など）への関心",
        advice: "「あんしん、あったか、あかるく元気！」の行動指針に合う協調性と前向きさをエピソードで示しましょう。"
    },
    {
        id: 63,
        company: "日本航空株式会社（JAL）",
        industry: "サービス・インフラ",
        location: "東京都品川区",
        salary: 255000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-09-17",
        atmosphere: "社員2名と約40分。JALフィロソフィへの共感や、感謝の気持ちを持って周囲と協働する姿勢が見られました。",
        questions: "・JALで実現したい社会貢献や新規事業\n・相手の立場に立って行動し感謝された経験\n・困難な状況で仲間を支えたエピソード",
        advice: "安全運航の堅持と、地域活性化やGX（グリーントランスフォーメーション）への取り組みを調べておくと良いです。"
    },
    {
        id: 64,
        company: "東京電力ホールディングス株式会社",
        industry: "サービス・インフラ",
        location: "東京都千代田区",
        salary: 255000,
        phase: "1次面接",
        format: "オンライン",
        date: "2026-09-16",
        atmosphere: "人事1名・現場1名と約40分。カーボンニュートラルと電力安定供給の両立に向けた真摯な姿勢が印象的でした。",
        questions: "・エネルギー業界を志望する理由\n・再生可能エネルギー拡大に向けた課題について\n・責任感を持って最後までやり抜いた経験",
        advice: "社会インフラを止めないという強い使命感と、GX推進への意欲を自分の言葉で語れるようにしましょう。"
    },
    {
        id: 65,
        company: "東京ガス株式会社",
        industry: "サービス・インフラ",
        location: "東京都港区",
        salary: 260000,
        phase: "2次面接・3次面接",
        format: "オンライン",
        date: "2026-09-15",
        atmosphere: "社員2名と約40分。穏やかで対話しやすく、脱炭素やソリューション事業への挑戦意欲が問われました。",
        questions: "・東京ガスの変革（脱炭素・デジタル化）で興味ある分野\n・顧客や仲間のニーズを汲み取って行動した経験\n・自身の強みをどう活かすか",
        advice: "都市ガス供給だけでなく、e-メタンやソリューション事業など未来に向けた挑戦を理解しておくと高評価です。"
    },
    {
        id: 66,
        company: "関西電力株式会社",
        industry: "サービス・インフラ",
        location: "大阪府大阪市",
        salary: 255000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-09-14",
        atmosphere: "社員2名と約40分。ゼロカーボンへの取り組みや新規事業開発への意欲について丁寧に深掘りされました。",
        questions: "・ゼロカーボンロードマップについてどう考えるか\n・困難な課題に対してチームで解決策を導いた経験\n・希望する職種とキャリアイメージ",
        advice: "エネルギー事業に加えて情報通信や不動産などグループ全体の多角的な事業に目を向けておきましょう。"
    },
    {
        id: 67,
        company: "日本郵船株式会社",
        industry: "サービス・インフラ",
        location: "東京都千代田区",
        salary: 295000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-09-13",
        atmosphere: "社員2名と約40分。グローバル物流を支えるダイナミズムと、多様な人々と協働するタフさが見られました。",
        questions: "・海運業界および日本郵船を志望する理由\n・価値観の異なる人と協力して目標達成した経験\n・脱炭素燃料への転換についてどう考えるか",
        advice: "市況変動の激しい業界で、長期視点で粘り強く物事を推進できるタフさをアピールすると効果的です。"
    },
    {
        id: 68,
        company: "株式会社商船三井",
        industry: "サービス・インフラ",
        location: "東京都港区",
        salary: 295000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-09-12",
        atmosphere: "社員2名と約40分。海運を軸とした海洋事業・不動産・ウェルビーイングなど幅広い挑戦を歓迎する空気でした。",
        questions: "・商船三井の非海運事業も含めた魅力とは\n・周囲を巻き込んで新しい取り組みを成功させた経験\n・海外駐在やグローバル業務への意欲",
        advice: "「青い海から人々の毎日を支える」という使命感と、新規事業への好奇心をバランス良く伝えましょう。"
    },
    {
        id: 69,
        company: "ヤマト運輸株式会社",
        industry: "サービス・インフラ",
        location: "東京都中央区",
        salary: 250000,
        phase: "1次面接",
        format: "オンライン",
        date: "2026-09-11",
        atmosphere: "人事担当者1名と約35分。非常に親しみやすく、現場を大切にする文化と課題解決力が問われました。",
        questions: "・物流業界の2024年問題以降の課題と解決策\n・現場の声を聞いて改善につなげた経験\n・ヤマト運輸で実現したいこと",
        advice: "宅急便ネットワークの社会的価値と、法人向けロジスティクス支援の両面を理解しておくと良いです。"
    },
    {
        id: 70,
        company: "三井不動産株式会社",
        industry: "サービス・インフラ",
        location: "東京都中央区",
        salary: 295000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-09-10",
        atmosphere: "社員2名と約40分。街づくりへの熱い想いと、多くの関係者を巻き込むリーダーシップが深く見られました。",
        questions: "・好きな街や商業施設とその理由\n・利害関係の異なる人たちをまとめて成し遂げた経験\n・三井不動産でどんな街をつくりたいか",
        advice: "日本橋や日比谷など実際の再開発エリアを歩き、コンセプトや工夫を自分の言葉で分析しておきましょう。"
    },
    {
        id: 71,
        company: "三菱地所株式会社",
        industry: "サービス・インフラ",
        location: "東京都千代田区",
        salary: 295000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-09-09",
        atmosphere: "社員2名と約40分。落ち着いた知的な雰囲気で、丸の内再開発に代表される長期的な街づくりの視座が問われました。",
        questions: "・丸の内エリアの今後の進化についてアイデアはありますか\n・長期的な目標に向かって粘り強く取り組んだ経験\n・総合デベロッパーの中でも三菱地所を選ぶ理由",
        advice: "オフィスだけでなく住宅・商業・空港運営・海外事業など幅広いフィールドへの関心を伝えると良いです。"
    },
    {
        id: 72,
        company: "住友不動産株式会社",
        industry: "サービス・インフラ",
        location: "東京都新宿区",
        salary: 280000,
        phase: "1次面接",
        format: "オンライン",
        date: "2026-09-08",
        atmosphere: "社員1名と約35分。スピード感と営業力・推進力を重視しており、明確な目標意識が確認されました。",
        questions: "・不動産業界を志望する理由\n・高い目標を設定して達成したエピソード\n・困難に直面したときのメンタルの保ち方",
        advice: "「信用と創造」を体現する粘り強さと、結果にこだわる姿勢を具体的な数値とともに語れると強いです。"
    },
    {
        id: 73,
        company: "東急不動産株式会社",
        industry: "サービス・インフラ",
        location: "東京都渋谷区",
        salary: 275000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-09-07",
        atmosphere: "社員2名と約40分。渋谷エリアの再開発や再生可能エネルギー事業など、先進的な取り組みへの共感が問われました。",
        questions: "・広域渋谷圏の街づくりについてどう感じるか\n・新しいアイデアを提案して周囲を動かした経験\n・環境経営と不動産開発の両立について",
        advice: "東急グループとの連携や再エネ事業など、東急不動産ならではの独自性を理解しておくと好印象です。"
    },
    {
        id: 74,
        company: "株式会社ファーストリテイリング",
        industry: "サービス・インフラ",
        location: "東京都江東区",
        salary: 310000,
        phase: "2次面接・3次面接",
        format: "オンライン",
        date: "2026-09-06",
        atmosphere: "経営幹部・人事2名と約45分。グローバル視点と現場主義、主体的な課題解決力が徹底的に深掘りされました。",
        questions: "・ユニクロやGUの店舗を見て気づいた改善点\n・自分の頭で考え抜いて行動を変えた経験\n・世界一のブランドになるために必要なこと",
        advice: "実際に店舗へ足を運び、陳列・接客・商品企画について具体的な仮説を持って面接に臨むと非常に響きます。"
    },
    {
        id: 75,
        company: "株式会社セブン-イレブン・ジャパン",
        industry: "サービス・インフラ",
        location: "東京都千代田区",
        salary: 265000,
        phase: "1次面接",
        format: "オンライン",
        date: "2026-09-05",
        atmosphere: "人事担当者1名と約35分。加盟店オーナー様と伴走するOFC（店舗経営相談員）の役割への理解が問われました。",
        questions: "・コンビニエンスストアの社会的役割について\n・相手の信頼を得て行動変容を促した経験\n・仮説検証を繰り返して成果を出したエピソード",
        advice: "「近くて便利」を支える商品開発力と、経営コンサルタントとしての店舗支援のやりがいを語りましょう。"
    },
    {
        id: 76,
        company: "イオン株式会社",
        industry: "サービス・インフラ",
        location: "千葉県千葉市",
        salary: 255000,
        phase: "2次面接・3次面接",
        format: "オンライン",
        date: "2026-09-04",
        atmosphere: "社員2名と約40分。地域社会への貢献やデジタルシフト、プライベートブランド戦略について幅広く質問されました。",
        questions: "・小売業のDX推進において重要だと思うこと\n・多様なメンバーと協力して課題を解決した経験\n・イオンの店舗やトップバリュ商品への意見",
        advice: "GMSだけでなくショッピングモール開発や金融・ヘルスケアなどグループ全体の広がりを意識すると良いです。"
    },
    {
        id: 77,
        company: "株式会社ニトリ",
        industry: "サービス・インフラ",
        location: "東京都北区",
        salary: 270000,
        phase: "2次面接・3次面接",
        format: "オンライン",
        date: "2026-09-03",
        atmosphere: "社員2名と約40分。配転教育によるゼネラリスト育成への理解と、現状否定から改善を生み出す姿勢が見られました。",
        questions: "・製造物流IT小売業というビジネスモデルの強み\n・現状に満足せず仕組みを改善した経験\n・多様な部署を経験するキャリアへの考え方",
        advice: "「お、ねだん以上。」を実現するためのサプライチェーン全体の視点と、素直な学習意欲をアピールしましょう。"
    },
    {
        id: 78,
        company: "株式会社良品計画",
        industry: "サービス・インフラ",
        location: "東京都文京区",
        salary: 255000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-09-02",
        atmosphere: "社員2名と約40分。「感じ良い暮らしと社会」の実現に向けた地域密着やサステナビリティへの想いが問われました。",
        questions: "・無印良品の商品や取り組みで共感するもの\n・地域やコミュニティの課題解決に関わった経験\n・店舗運営と商品開発のどちらに関心があるか",
        advice: "単なる雑貨・アパレルではなく、土着化や地域課題解決に取り組む姿勢に共感していることを伝えましょう。"
    },
    {
        id: 79,
        company: "株式会社オリエンタルランド",
        industry: "サービス・インフラ",
        location: "千葉県浦安市",
        salary: 255000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-09-01",
        atmosphere: "社員2名と約40分。ハピネスを届けるホスピタリティと、それを支える緻密なビジネス視点の両方が見られました。",
        questions: "・ゲストに感動を届けるために大切なこと\n・裏方として周囲を支え、組織の成果を高めた経験\n・テーマパーク事業の今後の成長戦略について",
        advice: "「夢や感動」だけでなく、安全管理や収益構造などビジネスとしての視点を交えて話すと説得力が増します。"
    },
    {
        id: 80,
        company: "株式会社星野リゾート",
        industry: "サービス・インフラ",
        location: "長野県北佐久郡軽井沢町",
        salary: 245000,
        phase: "グループディスカッション",
        format: "オンライン",
        date: "2026-08-31",
        atmosphere: "学生6名・社員1名で60分。フラットな組織文化そのままに、論理的で建設的な議論が重視されていました。",
        questions: "テーマ：『地方の温泉旅館の稼働率を高めるための新しい滞在体験を企画せよ』",
        advice: "マルチタスクな働き方や観光産業の生産性向上への理解を示し、顧客満足と収益の両立を意識しましょう。"
    },
    {
        id: 81,
        company: "株式会社JTB",
        industry: "サービス・インフラ",
        location: "東京都品川区",
        salary: 245000,
        phase: "1次面接",
        format: "オンライン",
        date: "2026-08-30",
        atmosphere: "社員1名と約35分。明るくコミュニケーション力が高い面接官で、交流創造事業への想いを引き出してくれました。",
        questions: "・旅行業にとどまらないJTBのソリューションとは\n・人の心を動かして行動につなげた経験\n・法人営業と個人向け企画のどちらに興味があるか",
        advice: "観光だけでなくMICEや地域活性化支援、企業の組織課題解決などBtoB領域への理解を深めておきましょう。"
    },
    {
        id: 82,
        company: "株式会社資生堂ジャパン",
        industry: "メーカー",
        location: "東京都港区",
        salary: 255000,
        phase: "1次面接",
        format: "オンライン",
        date: "2026-08-29",
        atmosphere: "人事1名と約35分。店舗やデジタルを通じた顧客体験価値の向上について、具体的な視点が問われました。",
        questions: "・店頭とECの融合（OMO）でできる新しい美容体験\n・チームで目標達成に向けて工夫したエピソード\n・自身の強みを営業・マーケティングでどう活かすか",
        advice: "ブランドの世界観を大切にしながら、データや現場観察に基づいて提案できる力をアピールしましょう。"
    },
    {
        id: 83,
        company: "キヤノン株式会社",
        industry: "メーカー",
        location: "東京都大田区",
        salary: 265000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-08-28",
        atmosphere: "技術・管理職社員2名と約45分。カメラ・事務機だけでなく医療機器や半導体露光装置への展開が話題になりました。",
        questions: "・キヤノンの新規事業領域（メディカル・産業機器）への関心\n・研究で直面した課題へのアプローチ方法\n・グローバル競争に勝つために必要なこと",
        advice: "光学・精密技術の強みを活かし、事業ポートフォリオの転換を推進している点に触れると好印象です。"
    },
    {
        id: 84,
        company: "富士フイルム株式会社",
        industry: "メーカー",
        location: "東京都港区",
        salary: 270000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-08-27",
        atmosphere: "社員2名と約45分。第二の創業を成し遂げた変革力と、ヘルスケア・高機能材料への熱い想いが問われました。",
        questions: "・既存技術を応用して新しい価値を生み出した経験\n・ヘルスケア領域で富士フイルムが果たせる役割\n・困難な状況でも諦めず挑戦し続けたエピソード",
        advice: "「NEVER STOP」のスローガンの通り、変化をチャンスと捉えて行動できる主体性を示しましょう。"
    },
    {
        id: 85,
        company: "ブリヂストン株式会社",
        industry: "メーカー",
        location: "東京都中央区",
        salary: 265000,
        phase: "2次面接・3次面接",
        format: "オンライン",
        date: "2026-08-26",
        atmosphere: "社員2名と約40分。「最高の品質で社会に貢献」の使命と、ソリューション事業への進化について確認されました。",
        questions: "・タイヤメーカーからソリューション企業への進化について\n・現場に出向いて課題を発見した経験\n・グローバルな環境で協働する上で大切なこと",
        advice: "「現物現場」を重んじる社風に合わせて、机上の空論ではなく自ら現場に足を運んだ経験を語ると良いです。"
    },
    {
        id: 86,
        company: "日本製鉄株式会社",
        industry: "メーカー",
        location: "東京都千代田区",
        salary: 265000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-08-25",
        atmosphere: "社員2名と約40分。産業の米である鉄鋼の重要性と、グリーンスチール開発への強い意志が感じられました。",
        questions: "・鉄鋼業界および日本製鉄を志望する理由\n・カーボンニュートラル実現に向けた挑戦について\n・タフな環境で周囲を牽引した経験",
        advice: "日本のものづくりを根幹から支える誇りと、世界トップクラスの技術力への理解をしっかりと伝えましょう。"
    },
    {
        id: 87,
        company: "コマツ（株式会社小松製作所）",
        industry: "メーカー",
        location: "東京都港区",
        salary: 265000,
        phase: "1次面接",
        format: "オンライン",
        date: "2026-08-24",
        atmosphere: "人事・現場社員2名と約40分。ダントツ商品やスマートコンストラクションなど技術革新への誇りが伝わりました。",
        questions: "・建設・鉱山機械の自動化・遠隔化についてどう考えるか\n・チームで課題を解決し成果を出した経験\n・海外で働くことへの意欲",
        advice: "海外売上比率が非常に高いため、異文化理解やグローバルなキャリアへの前向きな姿勢を示すと良いです。"
    },
    {
        id: 88,
        company: "ダイキン工業株式会社",
        industry: "メーカー",
        location: "大阪府大阪市",
        salary: 265000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-08-23",
        atmosphere: "社員2名と約40分。「人を基軸におく経営」の通り、個人の持ち味や粘り強さを温かく引き出してくれました。",
        questions: "・空調の力で解決したい地球規模の課題\n・周囲と協力して目標を達成したエピソード\n・困難にぶつかったときの乗り越え方",
        advice: "世界No.1の空調メーカーとしての強みと、環境技術への貢献意欲を自分の言葉で語りましょう。"
    },
    {
        id: 89,
        company: "三菱重工業株式会社",
        industry: "メーカー",
        location: "東京都千代田区",
        salary: 265000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-08-22",
        atmosphere: "管理職社員2名と約45分。エナジートランジションや防衛・宇宙など国家規模のプロジェクトへの使命感が問われました。",
        questions: "・三菱重工の幅広い事業の中で携わりたい分野\n・大規模なプロジェクトやチームで役割を果たした経験\n・脱炭素社会の実現に向けた技術的アプローチ",
        advice: "スケールの大きな社会インフラを長期にわたって支える責任感と、粘り強さをアピールすると効果的です。"
    },
    {
        id: 90,
        company: "株式会社IHI",
        industry: "メーカー",
        location: "東京都江東区",
        salary: 260000,
        phase: "1次面接",
        format: "オンライン",
        date: "2026-08-21",
        atmosphere: "人事1名・現場1名と約40分。穏やかで話しやすく、航空・宇宙・エネルギー分野への好奇心を丁寧に聞かれました。",
        questions: "・重工業の中でもIHIを志望する理由\n・学生時代に主体的に行動して改善した経験\n・希望する事業領域とその背景",
        advice: "アンモニア燃料技術や航空エンジンなど、IHIが世界をリードする技術分野について調べておくと良いです。"
    },
    {
        id: 91,
        company: "川崎重工業株式会社",
        industry: "メーカー",
        location: "東京都港区",
        salary: 260000,
        phase: "2次面接・3次面接",
        format: "オンライン",
        date: "2026-08-20",
        atmosphere: "社員2名と約40分。水素サプライチェーンやロボット事業など、先端技術への挑戦心が確認されました。",
        questions: "・水素社会の実現に向けて川重ができること\n・ロボットやモビリティ分野への関心\n・チーム内で意見が割れた際の調整経験",
        advice: "陸・海・空にわたる多様な技術力と、水素事業などの先進的な取り組みへの共感を伝えましょう。"
    },
    {
        id: 92,
        company: "株式会社クボタ",
        industry: "メーカー",
        location: "大阪府大阪市",
        salary: 260000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-08-19",
        atmosphere: "社員2名と約40分。「食料・水・環境」の課題解決に対する熱い使命感と、現場主義の誠実さが印象的でした。",
        questions: "・世界の食料・水・環境の課題に対して貢献したいこと\n・泥臭く粘り強く取り組んで成果を出した経験\n・スマート農業の普及についてどう考えるか",
        advice: "アジアをはじめとする新興国の発展を支える視点と、現場に寄り添う誠実さをアピールすると響きます。"
    },
    {
        id: 93,
        company: "大日本印刷株式会社（DNP）",
        industry: "メーカー",
        location: "東京都新宿区",
        salary: 255000,
        phase: "1次面接",
        format: "オンライン",
        date: "2026-08-18",
        atmosphere: "人事1名・現場1名と約40分。印刷技術を応用したエレクトロニクスやコンテンツ事業への理解が問われました。",
        questions: "・DNPの事業で意外だったもの・興味を持ったもの\n・顧客の課題を解決するために提案した経験\n・自身の強みを企画営業や開発でどう活かすか",
        advice: "「P&Iイノベーション」の考え方を理解し、紙の印刷にとどまらない幅広い事業領域を語れるようにしましょう。"
    },
    {
        id: 94,
        company: "TOPPAN株式会社",
        industry: "メーカー",
        location: "東京都文京区",
        salary: 255000,
        phase: "2次面接・3次面接",
        format: "オンライン",
        date: "2026-08-17",
        atmosphere: "社員2名と約40分。DX・SXへの変革意欲と、多様なクライアントの課題を解決する企画力が確認されました。",
        questions: "・社名変更に込められた変革への姿勢をどう捉えるか\n・新しいアイデアを形にして周囲を巻き込んだ経験\n・関心のある事業分野（情報コミュニケーション・生活産業・エレクトロニクス）",
        advice: "社会的課題を解決するソリューション企業としての側面を強調し、柔軟な発想力を示しましょう。"
    },
    {
        id: 95,
        company: "株式会社野村総合研究所（NRI）",
        industry: "IT・通信",
        location: "東京都千代田区",
        salary: 305000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-08-16",
        atmosphere: "社員2名と約45分。ナビゲーション×ソリューションの独自性と、論理的思考力の深さが徹底的に問われました。",
        questions: "・コンサルとITの両輪を持つNRIだからこそできること\n・複雑な課題を構造化して解決に導いた経験\n・最近関心のある社会・経済のテーマ",
        advice: "結論の妥当性だけでなく、そこに至る思考のプロセスや仮説構築力を論理的に説明することが重要です。"
    },
    {
        id: 96,
        company: "アクセンチュア株式会社",
        industry: "IT・通信",
        location: "東京都港区",
        salary: 320000,
        phase: "1次面接",
        format: "オンライン",
        date: "2026-08-15",
        atmosphere: "マネージャー1名と約45分。ケース面接と人物面接があり、素早い思考力と成長意欲が確認されました。",
        questions: "・ミニケース：『ある小売チェーンのEC売上を2倍にする施策』\n・高い目標に向かって自ら学び行動した経験\n・コンサルタントとして大切にしたい姿勢",
        advice: "ケース面接では完璧な答えよりも、面接官のフィードバックを素直に吸収して軌道修正する柔軟性が評価されます。"
    },
    {
        id: 97,
        company: "デロイト トーマツ コンサルティング合同会社",
        industry: "IT・通信",
        location: "東京都千代田区",
        salary: 325000,
        phase: "2次面接・3次面接",
        format: "オンライン",
        date: "2026-08-14",
        atmosphere: "シニアマネージャー1名と約45分。落ち着いた知的な雰囲気で、社会変革への視座とチームワークが問われました。",
        questions: "・企業の変革を支援する上で最も重要だと思うこと\n・異なる意見を持つメンバーと合意形成した経験\n・デロイトの強みと自分のキャリアの接点",
        advice: "グループ全体の総合力（監査・税務・法務・FAとの連携）を理解し、誠実にクライアントへ貢献する姿勢を示しましょう。"
    },
    {
        id: 98,
        company: "PwCコンサルティング合同会社",
        industry: "IT・通信",
        location: "東京都千代田区",
        salary: 325000,
        phase: "グループディスカッション",
        format: "オンライン",
        date: "2026-08-13",
        atmosphere: "学生5名・社員1名で60分。協調性と論理性のバランスが良く、お互いの意見を尊重しながら議論が進みました。",
        questions: "テーマ：『日本の製造業がグローバル競争力を再強化するための戦略を立案せよ』",
        advice: "他者の意見を否定せず建設的に発展させる姿勢と、時間内に結論をまとめる推進力が評価されます。"
    },
    {
        id: 99,
        company: "株式会社ベイカレント",
        industry: "IT・通信",
        location: "東京都港区",
        salary: 320000,
        phase: "2次面接・3次面接",
        format: "対面",
        date: "2026-08-12",
        atmosphere: "社員2名と約40分。ワンプール制のメリットや、業界を問わず成長し続ける意欲について深く確認されました。",
        questions: "・特定の業界に絞らず多様なプロジェクトに携わる魅力\n・未知の領域に飛び込んで短期間で成果を出した経験\n・自身の強みと弱み",
        advice: "変化への適応力と、クライアントの課題に泥臭く伴走する誠実さをアピールすると非常に好印象です。"
    },
    {
        id: 100,
        company: "株式会社ZOZO",
        industry: "IT・通信",
        location: "千葉県千葉市",
        salary: 290000,
        phase: "最終面接",
        format: "対面",
        date: "2026-08-11",
        atmosphere: "役員2名と約35分。非常に明るくフランクな雰囲気で、ファッションやテクノロジーへの愛着と素直さが見られました。",
        questions: "・ZOZOTOWNのサービスでさらに進化させたい点\n・自分の「好き」やこだわりを追求して周囲を巻き込んだ経験\n・楽しく働くために大切にしていること",
        advice: "「世界中をカッコよく、世界中に笑顔を。」の理念に合うポジティブさと、ユーザー目線のアイデアを用意しておきましょう。"
    }
];

/*-----------------------サンプル--------------------------*/