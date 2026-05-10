// ─── CONFIG ────────────────────────────────────────────────────────────────
// استخدام '' يعني "نفس الـ origin" - يشتغل تلقائياً على localhost وعلى Vercel
const API = ''
let TOKEN = localStorage.getItem('skyhawks_token') || ''

// ─── UTILS ─────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id)

function resetAllSubmitButtons() {
  document.querySelectorAll('form button[type="submit"]').forEach(btn => {
    if (btn.dataset.originalText) {
      btn.textContent = btn.dataset.originalText;
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';
      delete btn.dataset.originalText;
    }
  });
}

document.addEventListener('submit', (e) => {
  if (e.target.tagName === 'FORM') {
    const btn = e.target.querySelector('button[type="submit"]');
    if (btn && !btn.dataset.originalText) {
      btn.dataset.originalText = btn.textContent;
      btn.textContent = 'Saving...';
      btn.disabled = true;
      btn.style.opacity = '0.7';
      btn.style.cursor = 'wait';
    }
  }
});

function toast(msg, type = 'success') {
  const el = $('toast')
  el.textContent = (type === 'success' ? '✓ ' : '✗ ') + msg
  el.className = `toast ${type} show`
  setTimeout(() => el.className = 'toast', 3000)
}

async function api(method, path, body, isForm = false) {
  const opts = {
    method,
    headers: { Authorization: `Bearer ${TOKEN}` },
  }
  if (body) {
    if (isForm) opts.body = body
    else { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body) }
  }
  try {
    const res = await fetch(API + path, opts)
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || 'Request failed')
    return data
  } finally {
    resetAllSubmitButtons()
  }
}

// ─── AUTH ───────────────────────────────────────────────────────────────────
$('login-form').addEventListener('submit', async e => {
  e.preventDefault()
  const btn = $('login-btn')
  btn.textContent = 'Signing in...'
  btn.disabled = true
  try {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: $('login-username').value,
        password: $('login-password').value,
      }),
    })
    const data = await res.json()
    if (data.token) {
      TOKEN = data.token
      localStorage.setItem('skyhawks_token', TOKEN)
      showDashboard()
    } else {
      const err = $('login-error')
      err.textContent = data.error || 'Login failed'
      err.style.display = 'block'
    }
  } catch (err) {
    const errEl = $('login-error')
    errEl.textContent = 'Cannot connect to backend. Is the server running?'
    errEl.style.display = 'block'
  }
  btn.textContent = 'Sign In'
  btn.disabled = false
})

$('logout-btn').addEventListener('click', () => {
  TOKEN = ''; localStorage.removeItem('skyhawks_token')
  $('dashboard-page').style.display = 'none'
  $('login-page').style.display = 'flex'
})

async function showDashboard() {
  $('login-page').style.display = 'none'
  $('dashboard-page').style.display = 'flex'
  loadEngineering(); loadTeam(); loadAchievements(); loadSponsors(); loadContactInfo(); loadMessages()
}

// Auto-login if token exists
if (TOKEN) {
  fetch(`${API}/api/auth/verify`, { method: 'POST', headers: { Authorization: `Bearer ${TOKEN}` } })
    .then(r => r.json()).then(d => { if (d.valid) showDashboard() })
    .catch(() => {})
}

// ─── NAVIGATION ─────────────────────────────────────────────────────────────
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault()
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'))
    document.querySelectorAll('.section-panel').forEach(s => s.classList.remove('active'))
    item.classList.add('active')
    $('section-' + item.dataset.section).classList.add('active')
  })
})

// ─── MODAL HELPERS ───────────────────────────────────────────────────────────
function openModal(id) { $(id).style.display = 'flex' }
function closeModal(id) { $(id).style.display = 'none' }

function openAddModal(modalId, formId, title) {
  const form = $(formId)
  if (form) {
    form.reset()
    if (form._id) form._id.value = ''
  }
  if (modalId === 'eng-spec-modal') {
    const list = $('spec-details-list')
    if (list) list.innerHTML = ''
  }
  const titleEl = $(modalId + '-title')
  if (titleEl) titleEl.textContent = title
  openModal(modalId)
}

document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.style.display = 'none' })
})

