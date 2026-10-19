/* ==========================================================================
   10051201b - Official Music Player & Web App Controller
   Upgraded with 36 Tracks, Preview Mode (60s), Bilingual i18n, & Safe Contact
   ========================================================================== */

(function () {
  'use strict';

  const PREVIEW_LIMIT = 60; // 60 seconds preview

  // Obfuscated email (10051201b@gmail.com in base64 to prevent scraping bots)
  const SECURE_EMAIL_B64 = 'MTAwNTEyMDFiQGdtYWlsLmNvbQ==';

  // State Management
  const state = {
    catalog: null,
    allTracks: [],
    filteredTracks: [],
    currentTrackIndex: -1,
    isPlaying: false,
    isShuffle: false,
    repeatMode: 'all', // 'all', 'one', 'none'
    activeTab: 'all',
    searchQuery: '',
    currentLyricsTrack: null,
    currentLang: localStorage.getItem('lang_10051201b') || 'ko', // 'ko' or 'en'
    audio: null
  };

  // Bilingual i18n Dictionary
  const i18n = {
    ko: {
      lang_btn: 'English',
      lang_flag: '🇺🇸',
      nav_disco: '디스코그래피',
      nav_blogs: '사진 블로그',
      nav_story: '스토리',
      nav_contact: '문의하기',
      hero_badge: 'OFFICIAL ARTIST ARCHIVE',
      hero_title: '삶의 쉼표가 되는 <span>36편의 노래</span>',
      hero_desc: '1년 6개월 동안 축적된 삶의 고뇌와 시(詩) 같은 언어들이 선율을 입었습니다.<br>자극과 소음으로 지친 하루 끝, 언제든 찾아와 편안히 머물다 가실 수 있는 따뜻한 쉼터입니다.',
      btn_play_all: '전곡 미리듣기',
      btn_shuffle_all: '랜덤 재생',
      metric_albums: '정규 앨범',
      metric_tracks: '오리지널 트랙',
      metric_preview: '60초 미리듣기 지원',
      metric_streaming: 'Spotify & YouTube 정식 발매',
      disco_title: '디스코그래피',
      disco_sub: 'Discography & Tracklist',
      tab_all: '전체 (36곡)',
      tab_a1: '1집 : 빛이 나는 시간 (21곡)',
      tab_a2: '2집 : 여백 (13곡)',
      tab_a3: '3집 : 다른 하늘, 같은 바람 (2곡)',
      search_placeholder: '곡 제목, 가사, 장르 검색 (예: 박하사탕, 포크, 쉼터)...',
      search_total_prefix: '총 ',
      search_total_suffix: '곡',
      search_empty_title: '일치하는 곡을 찾을 수 없습니다',
      search_empty_sub: '다른 검색어를 입력하시거나 탭을 변경해 보세요.',
      preview_notice: '홈페이지에서는 60초 미리듣기가 제공되며, 전곡 고음질 감상은 Spotify 및 YouTube에서 즐기실 수 있습니다.',
      card_lyrics_btn: '가사 보기',
      blog_badge: 'PHOTO ARCHIVE',
      blog_title: '사진 블로그 & 에세이',
      blog_sub: '순간의 빛과 시선을 담아내는 아티스트의 사진 공간',
      naver_desc: '일상의 따스한 빛과 소박한 시선을 기록하는 한국어 감성 사진 블로그입니다.<br>계절이 머무는 길목과 지나쳐간 온기들을 사진으로 나눕니다.',
      google_desc: 'An English photo diary capturing quiet landscapes, silent moments, and reflections.<br>Visual essays crafted in parallel with musical journeys.',
      btn_visit_naver: '네이버 블로그 방문하기',
      btn_visit_google: 'Visit English Blog',
      story_badge: 'CREATIVE STORY',
      story_title: '"1년 6개월의 시간이 음악이 되기까지"',
      story_p1: '처음부터 음원을 발매하겠다고 마음먹고 시작한 작업은 아니었습니다.<br>각자의 자리에서 삶을 버텨내며 적어 내려갔던 1년 6개월간의 고뇌와 관찰, 사람의 온기를 담은 글귀들이 차곡차곡 쌓여 있었습니다.',
      story_p2: '시끄럽고 자극적인 소리들로 넘쳐나는 세상 속에서, 언제 틀어도 귀가 피곤하지 않고 마음 한구석에 가만히 온기를 지펴줄 수 있는 노래가 절실했습니다.',
      story_p3: '<strong>"내가 평생 곁에 두고 듣고 싶은 음악"</strong>을 향한 집념이 결국 36편의 오리지널 앨범으로 피어났고, 오늘날 전 세계 리스너들과 나누는 쉼터가 되었습니다.<br>잠시 쉬어가세요. 당신의 모든 시간은 그 자체로 빛이 납니다.',
      story_sig: 'Total Producer & Creator',
      footer_contact: 'Contact (문의)',
      btn_lyrics: '가사',
      pend_title: '1분 미리듣기가 완료되었습니다',
      pend_desc: '이 곡의 전곡 고음질 감상 및 스트리밍은 전 세계 공식 플랫폼에서 무료로 즐기실 수 있습니다.',
      btn_close: '닫기',
      contact_title: '아티스트에게 메시지 보내기',
      contact_sub: 'Direct Message to 10051201b-i'm cho',
      contact_notice: '스팸 수집 방지를 위해 이메일 주소를 직접 노출하지 않고 안전하게 메시지를 전달합니다.',
      f_name: '보내시는 분 성함 / 닉네임',
      f_reply: '답장받으실 연락처 (이메일)',
      f_msg: '메시지 내용',
      btn_send_msg: '메시지 전송하기',
      msg_sent: '이메일 클라이언트가 안전하게 연결되었습니다!',
      msg_sent_sub: '작성하신 내용이 아티스트 전용 메일로 안전하게 발송됩니다.'
    },
    en: {
      lang_btn: '한국어',
      lang_flag: '🇰🇷',
      nav_disco: 'Discography',
      nav_blogs: 'Photo Blogs',
      nav_story: 'Story',
      nav_contact: 'Contact',
      hero_badge: 'OFFICIAL ARTIST ARCHIVE',
      hero_title: 'Restful Moments Through <span>36 Original Tracks</span>',
      hero_desc: 'One and a half years of quiet reflection and poetic contemplation transformed into soothing melodies.<br>A warm musical sanctuary to rest your soul after exhausting days in a noisy world.',
      btn_play_all: 'Preview All',
      btn_shuffle_all: 'Shuffle Play',
      metric_albums: 'Studio Albums',
      metric_tracks: 'Original Tracks',
      metric_preview: '60s Previews',
      metric_streaming: 'Spotify & YouTube Releases',
      disco_title: 'Discography',
      disco_sub: 'Discography & Tracklist',
      tab_all: 'All (36 Tracks)',
      tab_a1: '1st : Shining Moment (21)',
      tab_a2: '2nd : The Blank Space (13)',
      tab_a3: '3rd : Same Wind, Different Skies (2)',
      search_placeholder: 'Search title, lyrics, genre (e.g. Candy, Folk, Rest)...',
      search_total_prefix: 'Total ',
      search_total_suffix: ' tracks',
      search_empty_title: 'No matching tracks found',
      search_empty_sub: 'Please try another search keyword or switch tabs.',
      preview_notice: 'Website plays 60-second previews. Enjoy full lossless tracks on Spotify and YouTube.',
      card_lyrics_btn: 'View Lyrics',
      blog_badge: 'PHOTO ARCHIVE',
      blog_title: 'Photo Blogs & Essays',
      blog_sub: 'Visual diaries capturing quiet light, seasonal horizons, and heartfelt moments',
      naver_desc: 'Korean photo journal chronicling gentle light, quiet roads, and lingering warmth.<br>A poetic reflection of seasons and daily light.',
      google_desc: 'An English photo diary capturing quiet landscapes, silent moments, and reflections.<br>Visual essays crafted in parallel with musical journeys.',
      btn_visit_naver: 'Visit Naver Photo Blog',
      btn_visit_google: 'Visit English Blogger',
      story_badge: 'CREATIVE STORY',
      story_title: '"How 1.5 Years of Solitude Became Music"',
      story_p1: 'This journey did not begin with commercial ambitions.<br>It started as an accumulated chronicle of solitary thoughts, observation of people, and human warmth written over 18 quiet months.',
      story_p2: 'In an era overwhelmed by high-stimulus, fatigue-inducing noise, we yearned for songs that never wear out the ears, gently rekindling warmth in quiet corners of the heart.',
      story_p3: '<strong>"Music I want to keep beside me for a lifetime."</strong><br>That single conviction bloomed into 36 original recordings, now shared as a sanctuary for listeners worldwide.<br>Rest here a while. Every moment of yours shines with purpose.',
      story_sig: 'Total Producer & Creator',
      footer_contact: 'Contact Artist',
      btn_lyrics: 'Lyrics',
      pend_title: '60-Second Preview Completed',
      pend_desc: 'Listen to the full lossless track for free on global official streaming platforms.',
      btn_close: 'Close',
      contact_title: 'Send a Message to Artist',
      contact_sub: 'Direct Message to 10051201b-i'm cho',
      contact_notice: 'Email is cryptographically protected to prevent scraper bots while routing your note directly.',
      f_name: 'Your Name / Nickname',
      f_reply: 'Reply Email Address',
      f_msg: 'Message Content',
      btn_send_msg: 'Dispatch Message',
      msg_sent: 'Email Dispatch Initialized!',
      msg_sent_sub: 'Your message has been securely pre-filled and routed to the artist.'
    }
  };

  // DOM Elements
  const el = {
    audio: document.getElementById('audioElement'),
    tracksGrid: document.getElementById('tracksGrid'),
    searchCount: document.getElementById('searchResultCount'),
    searchInput: document.getElementById('trackSearchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    tabBtns: document.querySelectorAll('.tab-btn'),
    btnPlayAll: document.getElementById('btnPlayAll'),
    btnShuffleAll: document.getElementById('btnShuffleAll'),
    btnLangToggle: document.getElementById('btnLangToggle'),
    langFlag: document.getElementById('langFlag'),
    langLabel: document.getElementById('langLabel'),
    heroTitle: document.getElementById('heroTitle'),
    heroDesc: document.getElementById('heroDesc'),
    storyContent: document.getElementById('storyContent'),

    // Bottom Player
    playerCover: document.getElementById('playerCover'),
    playerTitle: document.getElementById('playerTitle'),
    playerSub: document.getElementById('playerSub'),
    btnPlayPause: document.getElementById('btnPlayPause'),
    svgPlay: document.getElementById('svgPlay'),
    svgPause: document.getElementById('svgPause'),
    btnPrev: document.getElementById('btnPrev'),
    btnNext: document.getElementById('btnNext'),
    btnShuffle: document.getElementById('btnShuffle'),
    btnRepeat: document.getElementById('btnRepeat'),
    currentTime: document.getElementById('currentTime'),
    totalDuration: document.getElementById('totalDuration'),
    progressContainer: document.getElementById('progressContainer'),
    progressBarFill: document.getElementById('progressBarFill'),
    progressThumb: document.getElementById('progressThumb'),
    volumeSlider: document.getElementById('volumeSlider'),
    btnMute: document.getElementById('btnMute'),
    visualizer: document.getElementById('visualizer'),
    btnOpenLyrics: document.getElementById('btnOpenLyrics'),

    // Lyrics Modal
    lyricsModal: document.getElementById('lyricsModal'),
    lyricsBackdrop: document.getElementById('lyricsBackdrop'),
    btnCloseLyrics: document.getElementById('btnCloseLyrics'),
    lyricsModalTitle: document.getElementById('lyricsModalTitle'),
    lyricsModalSub: document.getElementById('lyricsModalSub'),
    lyricsTextKr: document.getElementById('lyricsTextKr'),
    lyricsTextEn: document.getElementById('lyricsTextEn'),
    btnTabKr: document.getElementById('btnTabKr'),
    btnTabEn: document.getElementById('btnTabEn'),

    // Preview End Modal
    previewEndModal: document.getElementById('previewEndModal'),
    previewEndBackdrop: document.getElementById('previewEndBackdrop'),
    btnClosePreviewModal: document.getElementById('btnClosePreviewModal'),

    // Contact Modal
    contactModal: document.getElementById('contactModal'),
    contactBackdrop: document.getElementById('contactBackdrop'),
    btnCloseContact: document.getElementById('btnCloseContact'),
    btnOpenContact: document.getElementById('btnOpenContact'),
    btnFooterContact: document.getElementById('btnFooterContact'),
    contactForm: document.getElementById('contactForm'),
    contactName: document.getElementById('contactName'),
    contactReply: document.getElementById('contactReply'),
    contactMsg: document.getElementById('contactMsg'),
    contactSuccessMsg: document.getElementById('contactSuccessMsg')
  };

  state.audio = el.audio;

  // Initialize App
  async function init() {
    try {
      const response = await fetch('data/catalog.json');
      state.catalog = await response.json();

      state.allTracks = [];
      state.catalog.albums.forEach(alb => {
        alb.tracks.forEach(t => {
          state.allTracks.push(t);
        });
      });

      state.filteredTracks = [...state.allTracks];

      applyLanguage(state.currentLang);
      renderTracks();
      bindEvents();
      setupMediaSession();

      if (state.allTracks.length > 0) {
        selectTrack(0, false);
      }
    } catch (err) {
      console.error('Failed to load catalog:', err);
      el.tracksGrid.innerHTML = `<div style="text-align:center; padding:40px; color:#ff6b6b;">음원 카탈로그를 불러오지 못했습니다. (${err.message})</div>`;
    }
  }

  // Format Seconds to MM:SS
  function formatTime(sec) {
    if (isNaN(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // Apply Language Toggle
  function applyLanguage(lang) {
    state.currentLang = lang;
    localStorage.setItem('lang_10051201b', lang);
    const t = i18n[lang];

    // Toggle Button
    el.langFlag.textContent = t.lang_flag;
    el.langLabel.textContent = t.lang_btn;

    // Attributes with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(elem => {
      const key = elem.getAttribute('data-i18n');
      if (t[key]) {
        elem.innerHTML = t[key];
      }
    });

    // Special HTML blocks
    el.heroTitle.innerHTML = t.hero_title;
    el.heroDesc.innerHTML = t.hero_desc;
    el.storyContent.innerHTML = `<p>${t.story_p1}</p><p>${t.story_p2}</p><p>${t.story_p3}</p>`;
    el.searchInput.placeholder = t.search_placeholder;

    renderTracks();
  }

  // Render Tracks to Grid
  function renderTracks() {
    const list = state.filteredTracks;
    const t = i18n[state.currentLang];
    el.searchCount.textContent = `${t.search_total_prefix}${list.length}${t.search_total_suffix}`;

    if (list.length === 0) {
      el.tracksGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <div style="font-size: 32px; margin-bottom: 12px;">🔍</div>
          <div style="font-size: 16px; font-weight: 700; color: #fff;">${t.search_empty_title}</div>
          <div style="font-size: 13px; margin-top: 6px;">${t.search_empty_sub}</div>
        </div>
      `;
      return;
    }

    el.tracksGrid.innerHTML = list.map((track) => {
      const isCurrent = state.currentTrackIndex >= 0 && state.allTracks[state.currentTrackIndex]?.id === track.id;
      const isPlayingCurrent = isCurrent && state.isPlaying;

      const mainTitle = state.currentLang === 'en' && track.title_en ? track.title_en : track.title_kr;
      const subTitle = state.currentLang === 'en' && track.title_en ? track.title_kr : (track.title_en || '');

      return `
        <div class="track-card ${isCurrent ? 'is-playing' : ''}" data-id="${track.id}">
          <div class="card-top">
            <span class="card-badge-num">#${track.track_num}</span>
            <img src="${track.cover_url || 'media/covers/master_album1.jpg'}" alt="${track.title_kr}" class="card-cover" loading="lazy">
            <div class="card-play-overlay">
              <div class="overlay-play-btn">
                ${isPlayingCurrent ?
                  `<svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>` :
                  `<svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>`
                }
              </div>
            </div>
          </div>
          <div class="card-info">
            <div class="card-title-kr" title="${mainTitle}">${mainTitle}</div>
            <div class="card-title-en" title="${subTitle}">${subTitle}</div>
            ${track.genre ? `<span class="card-genre">${track.genre}</span>` : ''}
          </div>
          <div class="card-bottom-actions">
            <span class="card-album-tag">${track.album_title}</span>
            <button class="btn-card-lyrics" data-id="${track.id}">${t.card_lyrics_btn}</button>
          </div>
        </div>
      `;
    }).join('');

    // Attach card click handlers
    el.tracksGrid.querySelectorAll('.track-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-card-lyrics')) {
          e.stopPropagation();
          const tId = e.target.getAttribute('data-id');
          openLyricsModalById(tId);
          return;
        }
        const tId = card.getAttribute('data-id');
        const targetIdx = state.allTracks.findIndex(t => t.id === tId);
        if (targetIdx >= 0) {
          if (state.currentTrackIndex === targetIdx) {
            togglePlay();
          } else {
            selectTrack(targetIdx, true);
          }
        }
      });
    });
  }

  // Select and Play Track
  function selectTrack(index, autoplay = true) {
    if (index < 0 || index >= state.allTracks.length) return;
    state.currentTrackIndex = index;
    const track = state.allTracks[index];

    el.audio.src = track.audio_url;
    el.audio.currentTime = 0;

    const displayTitle = state.currentLang === 'en' && track.title_en ? track.title_en : track.title_kr;
    el.playerTitle.textContent = displayTitle;
    el.playerSub.textContent = `${track.album_title} • 10051201b-i'm cho`;
    el.playerCover.src = track.cover_url || 'media/covers/master_album1.jpg';
    state.currentLyricsTrack = track;

    el.totalDuration.textContent = '1:00'; // Fixed 60s preview duration
    updateCardVisuals();
    updateMediaSessionMetadata(track);

    if (autoplay) {
      el.audio.play().then(() => {
        setPlayingState(true);
      }).catch(err => {
        console.warn('Playback prevented:', err);
        setPlayingState(false);
      });
    } else {
      setPlayingState(false);
    }
  }

  function setPlayingState(isPlaying) {
    state.isPlaying = isPlaying;
    if (isPlaying) {
      el.svgPlay.style.display = 'none';
      el.svgPause.style.display = 'block';
      el.visualizer.classList.add('playing');
    } else {
      el.svgPlay.style.display = 'block';
      el.svgPause.style.display = 'none';
      el.visualizer.classList.remove('playing');
    }
    updateCardVisuals();
  }

  function togglePlay() {
    if (!el.audio.src && state.allTracks.length > 0) {
      selectTrack(0, true);
      return;
    }
    if (el.audio.paused) {
      el.audio.play().then(() => setPlayingState(true)).catch(console.warn);
    } else {
      el.audio.pause();
      setPlayingState(false);
    }
  }

  function playNext() {
    if (state.allTracks.length === 0) return;
    if (state.isShuffle) {
      const rand = Math.floor(Math.random() * state.allTracks.length);
      selectTrack(rand, true);
    } else {
      const nextIdx = (state.currentTrackIndex + 1) % state.allTracks.length;
      selectTrack(nextIdx, true);
    }
  }

  function playPrev() {
    if (state.allTracks.length === 0) return;
    if (el.audio.currentTime > 3) {
      el.audio.currentTime = 0;
      return;
    }
    const prevIdx = (state.currentTrackIndex - 1 + state.allTracks.length) % state.allTracks.length;
    selectTrack(prevIdx, true);
  }

  function updateCardVisuals() {
    const curTrack = state.allTracks[state.currentTrackIndex];
    document.querySelectorAll('.track-card').forEach(card => {
      const isCur = curTrack && card.getAttribute('data-id') === curTrack.id;
      if (isCur) {
        card.classList.add('is-playing');
        const overlayBtn = card.querySelector('.overlay-play-btn');
        if (overlayBtn) {
          overlayBtn.innerHTML = state.isPlaying ?
            `<svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>` :
            `<svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>`;
        }
      } else {
        card.classList.remove('is-playing');
        const overlayBtn = card.querySelector('.overlay-play-btn');
        if (overlayBtn) {
          overlayBtn.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>`;
        }
      }
    });
  }

  // Filter & Search Logic
  function applyFilter() {
    let result = state.allTracks;

    // Filter by Tab
    if (state.activeTab === 'album1') {
      result = result.filter(t => t.album_id === 'album1');
    } else if (state.activeTab === 'album2') {
      result = result.filter(t => t.album_id === 'album2');
    } else if (state.activeTab === 'album3') {
      result = result.filter(t => t.album_id === 'album3');
    }

    // Filter by Search Query
    const q = state.searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(t =>
        (t.title_kr && t.title_kr.toLowerCase().includes(q)) ||
        (t.title_en && t.title_en.toLowerCase().includes(q)) ||
        (t.genre && t.genre.toLowerCase().includes(q)) ||
        (t.lyrics_kr && t.lyrics_kr.toLowerCase().includes(q))
      );
    }

    state.filteredTracks = result;
    renderTracks();
  }

  // Lyrics Modal
  function openLyricsModalById(trackId) {
    const track = state.allTracks.find(t => t.id === trackId);
    if (!track) return;
    openLyricsModal(track);
  }

  function openLyricsModal(track) {
    state.currentLyricsTrack = track;
    el.lyricsModalTitle.textContent = track.title_kr;
    el.lyricsModalSub.textContent = `${track.title_en ? track.title_en + ' • ' : ''}${track.album_title}`;

    el.lyricsTextKr.textContent = track.lyrics_kr || '(등록된 한국어 가사가 없습니다)';
    el.lyricsTextEn.textContent = track.lyrics_en || '(No English lyrics available)';

    // Reset to Korean tab
    el.btnTabKr.classList.add('active');
    el.btnTabEn.classList.remove('active');
    el.lyricsTextKr.style.display = 'block';
    el.lyricsTextEn.style.display = 'none';

    el.lyricsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLyricsModal() {
    el.lyricsModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Preview End Modal
  function openPreviewEndModal() {
    el.previewEndModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePreviewEndModal() {
    el.previewEndModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Contact Modal
  function openContactModal() {
    el.contactSuccessMsg.style.display = 'none';
    el.contactForm.style.display = 'flex';
    el.contactModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeContactModal() {
    el.contactModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function handleContactSubmit(e) {
    e.preventDefault();
    const name = el.contactName.value.trim();
    const reply = el.contactReply.value.trim();
    const msg = el.contactMsg.value.trim();

    // Decode safe email
    const recipient = atob(SECURE_EMAIL_B64);
    const subject = encodeURIComponent(`[10051201b 아티스트 웹사이트 문의] ${name}님으로부터`);
    const body = encodeURIComponent(`보내신 분: ${name}\n답장받을 이메일: ${reply}\n\n[문의 내용]\n${msg}\n\n---\n10051201b Official Archive Dispatch`);

    // Safe mailto trigger
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;

    el.contactForm.style.display = 'none';
    el.contactSuccessMsg.style.display = 'block';
  }

  // Media Session API
  function setupMediaSession() {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => togglePlay());
      navigator.mediaSession.setActionHandler('pause', () => togglePlay());
      navigator.mediaSession.setActionHandler('previoustrack', () => playPrev());
      navigator.mediaSession.setActionHandler('nexttrack', () => playNext());
    }
  }

  function updateMediaSessionMetadata(track) {
    if ('mediaSession' in navigator && track) {
      const displayTitle = state.currentLang === 'en' && track.title_en ? track.title_en : track.title_kr;
      navigator.mediaSession.metadata = new MediaMetadata({
        title: displayTitle,
        artist: "10051201b-i'm cho",
        album: track.album_title,
        artwork: [
          { src: track.cover_url || 'media/covers/master_album1.jpg', sizes: '512x512', type: 'image/jpeg' }
        ]
      });
    }
  }

  // Event Listeners
  function bindEvents() {
    // Language Toggle
    el.btnLangToggle.addEventListener('click', () => {
      const nextLang = state.currentLang === 'ko' ? 'en' : 'ko';
      applyLanguage(nextLang);
    });

    // Play / Pause Button
    el.btnPlayPause.addEventListener('click', togglePlay);
    el.btnNext.addEventListener('click', playNext);
    el.btnPrev.addEventListener('click', playPrev);

    // Shuffle
    el.btnShuffle.addEventListener('click', () => {
      state.isShuffle = !state.isShuffle;
      el.btnShuffle.classList.toggle('active', state.isShuffle);
    });

    // Repeat Mode
    el.btnRepeat.addEventListener('click', () => {
      if (state.repeatMode === 'all') {
        state.repeatMode = 'one';
        el.btnRepeat.classList.add('active');
        el.btnRepeat.title = '한 곡 반복';
      } else if (state.repeatMode === 'one') {
        state.repeatMode = 'none';
        el.btnRepeat.classList.remove('active');
        el.btnRepeat.style.opacity = '0.4';
        el.btnRepeat.title = '반복 끄기';
      } else {
        state.repeatMode = 'all';
        el.btnRepeat.classList.remove('active');
        el.btnRepeat.style.opacity = '1';
        el.btnRepeat.title = '전체 반복';
      }
    });

    // 60-second Preview enforcement & Timeupdate
    el.audio.addEventListener('timeupdate', () => {
      const cur = el.audio.currentTime;

      // 60s Preview Check!
      if (cur >= PREVIEW_LIMIT) {
        el.audio.pause();
        el.audio.currentTime = 0;
        setPlayingState(false);
        el.progressBarFill.style.width = '100%';
        el.currentTime.textContent = '1:00';
        openPreviewEndModal();
        return;
      }

      el.currentTime.textContent = formatTime(cur);
      const pct = (cur / PREVIEW_LIMIT) * 100;
      el.progressBarFill.style.width = `${pct}%`;
      el.progressThumb.style.left = `${pct}%`;
    });

    // Progress Bar Seeking (clamped to 60s)
    let isDragging = false;
    function seek(e) {
      const rect = el.progressContainer.getBoundingClientRect();
      const clickX = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
      const width = rect.width;
      let pct = Math.max(0, Math.min(1, clickX / width));
      el.audio.currentTime = pct * PREVIEW_LIMIT;
    }

    el.progressContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      seek(e);
    });
    window.addEventListener('mousemove', (e) => {
      if (isDragging) seek(e);
    });
    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    el.progressContainer.addEventListener('touchstart', (e) => {
      isDragging = true;
      seek(e);
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (isDragging) seek(e);
    }, { passive: true });
    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Volume Slider
    el.volumeSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      el.audio.volume = val;
      el.audio.muted = false;
    });

    // Mute Button
    el.btnMute.addEventListener('click', () => {
      el.audio.muted = !el.audio.muted;
      el.btnMute.style.opacity = el.audio.muted ? '0.4' : '1';
    });

    // Tabs
    el.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        el.tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeTab = btn.getAttribute('data-tab');
        applyFilter();
      });
    });

    // Search Input
    el.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      el.clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
      applyFilter();
    });

    el.clearSearchBtn.addEventListener('click', () => {
      el.searchInput.value = '';
      state.searchQuery = '';
      el.clearSearchBtn.style.display = 'none';
      applyFilter();
    });

    // Hero Action Buttons
    el.btnPlayAll.addEventListener('click', () => {
      state.isShuffle = false;
      el.btnShuffle.classList.remove('active');
      selectTrack(0, true);
    });

    el.btnShuffleAll.addEventListener('click', () => {
      state.isShuffle = true;
      el.btnShuffle.classList.add('active');
      const rand = Math.floor(Math.random() * state.allTracks.length);
      selectTrack(rand, true);
    });

    // Lyrics Modal
    el.btnOpenLyrics.addEventListener('click', () => {
      if (state.currentLyricsTrack) {
        openLyricsModal(state.currentLyricsTrack);
      }
    });

    el.btnCloseLyrics.addEventListener('click', closeLyricsModal);
    el.lyricsBackdrop.addEventListener('click', closeLyricsModal);

    el.btnTabKr.addEventListener('click', () => {
      el.btnTabKr.classList.add('active');
      el.btnTabEn.classList.remove('active');
      el.lyricsTextKr.style.display = 'block';
      el.lyricsTextEn.style.display = 'none';
    });

    el.btnTabEn.addEventListener('click', () => {
      el.btnTabEn.classList.add('active');
      el.btnTabKr.classList.remove('active');
      el.lyricsTextEn.style.display = 'block';
      el.lyricsTextKr.style.display = 'none';
    });

    // Preview End Modal
    el.btnClosePreviewModal.addEventListener('click', closePreviewEndModal);
    el.previewEndBackdrop.addEventListener('click', closePreviewEndModal);

    // Contact Modal
    el.btnOpenContact.addEventListener('click', openContactModal);
    el.btnFooterContact.addEventListener('click', openContactModal);
    el.btnCloseContact.addEventListener('click', closeContactModal);
    el.contactBackdrop.addEventListener('click', closeContactModal);
    el.contactForm.addEventListener('submit', handleContactSubmit);

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeLyricsModal();
        closePreviewEndModal();
        closeContactModal();
      }
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        togglePlay();
      }
    });
  }

  // Start on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
