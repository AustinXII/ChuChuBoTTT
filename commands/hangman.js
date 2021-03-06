exports.commands = {
    hangman: function(arg, by, room) {
        if (room.charAt(',') === 0) return false;
        if (!Bot.canUse('hangman', room, by)) return false;
        if (hangmanON[room]) {
            Bot.say(by, room, 'A game of Hangman is already in progress. Please wait for it to end before starting another.');
            return false;
        }
        if (checkGame(room)) return Bot.say(by, room, 'There is already a game going on in this room!');
        var HQN = Math.floor(Object.keys(wordBank).length * Math.random());
        var spl = Object.keys(wordBank)[HQN];
        Bot.say(by, room, 'Hosting a game of Hangman! Use ' + config.commandcharacter[0] + 'g to guess letter or word. It is a ``' + wordBank[spl] + '``.');
        game('hangman', room);
        hangmanON[room] = true;
        hangmanChances[room] = 0;
        hangmanDes[room] = '';
        hangmanA[room] = spl;
        hangmanProgress[room] = '';
        for (var i = 0; i < hangmanA[room].length; i++) hangmanProgress[room] += '_ ';
        hangmanProgress[room] += '| ';
        Bot.talk(room, hangmanProgress[room]);
        hangmanInterval[room] = setInterval(function() {
            Bot.talk(room, hangmanProgress[room]);
        }, 15000);
    },
    endhangman: 'hangmanend',
    hangmanend: function(arg, by, room) {
        if (room.charAt(',') === 0) return false;
        if (!Bot.canUse('hangman', room, by)) return false;
        clearInterval(hangmanInterval[room]);
        if (!hangmanON[room]) return false;
        hangmanON[room] = false;
        Bot.say(by, room, 'The game of hangman has been ended. The answer was ' + hangmanA[room] + '.');
    },
    guesshangman: function(arg, by, room) {
        if (!hangmanON[room]) return false;
        if (!toId(arg)) return false;
        if (hangmanProgress[room].indexOf(' ' + toId(arg) + ' ') > -1) return false;
        if (toId(arg).length > 1) {
            if (toId(arg) === hangmanA[room]) {
                clearInterval(hangmanInterval[room]);
                Bot.say(config.nick, room, 'Congrats, ' + by + ' got the correct answer! Reward: ' + Economy.getPayout(3, room) + ' ' + Economy.currency(room));
                Economy.give(by, Economy.getPayout(3, room), room);
                hangmanA[room] = '';
                hangmanON[room] = false;
            }
            else {
                hangmanProgress[room] += toId(arg) + ' ';
                hangmanChances[room]++;
                if (hangmanChances[room] >= 10) {
                    clearInterval(hangmanInterval[room]);
                    hangmanON[room] = false;
                    Bot.say(config.nick, room, 'RIP, the man has died. Game over.');
                    Bot.say(config.nick, room, 'The answer was ' + hangmanA[room] + '.');
                    hangmanA[room] = '';
                }
            }
        }
        else {
            if (hangmanA[room].indexOf(toId(arg)) > -1) {
                for (var i = 0; i < hangmanA[room].length; i++) {
                    if (hangmanA[room].charAt(i) === toId(arg)) {
                        hangmanProgress[room] = hangmanProgress[room].slice(0, 2 * i) + toId(arg) + hangmanProgress[room].slice((2 * i) + 1, hangmanProgress[room].length);
                    }
                    if (!(hangmanProgress[room].indexOf('_') > -1)) {
                        Bot.say(config.nick, room, '' + by + ' has gotten all of the letters. Congrats on completing the word!  Reward: ' + Economy.getPayout(3, room) + ' ' + Economy.currency(room));
                        Economy.give(by, Economy.getPayout(3, room), room);
                        clearInterval(hangmanInterval[room]);
                        hangmanON[room] = false;
                        hangmanA[room] = '';
                    }
                }
            }
            else {
                hangmanProgress[room] += toId(arg) + ' ';
                hangmanChances[room]++;
                if (hangmanChances[room] >= 10) {
                    clearInterval(hangmanInterval[room]);
                    hangmanON[room] = false;
                    Bot.say(config.nick, room, 'RIP, the man has died. Game over.');
                    Bot.say(config.nick, room, 'The answer was ' + hangmanA[room] + '.');
                    hangmanA[room] = '';
                }
            }
        }
    }
};

/****************************
*       For C9 Users        *
*****************************/
// Yes, sadly it can't be done in one huge chunk w/o undoing it / looking ugly :(

/* globals toId */
/* globals Bot */
/* globals config */
/* globals hangmanA */
/* globals hangmanProgress */
/* globals hangmanChances */
/* globals hangmanON */
/* globals hangmanInterval */
/* globals Economy */
/* globals hangmanDes */
/* globals game */
/* globals checkGame */
/* globals wordBank */