function formToObj(form) {
  const fd = new FormData(form)
  const obj = {}
  fd.forEach((v, k) => { obj[k] = v })
  return obj
}

// ─── ENGINEERING ─────────────────────────────────────────────────────────────
async function loadEngineering() {
  const [specs, stats] = await Promise.all([
    api('GET', '/api/engineering/specs'),
    api('GET', '/api/engineering/stats'),
  ])
  renderSpecs(specs); renderStats(stats)
}

function renderSpecs(specs) {
  $('specs-list').innerHTML = specs.map(s => `
    <div class="data-card">
      <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem">
        <span style="font-size:1.4rem">${s.icon}</span>
        <div class="card-title">${s.title}</div>
      </div>
      <div class="card-sub">${s.description}</div>
      <div style="margin-top:.75rem;display:flex;flex-wrap:wrap;gap:.4rem">
        ${(s.details||[]).map(d => `<span style="font-size:.7rem;padding:.15rem .5rem;background:rgba(201,168,124,.1);border-radius:5px;color:#C9A87C">${d.label}: ${d.value}</span>`).join('')}
      </div>
      <div class="card-actions">
        <button class="btn-edit" onclick='editSpec(${JSON.stringify(s).replace(/'/g, "&#39;")})'>✏ Edit</button>
        <button class="btn-danger" onclick="deleteSpec('${s._id}')">🗑 Delete</button>
      </div>
    </div>`).join('')
}

function renderStats(stats) {
  $('stats-list').innerHTML = stats.map(s => `
    <div class="data-card">
      <div class="card-title" style="color:${s.color};font-size:1.4rem">${s.value}</div>
      <div class="card-sub">${s.label}</div>
      <div class="card-actions">
        <button class="btn-edit" onclick='editStat(${JSON.stringify(s).replace(/'/g, "&#39;")})'>✏ Edit</button>
        <button class="btn-danger" onclick="deleteStat('${s._id}')">🗑 Delete</button>
      </div>
    </div>`).join('')
}

// Spec detail rows
function addDetailRow(label = '', value = '') {
  const div = document.createElement('div')
  div.className = 'detail-row'
  div.innerHTML = `<input type="text" placeholder="Label" value="${label}" class="det-label"/>
    <input type="text" placeholder="Value" value="${value}" class="det-value"/>
    <button type="button" class="remove-btn" onclick="this.parentElement.remove()">×</button>`
  $('spec-details-list').appendChild(div)
}

function getDetailRows() {
  return [...document.querySelectorAll('#spec-details-list .detail-row')].map(row => ({
    label: row.querySelector('.det-label').value,
    value: row.querySelector('.det-value').value,
  })).filter(d => d.label && d.value)
}

function editSpec(s) {
  const form = $('eng-spec-form')
  form._id.value = s._id
  form.part.value = s.part
  form.icon.value = s.icon
  form.title.value = s.title
  form.description.value = s.description
  form.order.value = s.order || 0
  $('spec-details-list').innerHTML = ''
  ;(s.details || []).forEach(d => addDetailRow(d.label, d.value))
  $('eng-spec-modal-title').textContent = 'Edit Spec'
  openModal('eng-spec-modal')
}

$('eng-spec-form').addEventListener('submit', async e => {
  e.preventDefault()
  const form = $('eng-spec-form')
  const data = formToObj(form)
  data.details = getDetailRows()
  const id = data._id; delete data._id
  try {
    if (id) await api('PUT', `/api/engineering/specs/${id}`, data)
    else await api('POST', '/api/engineering/specs', data)
    closeModal('eng-spec-modal')
    toast('Spec saved!')
    loadEngineering()
    form.reset(); $('spec-details-list').innerHTML = ''
    $('eng-spec-modal-title').textContent = 'Add Spec Card'
  } catch (err) { toast(err.message, 'error') }
})

async function deleteSpec(id) {
  if (!confirm('Delete this spec?')) return
  await api('DELETE', `/api/engineering/specs/${id}`)
  toast('Deleted'); loadEngineering()
}

function editStat(s) {
  const form = $('eng-stat-form')
  form._id.value = s._id; form.value.value = s.value
  form.label.value = s.label; form.color.value = s.color; form.order.value = s.order || 0
  $('eng-stat-modal-title').textContent = 'Edit Stat'
  openModal('eng-stat-modal')
}

