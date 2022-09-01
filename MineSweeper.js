        // const grid = [
        //     [0, 0, 0, 0],
        //     [0, 0, 0, 0]
        // ]

        // grid[y][x]
class Cell {
    constructor ( x, y, cellSize) {
        this.x = x;
        this.y = y;
        this.cellSize = cellSize;
        this.isRevealed = false;
        this.isMine = false;
        this.neighbouringMineCount = 0;
    }
}

class MineSweeper {
    constructor(dom, width, height, mineCount, cellSize) {
        this.dom = dom;
        this.canvas = null;
        this.contex = null;

        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.mineCount = mineCount;

        this.mineField = null;
        this.cols = 0;
        this.rows = 0;

        this.setup();
    }

    setup () {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.contex = this.canvas.getContext('2d');

        this.dom.appendChild(this.canvas);

        this.cols = this.width / this.cellSize;
        this.rows = this.height / this.cellSize;

        this.createMineField();
        this.placeMines();
        this.countNeighbouringMines();


        this.remainingCells = this.mineField.flat().length - this.mineCount;

        this.draw();


        this.canvas.addEventListener('click', e => {
            const clickX = e.clientX - this.canvas.offsetLeft;
            const clickY = e.clientY - this.canvas.offsetTop;

            const cell = this.getCellByCoordinates(clickX, clickY);

            if ( cell.isRevealed ) return;

            if ( cell.isMine ) return this.gameOver();

            cell.isRevealed = true;
            this.remainingCells--;

            this.checkForWin();

            this.floodFill(cell);

            this.draw();
        })
    }

    floodFill (cell) {
        if (cell.neighbouringMineCount === 0) {
            if (cell.x - 1 >= 0) {
                const lc = this.mineField[cell.y][cell.x - 1];
                if (!lc.isRevealed) {
                    lc.isRevealed = true;
                    if (lc.neighbouringMineCount === 0) {
                        this.floodFill(lc);
                    }
                } 
            }
            if (cell.x + 1 < this.cols) {
                const rc = this.mineField[cell.y][cell.x + 1];
                if (!rc.isRevealed) {
                    rc.isRevealed = true;
                    if (rc.neighbouringMineCount === 0) {
                        this.floodFill(rc);
                    }
                } 
            }
            if (cell.y - 1 >= 0) {
                const tc = this.mineField[cell.y - 1][cell.x];
                if (!tc.isRevealed) {
                    tc.isRevealed = true;
                    if (tc.neighbouringMineCount === 0) {
                        this.floodFill(tc);
                    }
                } 
            }
            if (cell.y + 1 < this.rows) {
                const bc = this.mineField[cell.y + 1][cell.x];
                if (!bc.isRevealed) {
                    bc.isRevealed = true;
                    if (bc.neighbouringMineCount === 0) {
                        this.floodFill(bc);
                    }
                } 
            }
        }
    }

    getCellByCoordinates(xPos, yPos) {
        return this.mineField[Math.floor(yPos / this.cellSize)][Math.floor(xPos / this.cellSize)];
    }

    createMineField () {
        this.mineField = [];
        for ( let y = 0; y < this.rows; y++ ) {
            this.mineField[y] = [];
            for ( let x = 0; x < this.cols; x++ ) {
                this.mineField[y][x] = new Cell(x, y, this.cellSize);
            }
        }
    }

    placeMines () {
        let minesLeft = this.mineCount;

        while (minesLeft > 0) {
            const x = Math.floor(Math.random() * this.cols);
            const y = Math.floor(Math.random() * this.rows);

            if (this.mineField[y][x].isMine) continue;

            this.mineField[y][x].isMine = true;

            minesLeft--;
        }
    }

    countNeighbouringMines () {
        for ( let y = 0; y < this.rows; y++ ) {
            for( let x = 0; x < this.cols; x++ ) {
                const cell = this.mineField[y][x];

                let xPos = x - 1;
                let yPos = y - 1;

                for (let xPos = 0; xPos < 9; xPos++) {
                    for (let yPos = 0; yPos < 9; yPos++) {
                        const c = this.mineField[yPos][xPos];

                        if (c === cell) continue;
                        if (c.x > cell.x + 1 || c.x < cell.x - 1 || c.y > cell.y + 1 || c.y < cell.y - 1) continue;
                        if (!c.isMine) continue;

                        cell.neighbouringMineCount++;
                    }
                }
            }
        }
    }

    gameOver () {
        for ( let y = 0; y < this.rows; y++ ) {
            for ( let x = 0; x < this.cols; x++) {
                const cell = this.mineField[y][x];
                cell.isRevealed = true;
            }
        }
        
        this.draw();

        alert("GAME OVER!");
    }

    checkForWin () {
       this.remainingCells = this.mineField.flat().filter( cell => !cell.isMine && !cell.isRevealed );
       
       if (this.remainingCells.length === 0) alert("YOU WIN!");
    }

    draw () {
        this.contex.clearRect(0, 0, this.width, this.height);

        for ( let y = 0; y < this.rows; y++ ) {
            for ( let x = 0; x < this.cols; x++ ) {
                const cell = this.mineField[y][x];

                this.contex.beginPath();
                this.contex.strokeStyle = '#222';
                this.contex.rect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                

                if (cell.isRevealed && cell.isMine) {
                    this.contex.fillStyle = '#f00';
                    this.contex.fill();
                }


                if (cell.neighbouringMineCount > 0) {
                    this.contex.fillStyle = '#000';
                    this.contex.textAlign = 'center';
                    this.contex.textBaseline = 'middle'; 
                    this.contex.font = '15px Arial';
                    this.contex.fillText(cell.neighbouringMineCount, cell.x * this.cellSize + this.cellSize / 2,
                                            cell.y * this.cellSize + this.cellSize / 2);
    
                }
               
                if (!cell.isRevealed) {
                    this.contex.fillStyle = '#ccc';
                    this.contex.fill();
                }
                                        
                this.contex.stroke();
                this.contex.closePath();
            }
        }
    }
}