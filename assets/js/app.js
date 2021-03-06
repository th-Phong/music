const $$ = document.querySelectorAll.bind(document);
const $ = document.querySelector.bind(document);
const PLAYER_KEY = "user_setting";
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const player = $(".player");
const btnPlay = $(".btn-toggle-play");
const cd = $(".cd");
const progress = $("#progress");
const btnPrev = $(".btn-prev");
const btnRepeat = $(".btn-repeat");
const btnNext = $(".btn-next");
const btnRandom = $(".btn-random");
const playlist = $(".playlist");

const app = {
  isRepeat: false,
  isRandom: false,
  isPlaying: false,
  currentIndex: 0,
  config: JSON.parse(localStorage.getItem(PLAYER_KEY)) || {},
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_KEY, JSON.stringify(this.config));
  },
  songs: [
    {
      name: "Một đêm say",
      singer: "Thịnh Suy",
      path: "./assets/music/motdemsay.mp3",
      image: "./assets/img/motdemsay.jpg",
    },
    {
      name: "Nghe em",
      singer: "Thịnh Suy",
      path: "./assets/music/ngheem.mp3",
      image: "./assets/img/ngheem.jpg",
    },
    {
      name: "Đường tôi chở em về",
      singer: "buitruonglinh x Freak D",
      path: "./assets/music/duongtoichoemve.mp3",
      image: "./assets/img/duongtoichoemve.jpg",
    },
    {
      name: "Lời yêu ngây dại",
      singer: "Kha",
      path: "./assets/music/loiyeungaydai.mp3",
      image: "./assets/img/loiyeungaydai.jpg",
    },
    {
      name: "Em Có Nghe (Freak D Lofi Ver.)",
      singer: "Kha",
      path: "./assets/music/emconghelofi.mp3",
      image: "./assets/img/emconghelofi.jpg",
    },
    {
      name: "Chuyện Rằng (Lofi Ver.)",
      singer: "Thịnh Suy x Freak D",
      path: "./assets/music/chuyenranglofi.mp3",
      image: "./assets/img/chuyenranglofi.jpg",
    },
    {
      name: "Thắc Mắc (MĐX)",
      singer: "Thịnh Suy",
      path: "./assets/music/thacmac.mp3",
      image: "./assets/img/thacmac.jpg",
    },
    {
      name: "Giá như",
      singer: "Chillies",
      path: "./assets/music/gianhu.mp3",
      image: "./assets/img/gianhu.jpg",
    },
    {
      name: "I will give you everything (C'est si bon OST)",
      singer: "Jung Woo",
      path: "./assets/music/iwillgiveyoueverything.mp3",
      image: "./assets/img/cestsibon.jpg",
    },
    {
      name: "Photograph",
      singer: "Ed Sheeran",
      path: "./assets/music/photograph.mp3",
      image: "./assets/img/photograph.jpg",
    },
    {
      name: "Perfect",
      singer: "Ed Sheeran",
      path: "./assets/music/perfect.mp3",
      image: "./assets/img/perfect.jpg",
    },
    {
      name: "Thinking Out Loud",
      singer: "Ed Sheeran",
      path: "./assets/music/thinkingoutloud.mp3",
      image: "./assets/img/thinkingoutloud.jpg",
    },
    {
      name: "Heartbreak anniversary",
      singer: "Passenger",
      path: "./assets/music/heartbreakanniversary.mp3",
      image: "./assets/img/heartbreak.jpg",
    },
    {
      name: "double take",
      singer: "Dhruv",
      path: "./assets/music/doubletake.mp3",
      image: "./assets/img/doubletake.jpg",
    },
    {
      name: "Loverboy",
      singer: "A-Wall",
      path: "./assets/music/loverboy.mp3",
      image: "./assets/img/loverboy.jpg",
    },
    {
      name: "Comethru",
      singer: "Jeremy Zucker",
      path: "./assets/music/comethru.mp3",
      image: "./assets/img/comethru.jpg",
    },
    {
      name: "Die for you",
      singer: "The Weeknd",
      path: "./assets/music/dieforyou.mp3",
      image: "./assets/img/dieforyou.jpg",
    },
    {
      name: "Let Her Go",
      singer: "Passenger",
      path: "./assets/music/lethergo.mp3",
      image: "./assets/img/lethergo.jpg",
    },
    {
      name: "You Are The Reason",
      singer: "Calum Scott",
      path: "./assets/music/youarethereason.mp3",
      image: "./assets/img/youarethereason.jpg",
    },
  ],
  render: function () {
    const htmls = this.songs.map((item, index) => {
      return `        
        <div data-index="${index}" class="song ${
        index === this.currentIndex ? "active" : ""
      }">
            <div
                class="thumb"
                style="
                background-image: url('${item.image}');
            ">
            </div>
                <div class="body">
                    <h3 class="title">${item.name}</h3>
                    <p class="author">${item.singer}</p>
                </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`;
    });
    playlist.innerHTML = htmls.join("");
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    //xử lý CD quay / dừng
    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000,
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();
    //xử lý phóng to thu nhỏ
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCDwidth = cdWidth - scrollTop;
      cd.style.width = newCDwidth > 0 ? newCDwidth + "px" : 0;
      cd.style.opacity = newCDwidth / cdWidth;
    };
    //xử lý khi play
    btnPlay.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    //xử lý khi nhấn next songs
    btnNext.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      _this.scrollToActiveSong();
      audio.play();
    };
    //xử lý khi nhấn pre songs
    btnPrev.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.preSong();
      }
      _this.scrollToActiveSong();
      audio.play();
    };
    //xử lý khi random
    btnRandom.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      btnRandom.classList.toggle("active", _this.isRandom);
    };
    //xử lý khi repeat
    btnRepeat.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      btnRepeat.classList.toggle("active", _this.isRepeat);
    };
    audio.onplay = function () {
      _this.isPlaying = true;
      cdThumbAnimate.play();
      player.classList.add("playing");
    };
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.value = progressPercent;
      }
    };
    progress.oninput = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        btnNext.click();
      }
    };
    //lắng nghe click hành vi click vào playlist
    playlist.onclick = function (e) {
      let songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          audio.play();
        }
        if (e.target.closest(".option")) {
        }
      }
    };
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (this.currentIndex === newIndex);
    console.log(newIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex > this.songs.length - 1) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  preSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      if (this.currentIndex <= 3) {
        $(".song.active").scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      } else {
        $(".song.active").scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 300);
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  defineProperty: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;

    if ($(".song.active")) {
      $(".song.active").classList.remove("active");
    }
    const list = $$(".song");
    list.forEach((song) => {
      if (Number(song.getAttribute("data-index")) === this.currentIndex) {
        song.classList.add("active");
      }
    });
  },
  start: function () {
    this.loadConfig();
    btnRandom.classList.toggle("active", this.isRandom);
    btnRepeat.classList.toggle("active", this.isRepeat);
    this.defineProperty();
    this.handleEvents();
    this.loadCurrentSong();
    this.render();
  },
};

app.start();