$('eng-stat-form').addEventListener('submit', async e => {
  e.preventDefault()
  const data = formToObj($('eng-stat-form'))
  const id = data._id; delete data._id
  try {
    if (id) await api('PUT', `/api/engineering/stats/${id}`, data)
    else await api('POST', '/api/engineering/stats', data)
    closeModal('eng-stat-modal')
    toast('Stat saved!'); loadEngineering()
    $('eng-stat-modal-title').textContent = 'Add Stat'
  } catch (err) { toast(err.message, 'error') }
})

async function deleteStat(id) {
  if (!confirm('Delete?')) return
  await api('DELETE', `/api/engineering/stats/${id}`)
  toast('Deleted'); loadEngineering()
}

// ─── TEAM ─────────────────────────────────────────────────────────────────────
async function loadTeam() {
  const team = await api('GET', '/api/team')
  $('team-list').innerHTML = team.map(m => `
    <div class="data-card" style="text-align:center">
      ${m.photo
        ? `<img src="${API}${m.photo}" class="card-avatar" style="width:64px;height:64px;object-fit:cover;border-radius:50%;margin:0 auto .75rem"/>`
        : `<div class="card-avatar" style="margin:0 auto .75rem">${m.initials}</div>`}
      <div class="card-title">${m.name}</div>
      <div class="card-badge" style="background:rgba(201,168,124,.12);color:#C9A87C">${m.role}</div>
      <div class="card-sub">${m.description || ''}</div>
      ${m.linkedin ? `<div style="margin-top:.4rem;font-size:.72rem"><a href="${m.linkedin}" target="_blank" style="color:#4A9EBF">LinkedIn ↗</a></div>` : ''}
      <div class="card-actions" style="justify-content:center">
        <button class="btn-edit" onclick='editMember(${JSON.stringify(m).replace(/'/g, "&#39;")})'>✏ Edit</button>
        <button class="btn-danger" onclick="deleteMember('${m._id}')">🗑 Delete</button>
      </div>
    </div>`).join('')
}

function editMember(m) {
  const form = $('team-form')
  form._id.value = m._id; form.name.value = m.name; form.initials.value = m.initials
  form.role.value = m.role; form.roleClass.value = m.roleClass; form.description.value = m.description || ''
  form.linkedin.value = m.linkedin || ''; form.order.value = m.order || 0
  $('team-modal-title').textContent = 'Edit Member'
  openModal('team-modal')
}

$('team-form').addEventListener('submit', async e => {
  e.preventDefault()
  const form = $('team-form')
  const fd = new FormData(form)
  const id = fd.get('_id'); fd.delete('_id')
  try {
    if (id) await api('PUT', `/api/team/${id}`, fd, true)
    else await api('POST', '/api/team', fd, true)
    closeModal('team-modal'); toast('Saved!'); loadTeam()
    form.reset(); $('team-modal-title').textContent = 'Add Team Member'
  } catch (err) { toast(err.message, 'error') }
})

async function deleteMember(id) {
  if (!confirm('Delete this team member?')) return
  await api('DELETE', `/api/team/${id}`)
  toast('Deleted'); loadTeam()
}

// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────
async function loadAchievements() {
  const achs = await api('GET', '/api/achievements')
  $('ach-list').innerHTML = achs.map(a => `
    <div class="data-card" style="border-left:3px solid ${a.color}">
      <div class="card-badge" style="background:rgba(201,168,124,.1);color:${a.color}">${a.year}</div>
      <div class="card-title">${a.title}</div>
      <div class="card-sub">${a.description}</div>
      <div style="margin-top:.5rem;font-size:.78rem;color:${a.color}">${a.award}</div>
      <div style="margin-top:.4rem;font-size:.72rem;color:var(--text-muted)">${(a.images||[]).length} image(s)</div>
      <div class="card-actions">
        <button class="btn-edit" onclick='editAch(${JSON.stringify(a).replace(/'/g, "&#39;")})'>✏ Edit</button>
        <button class="btn-secondary" onclick='openAchImagesObj(${JSON.stringify(a).replace(/'/g, "&#39;")})'>🖼 Images</button>
        <button class="btn-danger" onclick="deleteAch('${a._id}')">🗑 Delete</button>
      </div>
    </div>`).join('')
}

