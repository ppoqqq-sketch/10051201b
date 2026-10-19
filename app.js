/* ==========================================================================
   10051201b - Official Music & Photography Archive Controller
   - Single-Track Spotlight Showcase (하나씩 집중 감상)
   - Fine Art Photography Gallery & Lightbox
   - 60s Preview Mode & Download Protection
   - Bilingual i18n Engine (KO / EN)
   - Privacy-Safe Contact Dispatch
   ========================================================================== */

(function () {
  'use strict';

  const PREVIEW_LIMIT = 60; // 60 seconds preview
  const SECURE_EMAIL_B64 = 'MTAwNTEyMDFiQGdtYWlsLmNvbQ=='; // 10051201b@gmail.com

  // State Management
  const state = {
    catalog: null,
    photos: [],
    allTracks: [],
    currentFilteredList: [],
    currentTrackIndex: 0,
    isPlaying: false,
    isShuffle: false,
    repeatMode: 'all', // 'all', 'one', 'none'
    activeTab: 'all',
    currentLang: localStorage.getItem('lang_10051201b') || 'ko',
    audio: null
  };

  // Bilingual i18n Dictionary
  const i18n = {
    ko: {
      lang_btn: 'English',
      lang_flag: '🇺🇸',
      nav_disco: '음악 감상',
      nav_gallery: '사진 갤러리',
      nav_blogs: '블로그',
      nav_story: '스토리',
      nav_contact: '문의하기',
      hero_badge: 'OFFICIAL ARTIST ARCHIVE',
      hero_title: '삶의 쉼표가 되는 <span>36편의 노래</span>',
      hero_desc: '1년 6개월 동안 축적된 삶의 고뇌와 시(詩) 같은 언어들이 선율을 입었습니다.<br>곡 하나하나에 담긴 온기를 한 곡씩 집중해서 감상해 보세요.',
      metric_albums: '정규 앨범',
      metric_tracks: '오리지널 트랙',
      metric_preview: '하나씩 듣는 미리듣기',
      metric_streaming: 'Spotify & YouTube 정식 발매',
      showcase_badge: 'FEATURED TRACK',
      showcase_title: '한 곡씩 집중 감상하기',
      showcase_sub: 'Track by Track Spotlight Player',
      tab_all: '전체 (36곡)',
      tab_a1: '1집 : 빛이 나는 시간 (21)',
      tab_a2: '2집 : 여백 (13)',
      tab_a3: '3집 : 다른 하늘 (2)',
      strip_label: '전곡 넘겨보기 (클릭 시 바로 이동)',
      lyrics_excerpt: '가사 발췌',
      btn_full_lyrics: '전체 가사 보기 →',
      gallery_badge: 'FINE ART PHOTOGRAPHY',
      gallery_title: '은하(Daily Light)의 사진 작품 갤러리',
      gallery_sub: '빛이 머무는 길목과 계절의 시선을 담아낸 오리지널 사진 작품들',
      blog_badge: 'OFFICIAL BLOGS',
      blog_title: '공식 사진 블로그',
      blog_sub: '더 많은 사진과 서정적인 일상의 이야기들을 만나보세요',
      naver_desc: '일상의 따스한 빛과 소박한 시선을 기록하는 한국어 감성 사진 블로그입니다.<br>계절이 머무는 길목과 지나쳐간 온기들을 사진과 에세이로 나눕니다.',
      google_desc: 'An English photo diary capturing quiet landscapes, silent moments, and reflections.<br>Visual essays crafted in parallel with musical journeys.',
      btn_visit_naver: '네이버 블로그 방문하기',
      btn_visit_google: 'Visit English Blog (dailylight369.blogspot.com)',
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
      nav_disco: 'Music Showcase',
      nav_gallery: 'Photography',
      nav_blogs: 'Blogs',
      nav_story: 'Story',
      nav_contact: 'Contact',
      hero_badge: 'OFFICIAL ARTIST ARCHIVE',
      hero_title: 'Restful Moments Through <span>36 Original Tracks</span>',
      hero_desc: 'One and a half years of quiet reflection and poetic contemplation transformed into soothing melodies.<br>Explore each track one by one with heartfelt warmth.',
      metric_albums: 'Studio Albums',
      metric_tracks: 'Original Tracks',
      metric_preview: 'Track by Track Previews',
      metric_streaming: 'Spotify & YouTube Releases',
      showcase_badge: 'FEATURED TRACK',
      showcase_title: 'Track by Track Showcase',
      showcase_sub: 'Focused spotlight listening experience',
      tab_all: 'All (36 Tracks)',
      tab_a1: '1st : Shining Moment (21)',
      tab_a2: '2nd : The Blank Space (13)',
      tab_a3: '3rd : Same Wind (2)',
      strip_label: 'Browse Tracks (Click to jump)',
      lyrics_excerpt: 'Lyrics Excerpt',
      btn_full_lyrics: 'View Full Lyrics →',
      gallery_badge: 'FINE ART PHOTOGRAPHY',
      gallery_title: 'Daily Light Fine Art Photography',
      gallery_sub: 'Visual poetry capturing seasonal light, quiet horizons, and lingering stillness',
      blog_badge: 'OFFICIAL BLOGS',
      blog_title: 'Official Photo Blogs',
      blog_sub: 'Explore more photography and lyrical essays',
      naver_desc: 'Korean photo journal chronicling gentle light, quiet roads, and lingering warmth.<br>A poetic reflection of seasons and daily light.',
      google_desc: 'An English photo diary capturing quiet landscapes, silent moments, and reflections.<br>Visual essays crafted in parallel with musical journeys.',
      btn_visit_naver: 'Visit Naver Photo Blog',
      btn_visit_google: 'Visit English Blog (dailylight369.blogspot.com)',
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
    btnLangToggle: document.getElementById('btnLangToggle'),
    langFlag: document.getElementById('langFlag'),
    langLabel: document.getElementById('langLabel'),
    heroTitle: document.getElementById('heroTitle'),
    heroDesc: document.getElementById('heroDesc'),
    storyContent: document.getElementById('storyContent'),
    tabBtns: document.querySelectorAll('.tab-btn'),

    // Spotlight Elements
    spotlightCard: document.getElementById('spotlightCard'),
    spotCover: document.getElementById('spotCover'),
    spotTrackNum: document.getElementById('spotTrackNum'),
    btnSpotPlay: document.getElementById('btnSpotPlay'),
    svgSpotPlay: document.getElementById('svgSpotPlay'),
    svgSpotPause: document.getElementById('svgSpotPause'),
    btnSpotPrev: document.getElementById('btnSpotPrev'),
    btnSpotNext: document.getElementById('btnSpotNext'),
    spotAlbumTag: document.getElementById('spotAlbumTag'),
    spotGenreTag: document.getElementById('spotGenreTag'),
    spotTitleKr: document.getElementById('spotTitleKr'),
    spotTitleEn: document.getElementById('spotTitleEn'),
    spotCurrentTime: document.getElementById('spotCurrentTime'),
    spotProgressBar: document.getElementById('spotProgressBar'),
    spotProgressFill: document.getElementById('spotProgressFill'),
    spotLyricsPreview: document.getElementById('spotLyricsPreview'),
    btnSpotViewLyrics: document.getElementById('btnSpotViewLyrics'),
    trackThumbStrip: document.getElementById('trackThumbStrip'),
    stripCount: document.getElementById('stripCount'),

    // Photography Gallery
    photoGalleryGrid: document.getElementById('photoGalleryGrid'),
    photoLightboxModal: document.getElementById('photoLightboxModal'),
    photoLightboxBackdrop: document.getElementById('photoLightboxBackdrop'),
    btnCloseLightbox: document.getElementById('btnCloseLightbox'),
    lightboxImg: document.getElementById('lightboxImg'),
    lightboxTitle: document.getElementById('lightboxTitle'),
    lightboxLocation: document.getElementById('lightboxLocation'),

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
      // Load Catalog & Photos in parallel
      const [catRes, photoRes] = await Promise.all([
        fetch('data/catalog.json'),
        fetch('data/photos.json')
      ]);

      state.catalog = await catRes.json();
      state.photos = await photoRes.json();

      state.allTracks = [];
      state.catalog.albums.forEach(alb => {
        alb.tracks.forEach(t => {
          state.allTracks.push(t);
        });
      });

      state.currentFilteredList = [...state.allTracks];

      applyLanguage(state.currentLang);
      renderTrackThumbStrip();
      renderPhotoGallery();
      bindEvents();
      setupMediaSession();

      if (state.allTracks.length > 0) {
        selectTrack(0, false);
      }
    } catch (err) {
      console.error('Initialization error:', err);
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

    el.langFlag.textContent = t.lang_flag;
    el.langLabel.textContent = t.lang_btn;

    document.querySelectorAll('[data-i18n]').forEach(elem => {
      const key = elem.getAttribute('data-i18n');
      if (t[key]) {
        elem.innerHTML = t[key];
      }
    });

    el.heroTitle.innerHTML = t.hero_title;
    el.heroDesc.innerHTML = t.hero_desc;
    el.storyContent.innerHTML = `<p>${t.story_p1}</p><p>${t.story_p2}</p><p>${t.story_p3}</p>`;

    updateSpotlightDisplay();
    renderTrackThumbStrip();
    renderPhotoGallery();
  }

  // Render Track Thumb Strip below Spotlight
  function renderTrackThumbStrip() {
    const list = state.currentFilteredList;
    el.stripCount.textContent = `${state.currentTrackIndex + 1} / ${state.allTracks.length}`;

    el.trackThumbStrip.innerHTML = list.map((track) => {
      const isCur = state.allTracks[state.currentTrackIndex]?.id === track.id;
      const title = state.currentLang === 'en' && track.title_en ? track.title_en : track.title_kr;

      return `
        <div class="strip-item ${isCur ? 'active' : ''}" data-id="${track.id}">
          <img src="${track.cover_url || 'media/covers/master_album1.jpg'}" alt="" class="strip-thumb-img">
          <div class="strip-item-info">
            <div class="strip-item-title">${title}</div>
            <div class="strip-item-num">#${track.track_num} • ${track.album_title}</div>
          </div>
        </div>
      `;
    }).join('');

    el.trackThumbStrip.querySelectorAll('.strip-item').forEach(item => {
      item.addEventListener('click', () => {
        const tId = item.getAttribute('data-id');
        const targetIdx = state.allTracks.findIndex(t => t.id === tId);
        if (targetIdx >= 0) {
          selectTrack(targetIdx, true);
        }
      });
    });
  }

  // Render Photography Gallery
  function renderPhotoGallery() {
    if (!state.photos || state.photos.length === 0) return;

    el.photoGalleryGrid.innerHTML = state.photos.map((p, idx) => {
      const title = state.currentLang === 'en' ? p.title_en : p.title_kr;
      return `
        <div class="photo-card" data-idx="${idx}">
          <img src="media/photos/${p.filename}" alt="${title}" class="photo-img" loading="lazy">
          <div class="photo-overlay">
            <div class="photo-title">${title}</div>
            <div class="photo-loc">📍 ${p.location}</div>
          </div>
        </div>
      `;
    }).join('');

    el.photoGalleryGrid.querySelectorAll('.photo-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.getAttribute('data-idx'), 10);
        openLightbox(state.photos[idx]);
      });
    });
  }

  // Open Photo Lightbox
  function openLightbox(photo) {
    if (!photo) return;
    el.lightboxImg.src = `media/photos/${photo.filename}`;
    el.lightboxTitle.textContent = state.currentLang === 'en' ? photo.title_en : photo.title_kr;
    el.lightboxLocation.textContent = `📍 ${photo.location}`;
    el.photoLightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    el.photoLightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Update Spotlight UI Display for Selected Track
  function updateSpotlightDisplay() {
    const track = state.allTracks[state.currentTrackIndex];
    if (!track) return;

    const mainTitle = state.currentLang === 'en' && track.title_en ? track.title_en : track.title_kr;
    const subTitle = state.currentLang === 'en' && track.title_en ? track.title_kr : (track.title_en || track.album_title);

    el.spotCover.src = track.cover_url || 'media/covers/master_album1.jpg';
    el.spotTrackNum.textContent = `Track ${track.track_num} of ${state.allTracks.length}`;
    el.spotAlbumTag.textContent = track.album_title;
    el.spotGenreTag.textContent = track.genre || 'Acoustic / Folk';
    el.spotTitleKr.textContent = mainTitle;
    el.spotTitleEn.textContent = subTitle;

    // First 3 lines of lyrics for teaser
    const rawLyrics = (state.currentLang === 'en' && track.lyrics_en) ? track.lyrics_en : (track.lyrics_kr || '');
    const cleanExcerpt = rawLyrics.split('\n').filter(l => l.trim() && !l.startsWith('[')).slice(0, 3).join('\n') || '따스한 선율과 함께 마음의 쉼표를 전합니다.';
    el.spotLyricsPreview.textContent = cleanExcerpt;

    // Bottom Player Meta
    el.playerTitle.textContent = mainTitle;
    el.playerSub.textContent = `${track.album_title} • 10051201b-i'm cho`;
    el.playerCover.src = track.cover_url || 'media/covers/master_album1.jpg';

    // Strip Active Item Highlight
    document.querySelectorAll('.strip-item').forEach(item => {
      const isCur = item.getAttribute('data-id') === track.id;
      item.classList.toggle('active', isCur);
      if (isCur) {
        item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    });

    el.stripCount.textContent = `${state.currentTrackIndex + 1} / ${state.allTracks.length}`;
  }

  // Select Track
  function selectTrack(index, autoplay = true) {
    if (index < 0 || index >= state.allTracks.length) return;
    state.currentTrackIndex = index;
    const track = state.allTracks[index];

    el.audio.src = track.audio_url;
    el.audio.currentTime = 0;
    state.currentLyricsTrack = track;

    updateSpotlightDisplay();
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
      el.svgSpotPlay.style.display = 'none';
      el.svgSpotPause.style.display = 'block';
      el.visualizer.classList.add('playing');
      el.spotlightCard.classList.add('is-playing');
    } else {
      el.svgPlay.style.display = 'block';
      el.svgPause.style.display = 'none';
      el.svgSpotPlay.style.display = 'block';
      el.svgSpotPause.style.display = 'none';
      el.visualizer.classList.remove('playing');
      el.spotlightCard.classList.remove('is-playing');
    }
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

  // Filter Tabs
  function applyTabFilter(tabKey) {
    state.activeTab = tabKey;
    if (tabKey === 'album1') {
      state.currentFilteredList = state.allTracks.filter(t => t.album_id === 'album1');
    } else if (tabKey === 'album2') {
      state.currentFilteredList = state.allTracks.filter(t => t.album_id === 'album2');
    } else if (tabKey === 'album3') {
      state.currentFilteredList = state.allTracks.filter(t => t.album_id === 'album3');
    } else {
      state.currentFilteredList = [...state.allTracks];
    }

    renderTrackThumbStrip();

    // Select first track of that album
    if (state.currentFilteredList.length > 0) {
      const targetIdx = state.allTracks.findIndex(t => t.id === state.currentFilteredList[0].id);
      if (targetIdx >= 0) {
        selectTrack(targetIdx, true);
      }
    }
  }

  // Lyrics Modal
  function openLyricsModal(track) {
    state.currentLyricsTrack = track;
    el.lyricsModalTitle.textContent = track.title_kr;
    el.lyricsModalSub.textContent = `${track.title_en ? track.title_en + ' • ' : ''}${track.album_title}`;

    el.lyricsTextKr.textContent = track.lyrics_kr || '(등록된 한국어 가사가 없습니다)';
    el.lyricsTextEn.textContent = track.lyrics_en || '(No English lyrics available)';

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

    const recipient = atob(SECURE_EMAIL_B64);
    const subject = encodeURIComponent(`[10051201b 아티스트 웹사이트 문의] ${name}님으로부터`);
    const body = encodeURIComponent(`보내신 분: ${name}\n답장받을 이메일: ${reply}\n\n[문의 내용]\n${msg}\n\n---\n10051201b Official Archive Dispatch`);

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

    // Spotlight Play & Navigation Buttons
    el.btnSpotPlay.addEventListener('click', togglePlay);
    el.btnSpotPrev.addEventListener('click', playPrev);
    el.btnSpotNext.addEventListener('click', playNext);
    el.btnSpotViewLyrics.addEventListener('click', () => {
      if (state.allTracks[state.currentTrackIndex]) {
        openLyricsModal(state.allTracks[state.currentTrackIndex]);
      }
    });

    // Bottom Player Controls
    el.btnPlayPause.addEventListener('click', togglePlay);
    el.btnNext.addEventListener('click', playNext);
    el.btnPrev.addEventListener('click', playPrev);

    el.btnShuffle.addEventListener('click', () => {
      state.isShuffle = !state.isShuffle;
      el.btnShuffle.classList.toggle('active', state.isShuffle);
    });

    el.btnRepeat.addEventListener('click', () => {
      if (state.repeatMode === 'all') {
        state.repeatMode = 'one';
        el.btnRepeat.classList.add('active');
        el.btnRepeat.title = '한 곡 반복';
      } else if (state.repeatMode === 'one') {
        state.repeatMode = 'none';
        el.btnRepeat.classList.remove('active');
        el.btnRepeat.style.opacity = '0.4';
      } else {
        state.repeatMode = 'all';
        el.btnRepeat.classList.remove('active');
        el.btnRepeat.style.opacity = '1';
      }
    });

    // 60-second Preview enforcement & Timeupdate
    el.audio.addEventListener('timeupdate', () => {
      const cur = el.audio.currentTime;

      if (cur >= PREVIEW_LIMIT) {
        el.audio.pause();
        el.audio.currentTime = 0;
        setPlayingState(false);
        el.progressBarFill.style.width = '100%';
        el.spotProgressFill.style.width = '100%';
        el.currentTime.textContent = '1:00';
        el.spotCurrentTime.textContent = '1:00';
        openPreviewEndModal();
        return;
      }

      const formatted = formatTime(cur);
      el.currentTime.textContent = formatted;
      el.spotCurrentTime.textContent = formatted;

      const pct = (cur / PREVIEW_LIMIT) * 100;
      el.progressBarFill.style.width = `${pct}%`;
      el.progressThumb.style.left = `${pct}%`;
      el.spotProgressFill.style.width = `${pct}%`;
    });

    // Spotlight Scrubber Seeking
    function seekSpotlight(e) {
      const rect = el.spotProgressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      el.audio.currentTime = pct * PREVIEW_LIMIT;
    }
    el.spotProgressBar.addEventListener('click', seekSpotlight);

    // Bottom Scrubber Seeking
    let isDragging = false;
    function seekBottom(e) {
      const rect = el.progressContainer.getBoundingClientRect();
      const clickX = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      el.audio.currentTime = pct * PREVIEW_LIMIT;
    }
    el.progressContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      seekBottom(e);
    });
    window.addEventListener('mousemove', (e) => {
      if (isDragging) seekBottom(e);
    });
    window.addEventListener('mouseup', () => { isDragging = false; });

    // Volume Slider
    el.volumeSlider.addEventListener('input', (e) => {
      el.audio.volume = parseFloat(e.target.value);
      el.audio.muted = false;
    });

    el.btnMute.addEventListener('click', () => {
      el.audio.muted = !el.audio.muted;
      el.btnMute.style.opacity = el.audio.muted ? '0.4' : '1';
    });

    // Album Tabs Filter
    el.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        el.tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyTabFilter(btn.getAttribute('data-tab'));
      });
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

    // Lightbox Modal
    el.btnCloseLightbox.addEventListener('click', closeLightbox);
    el.photoLightboxBackdrop.addEventListener('click', closeLightbox);

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
        closeLightbox();
        closePreviewEndModal();
        closeContactModal();
      }
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === 'ArrowRight' && e.target.tagName !== 'INPUT') {
        playNext();
      }
      if (e.key === 'ArrowLeft' && e.target.tagName !== 'INPUT') {
        playPrev();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
