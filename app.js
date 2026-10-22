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
  const SECURE_EMAIL_B64 = 'bGljZW5zZTAwMTlAZ21haWwuY29t'; // license0019@gmail.com

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
      nav_saatchi: '작품 소장',
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
      blog_badge: 'OFFICIAL CHANNELS & BLOGS',
      blog_title: '공식 사진 블로그 & 갤러리 샵',
      blog_sub: '더 많은 사진과 서정적인 일상의 이야기, 오리지널 작품을 만나보세요',
      naver_desc: '일상의 따스한 빛과 소박한 시선을 기록하는 한국어 감성 사진 블로그입니다.<br>계절이 머무는 길목과 지나쳐간 온기들을 사진과 에세이로 나눕니다.',
      google_desc: 'An English photo diary capturing quiet landscapes, silent moments, and reflections.<br>Visual essays crafted in parallel with musical journeys.',
      saatchi_card_desc: '세계적인 온라인 파인아트 갤러리 Saatchi Art에서 은하(Inje Cho)의 엄선된 오리지널 사진 작품과 고해상도 리미티드 에디션 프린트를 공식 소장하실 수 있습니다.',
      btn_visit_naver: '네이버 블로그 방문하기',
      btn_visit_google: 'Visit English Blog (dailylight369.blogspot.com)',
      btn_visit_saatchi: '사치아트 갤러리 방문하기',
      secret_title: '🔐 [비밀 문서 : 상처를 빛으로 바꾼 시간]',
      secret_sub: "10051201b-i'm cho × AI (Argon 4.0 & Gemini Flash 3.8) Secret Archive",
      story_section_badge: 'CREATIVE STORIES',
      story_section_title: '음악과 사진, 기록의 이야기',
      story_section_sub: "10051201b - i'm cho의 창작 세계와 시선",
      story_m_badge: 'MUSIC STORY 🎵',
      story_title: '"1년 6개월의 시간이 음악이 되기까지"',
      story_p1: '처음부터 음원을 발매하겠다고 마음먹고 시작한 작업은 아니었습니다.<br>각자의 자리에서 삶을 버텨내며 적어 내려갔던 1년 6개월간의 고뇌와 관찰, 사람의 온기를 담은 시(詩) 같은 언어들이 차곡차곡 쌓여 있었습니다.',
      story_p2: '이 소중한 기록들에 선율을 입히기 위해, 저는 가장 현대적인 예술적 파트너십을 선택했습니다.<br>생각의 깊이와 서정적인 노랫말을 다듬어준 인공지능 파트너 <strong>Gemini Flash(제미니 플래시)</strong>와 <strong>Argon(아르곤)</strong>이 기획과 사유의 여정을 함께했고, 감성적인 사운드스케이프를 현실화하는 차세대 작곡 엔진 <strong>SUNO(수노)</strong>를 활용하여 멜로디와 편곡을 직조해 나갔습니다.',
      story_p3: '<strong>"내가 평생 곁에 두고 듣고 싶은 음악, 언제 틀어도 귀가 피로하지 않은 따스한 쉼표."</strong><br>인간의 고유한 감정과 첨단 AI 기술의 정밀한 조화가 빚어낸 36편의 오리지널 앨범이 당신의 모든 순간에 작은 위로와 빛이 되기를 소망합니다.',
      story_sig_music: 'Total Producer (with Gemini Flash · Argon · SUNO)',
      story_p_badge: 'PHOTOGRAPHY STORY 📸',
      photo_story_title: '"빛이 스며드는 순간을 기록합니다"',
      photo_story_p2: '도시의 가장자리에서, 물 위에 흔들리는 반사 속에서, 이른 새벽 조용히 머무는 아침 공기 사이에서 멈추어 서서 셔터를 눌렀습니다.<br>어떤 사진은 치열한 실험으로 남겨졌고, 어떤 작업은 세상과의 연결을 위해 기록되었습니다.<br>끝없는 방황 속에서 렌즈 너머로 마주한 것은, 칠흑 같은 어둠 속에서도 묵묵히 스며드는 작은 빛의 조각들이었습니다.',
      photo_story_p3: '이 사진들은 단순한 풍경이 아닌, 부서진 마음을 부여잡고 가장 아프고 힘겨웠던 시간을 묵묵히 버텨내고 이겨낸 치유의 기록입니다.<br>모든 기록의 중심에는 <strong>‘조용한 순간’</strong>이 머물러 있습니다.<br>어둠을 지나온 이 따스한 빛들이, 지금 저마다의 외로운 계절을 지나고 있을 당신에게도 조용한 위로가 되기를 바랍니다.',
      story_sig_photo: 'Fine Art Photographer',
      footer_contact: 'Contact (문의)',
      btn_lyrics: '가사',
      contact_title: '아티스트에게 메시지 보내기',
      contact_sub: "Direct Message to 10051201b-i'm cho",
      contact_notice: '스팸 수집 방지를 위해 이메일 주소를 직접 노출하지 않고 안전하게 메시지를 전달합니다.',
      f_name: '보내시는 분 성함 / 닉네임',
      f_reply: '답장받으실 연락처 (이메일)',
      f_msg: '메시지 내용',
      btn_send_msg: '메시지 전송하기',
      direct_label: '또는 이메일 직접 복사:',
      btn_copy_email: '📋 이메일 주소 복사하기',
      msg_sent: '이메일 전송 준비가 완료되었습니다!',
      msg_sent_sub: '메일 프로그램이 자동으로 열리지 않는 경우, 아래 웹메일 버튼을 누르시면 작성하신 내용 그대로 전송창이 열립니다.',
      cosmic_badge: '🛸 [DEEP SPACE BEACON // FREQ: 1005-1201]',
      cosmic_title: '은하문명개발단 (Galactic Civilization Dev Corps)',
      cosmic_sub: 'Transmission from Deep Space • Secret Frequency',
      cosmic_wish_placeholder: '소원을 적어 우주로 전송하세요...',
      cosmic_btn_transmit: '소원 전송',
      cosmic_btn_close: '전송문 닫기'
    },
    en: {
      lang_btn: '한국어',
      lang_flag: '🇰🇷',
      nav_disco: 'Music Showcase',
      nav_gallery: 'Photography',
      nav_blogs: 'Blogs',
      nav_story: 'Story',
      nav_contact: 'Contact',
      nav_saatchi: 'Art Shop',
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
      blog_badge: 'OFFICIAL CHANNELS & BLOGS',
      blog_title: 'Official Photo Blogs & Gallery Shop',
      blog_sub: 'Explore curated photography, lyrical essays, and original art collections',
      naver_desc: 'Korean photo journal chronicling gentle light, quiet roads, and lingering warmth.<br>A poetic reflection of seasons and daily light.',
      google_desc: 'An English photo diary capturing quiet landscapes, silent moments, and reflections.<br>Visual essays crafted in parallel with musical journeys.',
      saatchi_card_desc: 'Acquire curated original photography and high-resolution limited edition fine art prints exclusively through the world-renowned Saatchi Art gallery.',
      btn_visit_naver: 'Visit Naver Photo Blog',
      btn_visit_google: 'Visit English Blog (dailylight369.blogspot.com)',
      btn_visit_saatchi: 'Visit Saatchi Art Gallery',
      secret_title: '🔐 [TOP SECRET LORE : Transmuting Ache into Light]',
      secret_sub: "10051201b-i'm cho × AI (Argon 4.0 & Gemini Flash 3.8) Secret Archive",
      story_section_badge: 'CREATIVE STORIES',
      story_section_title: 'Chronicles of Sound & Light',
      story_section_sub: "The creative journey and vision of 10051201b - i'm cho",
      story_m_badge: 'MUSIC STORY 🎵',
      story_title: '"How 1.5 Years of Solitude Became Music"',
      story_p1: 'This journey did not begin with commercial ambitions.<br>It started as an accumulated chronicle of solitary thoughts, observation of people, and human warmth written over 18 quiet months.',
      story_p2: 'To breathe melody into these personal chronicles, I chose a progressive creative partnership between human emotion and artificial intelligence.<br>AI companions <strong>Gemini Flash</strong> and <strong>Argon</strong> journeyed alongside me to refine the philosophical depth, lyrical concepts, and narrative direction, while the cutting-edge musical engine <strong>SUNO</strong> brought the melodies and harmonic arrangements to life.',
      story_p3: '<strong>"Music I want to keep beside me for a lifetime—a gentle pause that never fatigues the ears."</strong><br>Born from the intimate synergy of human contemplation and generative AI craftsmanship, may these 36 original tracks bring a quiet moment of light and comfort to your day.',
      story_sig_music: 'Total Producer (with Gemini Flash · Argon · SUNO)',
      story_p_badge: 'PHOTOGRAPHY STORY 📸',
      photo_story_title: '"Recording Moments Where Light Gently Seeps In"',
      photo_story_p2: 'At the edge of distant cities, in trembling reflections upon quiet waters, and amidst the still dawn air, I paused and pressed the shutter.<br>Some works were captured as raw artistic experiments, while others were preserved to reconnect with the world.<br>What I met through the lens during those solitary wanderings were gentle fragments of light seeping silently through the deepest shadows.',
      photo_story_p3: 'These photographs are not merely landscapes; they are an intimate record of endurance and healing, holding together a shattered heart through the hardest chapter of life.<br>At the center of every frame lies a <strong>\'quiet moment\'</strong>.<br>May the light that carried me through the dark bring gentle solace to anyone currently walking through their own cold season.',
      story_sig_photo: 'Fine Art Photographer',
      footer_contact: 'Contact Artist',
      btn_lyrics: 'Lyrics',
      contact_title: 'Send a Message to Artist',
      contact_sub: "Direct Message to 10051201b-i'm cho",
      contact_notice: 'Email is cryptographically protected to prevent scraper bots while routing your note directly.',
      f_name: 'Your Name / Nickname',
      f_reply: 'Reply Email Address',
      f_msg: 'Message Content',
      btn_send_msg: 'Dispatch Message',
      direct_label: 'Or copy direct email:',
      btn_copy_email: '📋 Copy Email Address',
      msg_sent: 'Email Dispatch Initialized!',
      msg_sent_sub: 'If your mail app did not open automatically, click the webmail buttons below to open directly.',
      cosmic_badge: '🛸 [DEEP SPACE BEACON // FREQ: 1005-1201]',
      cosmic_title: 'Galactic Civilization Development Corps',
      cosmic_sub: 'Transmission from Deep Space • Secret Frequency',
      cosmic_wish_placeholder: 'Enter your wish to transmit into the cosmos...',
      cosmic_btn_transmit: 'Transmit Wish',
      cosmic_btn_close: 'Close Transmission'
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
    contactSuccessMsg: document.getElementById('contactSuccessMsg'),
    btnCopyEmail: document.getElementById('btnCopyEmail'),
    copyEmailText: document.getElementById('copyEmailText'),
    btnOpenGmail: document.getElementById('btnOpenGmail'),
    btnOpenNaverMail: document.getElementById('btnOpenNaverMail'),
    btnResetContact: document.getElementById('btnResetContact'),

    // Secret Lore Modal (Easter Egg)
    brandName: document.getElementById('brandName'),
    brandSub: document.getElementById('brandSub'),
    secretLoreModal: document.getElementById('secretLoreModal'),
    secretLoreBackdrop: document.getElementById('secretLoreBackdrop'),
    btnCloseSecretLore: document.getElementById('btnCloseSecretLore'),
    btnOpenSecretLore: document.getElementById('btnOpenSecretLore'),
    btnFooterSecretLore: document.getElementById('btnFooterSecretLore'),

    // Cosmic Easter Egg Modal (13 Right Clicks on 10051201b)
    cosmicModal: document.getElementById('cosmicModal'),
    cosmicBackdrop: document.getElementById('cosmicBackdrop'),
    btnCloseCosmic: document.getElementById('btnCloseCosmic'),
    btnFooterCloseCosmic: document.getElementById('btnFooterCloseCosmic'),
    cosmicWishInput: document.getElementById('cosmicWishInput'),
    btnTransmitWish: document.getElementById('btnTransmitWish'),
    cosmicWishEcho: document.getElementById('cosmicWishEcho')
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

    // Toggle Secret Lore Easter Egg Language
    const isEn = lang === 'en';
    const koSec = document.getElementById('secretLoreContentKo');
    const enSec = document.getElementById('secretLoreContentEn');
    if (koSec) koSec.style.display = isEn ? 'none' : 'block';
    if (enSec) enSec.style.display = isEn ? 'block' : 'none';

    // Toggle Cosmic Easter Egg Language (은하문명개발단)
    const cosmicKo = document.getElementById('cosmicContentKo');
    const cosmicEn = document.getElementById('cosmicContentEn');
    if (cosmicKo) cosmicKo.style.display = isEn ? 'none' : 'block';
    if (cosmicEn) cosmicEn.style.display = isEn ? 'block' : 'none';

    document.querySelectorAll('[data-i18n-ph]').forEach(elem => {
      const key = elem.getAttribute('data-i18n-ph');
      if (t[key]) {
        elem.placeholder = t[key];
      }
    });

    updateSpotlightDisplay();
    renderTrackThumbStrip();
    renderPhotoGallery();

    if (el.lyricsModal && el.lyricsModal.classList.contains('active') && state.currentLyricsTrack) {
      openLyricsModal(state.currentLyricsTrack);
    }
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
    const isEn = state.currentLang === 'en';

    if (isEn) {
      el.lyricsModalTitle.textContent = track.title_en || track.title_kr;
      el.lyricsModalSub.textContent = `${track.title_kr ? track.title_kr + ' • ' : ''}${track.album_title}`;
      el.btnTabEn.classList.add('active');
      el.btnTabKr.classList.remove('active');
      el.lyricsTextEn.style.display = 'block';
      el.lyricsTextKr.style.display = 'none';
    } else {
      el.lyricsModalTitle.textContent = track.title_kr;
      el.lyricsModalSub.textContent = `${track.title_en ? track.title_en + ' • ' : ''}${track.album_title}`;
      el.btnTabKr.classList.add('active');
      el.btnTabEn.classList.remove('active');
      el.lyricsTextKr.style.display = 'block';
      el.lyricsTextEn.style.display = 'none';
    }

    el.lyricsTextKr.textContent = track.lyrics_kr || '(등록된 한국어 가사가 없습니다)';
    el.lyricsTextEn.textContent = track.lyrics_en || '(No English lyrics available)';

    el.lyricsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLyricsModal() {
    el.lyricsModal.classList.remove('active');
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

  // Secret Lore Modal
  function openSecretLoreModal() {
    if (el.secretLoreModal) {
      el.secretLoreModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeSecretLoreModal() {
    if (el.secretLoreModal) {
      el.secretLoreModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Cosmic Easter Egg Modal (13 Right Clicks on 10051201b)
  function openCosmicModal() {
    if (el.cosmicModal) {
      const isEn = state.currentLang === 'en';
      const cosmicKo = document.getElementById('cosmicContentKo');
      const cosmicEn = document.getElementById('cosmicContentEn');
      if (cosmicKo) cosmicKo.style.display = isEn ? 'none' : 'block';
      if (cosmicEn) cosmicEn.style.display = isEn ? 'block' : 'none';

      el.cosmicModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (el.cosmicWishInput) {
        setTimeout(() => el.cosmicWishInput.focus(), 300);
      }
    }
  }

  function closeCosmicModal() {
    if (el.cosmicModal) {
      el.cosmicModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function transmitCosmicWish() {
    if (!el.cosmicWishInput || !el.cosmicWishEcho) return;
    const wish = el.cosmicWishInput.value.trim();
    if (!wish) {
      el.cosmicWishInput.focus();
      return;
    }

    try {
      localStorage.setItem('cosmic_wish_10051201b', wish);
    } catch (err) {}

    const isEn = state.currentLang === 'en';
    const echoMsg = isEn 
      ? `✨ <strong>[TRANSMISSION COMPLETE]</strong> Your wish <em>"${wish}"</em> has been encoded into the Galactic Beacon Network.<br>"Ponder deeply. The stars are watching over your path."`
      : `✨ <strong>[은하 네트워크 전송 완료]</strong> 당신의 소원 <em>"${wish}"</em>이(가) 기록되었습니다.<br>"생각을 깊게 하세요. 규율에 어긋나지 않는다면 별들이 당신의 앞길을 지켜볼 것입니다."`;

    el.cosmicWishEcho.innerHTML = echoMsg;
    el.cosmicWishEcho.style.display = 'block';
    el.cosmicWishInput.value = '';
    if (el.btnTransmitWish) {
      el.btnTransmitWish.disabled = true;
      el.btnTransmitWish.style.opacity = '0.6';
      el.btnTransmitWish.textContent = isEn ? 'Transmitted' : '전송 완료';
    }
  }

  function handleContactSubmit(e) {
    e.preventDefault();
    const name = el.contactName.value.trim();
    const reply = el.contactReply.value.trim();
    const msg = el.contactMsg.value.trim();

    const recipient = atob(SECURE_EMAIL_B64);
    const subjectRaw = `[10051201b 아티스트 웹사이트 문의] ${name}님으로부터`;
    const bodyRaw = `보내신 분: ${name}\n답장받을 이메일: ${reply}\n\n[문의 내용]\n${msg}\n\n---\n10051201b Official Archive Dispatch`;

    const subject = encodeURIComponent(subjectRaw);
    const body = encodeURIComponent(bodyRaw);

    if (el.btnOpenGmail) {
      el.btnOpenGmail.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;
    }
    if (el.btnOpenNaverMail) {
      el.btnOpenNaverMail.href = `https://mail.naver.com/v2/write?to=${recipient}&subject=${subject}&body=${body}`;
    }

    try {
      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    } catch (err) {
      console.warn('Mailto dispatch error:', err);
    }

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

    // 60-second Preview enforcement & Timeupdate (모달 팝업 없이 부드러운 다음 곡 전환)
    el.audio.addEventListener('timeupdate', () => {
      const cur = el.audio.currentTime;

      if (cur >= PREVIEW_LIMIT) {
        if (state.repeatMode === 'one') {
          el.audio.currentTime = 0;
          el.audio.play();
        } else {
          playNext();
        }
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

    el.audio.addEventListener('ended', () => {
      if (state.repeatMode === 'one') {
        el.audio.currentTime = 0;
        el.audio.play();
      } else {
        playNext();
      }
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

    // Contact Modal
    el.btnOpenContact.addEventListener('click', openContactModal);
    el.btnFooterContact.addEventListener('click', openContactModal);
    el.btnCloseContact.addEventListener('click', closeContactModal);
    el.contactBackdrop.addEventListener('click', closeContactModal);
    el.contactForm.addEventListener('submit', handleContactSubmit);

    if (el.btnCopyEmail) {
      el.btnCopyEmail.addEventListener('click', () => {
        const email = atob(SECURE_EMAIL_B64);
        navigator.clipboard.writeText(email).then(() => {
          if (el.copyEmailText) {
            el.copyEmailText.textContent = state.currentLang === 'en' ? '✓ Copied!' : '✓ 복사되었습니다!';
            setTimeout(() => {
              el.copyEmailText.textContent = state.currentLang === 'en' ? '📋 Copy Email Address' : '📋 이메일 주소 복사하기';
            }, 2500);
          }
        }).catch(() => {
          prompt('이메일 주소 복사:', atob(SECURE_EMAIL_B64));
        });
      });
    }

    if (el.btnResetContact) {
      el.btnResetContact.addEventListener('click', () => {
        el.contactSuccessMsg.style.display = 'none';
        el.contactForm.style.display = 'flex';
      });
    }

    if (el.spotCover) {
      el.spotCover.style.cursor = 'pointer';
      el.spotCover.addEventListener('click', togglePlay);
    }

    // 1) Secret Lore Easter Egg on 'i\'m cho' (3 Clicks)
    if (el.brandSub) {
      let secretClickCount = 0;
      let secretClickTimer = null;

      el.brandSub.addEventListener('click', (e) => {
        e.preventDefault();
        secretClickCount++;
        clearTimeout(secretClickTimer);

        if (secretClickCount >= 3) {
          secretClickCount = 0;
          openSecretLoreModal();
        } else {
          secretClickTimer = setTimeout(() => {
            secretClickCount = 0;
          }, 1500);
        }
      });

      let secretKeyCount = 0;
      let secretKeyTimer = null;
      el.brandSub.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          secretKeyCount++;
          clearTimeout(secretKeyTimer);

          if (secretKeyCount >= 3) {
            secretKeyCount = 0;
            openSecretLoreModal();
          } else {
            secretKeyTimer = setTimeout(() => {
              secretKeyCount = 0;
            }, 1500);
          }
        }
      });
    }

    // 2) Cosmic Easter Egg: 13 Right-Clicks on '10051201b' (은하문명개발단)
    // Completely unstyled, no color change, secret discovery
    if (el.brandName) {
      let cosmicRightClickCount = 0;
      let cosmicRightClickTimer = null;
      let lastRightClickTime = 0;

      function handleCosmicRightClick(e) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        const now = Date.now();
        // Prevent double counting if both pointer/mouse and contextmenu fire
        if (now - lastRightClickTime < 60) return;
        lastRightClickTime = now;

        cosmicRightClickCount++;
        clearTimeout(cosmicRightClickTimer);

        if (cosmicRightClickCount >= 13) {
          cosmicRightClickCount = 0;
          openCosmicModal();
          return;
        }

        // Reset if user pauses clicking for more than 5 seconds
        cosmicRightClickTimer = setTimeout(() => {
          cosmicRightClickCount = 0;
        }, 5000);
      }

      // Standard contextmenu event (right-click / Mac two-finger tap)
      el.brandName.addEventListener('contextmenu', handleCosmicRightClick);

      // Mouse/pointer event support for right-click button or Mac Ctrl+Click
      el.brandName.addEventListener('mousedown', (e) => {
        if (e.button === 2 || (e.button === 0 && e.ctrlKey)) {
          handleCosmicRightClick(e);
        }
      });
    }
    if (el.btnOpenSecretLore) el.btnOpenSecretLore.addEventListener('click', openSecretLoreModal);
    if (el.btnFooterSecretLore) el.btnFooterSecretLore.addEventListener('click', openSecretLoreModal);
    if (el.btnCloseSecretLore) el.btnCloseSecretLore.addEventListener('click', closeSecretLoreModal);
    if (el.secretLoreBackdrop) el.secretLoreBackdrop.addEventListener('click', closeSecretLoreModal);

    // Cosmic Modal Event Listeners (13 Clicks)
    if (el.btnCloseCosmic) el.btnCloseCosmic.addEventListener('click', closeCosmicModal);
    if (el.btnFooterCloseCosmic) el.btnFooterCloseCosmic.addEventListener('click', closeCosmicModal);
    if (el.cosmicBackdrop) el.cosmicBackdrop.addEventListener('click', closeCosmicModal);
    if (el.btnTransmitWish) el.btnTransmitWish.addEventListener('click', transmitCosmicWish);
    if (el.cosmicWishInput) {
      el.cosmicWishInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          transmitCosmicWish();
        }
      });
    }

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeLyricsModal();
        closeLightbox();
        closeContactModal();
        closeSecretLoreModal();
        closeCosmicModal();
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