function editAch(a) {
  const form = $('ach-form')
  form._id.value = a._id; form.year.value = a.year; form.title.value = a.title
  form.description.value = a.description; form.award.value = a.award
  form.color.value = a.color; form.order.value = a.order || 0
  $('ach-modal-title').textContent = 'Edit Achievement'
  openModal('ach-modal')
}

$('ach-form').addEventListener('submit', async e => {
  e.preventDefault()
  const data = formToObj($('ach-form'))
  const id = data._id; delete data._id
  try {
    if (id) await api('PUT', `/api/achievements/${id}`, data)
    else await api('POST', '/api/achievements', data)
    closeModal('ach-modal'); toast('Saved!'); loadAchievements()
    $('ach-modal-title').textContent = 'Add Achievement'
  } catch (err) { toast(err.message, 'error') }
})

async function deleteAch(id) {
  if (!confirm('Delete?')) return
  await api('DELETE', `/api/achievements/${id}`)
  toast('Deleted'); loadAchievements()
}

function openAchImagesObj(a) {
  openAchImages(a._id, a.title, a.images || [])
}

function openAchImages(id, title, images) {
  $('ach-images-id').value = id
  document.querySelector('#ach-images-modal .modal-header h3').textContent = 'Images: ' + title
  renderAchImages(id, images)
  openModal('ach-images-modal')
}

function renderAchImages(id, images) {
  $('ach-images-grid').innerHTML = images.map((img, idx) => `
    <div class="img-wrap">
      <img src="${img.startsWith('data:') || img.startsWith('http') ? img : API + img}" alt="achievement"/>
      <button class="img-remove" onclick="removeAchImage('${id}', ${idx})">×</button>
    </div>`).join('')
}

async function removeAchImage(id, idx) {
  if (!confirm('Remove this image?')) return
  const res = await api('DELETE', `/api/achievements/${id}/images`, { imageIndex: idx })
  renderAchImages(id, res.images || [])
  toast('Image removed'); loadAchievements()
}

$('ach-images-upload-form').addEventListener('submit', async e => {
  e.preventDefault()
  const id = $('ach-images-id').value
  const files = $('ach-images-files').files
  if (!files.length) return
  const fd = new FormData()
  for (const f of files) fd.append('images', f)
  const res = await api('POST', `/api/achievements/${id}/images`, fd, true)
  renderAchImages(id, res.images || [])
  toast('Images uploaded!'); loadAchievements()
  $('ach-images-files').value = ''
})

// ─── SPONSORS ─────────────────────────────────────────────────────────────────
async function loadSponsors() {
  const sps = await api('GET', '/api/sponsors')
  $('sponsors-list').innerHTML = sps.map(s => `
    <div class="data-card" style="text-align:center">
      ${s.logo
        ? `<img src="${API}${s.logo}" style="width:60px;height:60px;object-fit:contain;margin-bottom:.5rem"/>`
        : `<div style="font-size:2rem;margin-bottom:.5rem">${s.icon}</div>`}
      <div class="card-title">${s.name}</div>
      <div class="card-badge" style="background:rgba(201,168,124,.1);color:${s.color}">${s.tier}</div>
      ${s.website ? `<div style="margin-top:.4rem;font-size:.72rem"><a href="${s.website}" target="_blank" style="color:#4A9EBF">${s.website}</a></div>` : ''}
      <div class="card-actions" style="justify-content:center">
        <button class="btn-edit" onclick='editSponsor(${JSON.stringify(s).replace(/'/g, "&#39;")})'>✏ Edit</button>
        <button class="btn-danger" onclick="deleteSponsor('${s._id}')">🗑 Delete</button>
      </div>
    </div>`).join('')
}

function editSponsor(s) {
  const form = $('sponsor-form')
  form._id.value = s._id; form.name.value = s.name; form.icon.value = s.icon || ''
  form.tier.value = s.tier; form.color.value = s.color; form.website.value = s.website || ''
  form.order.value = s.order || 0
  $('sponsor-modal-title').textContent = 'Edit Sponsor'
  openModal('sponsor-modal')
}

