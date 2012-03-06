(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  jQuery(function() {
    var Game, Player, notice;
    ($('#start_button')).focus();
    ($('section#board')).hide();
    notice = function(message) {
      return ($('div#statusBar > p')).html("<p>" + message + "</p>");
    };
    Game = (function() {

      function Game(options) {
        this.resetCell = __bind(this.resetCell, this);
        this.makeMove = __bind(this.makeMove, this);
        var p1, p2, players, _ref, _ref2, _ref3;
        players = (_ref = options[0]) != null ? _ref : '1';
        switch (players) {
          case 0:
          case "0":
            p1 = p2 = false;
            break;
          case 2:
          case "2":
            p1 = p2 = true;
            break;
          default:
            p1 = true;
            p2 = false;
        }
        this.player1 = new Player((_ref2 = options[1]) != null ? _ref2 : 'X', p1);
        this.player2 = new Player((_ref3 = options[2]) != null ? _ref3 : 'O', p2);
        this.cells = $("section#board .cell");
        this.cells.each(function() {
          $(this).text(" ");
          return $(this).removeClass('score');
        });
        this.currentPlayer = this.player1;
        this.availableMoves = 9;
        ($('span.p1-title')).text(" " + options[1] + " Wins : ");
        ($('span.p2-title')).text(" " + options[2] + " Wins : ");
        notice("" + this.currentPlayer.type + ": It's your turn");
        ($('section#board div.cell')).on({
          click: this.makeMove,
          mouseleave: this.resetCell
        });
        if (parseInt(players) === 0) {
          setTimeout(this.computerMove(this.currentPlayer), 1000);
        }
      }

      Game.prototype.makeMove = function(e) {
        if (($(e.target)).text() !== " ") {
          ($(e.target)).addClass('invalid');
          ($(e.target)).removeClass('valid');
        } else {
          ($(e.target)).addClass('valid');
        }
        if (($(e.target)).hasClass('valid') === true) {
          if (($(e.target)).hasClass('invalid') === false) {
            ($(e.target)).text(this.currentPlayer.type);
            return this.checkForWinner();
          }
        }
      };

      Game.prototype.checkForWinner = function() {
        var allTheDirections, count, gameOver, group, moves, score, selection, theAngles, theRowsAndCols, type, winner, _i, _j, _len, _len2;
        type = this.currentPlayer.type;
        gameOver = false;
        winner = type === this.player1.type ? "p1" : "p2";
        theRowsAndCols = [$('div.row1'), $('div.row2'), $('div.row3'), $('div.col1'), $('div.col2'), $('div.col3')];
        theAngles = [$('div.row1.col1, div.row2.col2, div.row3.col3'), $('div.row3.col1, div.row2.col2, div.row1.col3')];
        allTheDirections = [theRowsAndCols, theAngles];
        for (_i = 0, _len = allTheDirections.length; _i < _len; _i++) {
          selection = allTheDirections[_i];
          for (_j = 0, _len2 = selection.length; _j < _len2; _j++) {
            group = selection[_j];
            count = [];
            group.each(function() {
              var c, _k, _len3;
              if ($(this).text() === type) count.push($(this));
              if (count.length === 3) {
                for (_k = 0, _len3 = count.length; _k < _len3; _k++) {
                  c = count[_k];
                  $(c).addClass('score');
                }
                return gameOver = true;
              }
            });
          }
        }
        if (gameOver === true) {
          score = ($("." + winner + "-wins")).text();
          ($("." + winner + "-wins")).text(parseInt(score) + 1);
          this.gameOver("GAMEOVER!");
          return;
        } else {
          moves = 9;
          this.cells.each(function() {
            if ($(this).text() !== " ") return moves -= 1;
          });
          this.availableMoves = moves;
          if (this.availableMoves <= 0) {
            this.gameOver("STALEMATE");
          } else {
            this.switchPlayer();
          }
        }
      };

      Game.prototype.gameOver = function(message) {
        notice(message);
        return ($('section#setup')).slideToggle();
      };

      Game.prototype.computerMove = function(player) {
        var cell, cells, i, index, j, max, move, opponent, rank, row, rows, type, _len, _len2, _len3, _ref;
        type = player.type;
        opponent = this.currentPlayer.type === this.player1.type ? this.player2.type : this.player1.type;
        rows = [$('div.row1'), $('div.row2'), $('div.row3')];
        rank = [[3, 2, 3], [2, 5, 2], [3, 2, 3]];
        for (index = 0, _len = rows.length; index < _len; index++) {
          row = rows[index];
          row.each(function(col) {
            if ($(this).text() !== " ") return rank[index][col] = 0;
          });
        }
        this.checkForWinAndBlock(type, 9, rank);
        this.checkForWinAndBlock(opponent, 8, rank);
        this.checkCorners(opponent, rank);
        max = (_ref = []).concat.apply(_ref, rank);
        max = max.sort();
        max = max[max.length - 1];
        move = [];
        for (i = 0, _len2 = rank.length; i < _len2; i++) {
          row = rank[i];
          for (j = 0, _len3 = row.length; j < _len3; j++) {
            cell = row[j];
            if (cell === max) move = "" + i + "," + j;
          }
        }
        switch (move) {
          case "0,0":
            move = 0;
            break;
          case "0,1":
            move = 1;
            break;
          case "0,2":
            move = 2;
            break;
          case "1,0":
            move = 3;
            break;
          case "1,1":
            move = 4;
            break;
          case "1,2":
            move = 5;
            break;
          case "2,0":
            move = 6;
            break;
          case "2,1":
            move = 7;
            break;
          case "2,2":
            move = 8;
        }
        cells = $('section#board div.cell');
        $(cells[move]).text(type);
        return this.checkForWinner();
      };

      Game.prototype.checkCorners = function(opponent, rank) {
        var corners;
        corners = [$('div.row1.col1'), $('div.row1.col3'), $('div.row3.col1'), $('div.row3.col3')];
        if (corners[0] === opponent && corners[3] === " ") rank[2][2] += 1;
        if (corners[3] === opponent && corners[0] === " ") rank[0][0] += 1;
        if (corners[1] === opponent && corners[2] === " ") rank[2][0] += 1;
        if (corners[2] === opponent && corners[1] === " ") rank[0][2] += 1;
        return rank;
      };

      Game.prototype.checkForWinAndBlock = function(type, amount, rank) {
        var col, cols, index, ltrs, result, results, row, rows, rtls, _len, _len2;
        rank = rank;
        rows = [$('div.row1'), $('div.row2'), $('div.row3')];
        cols = [$('div.col1'), $('div.col2'), $('div.col3')];
        ltrs = $('div.row1.col1, div.row2.col2, div.row3.col3');
        rtls = $('div.row3.col1, div.row2.col2, div.row1.col3');
        for (index = 0, _len = rows.length; index < _len; index++) {
          row = rows[index];
          results = [];
          row.each(function() {
            var cell, i, _len2, _ref, _results;
            if ($(this).hasClass("row" + (index + 1))) {
              if ($(this).text() === type) {
                results.push($(this));
                if (results.length === 2) {
                  _ref = rank[index];
                  _results = [];
                  for (i = 0, _len2 = _ref.length; i < _len2; i++) {
                    cell = _ref[i];
                    if (cell !== 0) {
                      _results.push(rank[index][i] = amount);
                    } else {
                      _results.push(void 0);
                    }
                  }
                  return _results;
                }
              }
            }
          });
        }
        for (index = 0, _len2 = cols.length; index < _len2; index++) {
          col = cols[index];
          results = [];
          col.each(function() {
            var cell, i, rank_cols, _len3;
            if ($(this).hasClass("col" + (index + 1))) {
              if ($(this).text() === type) {
                results.push($(this));
                if (results.length === 2) {
                  rank_cols = [rank[0][index], rank[1][index], rank[2][index]];
                  for (i = 0, _len3 = rank_cols.length; i < _len3; i++) {
                    cell = rank_cols[i];
                    if (cell !== 0) rank_cols[i] = amount;
                  }
                  return rank[0][index] = rank_cols[0], rank[1][index] = rank_cols[1], rank[2][index] = rank_cols[2], rank_cols;
                }
              }
            }
          });
        }
        result = 0;
        ltrs.each(function() {
          var n, _results;
          if ($(this).text() === type) {
            result += 1;
            if (result === 2) {
              _results = [];
              for (n = 0; n <= 2; n++) {
                if (rank[n][n] !== 0) {
                  _results.push(rank[n][n] = amount);
                } else {
                  _results.push(void 0);
                }
              }
              return _results;
            }
          }
        });
        result = 0;
        rtls.each(function() {
          var n, _results;
          if ($(this).text() === type) {
            result += 1;
            if (result === 2) {
              _results = [];
              for (n = 0; n <= 2; n++) {
                if (rank[2 - n][n] !== 0) {
                  _results.push(rank[2 - n][n] = amount);
                } else {
                  _results.push(void 0);
                }
              }
              return _results;
            }
          }
        });
        return rank;
      };

      Game.prototype.resetCell = function(e) {
        ($(e.target)).removeClass('invalid');
        return ($(e.target)).removeClass('valid');
      };

      Game.prototype.switchPlayer = function() {
        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
        if (this.currentPlayer.human !== true) {
          setTimeout(this.computerMove(this.currentPlayer), 800);
        }
        return notice("" + this.currentPlayer.type + ": It's your turn");
      };

      return Game;

    })();
    Player = (function() {

      function Player(type, human) {
        this.type = type;
        this.human = human != null ? human : true;
      }

      return Player;

    })();
    return ($('#gameOptions')).submit(function(event) {
      var game;
      ($('section#board div.cells')).off();
      if (game !== null) delete game;
      event.target.checkValidity();
      event.preventDefault();
      game = new Game([($('#player-count')).val(), ($('#player-1-type')).val(), ($('#player-2-type')).val()]);
      ($('section#setup')).slideToggle();
      return ($('section#board')).show();
    });
  });

}).call(this);
