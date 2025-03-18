const express = require("express");
const cors = require("cors");
const sessions = require("express-session");
var cookieParser = require("cookie-parser");
const app = express();
const http = require("http");
const server = http.createServer(app);
const PORT = 7878;
const host = "0.0.0.0";
const axios = require("axios");

const socketIO = require("socket.io")(server, {
  cors: {
    origin: true,
    credentials: true,
  },
  path: "/node/",
});

// ================= SAVE TOKEN AS COOKIE ================
app.use(cookieParser());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
  next();
});
app.use(
  sessions({
    key: "session.sid",
    secret: "soy secreto",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 600000,
    },
  })
);

app.use(express.static('public'));

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      return callback(null, true);
    },
  })
);

let i = 0;
const laravelRoute = "http://127.0.0.1:8000/index.php/";

let lobbies = [];

const maxSettings = {
  maxTime: 120,
  minTime: 30,
  minAmountOfTurns: 1,
  maxAmountOfTurns: 5,
};

var sesiones = [];

// ------------------------------------------------------------------

socketIO.on("connection", (socket) => {
  i++;
  socket.data.id = i;
  socket.data.username = "";
  socket.data.token = null;
  socket.data.current_lobby = null;
  socket.data.avatar = "";

  console.log(socket.data.id + " connected ");

  const random_hex_color_code = () => {
    let n = Math.floor(Math.random() * 999999);
    return n.toString().padStart(6, "0");
  };

  socket.on("send token", (data) => {
    let token = data.token;
    socket.data.token = token;

    axios
      .post(laravelRoute + "getUserInfo", {
        token: token,
      })
      .then(function (response) {
        var user = {
          token: token,
          userId: response.data.id,
          userName: response.data.name,
        };
        sesiones.push(user);

        socket.data.dbId = response.data.id;
        socket.data.username = response.data.name;
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  socket.on("get_username", () => {
    if (socket.data.username != "") {
      socketIO.to(socket.id).emit("username_saved", {
        name: socket.data.username,
      });
    }
  });

  socket.on("get_categories", () => {
    sendCategoriesToUser(socket);
  });

  async function sendCategoriesToUser(socket) {
    await axios
      .post(laravelRoute + "getCategories", {
        token: socket.data.token,
      })
      .then(function (response) {
        socketIO.to(socket.id).emit("categories", response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  socket.on("new_lobby", () => {
    if (socket.data.current_lobby != null) {
      resetLobbyData(socket.data.current_lobby);
    } else {
      let existeix = false;
      let newLobbyIdentifier;

      do {
        newLobbyIdentifier = random_hex_color_code();

        lobbies.forEach((element) => {
          if (element.lobbyIdentifier == newLobbyIdentifier) {
            existeix = true;
          }
        });
      } while (existeix);

      if (!existeix) {
        let lobbyData = {
          lobbyIdentifier: newLobbyIdentifier,
          ownerId: socket.data.id,
          members: [],
          currentDrawer: "",
          wordLengthUserCount: 0,
          words: [],
          rounds: 0,
          actualRound: 0,
          startedWordLength: false,
          actualTurn: 1,
          ind_drawer: 0,
          ended: false,
          boardData: undefined,
          started: false,
          cont: 0,
          settings: {
            roundDuration: 60,
            amountOfTurns: 1,
            ownerPlay: false,
          },
        };
        lobbies.push(lobbyData);
        socketIO.to(socket.id).emit("lobby_info", lobbyData);
        socket.join(newLobbyIdentifier);
        socket.data.current_lobby = newLobbyIdentifier;
      }
    }
  });

  socket.on("lobby_data", () => {
    sendUserList(socket.data.current_lobby);
  });

  socket.on("join_room", (data) => {
    if (data.username.length > 8) {
      socketIO.to(socket.id).emit("USR_NAME_TOO_LONG");
    } else {
      socket.data.username = data.username;
      joinLobby(socket, data.lobbyIdentifier, socket.data.username);
    }
  });

  socket.on("set_avatar", (data) => {
    socket.data.avatar = data.avatar;
    lobbies.forEach((lobby) => {
      if (lobby.lobbyIdentifier == socket.data.current_lobby) {
        lobby.members.forEach((member) => {
          if (member.idUser == socket.data.id) {
            member.avatar = data.avatar;
          }
        });
      }
    });
    sendUserList(socket.data.current_lobby)
  });



  socket.on("leave_lobby", (data) => {
    let lobby = socket.data.current_lobby;
    if (data.delete) {
      deleteLobby(socket);
    } else if (data.wasDeleted) {
      socket.leave(socket.data.current_lobby);
      socket.data.current_lobby = null;
    } else {
      leaveLobby(socket);
      sendUserList(lobby);
    }
  });

  socket.on("use_same_seed", () => {
    socketIO.to(socket.id).emit("");
  });

  socket.on("get_owner", () => {
    getOwner(socket.data.current_lobby);
  });

  socket.on("set_categories", (data) => {
    lobbies.forEach(lobby => {
      if (lobby.lobbyIdentifier == socket.data.current_lobby) {
        lobby.categories = data.ids;
      }
    });
  })

  socket.on("start_game", () => {
    let amountOfRounds;

    lobbies.forEach(lobby => {
      if (lobby.lobbyIdentifier == socket.data.current_lobby && !lobby.started) {
        if (lobby.members.length > 1) {
          lobby.rounds = lobby.members.length * lobby.settings.amountOfTurns;
          amountOfRounds = lobby.rounds;
          socketIO.to(socket.data.current_lobby).emit('game_started');
          setLobbyWord(socket.data.current_lobby, amountOfRounds);
          enviarPintor(socket.data.current_lobby)
          sendUserList(socket.data.current_lobby);
        } else {
          socketIO.to(socket.id).emit('NOT_ENOUGH_PLAYERS');
        }
      }
    });
  });

  socket.on("countdown_ended", () => {
    lobbies.forEach(lobby => {
      if (lobby.lobbyIdentifier == socket.data.current_lobby && lobby.ownerId == socket.data.id) {
        setCounter(socket.data.current_lobby);
      }
    });
  })

  socket.on("word_length_loaded", () => {
    lobbies.forEach(lobby => {
      if (lobby.lobbyIdentifier == socket.data.current_lobby) {
        lobby.wordLengthUserCount++;
        if ((!lobby.settings.ownerPlay && lobby.wordLengthUserCount == lobby.members.length) || (lobby.settings.ownerPlay && lobby.wordLengthUserCount == lobby.members.length - 1)) {
          startWordLength(socket.data.current_lobby);
          lobby.wordLengthUserCount = 0;
        }
      }
    });
  })

  socket.on("get_game_data", () => {
    enviarPintor(socket.data.current_lobby);
    let word;
    lobbies.forEach((lobby) => {
      if (lobby.lobbyIdentifier == socket.data.current_lobby) {
        word = lobby.words[lobby.actualRound];
      }
    });
    socketIO.to(socket.id).emit("current_word", {
      word: word,
    });
  });



  socket.on("get_lobby_settings", () => {
    let data;
    lobbies.forEach((lobby) => {
      if (lobby.lobbyIdentifier == socket.data.current_lobby) {
        data = lobby.settings;
      }
    });

    if (data != null) {
      socketIO.to(socket.id).emit("lobby_settings", data);
    }
  });

  socket.on("save_gamemode", (data) => {
    lobbies.forEach((lobby) => {
      if (lobby.lobbyIdentifier == socket.data.current_lobby) {
        lobby.gamemode = data.gamemode;
      }
    });
    socketIO.to(socket.id).emit("gamemode_setted");
  });

  socket.on("save_settings", (data) => {
    let valid = true;
    lobbies.forEach((lobby) => {
      if (
        lobby.lobbyIdentifier == socket.data.current_lobby &&
        lobby.ownerId == socket.data.id
      ) {
        if (data.roundDuration < maxSettings.minTime) {
          socketIO.to(socket.id).emit("ROUND_TIME_UNDER_MIN", {
            min: maxSettings.minTime,
          });

          valid = false;
        } else if (data.roundDuration > maxSettings.maxTime) {
          socketIO.to(socket.id).emit("ROUND_TIME_ABOVE_MAX", {
            max: maxSettings.maxTime,
          });

          valid = false;
        }

        if (valid) {
          if (data.amountOfTurns < maxSettings.minAmountOfTurns) {
            socketIO.to(socket.id).emit("TURNS_AMT_UNDER_MIN", {
              min: maxSettings.minAmountOfTurns,
            });

            valid = false;
          } else if (data.amountOfTurns > maxSettings.maxAmountOfTurns) {
            socketIO.to(socket.id).emit("TURNS_AMT_ABOVE_MAX", {
              max: maxSettings.maxAmountOfTurns,
            });

            valid = false;
          }
        }

        if (valid) {
          if (data.ownerPlay && data.nickname == "") {
            valid = false;
            socketIO.to(socket.id).emit("NO_USR_DEFINED");
          }

          if (!lobby.settings.ownerPlay && data.ownerPlay) {
            lobby.members.forEach((checking_member) => {
              if (checking_member.username == data.nickname) {
                valid = false;
                socketIO.to(socket.id).emit("USER_ALR_CHOSEN_ERROR");
              }
            });

            if (valid) {
              socket.data.username = data.nickname;
              lobby.members.push({
                idUser: socket.data.id,
                username: data.nickname,
                lastAnswerCorrect: false,
                lastAnswer: "",
                points: 0,
              });

              sendUserList(socket.data.current_lobby);
            }
          } else if (lobby.settings.ownerPlay && !data.ownerPlay) {
            lobby.members.forEach((member, index) => {
              if (member.idUser == socket.data.id) {
                lobby.members.splice(index, 1);
              }
            });

            sendUserList(socket.data.current_lobby);
          } else if (lobby.settings.ownerPlay && data.ownerPlay) {
            lobby.members.forEach((member) => {
              if (member.idUser == socket.data.id) {
                if (member.username != data.nickname) {
                  lobby.members.forEach((checking_member) => {
                    if (checking_member.username == data.nickname) {
                      valid = false;
                    }
                  });

                  if (valid) {
                    member.username = data.nickname;
                  } else {
                    socketIO.to(socket.id).emit("USER_ALR_CHOSEN_ERROR");
                  }
                }
              }
            });

            sendUserList(socket.data.current_lobby);
          }
        }

        if (valid) {
          lobby.settings = data;
        }

        socketIO.to(socket.id).emit("starting_errors", {
          valid: valid,
        });
      }
    });
  });

  socket.on("save_coord", (arrayDatos) => {
    lobbies.forEach((lobby) => {
      if (lobby.lobbyIdentifier == socket.data.current_lobby) {
        lobby.boardData = arrayDatos;
      }
    });

    sendBoardData(socket.data.current_lobby);
  });

  socket.on("give_me_the_board", () => {
    let boardData;
    lobbies.forEach((lobby) => {
      if (lobby.lobbyIdentifier == socket.data.current_lobby) {
        boardData = lobby.boardData;
      }
    });

    if (boardData != undefined) {
      sendBoardData(socket.data.current_lobby);
    }
  });

  socket.on("try_word_attempt", (data) => {
    let wordToCheck;

    lobbies.forEach((lobby) => {
      if (lobby.lobbyIdentifier == socket.data.current_lobby) {
        if (!lobby.ended) {
          wordToCheck = lobby.words[lobby.actualRound].name;

          if (data.word.toLowerCase() === wordToCheck.toLowerCase()) {
            socketIO.to(socket.id).emit("answer_result", {
              resultsMatch: true,
            });
            let pointsRound = 0;
            let userTime = lobby.settings.roundDuration - lobby.cont;

            if (
              lobby.settings.roundDuration - userTime >
              lobby.settings.roundDuration - 20
            ) {
              pointsRound = lobby.settings.roundDuration - 20;
            } else {
              pointsRound = lobby.settings.roundDuration - userTime;
            }

            lobby.members.forEach((member) => {
              if (member.username == lobby.currentDrawer) {
                member.points = member.points + 10;
              } else if (member.idUser == socket.data.id) {
                member.lastAnswerCorrect = true;
                member.lastAnswer = data.word;
                member.points = member.points + pointsRound;
              }
            });
            sendUserList(socket.data.current_lobby);
          } else {
            socketIO.to(socket.id).emit("answer_result", {
              resultsMatch: false,
            });

            lobby.members.forEach((member) => {
              if (member.idUser == socket.data.id) {
                member.lastAnswerCorrect = false;
                member.lastAnswer = data.word;
              }
            });
            sendUserList(socket.data.current_lobby);
          }
        }
      }
    });
  });

  socket.on('round_end', () => {
    lobbies.forEach((lobby) => {
      if (lobby.lobbyIdentifier == socket.data.current_lobby) {
        if (lobby.ownerId == socket.data.id) {
          enviarPintor(socket.data.current_lobby);
          sendUserList(socket.data.current_lobby);
          acabarRonda(socket.data.current_lobby);
        }
        if (!lobby.ended) {
          lobby.wordLengthUserCount++;
          if (lobby.wordLengthUserCount == lobby.members.length) {
            startWordLength(socket.data.current_lobby);
            lobby.wordLengthUserCount = 0;
          }
        }
      }
    });
  })

  socket.on("disconnect", () => {
    console.log(socket.data.id + " disconnected");
    leaveLobby(socket);
  });
});

async function resetLobbyData(room) {
  const sockets = await socketIO.in(room).fetchSockets();
  let lobby_data;

  socketIO.to(room).emit("GO_BACK_TO_LOBBY");

  lobbies.forEach((lobby) => {
    if (lobby.lobbyIdentifier == room) {
      lobby.currentDrawer = "";
      lobby.words = [];
      lobby.rounds = 0;
      lobby.actualRound = 0;
      lobby.wordLengthUserCount = 0;
      lobby.startedWordLength = false;
      lobby.cont = 0;
      lobby.ind_drawer = 0;
      lobby.actualTurn = 1;
      lobby.ended = false;
      lobby.boardData = undefined;
      lobby.started = false;
      lobby.members.forEach((member) => {
        member.lastAnswerCorrect = false;
        member.lastAnswer = "";
        member.points = 0;
        member.avatar = "";
      });
      lobby_data = lobby;
    }
  });

  sockets.forEach((user) => {
    socketIO.to(user.id).emit("lobby_info", lobby_data);
  });
  sendUserList(room);
  sendBoardData(room);
}

async function getOwner(room) {
  const sockets = await socketIO.in(room).fetchSockets();

  lobbies.forEach((lobby) => {
    if (lobby.lobbyIdentifier == room) {
      sockets.forEach((user) => {
        if (user.data.id == lobby.ownerId) {
          socketIO.to(user.id).emit("is_owner", lobby);
        }
      });
    }
  });
}

function setCounter(lobbyId) {
  let timer;
  lobbies.forEach((lobby) => {
    if (lobby.lobbyIdentifier == lobbyId && !lobby.ended && !lobby.counting) {
      lobby.counting = true;
      lobby.cont = lobby.settings.roundDuration;
      lobby.cont++;
      timer = setInterval(() => {
        lobby.cont--;
        socketIO.to(lobbyId).emit("counter_down", {
          counter: lobby.cont,
        });

        let correct = 0;
        lobby.members.forEach((member) => {
          if (member.lastAnswerCorrect) {
            correct++;
          }
        });

        if (
          lobby.cont <= 0 ||
          correct == lobby.members.length - 1 ||
          (correct == 1 && lobby.gamemode == "fast")
        ) {
          if (lobby.actualRound < lobby.rounds) {
            lobby.actualRound++;
            lobby.ind_drawer++;

            if (lobby.actualRound == lobby.members.length * lobby.actualTurn) {
              lobby.actualTurn++;
              lobby.ind_drawer = 0;
            }
          }

          if (lobby.actualRound == lobby.rounds) {
            lobby.ended = true;
            socketIO.to(lobbyId).emit("game_ended");
          } else if (
            lobby.actualRound ==
            lobby.rounds / lobby.settings.amountOfTurns
          ) {
            socketIO
              .to(lobbyId)
              .emit("turn_ended", { turnIndex: lobby.actualTurn });
          }

          let motivo = lobby.cont == 0 ? "time" : "perfect";
          socketIO
            .to(lobbyId)
            .emit("round_ended", {
              roundIndex: lobby.actualRound,
              motivo: motivo,
              gamemode: lobby.gamemode,
            });

          clearInterval(timer);
        }
      }, 1000);
      lobby.counting = false;
    }
  });
}

function acabarRonda(lobbyId) {
  lobbies.forEach((lobby) => {
    if (lobby.lobbyIdentifier == lobbyId) {
      if (!lobby.ended) {
        lobby.members.forEach((member) => {
          member.lastAnswerCorrect = false;
          member.lastAnswer = "";
        });

        lobby.boardData = {
          arrayDatos: [],
          limpiar: true,
          cambioDeRonda: true,
        };

        sendBoardData(lobbyId);
        sendUserList(lobbyId);
        setCounter(lobbyId);
      }
    }
  });
}

function joinLobby(socket, lobbyIdentifier, username) {
  var disponible = false;
  lobbies.forEach((lobby) => {
    if (lobby.lobbyIdentifier == lobbyIdentifier) {
      disponible = true;
      lobby.members.forEach((member) => {
        if (member.username == username || lobby.ownerId == socket.data.id) {
          disponible = false;
        }
      });

      if (disponible) {
        lobby.members.push({
          idUser: socket.data.id,
          username: username,
          lastAnswerCorrect: false,
          lastAnswer: "",
          points: 0,
          avatar: "",
        });

        socketIO.to(socket.id).emit("lobby_info", lobby);
      } else {
        socketIO.to(socket.id).emit("USER_ALR_CHOSEN_ERROR");
      }
    }
  });

  if (disponible) {
    socket.join(lobbyIdentifier);
    socket.data.current_lobby = lobbyIdentifier;

    sendUserList(lobbyIdentifier);
  }
}

function leaveLobby(socket) {
  lobbies.forEach((lobby, ind_lobby) => {
    if (lobby.lobbyIdentifier == socket.data.current_lobby) {
      lobby.members.forEach((member, index) => {
        if (member.idUser == socket.data.id) {
          lobby.members.splice(index, 1);
        }
      });
    }
  });

  socket.leave(socket.data.current_lobby);
  socket.data.current_lobby = null;
  socketIO.to(socket.id).emit("YOU_LEFT_LOBBY");
}
function deleteLobby(socket) {
  lobbies.forEach((lobby, ind_lobby) => {
    if (lobby.lobbyIdentifier == socket.data.current_lobby) {
      lobbies.splice(ind_lobby, 1);
      socketIO.to(lobby.lobbyIdentifier).emit("lobby_deleted", {
        message: "Lobby has been deleted by the owner",
      });
    }
  });

  socket.leave(socket.data.current_lobby);
  socket.data.current_lobby = null;
}

async function setLobbyWord(room, amount) {
  let words;
  let category = [];

  lobbies.forEach((lobby) => {
    if (lobby.lobbyIdentifier == room) {
      lobby.started = true;
      category = lobby.categories
    }
  });
  console.log("Pre-axios", category);

  await axios
    .post(laravelRoute + "getWords", {
      category: category,
      amount: amount,
    })
    .then(function (response) {
      words = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
  lobbies.forEach((lobby) => {
    if (lobby.lobbyIdentifier == room) {
      lobby.words = words;
      lobby.started = true;
      socketIO.to(room).emit("started");
      socketIO.to(room).emit("game_data", lobby);
    }
  });
}

function startWordLength(room) {
  let long;
  let timer;
  let time;
  let actualRound;
  let word = "";

  lobbies.forEach((lobby) => {
    if (lobby.lobbyIdentifier == room && lobby.actualRound < lobby.words.length) {
      word = lobby.words[lobby.actualRound].name;
      long = lobby.words[lobby.actualRound].name.length;
      time = lobby.settings.roundDuration;
      actualRound = lobby.actualRound;
    }
  });

  socketIO.to(room).emit("word_length", {
    long: long,
  });

  let timeBetweenLetters = time / (Math.trunc(long / 2) + 1);
  let letters = word.split("");
  let letterPositions = [];
  let letterPosition = 0;
  let contTimer = 0;

  timer = setInterval(() => {
    contTimer++;
    let roundChanged;

    lobbies.forEach((lobby) => {
      if (lobby.lobbyIdentifier == room) {
        roundChanged = lobby.actualRound;
      }
    });

    if (contTimer == timeBetweenLetters) {
      for (i = 0; i < 1; i++) {
        letterPosition = Math.trunc(Math.random() * long);
        if (!letterPositions.some((num) => num == letterPosition)) {
          letterPositions.push(letterPosition);
        } else {
          i--;
        }
      }
      socketIO.to(room).emit("word_letters", {
        letterNode: letters[letterPosition],
        pos: letterPosition,
      });
      contTimer = 0;
    }

    if (actualRound != roundChanged) {
      clearInterval(timer);
      actualRound = roundChanged;
      socketIO.to(room).emit("clear_word");
    }
  }, 1000);
}

function sendUserList(room) {
  var list = [];

  lobbies.forEach((lobby) => {
    if (lobby.lobbyIdentifier == room) {
      lobby.members.forEach((member) => {
        list.push({
          name: member.username,
          lastAnswerCorrect: member.lastAnswerCorrect,
          lastAnswer: member.lastAnswer,
          painting: member.painting,
          points: member.points,
          avatar: member.avatar
        });
      });
    }
  });

  socketIO.to(room).emit("lobby_user_list", {
    list: list,
    message: "user list",
  });
}

async function sendBoardData(room) {
  const sockets = await socketIO.in(room).fetchSockets();

  let boardData;

  lobbies.forEach((lobby) => {
    if (lobby.lobbyIdentifier == room) {
      if (
        lobby.actualRound < lobby.rounds &&
        lobby.ind_drawer < lobby.members.length
      ) {
        boardData = lobby.boardData;

        sockets.forEach((user) => {
          if (user.data.id != lobby.members[lobby.ind_drawer].idUser) {
            socketIO.to(user.id).emit("new_board_data", {
              board: boardData,
            });
          }
        });
      }
    }
  });
}

async function enviarPintor(room) {
  const sockets = await socketIO.in(room).fetchSockets();

  lobbies.forEach((lobby) => {
    if (lobby.lobbyIdentifier == room) {
      lobby.enviandoPintor = true;
      if (
        lobby.actualRound < lobby.rounds &&
        lobby.ind_drawer < lobby.members.length &&
        !lobby.ended
      ) {
        sockets.forEach((user) => {
          if (user.data.id == lobby.members[lobby.ind_drawer].idUser) {
            lobby.currentDrawer = lobby.members[lobby.ind_drawer].username;

            if (
              lobby.actualRound <
              lobby.rounds / lobby.settings.amountOfTurns - 1
            ) {
              lobby.nextDrawer = lobby.members[lobby.ind_drawer + 1].username;
            } else {
              lobby.nextDrawer = null;
            }

            socketIO.to(user.id).emit("pintor", {
              pintor: true,
            });

            socketIO.to(lobby.lobbyIdentifier).emit("drawer_name", {
              name: lobby.currentDrawer,
              next: lobby.nextDrawer,
            });

            lobby.members.forEach((member) => {
              if (member.idUser == user.data.id) {
                member.painting = true;
              }
            });
          } else {
            if (!lobby.settings.ownerPlay) {
              if (user.data.id != lobby.ownerId) {
                socketIO.to(user.id).emit("pintor", {
                  pintor: false,
                });
              } else {
                socketIO.to(user.id).emit("spectator", {
                  spectator: true,
                });
              }

              lobby.members.forEach((member) => {
                if (member.idUser == user.data.id) {
                  member.painting = false;
                }
              });
            } else {
              socketIO.to(user.id).emit("pintor", {
                pintor: false,
              });

              lobby.members.forEach((member) => {
                if (member.idUser == user.data.id) {
                  member.painting = false;
                }
              });
            }
          }
          lobby.enviandoPintor = false;
        });

        socketIO.to(room).emit("round_change");
      } else {
        lobby.ended = true;
      }
    }
  });
}

server.listen(PORT, host, () => {
  console.log("Listening on *:" + PORT);
});
