const API_BASE = 'http://localhost:8080/api';
const SERVER_BASE = 'http://localhost:8080';
const state = {
  view: 'home',
  query: '',
  images: [],
  profile: null,
  token: localStorage.getItem('pinboard_token') || '',
  selectedTab: 'created'
};

const app = document.querySelector('#app');
const modalRoot = document.querySelector('#modal-root');

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));
}

function initials(name = 'P') {
  return name.trim().split(/\s+/).slice(-2).map(part => part[0]).join('').toUpperCase() || 'P';
}

function imageUrl(path) {
  if (!path) return '';
  return path.startsWith('http') ? path : `${SERVER_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

function authHeaders() {
  return state.token ? { Authorization: `Bearer ${state.token}` } : {};
}

async function api(path, options = {}) {
  const headers = { ...authHeaders(), ...(options.headers || {}) };
  if (options.body && !(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) throw new Error(data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
  return data;
}

function notify(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.querySelector('#toast-region').appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function setLoading(container, label = 'Đang tải...') {
  container.innerHTML = `<div class="loading-state">${escapeHtml(label)}</div>`;
}

function renderNav() {
  const user = state.profile;
  return `<header class="topbar">
    <button class="brand" data-action="home" aria-label="Về trang chủ"><span class="brand-mark">P</span><span class="brand-name">pinboard</span></button>
    <nav class="nav-links" aria-label="Điều hướng chính">
      <button class="nav-link ${state.view === 'home' ? 'active' : ''}" data-action="home">Trang chủ</button>
      <button class="nav-link ${state.view === 'create' ? 'active' : ''}" data-action="create">Tạo</button>
    </nav>
    <form class="search" id="search-form">
      <span class="search-icon">⌕</span>
      <input id="search-input" value="${escapeHtml(state.query)}" placeholder="Tìm ý tưởng, hình ảnh..." aria-label="Tìm kiếm" />
    </form>
    <div class="user-actions">
      ${user ? `<button class="icon-button" data-action="profile" title="Trang cá nhân">♡</button><button class="avatar-button" data-action="profile" title="Hồ sơ">${initials(user.ho_ten)}</button>` : `<button class="text-button" data-action="login">Đăng nhập</button><button class="primary-button" data-action="register">Đăng ký</button>`}
    </div>
  </header>`;
}

function renderPin(image, options = {}) {
  const creator = image.nguoi_dung || {};
  const title = image.ten_hinh || 'Untitled pin';
  const path = image.duong_dan || image.hinh_anh?.duong_dan;
  return `<article class="pin fade-in">
    <div class="pin-card">
      <button class="pin-open" data-image-id="${image.hinh_id}" aria-label="Mở ${escapeHtml(title)}"><img src="${imageUrl(path)}" alt="${escapeHtml(title)}" loading="lazy" /></button>
      <div class="pin-overlay"><button class="save-button" data-save-id="${image.hinh_id}">${options.saved ? 'Đã lưu' : 'Lưu'}</button><button class="icon-button" data-image-id="${image.hinh_id}" aria-label="Xem chi tiết">↗</button></div>
    </div>
    <div class="pin-meta">
      <div class="avatar">${creator.anh_dai_dien ? `<img src="${imageUrl(creator.anh_dai_dien)}" alt="" />` : initials(creator.ho_ten)}</div>
      <div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(creator.ho_ten || 'Cộng đồng pinboard')}</p></div>
    </div>
  </article>`;
}

function renderHome() {
  app.innerHTML = `${renderNav()}<main class="page-shell">
    <section class="hero fade-in"><div><p class="eyebrow">A little place for big ideas</p><h1>Những điều làm bạn thấy rung động.</h1><p class="hero-copy">Khám phá, lưu giữ và chia sẻ những hình ảnh khiến ngày thường trở nên thú vị hơn.</p></div><div class="hero-note"><strong>stay<br>curious.</strong></div></section>
    <section class="toolbar"><div><p id="result-label">Gợi ý dành cho bạn</p></div><div class="filter-row"><button class="chip active">Tất cả</button><button class="chip">Nghệ thuật</button><button class="chip">Thiết kế</button><button class="chip">Đời sống</button></div></section>
    <section id="image-grid" class="masonry" aria-live="polite"></section>
  </main>`;
  loadImages();
}

async function loadImages() {
  const grid = document.querySelector('#image-grid');
  if (!grid) return;
  setLoading(grid, 'Đang gom những ý tưởng hay...');
  try {
    const query = state.query ? `?name=${encodeURIComponent(state.query)}` : '';
    state.images = await api(`/images${query}`);
    document.querySelector('#result-label').textContent = state.query ? `${state.images.length} kết quả cho “${state.query}”` : 'Gợi ý dành cho bạn';
    grid.innerHTML = state.images.length ? state.images.map(renderPin).join('') : `<div class="empty-state"><h3>Chưa có hình ảnh phù hợp</h3><p>Thử một từ khóa khác nhé.</p></div>`;
  } catch (error) {
    grid.innerHTML = `<div class="empty-state"><h3>Không thể tải bảng tin</h3><p>${escapeHtml(error.message)}</p><button class="secondary-button" data-action="home">Thử lại</button></div>`;
  }
}

function showAuth(mode = 'login') {
  const register = mode === 'register';
  modalRoot.innerHTML = `<div class="modal-backdrop" data-close-modal><section class="modal auth-modal" onclick="event.stopPropagation()">
    <button class="modal-close" data-close-modal aria-label="Đóng">×</button>
    <div class="brand"><span class="brand-mark">P</span><span class="brand-name">pinboard</span></div>
    <h2>${register ? 'Bắt đầu tạo bảng của riêng bạn.' : 'Chào mừng trở lại.'}</h2>
    <p class="auth-subtitle">${register ? 'Một nơi nhỏ để lưu những điều lớn lao.' : 'Tiếp tục hành trình tìm kiếm cảm hứng của bạn.'}</p>
    <form id="auth-form">
      <div class="form-group"><label for="auth-email">Email</label><input id="auth-email" name="email" type="email" placeholder="you@example.com" required /></div>
      <div class="form-group"><label for="auth-password">Mật khẩu</label><input id="auth-password" name="mat_khau" type="password" placeholder="Tối thiểu 6 ký tự" required /></div>
      ${register ? `<div class="form-group"><label for="auth-name">Họ tên</label><input id="auth-name" name="ho_ten" placeholder="Tên của bạn" required /></div><div class="form-group"><label for="auth-age">Tuổi</label><input id="auth-age" name="tuoi" type="number" min="1" placeholder="25" /></div>` : ''}
      <p id="auth-error" class="form-error"></p><button class="primary-button auth-submit" type="submit">${register ? 'Tạo tài khoản' : 'Đăng nhập'}</button>
    </form>
    <p class="auth-switch">${register ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'} <button data-auth-switch="${register ? 'login' : 'register'}">${register ? 'Đăng nhập' : 'Đăng ký'}</button></p>
  </section></div>`;
  document.querySelector('#auth-form').addEventListener('submit', event => submitAuth(event, register));
}

async function submitAuth(event, register) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const payload = Object.fromEntries(form.entries());
  if (payload.tuoi) payload.tuoi = Number(payload.tuoi);
  const error = document.querySelector('#auth-error');
  const submit = event.currentTarget.querySelector('button[type="submit"]');
  submit.disabled = true;
  try {
    const result = await api(register ? '/auth/register' : '/auth/login', { method: 'POST', body: JSON.stringify(payload) });
    if (register) {
      notify('Tạo tài khoản thành công. Đăng nhập để bắt đầu.');
      showAuth('login');
    } else {
      state.token = result.token;
      localStorage.setItem('pinboard_token', state.token);
      closeModal();
      await loadProfile();
      renderHome();
      notify('Chào mừng bạn trở lại.');
    }
  } catch (err) { error.textContent = err.message; } finally { submit.disabled = false; }
}

function closeModal() { modalRoot.innerHTML = ''; }

async function openDetail(id) {
  modalRoot.innerHTML = `<div class="modal-backdrop"><section class="modal"><div class="loading-state">Đang mở hình ảnh...</div></section></div>`;
  try {
    const requests = [api(`/images/${id}`), api(`/images/${id}/comments`)];
    if (state.token) requests.push(api(`/images/${id}/saved`));
    const [image, comments, savedResult] = await Promise.all(requests);
    const saved = savedResult?.isSaved || false;
    const creator = image.nguoi_dung || {};
    modalRoot.innerHTML = `<div class="modal-backdrop" data-close-modal><section class="modal" onclick="event.stopPropagation()">
      <button class="modal-close" data-close-modal aria-label="Đóng">×</button><div class="detail-grid">
      <div class="detail-image"><img src="${imageUrl(image.duong_dan)}" alt="${escapeHtml(image.ten_hinh)}" /></div>
      <div class="detail-body"><div class="detail-head"><div><p class="eyebrow">Pin detail</p><h2>${escapeHtml(image.ten_hinh)}</h2></div><button class="primary-button" data-save-detail="${image.hinh_id}">${saved ? 'Đã lưu' : 'Lưu'}</button></div>
      <p class="detail-description">${escapeHtml(image.mo_ta || 'Một hình ảnh được chia sẻ trong cộng đồng pinboard.')}</p>
      <div class="creator"><div class="avatar">${creator.anh_dai_dien ? `<img src="${imageUrl(creator.anh_dai_dien)}" alt="" />` : initials(creator.ho_ten)}</div><div><strong>${escapeHtml(creator.ho_ten || 'Người dùng pinboard')}</strong><small>Người tạo hình ảnh</small></div></div>
      <div class="detail-comments"><strong>${comments.length} bình luận</strong>${comments.length ? comments.map(renderComment).join('') : '<p class="empty-state">Hãy là người đầu tiên để lại một lời nhắn.</p>'}</div>
      <form class="comment-form" id="comment-form"><input name="noi_dung" placeholder="Thêm nhận xét..." required /><button class="round-button primary-button" type="submit" aria-label="Gửi bình luận">↑</button></form>
      </div></div></section></div>`;
    document.querySelector('#comment-form').addEventListener('submit', event => submitComment(event, id));
  } catch (err) { modalRoot.innerHTML = `<div class="modal-backdrop" data-close-modal><section class="modal empty-state"><h3>Không mở được hình ảnh</h3><p>${escapeHtml(err.message)}</p></section></div>`; }
}

function renderComment(comment) {
  const user = comment.nguoi_dung || {};
  return `<div class="comment"><div class="avatar">${user.anh_dai_dien ? `<img src="${imageUrl(user.anh_dai_dien)}" alt="" />` : initials(user.ho_ten)}</div><div><strong>${escapeHtml(user.ho_ten || 'Người dùng')}</strong><p>${escapeHtml(comment.noi_dung)}</p><small>${comment.ngay_binh_luan ? new Date(comment.ngay_binh_luan).toLocaleDateString('vi-VN') : ''}</small></div></div>`;
}

async function submitComment(event, id) {
  event.preventDefault();
  if (!state.token) return showAuth('login');
  const input = event.currentTarget.querySelector('input');
  try { await api(`/images/${id}/comments`, { method: 'POST', body: JSON.stringify({ noi_dung: input.value }) }); notify('Đã thêm bình luận.'); await openDetail(id); }
  catch (err) { notify(err.message, 'error'); }
}

async function saveImage(id, button) {
  if (!state.token) return showAuth('login');
  try {
    await api(`/images/${id}/saved`, { method: 'POST' });
    button.textContent = 'Đã lưu';
    notify('Đã lưu hình ảnh vào bộ sưu tập.');
  } catch (err) { notify(err.message, 'error'); }
}

async function loadProfile() {
  if (!state.token) return;
  try { state.profile = await api('/users/profile'); } catch { logout(false); }
}

function renderCreate() {
  if (!state.token) return showAuth('login');
  app.innerHTML = `${renderNav()}<main class="dashboard"><div class="form-panel fade-in"><p class="eyebrow">Create a new pin</p><h2>Thêm một điều đáng nhớ.</h2><form id="upload-form"><div class="form-group"><label class="upload-zone" for="image-file"><span class="upload-icon">＋</span><strong id="upload-title">Kéo thả hoặc nhấp để tải lên</strong><span id="upload-hint">JPG, PNG hoặc WEBP · tối đa 20MB</span><input id="image-file" name="hinh_anh" type="file" accept="image/*" required /></label></div><div class="form-group"><label for="image-name">Tiêu đề</label><input id="image-name" name="ten_hinh" placeholder="Ví dụ: Những buổi sáng chậm rãi" required /></div><div class="form-group"><label for="image-description">Mô tả</label><textarea id="image-description" name="mo_ta" placeholder="Điều gì làm hình ảnh này đặc biệt?"></textarea></div><p id="upload-error" class="form-error"></p><div class="form-actions"><button class="secondary-button" type="button" data-action="home">Hủy</button><button class="primary-button" type="submit">Lưu hình ảnh</button></div></form></div></main>`;
  document.querySelector('#image-file').addEventListener('change', previewUpload);
  document.querySelector('#upload-form').addEventListener('submit', submitUpload);
}

function previewUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  document.querySelector('#upload-title').textContent = file.name;
  document.querySelector('#upload-hint').textContent = 'Ảnh đã sẵn sàng để tải lên';
}

async function submitUpload(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  try { await api('/images', { method: 'POST', body: new FormData(form) }); notify('Đã thêm hình ảnh thành công.'); renderHome(); }
  catch (err) { document.querySelector('#upload-error').textContent = err.message; }
  finally { submit.disabled = false; }
}

async function renderProfile() {
  if (!state.token) return showAuth('login');
  if (!state.profile) await loadProfile();
  app.innerHTML = `${renderNav()}<main class="dashboard"><section class="profile-header fade-in"><div class="profile-avatar">${state.profile?.anh_dai_dien ? `<img src="${imageUrl(state.profile.anh_dai_dien)}" alt="" />` : initials(state.profile?.ho_ten)}</div><div class="profile-info"><p class="eyebrow">Your creative corner</p><h1>${escapeHtml(state.profile?.ho_ten || 'Hồ sơ của tôi')}</h1><p>${escapeHtml(state.profile?.email || '')}</p></div><div class="dashboard-actions"><button class="secondary-button" data-action="edit-profile">Chỉnh sửa hồ sơ</button><button class="text-button" data-action="logout">Đăng xuất</button></div></section><div class="tabs"><button class="tab ${state.selectedTab === 'created' ? 'active' : ''}" data-tab="created">Đã tạo</button><button class="tab ${state.selectedTab === 'saved' ? 'active' : ''}" data-tab="saved">Đã lưu</button></div><section id="profile-grid" class="masonry"></section></main>`;
  loadProfileImages();
}

async function loadProfileImages() {
  const grid = document.querySelector('#profile-grid');
  setLoading(grid);
  try {
    const data = await api(`/users/${state.selectedTab === 'saved' ? 'saved-images' : 'created-images'}`);
    const images = state.selectedTab === 'saved' ? data.map(item => ({ ...item.hinh_anh, saved: true })) : data;
    grid.innerHTML = images.length ? images.map(image => renderPin(image, { saved: image.saved })).join('') : `<div class="empty-state"><h3>Chưa có hình ảnh</h3><p>Những điều bạn tạo hoặc lưu sẽ xuất hiện tại đây.</p></div>`;
  } catch (err) { grid.innerHTML = `<div class="empty-state"><h3>Không thể tải dữ liệu</h3><p>${escapeHtml(err.message)}</p></div>`; }
}

function renderEditProfile() {
  const profile = state.profile || {};
  app.innerHTML = `${renderNav()}<main class="dashboard"><div class="form-panel fade-in"><p class="eyebrow">Profile settings</p><h2>Chỉnh sửa thông tin cá nhân.</h2><form id="profile-form"><div class="form-grid"><div class="form-group"><label for="profile-name">Họ tên</label><input id="profile-name" name="ho_ten" value="${escapeHtml(profile.ho_ten)}" required /></div><div class="form-group"><label for="profile-age">Tuổi</label><input id="profile-age" name="tuoi" type="number" min="1" value="${profile.tuoi || ''}" /></div><div class="form-group full"><label for="profile-avatar">Đường dẫn ảnh đại diện</label><input id="profile-avatar" name="anh_dai_dien" value="${escapeHtml(profile.anh_dai_dien || '')}" placeholder="/img/avatar.jpg" /></div></div><p id="profile-error" class="form-error"></p><div class="form-actions"><button class="secondary-button" type="button" data-action="profile">Hủy</button><button class="primary-button" type="submit">Lưu thay đổi</button></div></form></div></main>`;
  document.querySelector('#profile-form').addEventListener('submit', submitProfile);
}

async function submitProfile(event) {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
  if (payload.tuoi) payload.tuoi = Number(payload.tuoi);
  try { const result = await api('/users/profile', { method: 'PUT', body: JSON.stringify(payload) }); state.profile = result.data || { ...state.profile, ...payload }; notify('Đã cập nhật hồ sơ.'); renderProfile(); }
  catch (err) { document.querySelector('#profile-error').textContent = err.message; }
}

function logout(showMessage = true) {
  state.token = ''; state.profile = null; localStorage.removeItem('pinboard_token'); if (showMessage) notify('Bạn đã đăng xuất.'); renderHome();
}

function navigate(view) {
  state.view = view;
  if (view === 'home') renderHome();
  if (view === 'create') renderCreate();
  if (view === 'profile') renderProfile();
  if (view === 'edit-profile') renderEditProfile();
}

document.addEventListener('click', event => {
  const actionElement = event.target.closest('[data-action]');
  if (actionElement) {
    const action = actionElement.dataset.action;
    if (action === 'home' || action === 'create' || action === 'profile' || action === 'edit-profile') navigate(action);
    if (action === 'login' || action === 'register') showAuth(action);
    if (action === 'logout') logout();
  }
  const authSwitch = event.target.closest('[data-auth-switch]');
  if (authSwitch) showAuth(authSwitch.dataset.authSwitch);
  if (event.target.closest('[data-close-modal]')) closeModal();
  const imageButton = event.target.closest('[data-image-id]');
  if (imageButton) openDetail(imageButton.dataset.imageId);
  const saveButton = event.target.closest('[data-save-id]');
  if (saveButton) { event.stopPropagation(); saveImage(saveButton.dataset.saveId, saveButton); }
  const detailSave = event.target.closest('[data-save-detail]');
  if (detailSave) saveImage(detailSave.dataset.saveDetail, detailSave);
  const tab = event.target.closest('[data-tab]');
  if (tab) { state.selectedTab = tab.dataset.tab; renderProfile(); }
});

document.addEventListener('submit', event => {
  if (event.target.id === 'search-form') {
    event.preventDefault(); state.query = event.target.querySelector('input').value.trim(); state.view = 'home'; renderHome();
  }
});

(async function init() { await loadProfile(); renderHome(); })();
