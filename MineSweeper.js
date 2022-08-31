        // const grid = [
        //     [0, 0, 0, 0],
        //     [0, 0, 0, 0]
        // ]

        // grid[x][y]
class Cell {
    constructor ( x, y, cellSize) {
        this.x = x;
        this.y = y;
        this.cellSize = cellSize;
        this.isRevealed = false;
        this.isMine = false;
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
        this.draw();


        this.canvas.addEventListener('click', e => {
            const clickX = e.clientX - this.canvas.offsetLeft;
            const clickY = e.clientY - this.canvas.offsetTop;

            const cell = this.getCellByCoordinates(clickX, clickY);

            cell.isRevealed = true;
            this.draw();
        })
    }

    getCellByCoordinates(xPos, yPos) {
        // for ( let y = 0; y < this.rows; y++ ) {
        //     for ( let x = 0; x < this.cols; x++ ) {
        //         const cell = this.mineField[y][x];
        //     }
        // }

        // this.mineField.find( cell => {
        //     if (
        //         cell.x < xPos &&
        //         cell.y < yPos &&
        //         cell.x + cell.cellSize > xPos &&
        //         cell.y + cell.cellSize > yPos
        //     ) {
        //         return cell;
        //     }
        // })

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

            if (this.mineField[y][x].isMine) {
                return;
            }

            console.log(`place mine at ${y}:${x}`);

            this.mineField[y][x].isMine = true;

            minesLeft--;
        }

        console.log(this.mineField);
    }

    draw () {
        this.contex.clearRect(0, 0, this.width, this.height);

        for ( let y = 0; y < this.rows; y++ ) {
            for ( let x = 0; x < this.cols; x++ ) {
                const cell = this.mineField[y][x];

                this.contex.beginPath();


                //styles
                this.contex.strokeStyle = '#222';


                this.contex.rect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                
                if (!cell.isRevealed) {
                    this.contex.fillStyle = '#000';
                    this.contex.fill();
                }

                if (cell.isMine) {
                    this.contex.fillStyle = '#f00';
                    this.contex.fill();
                }

                this.contex.stroke();

                this.contex.closePath();

            }
        }
    }
}