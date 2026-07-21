const papersContainer = document.getElementById("papersContainer");

async function loadPapers() {
    try {
        const response = await fetch("data/papers.json");
        const papers = await response.json();

        papersContainer.innerHTML = "";

        papers
            .filter(paper => paper.available)
            .sort((a, b) => Number(b.examYear) - Number(a.examYear))
            .forEach(paper => {

                const categories = paper.categoryNo.join(", ");

                const card = document.createElement("div");
                card.className = "paper-card";

                card.innerHTML = `
                    <h3>🩺 ${paper.post}</h3>

                    <p><strong>Category No :</strong> ${categories}</p>

                    <p><strong>Question Paper No :</strong> ${paper.questionPaperNo}</p>

                    <p><strong>Exam Year :</strong> ${paper.examYear}</p>

                    <div class="paper-buttons">

                        <a href="viewer.html?file=${encodeURIComponent(paper.pdf)}"
                           target="_blank"
                           rel="noopener">
                           📄 View Question Paper
                        </a>

                        <a href="${paper.quiz}">
                           📝 Practice This Paper Online
                        </a>

                    </div>

                    <small class="paper-source">
                        📌 Source: ${paper.source}
                    </small>
                `;

                papersContainer.appendChild(card);

            });

    } catch (error) {

        papersContainer.innerHTML =
        "<p>Unable to load question papers.</p>";

        console.error(error);

    }
}

loadPapers();
