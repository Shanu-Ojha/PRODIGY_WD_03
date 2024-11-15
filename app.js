let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let humanVsHumanBtn = document.querySelector("#human-vs-human");
let humanVsAIBtn = document.querySelector("#human-vs-ai");

let turnX = true;
let count = 0;
 
const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8]
];
humanVsHumanBtn.addEventListener("click", () => {
    isHumanVsAI = false;
    resetGame();
    toggleActiveBtn(humanVsHumanBtn,humanVsAIBtn);
});

humanVsAIBtn.addEventListener("click", () => {
    isHumanVsAI = true;
    resetGame();
    toggleActiveBtn(humanVsAIBtn,humanVsHumanBtn);
});

const toggleActiveBtn = (selectedBtn,otherBtn)=>{
    selectedBtn.classList.add("active");
    otherBtn.classList.remove("active");
};

function resetGame() {
    turnX = true;
    count = 0;
    enableBoxes();
    msgContainer.classList.add("hide");
    boxes.forEach(box => {
        box.classList.remove("winning-pattern");
    });
}

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (turnX) {
            box.innerText = "X";
            box.classList.add("x-color");
            turnX = false;
        } else {
            box.innerText = "O";
            box.classList.add("o-color");
            turnX = true;
        }
        box.disabled = true;
        count++;
        let isWinner = checkWinner();
    
        if (count === 9 && !isWinner) {
            gameDraw();
        }
        if (isHumanVsAI && !isWinner && !turnX) {
            aiMove();
        }
    });
});

const aiMove = () => {
    msg.innerText = "AI is thinking...";
    msgContainer.classList.remove("hide");
    
    setTimeout(() => {
        let bestMove = findBestMove();
        if (bestMove !== -1) {
            boxes[bestMove].innerText = "O";
            boxes[bestMove].classList.add("o-color");
            boxes[bestMove].disabled = true;
            turnX = true;
            count++;
        }

        msgContainer.classList.add("hide");

        let isWinner = checkWinner();
        if (count === 9 && !isWinner) {
            gameDraw();
        }
    }, 1000);
};


const findBestMove = () => {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].innerText === "") {
            boxes[i].innerText = "O";
            let score = minimax(false);
            boxes[i].innerText = "";
            
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
};

const minimax = (isMaximizing) => {
    let isWinner = checkWinnerForMinimax();
    if (isWinner === "O") return 10;
    if (isWinner === "X") return -10;
    if (count === 9) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < boxes.length; i++) {
            if (boxes[i].innerText === "") {
                boxes[i].innerText = "O";
                count++;
                let score = minimax(false);
                boxes[i].innerText = "";
                count--;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < boxes.length; i++) {
            if (boxes[i].innerText === "") {
                boxes[i].innerText = "X";
                count++;
                let score = minimax(true);
                boxes[i].innerText = "";
                count--;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
};

const checkWinnerForMinimax = () => {
    for (let pattern of winPatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if (pos1Val !== "" && pos1Val === pos2Val && pos2Val === pos3Val) {
            return pos1Val;
        }
    }
    return null;
};


const gameDraw = () => {
    msg.innerText = `Game was a Draw.`;
    msgContainer.classList.remove("hide");
    disableBoxes();
};

const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};
const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
        box.classList.remove("x-color", "o-color");
    }
};
const showWinner = (winner,pattern) => {
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    pattern.forEach(index => {
        boxes[index].classList.add("winning-pattern");
    });
    disableBoxes();
};    

const checkWinner = () => {
    for (let pattern of winPatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;
    
        if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
            if (pos1Val === pos2Val && pos2Val === pos3Val) {
            showWinner(pos1Val,pattern);
            return true;
            }
        }
    }
  };

resetBtn.addEventListener("click", resetGame);