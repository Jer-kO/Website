var Connect4 = Backbone.View.extend({
    events: {
        'click #player-move': 'playerMove',
        'click #reset-game' : 'initialize'
    },

    initialize: function () {
        this.state = {
            GAME_OVER_DRAW: 0,
            GAME_OVER_ONE: 1,
            GAME_OVER_TWO: 2,
            GAME_ACTIVE: 3,
            GAME_INACTIVE: 4
        };

        this.board = new Board({
            el: this.$el.find('.board')
        });
        this.playerInput = this.$el.find('.player-input');
        this.playerInput.val('');
        this.playerInput.attr('placeholder', 'Player 1\'s turn to move.');
        this.message = this.$el.find('.game-message');
        this.message.empty();

        this.currentState = this.state.GAME_ACTIVE;
        this.currentPlayer = 1;

        this.turnNumber = 0;
    },

    playerMove: function () {
        var col = parseInt(this.playerInput.val());
        if (col >= 0 && col < this.board.width) {
            var move = this.board.addToColumn(col, this.currentPlayer);
            if (move !== -1) {
                // Valid move
                this.board.drawBoard();
                this.turnNumber = this.turnNumber + 1;
                this.checkGameDraw();
                this.checkGameWon(col, move);
                (this.currentPlayer === 1) ? this.currentPlayer = 2 : this.currentPlayer = 1;
                this.playerInput.val('');
                this.playerInput.attr('placeholder', 'Player ' + this.currentPlayer + '\'s turn to move.');
            } else {
                this.message.empty();
                this.message.append('This column is full!');
            }
        } else {
            this.message.empty();
            this.message.append('That is not a valid column number!');
        }
    },

    checkGameDraw: function () {
        if (this.turnNumber ===  this.board.width*this.board.height) {
            this.message.empty();
            this.message.append('Draw!');
            return true;
        }
        return false;
    },

    checkGameWon: function (x, y) {
        var winner = this.board.checkWinnerFromPosition(x, y);
        if (winner !== 0) {
            this.message.empty();
            this.message.append('Player ' + winner + ' wins!');
            return true;
        }
        return false;
    }
});

var Board = Backbone.View.extend({
    initialize: function () {
        this.width = 7;
        this.height = 6;

        // Initialize 2D array
        this.boardArr = new Array(this.width);
        for (var x = 0; x < this.width; x++) {
            this.boardArr[x] = new Array(this.height);
        }

        // Fill the boardArr with all 0
        for (x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                this.boardArr[x][y] = 0;
            }
        }
        this.drawBoard();
    },

    drawBoard: function () {
        var str = '';
        for (var y = this.height - 1; y >= 0; y--) {
            for (var x = 0; x < this.width; x++) {
                str = str.concat('| ');
                switch (this.boardArr[x][y]) {
                    case 0:
                    default:
                        str = str.concat(' ');
                        break;
                    case 1:
                        str = str.concat('o');
                        break;
                    case 2:
                        str = str.concat('x');
                        break;
                }
                str = str.concat(' |');
            }
            str = str.concat('\n');
        }

        str = str.concat('-----------------------------------');
        this.$el.val(str);
    },

    // Returns the row number of move, otherwise -1 if invalid move
    addToColumn: function (col, player) {
        if (!this.isColumnFull(col)) {
            for (var y = 0; y < this.height; y++) {
                if (this.boardArr[col][y] === 0) {
                    this.boardArr[col][y] = player;
                    return y;
                }
            }
        }
        return -1;
    },

    isColumnFull: function (col) {
        if (this.boardArr[col][this.height-1] === 0) {
            return false;
        }
        return true;
    },

    checkWinnerFromPosition: function (x, y) {
        var winner = this.checkWinnerFromCol(x);
        if (winner !== 0) {
            return winner;
        }

        winner = this.checkWinnerFromRow(y);
        if (winner !== 0) {
            return winner;
        }

        winner = this.checkWinnerFromLeftDiag(x, y);
        if (winner !== 0) {
            return winner;
        }

        winner = this.checkWinnerFromRightDiag(x, y);
        return winner;
    },

    // Check for winner along a column
    // Returns 1 if player 1 wins, 2 if player 2 wins, 0 if no winner
    checkWinnerFromCol: function (x) {
        var str = '';
        for (var y = 0; y < this.height; y++) {
            str = str.concat(this.boardArr[x][y]);
        }
        return this.checkWinnerFromString(str);
    },

    // Check for winner along a row
    // Returns 1 if player 1 wins, 2 if player 2 wins, 0 if no winner
    checkWinnerFromRow: function (y) {
        var str = '';
        for (var x = 0; x < this.width; x++) {
            str = str.concat(this.boardArr[x][y]);
        }
        return this.checkWinnerFromString(str);
    },

    // Check for winner along / diagonal direction
    // Returns 1 if player 1 wins, 2 if player 2 wins, 0 if no winner
    checkWinnerFromLeftDiag: function (x, y) {
        var str = '';
        var xx = x;
        var yy = y;
        while (xx < this.width && yy < this.height) {
            str = str.concat(this.boardArr[xx][yy]);
            xx = xx + 1;
            yy = yy + 1;
        }

        xx = x - 1;
        yy = y - 1;
        while (xx >= 0 && yy >= 0) {
            str = this.boardArr[xx][yy] + str;
            xx = xx - 1;
            yy = yy - 1;
        }

        return this.checkWinnerFromString(str);
    },

    // Check for winner along \ diagonal direction
    // Returns 1 if player 1 wins, 2 if player 2 wins, 0 if no winner
    checkWinnerFromRightDiag: function (x, y) {
        var str = '';
        var xx = x;
        var yy = y;
        while (xx >= 0 && yy < this.height) {
            str = str.concat(this.boardArr[xx][yy]);
            xx = xx - 1;
            yy = yy + 1;
        }

        xx = x + 1;
        yy = y - 1;
        while (xx < this.width && yy >= 0) {
            str = this.boardArr[xx][yy] + str;
            xx = xx + 1;
            yy = yy - 1;
        }

        return this.checkWinnerFromString(str);
    },

    // Returns 1 if player 1 wins, 2 if player 2 wins, 0 if no winner
    checkWinnerFromString: function (str) {
        if (str.indexOf('1111') !== -1) {
            return 1;
        } else if (str.indexOf('2222') !== -1) {
            return 2;
        }
        return 0;
    }
});

