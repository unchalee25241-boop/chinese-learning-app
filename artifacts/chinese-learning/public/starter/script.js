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

  // Resolves the requested 1-based position to a card + its clamped position.
  // Falls back to the first card if the requested position is out of range.
  function resolveCard(cards, requestedId) {
    var index = requestedId - 1;
    if (index < 0 || index >= cards.length) index = 0;
    return { card: cards[index], position: index + 1 };
  }

  function renderCard(cards, card, position) {
    document.getElementById('traditional').textContent = card.traditional;
    document.getElementById('simplified').textContent = card.simplified;
    document.getElementById('pinyin').textContent = card.pinyin;
    document.getElementById('zhuyin').textContent = card.zhuyin;
    document.getElementById('thai').textContent = card.thai;
    document.getElementById('exampleZh').textContent = card.exampleZh;
    document.getElementById('examplePinyin').textContent = card.examplePinyin;
    document.getElementById('exampleThai').textContent = card.exampleThai;
    document.getElementById('progressCurrent').textContent = card.id;
    document.getElementById('progressTotal').textContent = cards.length;

    // Audio files are generated per-card as "<id>_word.mp3" and "<id>_sentence.mp3"
    // (see audio-manifest.json). The word audio is used here for the main play button.
    var audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = 'audio/' + card.id + '_word.mp3';

    var playBtn = document.getElementById('playBtn');
    playBtn.classList.toggle('audio-unavailable', false);

    // All navigation math uses the numeric deck position, never card.id
    // (card.id is a display label like "EC0001" and is not safe to do arithmetic on)
    var isFirst = position <= 1;
    var isLast = position >= cards.length;

    var prevBtn = document.getElementById('prevBtn');
    var nextBtn = document.getElementById('nextBtn');
    prevBtn.disabled = isFirst;
    nextBtn.disabled = isLast;
    prevBtn.onclick = function () { if (!isFirst) navigateTo(position - 1, 'prev'); };
    nextBtn.onclick = function () { if (!isLast) navigateTo(position + 1, 'next'); };

    // Friendly completion state instead of a dead-looking disabled Next button
    if (isLast) {
      document.getElementById('cardNav').hidden = true;
      document.getElementById('completeNav').hidden = false;
      document.getElementById('completeMsg').hidden = false;
    }

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
        if (dx < 0 && !isLast) navigateTo(position + 1, 'next');
        if (dx > 0 && !isFirst) navigateTo(position - 1, 'prev');
      }
    });

    // Real audio playback + playing feedback, fails safely if audio is missing
    var audioLabel = document.getElementById('audioLabel');

    function resetAudioState() {
      playBtn.classList.remove('playing');
      audioLabel.textContent = 'ฟังออกเสียง';
    }

    playBtn.onclick = function () {
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

  function showLoadError() {
    document.querySelector('.card').hidden = true;
    document.getElementById('cardNav').hidden = true;
    document.getElementById('loadError').hidden = false;
  }

  document.getElementById('retryBtn').onclick = function () {
    window.location.reload();
  };

  fetch('data/cards.json')
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (cards) {
      if (!Array.isArray(cards) || cards.length === 0) throw new Error('cards.json มีข้อมูลว่างเปล่า');
      var resolved = resolveCard(cards, getRequestedId());
      renderCard(cards, resolved.card, resolved.position);
    })
    .catch(function (err) {
      console.error('โหลด cards.json ไม่สำเร็จ:', err);
      showLoadError();
    });
})();
