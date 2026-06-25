(function () {
  function getQueryParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function getRequestedId() {
    var id = parseInt(getQueryParam('id'), 10);
    return isNaN(id) || id < 1 ? 1 : id;
  }

  function navigateTo(id, dir) {
    window.location.href = 'card.html?id=' + id + '&dir=' + dir;
  }

  // Falls back to the first card if the requested id doesn't exist
  function resolveCard(cards, requestedId) {
    var found = cards.find(function (c) { return c.id === requestedId; });
    return found || cards[0];
  }

  function renderCard(cards, card) {
    var id = card.id;

    document.getElementById('traditional').textContent = card.traditional;
    document.getElementById('simplified').textContent = card.simplified;
    document.getElementById('pinyin').textContent = card.pinyin;
    document.getElementById('zhuyin').textContent = card.zhuyin;
    document.getElementById('thai').textContent = card.thai;
    document.getElementById('exampleZh').textContent = card.exampleZh;
    document.getElementById('examplePinyin').textContent = card.examplePinyin;
    document.getElementById('exampleThai').textContent = card.exampleThai;
    document.getElementById('progressCurrent').textContent = id;
    document.getElementById('progressTotal').textContent = cards.length;

    var audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = card.audio ? ('audio/' + card.audio) : '';

    var isFirst = id <= 1;
    var isLast = id >= cards.length;

    var prevBtn = document.getElementById('prevBtn');
    var nextBtn = document.getElementById('nextBtn');
    prevBtn.disabled = isFirst;
    nextBtn.disabled = isLast;
    prevBtn.onclick = function () { if (!isFirst) navigateTo(id - 1, 'prev'); };
    nextBtn.onclick = function () { if (!isLast) navigateTo(id + 1, 'next'); };

    // Entrance animation, direction-aware based on how the user arrived
    var dir = getQueryParam('dir');
    var cardPage = document.querySelector('.card-page');
    if (dir === 'next') cardPage.classList.add('dir-next');
    else if (dir === 'prev') cardPage.classList.add('dir-prev');
    else cardPage.classList.add('dir-in');

    // Swipe navigation (Pointer Events — works for touch and mouse)
    var startX = 0, startY = 0, startTime = 0;
    var SWIPE_MIN_X = 50;
    var SWIPE_MAX_Y = 60;
    var SWIPE_MAX_TIME = 600;

    document.addEventListener('pointerdown', function (e) {
      startX = e.clientX;
      startY = e.clientY;
      startTime = Date.now();
    });

    document.addEventListener('pointerup', function (e) {
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      var dt = Date.now() - startTime;
      if (Math.abs(dx) >= SWIPE_MIN_X && Math.abs(dy) <= SWIPE_MAX_Y && dt <= SWIPE_MAX_TIME) {
        if (dx < 0 && !isLast) navigateTo(id + 1, 'next');
        if (dx > 0 && !isFirst) navigateTo(id - 1, 'prev');
      }
    });

    // Real audio playback + playing feedback, fails safely if audio is missing
    var playBtn = document.getElementById('playBtn');
    var audioLabel = document.getElementById('audioLabel');

    function resetAudioState() {
      playBtn.classList.remove('playing');
      audioLabel.textContent = 'ฟังออกเสียง';
    }

    playBtn.onclick = function () {
      if (!card.audio) return;
      audioPlayer.currentTime = 0;
      var playPromise = audioPlayer.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function (err) {
          console.warn('เล่นเสียงไม่สำเร็จ:', err);
          resetAudioState();
        });
      }
    };
    audioPlayer.addEventListener('play', function () {
      playBtn.classList.add('playing');
      audioLabel.textContent = 'กำลังเล่น...';
    });
    audioPlayer.addEventListener('pause', resetAudioState);
    audioPlayer.addEventListener('ended', resetAudioState);
    audioPlayer.addEventListener('error', resetAudioState);
  }

  fetch('data/cards.json')
    .then(function (res) { return res.json(); })
    .then(function (cards) {
      var card = resolveCard(cards, getRequestedId());
      renderCard(cards, card);
    })
    .catch(function (err) {
      console.error('โหลด cards.json ไม่สำเร็จ:', err);
    });
})();
