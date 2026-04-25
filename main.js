// ボタン取得
const analyzeBtn = document.getElementById("analyze-btn");
const backBtn = document.getElementById("back-btn");

// 画面取得
const inputScreen = document.getElementById("input-screen");
const resultScreen = document.getElementById("result-screen");

// 表示
const displayComplaint = document.getElementById("display-complaint");
const displayCategory = document.getElementById("display-category");

// AI
async function analyzeComplaint(text) {
  const res = await fetch("/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  const data = await res.json();   // { raw: "カテゴリ名：◯◯◯" }
  return data; // raw をそのまま返す
}


async function searchExistingSolutions(text) {
  const res = await fetch("/solutions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  const data = await res.json();

  return data.solutions;
}

// 「分析」ボタン
analyzeBtn.addEventListener("click", async () => {
    const text = document.getElementById("complaint-input").value;

    if (!text.trim()) return;

    const result = await analyzeComplaint(text);
    const solutions = await searchExistingSolutions(text);

    const lines = result.raw.split("\n").filter(l => l.trim());
    const categoryLine = lines.find(l => l.includes("カテゴリ名：")) || "";
    const category = categoryLine.replace("カテゴリ名：", "").trim();

    displayComplaint.textContent = text;
    displayCategory.textContent = category;
    
    // 既存解決策の表示
    const list = document.getElementById("solution-list");
    list.innerHTML = ""; //初期化

    for (const item of solutions) {
        const div = document.createElement("div");
        div.innerHTML = `
            <p><strong>${item.name}</strong></p>
            <p>${item.desc}</p>
            <p><a href="${item.url}" target="_blank">情報を見る</a></p>
            <hr>
        `;
        list.appendChild(div);
    }

    // 画面切り替え
    inputScreen.style.display = "none";
    resultScreen.style.display = "block"
});

// 「戻る」ボタン
backBtn.addEventListener("click", () => {
    resultScreen.style.display = "none";
    inputScreen.style.display = "block";
});