$('sponsor-form').addEventListener('submit', async e => {
  e.preventDefault()
  const form = $('sponsor-form')
  const fd = new FormData(form)
  const id = fd.get('_id'); fd.delete('_id')
  try {
    if (id) await api('PUT', `/api/sponsors/${id}`, fd, true)
    else await api('POST', '/api/sponsors', fd, true)
    closeModal('sponsor-modal'); toast('Saved!'); loadSponsors()
    form.reset(); $('sponsor-modal-title').textContent = 'Add Sponsor'
  } catch (err) { toast(err.message, 'error') }
})

async function deleteSponsor(id) {
  if (!confirm('Delete?')) return
  await api('DELETE', `/api/sponsors/${id}`)
  toast('Deleted'); loadSponsors()
}

// ─── CONTACT INFO ─────────────────────────────────────────────────────────────
async function loadContactInfo() {
  const info = await api('GET', '/api/contact/info')
  const form = $('contact-info-form')
  Object.keys(info).forEach(k => { if (form[k]) form[k].value = info[k] || '' })
}

$('contact-info-form').addEventListener('submit', async e => {
  e.preventDefault()
  const data = formToObj($('contact-info-form'))
  await api('PUT', '/api/contact/info', data)
  const msg = $('contact-save-msg')
  msg.style.display = 'inline'; setTimeout(() => msg.style.display = 'none', 2000)
  toast('Contact info saved!')
})

// ─── MESSAGES ─────────────────────────────────────────────────────────────────
async function loadMessages() {
  const msgs = await api('GET', '/api/contact/messages')
  if (!msgs.length) { $('messages-list').innerHTML = '<p style="color:var(--text-muted)">No messages yet.</p>'; return }
  $('messages-list').innerHTML = msgs.map(m => `
    <div class="message-item ${m.read ? '' : 'unread'}" id="msg-${m._id}">
      <div class="message-meta">
        <span class="message-name">${m.name}</span>
        <span>${m.email}</span>
        <span>${new Date(m.createdAt).toLocaleString()}</span>
        ${!m.read ? '<span style="color:#D4A843;font-weight:700">● Unread</span>' : ''}
      </div>
      <div class="message-body">${m.message}</div>
      <div class="card-actions" style="margin-top:.75rem">
        ${!m.read ? `<button class="btn-secondary" onclick="markRead('${m._id}')">Mark as Read</button>` : ''}
        <button class="btn-danger" onclick="deleteMessage('${m._id}')">🗑 Delete</button>
      </div>
    </div>`).join('')
}

async function markRead(id) {
  await api('PUT', `/api/contact/messages/${id}/read`, {})
  loadMessages()
}

async function deleteMessage(id) {
  if (!confirm('Delete this message?')) return
  await api('DELETE', `/api/contact/messages/${id}`)
  toast('Deleted'); loadMessages()
}

// ─── BACKUP ───────────────────────────────────────────────────────────────────
function exportBackup() {
  const a = document.createElement('a')
  a.href = `${API}/api/backup/export`
  a.download = `skyhawks-backup-${Date.now()}.zip`
  document.body.appendChild(a)
  // Must send token via URL isn't ideal; use fetch+blob instead
  fetch(`${API}/api/backup/export`, { headers: { Authorization: `Bearer ${TOKEN}` } })
    .then(r => r.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob)
      a.href = url; a.click()
      URL.revokeObjectURL(url)
      a.remove()
      toast('Backup downloaded!')
    })
    .catch(() => toast('Export failed', 'error'))
}

async function importBackup(input) {
  const file = input.files[0]
  if (!file) return
  const msgEl = $('backup-import-msg')
  msgEl.style.display = 'block'; msgEl.textContent = '⏳ Restoring backup...'
  msgEl.style.color = 'var(--text-muted)'
  const fd = new FormData()
  fd.append('backup', file)
  try {
    const res = await api('POST', '/api/backup/import', fd, true)
    msgEl.textContent = '✓ ' + res.message; msgEl.style.color = 'var(--success)'
    toast('Backup restored!')
    loadEngineering(); loadTeam(); loadAchievements(); loadSponsors(); loadContactInfo(); loadMessages()
  } catch (err) {
    msgEl.textContent = '✗ ' + err.message; msgEl.style.color = 'var(--danger)'
    toast(err.message, 'error')
  }
  input.value = ''
}
