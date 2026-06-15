// ============================================
// FIREBASE SETUP
// ============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyApfMg-55DRSjQcWtq4Ml2B1yGh3MvZ_TM",
  authDomain: "worldcup2026-a5bd7.firebaseapp.com",
  projectId: "worldcup2026-a5bd7",
  storageBucket: "worldcup2026-a5bd7.firebasestorage.app",
  messagingSenderId: "358912564554",
  appId: "1:358912564554:web:5ae46c7c186a4918f2b5b3"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// ============================================
// PLAYERS
// ============================================
const PLAYERS = [
  { name: 'Micole',   icon: '🐻' },
  { name: 'Mom',      icon: '🦒' },
  { name: 'Zac',      icon: '🦥' },
  { name: 'Sean',     icon: '🦅' },
  { name: 'Patricia', icon: '🦩' },
];

const STARTING_COINS = 100;
const MIN_TEAMS      = 0;  // No minimum — more teams = more chances
const STEAL_PCT      = 0.5;  // 50% of loser's coins stolen as points
const WIN_POINTS     = 10;   // flat points for any win

// ============================================
// ROUND OF 32 SLOTS
// ============================================
const slots = [
  { id:'s1',  name:'Brazil',            flag:'🇧🇷', confirmed:true,  group:'C' },
  { id:'s2',  name:'France',            flag:'🇫🇷', confirmed:true,  group:'I' },
  { id:'s3',  name:'Argentina',         flag:'🇦🇷', confirmed:true,  group:'J' },
  { id:'s4',  name:'England',           flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', confirmed:true,  group:'L' },
  { id:'s5',  name:'Spain',             flag:'🇪🇸', confirmed:true,  group:'H' },
  { id:'s6',  name:'Germany',           flag:'🇩🇪', confirmed:true,  group:'E' },
  { id:'s7',  name:'Portugal',          flag:'🇵🇹', confirmed:true,  group:'K' },
  { id:'s8',  name:'Netherlands',       flag:'🇳🇱', confirmed:true,  group:'F' },
  { id:'s9',  name:'Belgium',           flag:'🇧🇪', confirmed:true,  group:'G' },
  { id:'s10', name:'Uruguay',           flag:'🇺🇾', confirmed:true,  group:'H' },
  { id:'s11', name:'USA',               flag:'🇺🇸', confirmed:true,  group:'D' },
  { id:'s12', name:'Canada',            flag:'🇨🇦', confirmed:true,  group:'B' },
  { id:'s13', name:'Mexico',            flag:'🇲🇽', confirmed:true,  group:'A' },
  { id:'s14', name:'Morocco',           flag:'🇲🇦', confirmed:true,  group:'C' },
  { id:'s15', name:'Japan',             flag:'🇯🇵', confirmed:true,  group:'F' },
  { id:'s16', name:'Senegal',           flag:'🇸🇳', confirmed:true,  group:'I' },
  { id:'s17', name:'Colombia',          flag:'🇨🇴', confirmed:true,  group:'K' },
  { id:'s18', name:'Ecuador',           flag:'🇪🇨', confirmed:true,  group:'E' },
  { id:'s19', name:'Croatia',           flag:'🇭🇷', confirmed:true,  group:'L' },
  { id:'s20', name:'South Korea',       flag:'🇰🇷', confirmed:true,  group:'A' },
  { id:'s21', name:'Switzerland',       flag:'🇨🇭', confirmed:true,  group:'B' },
  { id:'s22', name:'Austria',           flag:'🇦🇹', confirmed:true,  group:'J' },
  { id:'s23', name:'Norway',            flag:'🇳🇴', confirmed:true,  group:'I' },
  { id:'s24', name:'Türkiye',           flag:'🇹🇷', confirmed:true,  group:'D' },
  { id:'s25', name:'DR Congo',          flag:'🇨🇩', confirmed:true,  group:'K' },
  { id:'s26', name:'Group A Runner-up', flag:'🏳️', confirmed:false, placeholder:'South Africa or Czechia',  group:'A' },
  { id:'s27', name:'Group B Runner-up', flag:'🏳️', confirmed:false, placeholder:'Bosnia & Herz. or Qatar', group:'B' },
  { id:'s28', name:'Group D Runner-up', flag:'🏳️', confirmed:false, placeholder:'Australia or Paraguay',   group:'D' },
  { id:'s29', name:'Group E Runner-up', flag:'🏳️', confirmed:false, placeholder:'Ivory Coast or Curaçao',  group:'E' },
  { id:'s30', name:'Group F Runner-up', flag:'🏳️', confirmed:false, placeholder:'Sweden or Tunisia',       group:'F' },
  { id:'s31', name:'Group G Runner-up', flag:'🏳️', confirmed:false, placeholder:'Egypt or Iran',           group:'G' },
  { id:'s32', name:'Group L Runner-up', flag:'🏳️', confirmed:false, placeholder:'Ghana or Panama',         group:'L' },
];

const r32Matches = [
  { id:'r32-1',  slotA:'s1',  slotB:'s26' },
  { id:'r32-2',  slotA:'s13', slotB:'s20' },
  { id:'r32-3',  slotA:'s12', slotB:'s21' },
  { id:'r32-4',  slotA:'s27', slotB:'s2'  },
  { id:'r32-5',  slotA:'s14', slotB:'s4'  },
  { id:'r32-6',  slotA:'s19', slotB:'s32' },
  { id:'r32-7',  slotA:'s11', slotB:'s24' },
  { id:'r32-8',  slotA:'s28', slotB:'s6'  },
  { id:'r32-9',  slotA:'s18', slotB:'s29' },
  { id:'r32-10', slotA:'s31', slotB:'s9'  },
  { id:'r32-11', slotA:'s15', slotB:'s30' },
  { id:'r32-12', slotA:'s8',  slotB:'s16' },
  { id:'r32-13', slotA:'s5',  slotB:'s10' },
  { id:'r32-14', slotA:'s23', slotB:'s3'  },
  { id:'r32-15', slotA:'s7',  slotB:'s17' },
  { id:'r32-16', slotA:'s25', slotB:'s22' },
];

// ============================================
// STATE
// ============================================
let currentUser = null;
let state = {
  bids:         {},  // bids[slotId][username] = amount
  owners:       {},  // owners[slotId] = { username, coins }  — original auction owner
  collection:   {},  // collection[username] = [{ slotId, how:'original'|'stolen'|'collected' }]
  auctionLocked:false,
  matchResults: {},  // matchResults[matchId] = { winnerSlot, loserSlot }
  slotOverrides:{},  // slotOverrides[slotId] = { name, flag }
  notifications:{},  // notifications[username] = [{ id, msg, type, ts, read, slotId }]
  playerPoints:{},   // playerPoints[username] = tiebreaker points
};

let unsubscribe = null;

// ============================================
// FIREBASE
// ============================================
async function saveToFirebase(data) {
  try {
    await setDoc(doc(db,'worldcup2026_r32','shared'), data, { merge:true });
  } catch(e) { showToast('Save failed','error'); }
}

async function loadFromFirebase() {
  try {
    const snap = await getDoc(doc(db,'worldcup2026_r32','shared'));
    return snap.exists() ? snap.data() : {};
  } catch(e) { return {}; }
}

function startLiveListener() {
  if (unsubscribe) unsubscribe();
  unsubscribe = onSnapshot(doc(db,'worldcup2026_r32','shared'), snap => {
    if (snap.exists()) {
      const d = snap.data();
      state.bids          = d.bids          || {};
      state.owners        = d.owners        || {};
      state.collection    = d.collection    || {};
      state.auctionLocked = d.auctionLocked || false;
      state.matchResults  = d.matchResults  || {};
      state.slotOverrides = d.slotOverrides || {};
      state.notifications = d.notifications || {};
      state.playerPoints  = d.playerPoints  || {};
      refreshAll();
    }
  });
}

function refreshAll() {
  updateHeader();
  if (!document.getElementById('auction').classList.contains('hidden'))     renderAuction();
  if (!document.getElementById('mypicks').classList.contains('hidden'))     renderMyPicks();
  if (!document.getElementById('leaderboard').classList.contains('hidden')) renderLeaderboard();
  if (!document.getElementById('results').classList.contains('hidden'))     renderResults();
  if (!document.getElementById('inbox').classList.contains('hidden'))       renderInbox();
}

// ============================================
// HELPERS
// ============================================
function getSlot(slotId) {
  const base = slots.find(s => s.id === slotId);
  if (!base) return null;
  const ov = state.slotOverrides[slotId];
  return ov ? { ...base, name:ov.name, flag:ov.flag, confirmed:true } : base;
}

function getCoinsSpent(username) {
  let spent = 0;
  Object.values(state.owners).forEach(o => { if (o.username === username) spent += o.coins; });
  return spent;
}

function getCoinsCommitted(username) {
  let committed = 0;
  Object.entries(state.bids).forEach(([slotId, bids]) => {
    if (state.owners[slotId]) return;
    if (bids[username]) committed += bids[username];
  });
  return committed;
}

function getCoinsRemaining(username) {
  return STARTING_COINS - getCoinsSpent(username) - getCoinsCommitted(username);
}

function getCollection(username) {
  return state.collection[username] || [];
}

function getTotalTeams(username) {
  return getCollection(username).length;
}

// Who currently "holds" a slot (could be stolen)
function getCurrentHolder(slotId) {
  for (const [username, col] of Object.entries(state.collection)) {
    if (col.find(c => c.slotId === slotId)) return username;
  }
  return null;
}

function addNotification(username, msg, type, slotId=null) {
  if (!state.notifications[username]) state.notifications[username] = [];
  state.notifications[username].unshift({ id: Date.now()+Math.random(), msg, type, slotId, ts: new Date().toISOString(), read:false });
  state.notifications[username] = state.notifications[username].slice(0,30);
}

function getUnreadCount(username) {
  return (state.notifications[username]||[]).filter(n=>!n.read).length;
}

function updateHeader() {
  const el = document.getElementById('welcome-msg');
  if (!el || !currentUser) return;
  const remaining = getCoinsRemaining(currentUser);
  const teams = getTotalTeams(currentUser);
  el.textContent = `${currentUser} · 🪙 ${remaining} coins · 🏳️ ${teams} teams`;
  const inboxBtn = document.getElementById('nav-inbox');
  if (inboxBtn) {
    const unread = getUnreadCount(currentUser);
    inboxBtn.innerHTML = unread > 0 ? `📬 Inbox <span class="notif-badge">${unread}</span>` : `📭 Inbox`;
  }
}

// ============================================
// LOGIN / LOGOUT
// ============================================
async function login(name) {
  showLoading(true);
  const d = await loadFromFirebase();
  state.bids          = d.bids          || {};
  state.owners        = d.owners        || {};
  state.collection    = d.collection    || {};
  state.auctionLocked = d.auctionLocked || false;
  state.matchResults  = d.matchResults  || {};
  state.slotOverrides = d.slotOverrides || {};
  state.notifications = d.notifications || {};
  state.playerPoints  = d.playerPoints  || {};

  currentUser = name;
  const isAdmin = name === 'Micole';

  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('reset-btn').classList.toggle('hidden', !isAdmin);
  document.getElementById('nav-results').classList.toggle('hidden', !isAdmin);

  updateHeader();
  renderRules();
  renderAuction();
  renderMyPicks();
  renderLeaderboard();
  renderInbox();
  if (isAdmin) renderResults();

  showSection('rules', { target: document.getElementById('nav-rules') });
  startLiveListener();
  showLoading(false);
}

function logout() {
  if (unsubscribe) unsubscribe();
  currentUser = null;
  document.getElementById('app').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
}
window.login  = login;
window.logout = logout;

// ============================================
// NAVIGATION
// ============================================
function showSection(id, e) {
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  if (e && e.target) e.target.classList.add('active');
  if (id === 'auction')     renderAuction();
  if (id === 'mypicks')     renderMyPicks();
  if (id === 'leaderboard') renderLeaderboard();
  if (id === 'results')     renderResults();
  if (id === 'inbox')       { markAllRead(); renderInbox(); }
}
window.showSection = showSection;

// ============================================
// RENDER AUCTION
// ============================================
function renderAuction() {
  const container = document.getElementById('auction-container');
  const statusBar  = document.getElementById('auction-status-bar');
  if (!container) return;

  const isAdmin    = currentUser === 'Micole';
  const coinsLeft  = getCoinsRemaining(currentUser);
  const teamCount  = getTotalTeams(currentUser);

  statusBar.innerHTML = `
    <div class="auction-status">
      <div class="auction-stat">
        <div class="auction-stat-val">🪙 ${coinsLeft}</div>
        <div class="auction-stat-lbl">coins left</div>
      </div>
      <div class="auction-stat">
        <div class="auction-stat-val">🏳️ ${teamCount}</div>
        <div class="auction-stat-lbl">teams owned</div>
      </div>

      ${state.auctionLocked ? '<div class="auction-locked-banner">🔒 Auction closed — squads are final</div>' : ''}

    </div>`;

  container.innerHTML = '';

  const confirmed   = slots.filter(s => s.confirmed || state.slotOverrides[s.id]);
  const placeholder = slots.filter(s => !s.confirmed && !state.slotOverrides[s.id]);

  const buildSection = (title, list) => {
    const titleEl = document.createElement('div');
    titleEl.className = 'auction-section-title';
    titleEl.textContent = title;
    container.appendChild(titleEl);
    const grid = document.createElement('div');
    grid.className = 'auction-grid';
    list.forEach(slot => grid.appendChild(buildSlotCard(slot, isAdmin)));
    container.appendChild(grid);
  };

  buildSection('✅ Confirmed Teams', confirmed);
  if (placeholder.length > 0) {
    const divEl = document.createElement('div');
    divEl.style.marginTop = '32px';
    container.appendChild(divEl);
    buildSection('⏳ TBD Slots — bid now, team confirmed later', placeholder);
  }

  if (isAdmin && !state.auctionLocked) {
    const lockBtn = document.createElement('button');
    lockBtn.className = 'cta-btn';
    lockBtn.style.cssText = 'margin:32px auto;display:block;background:var(--red);box-shadow:none;';
    lockBtn.textContent = '🔒 Lock Auction — Squads Final';
    lockBtn.onclick = lockAuction;
    container.appendChild(lockBtn);
  }
}

function buildSlotCard(slot, isAdmin) {
  const actualSlot  = getSlot(slot.id);
  const owner       = state.owners[slot.id];
  const myBid       = (state.bids[slot.id]||{})[currentUser] || 0;
  const allBids     = state.bids[slot.id] || {};
  const topBid      = Object.values(allBids).length ? Math.max(...Object.values(allBids)) : 0;
  const isMine      = owner?.username === currentUser;

  // Determine card status for border colour
  // green = I originally own it, purple = I stole/collected it, grey = eliminated
  const myCol = getCollection(currentUser);
  const myEntry = myCol.find(c => c.slotId === slot.id);
  const isInMyCollection = !!myEntry;
  const isStolen = myEntry?.how === 'stolen' || myEntry?.how === 'collected';
  const isEliminated = Object.values(state.matchResults).some(r => r.loserSlot === slot.id);

  const card = document.createElement('div');
  card.dataset.slotId = slot.id;
  let cardClass = 'slot-card';
  if (isInMyCollection && !isStolen) cardClass += ' slot-mine';
  else if (isInMyCollection && isStolen) cardClass += ' slot-stolen-mine';
  else if (isEliminated) cardClass += ' slot-eliminated';
  else if (!actualSlot.confirmed) cardClass += ' slot-tbd';
  card.className = cardClass;

  // Who owns it in the collection right now?
  const holder = getCurrentHolder(slot.id);
  const holderPlayer = holder ? PLAYERS.find(p => p.name === holder) : null;

  let ownerHTML = '';
  if (owner && state.auctionLocked) {
    // Show original owner + current holder if stolen
    const origPlayer = PLAYERS.find(p => p.name === owner.username);
    if (holder && holder !== owner.username) {
      const holP = PLAYERS.find(p => p.name === holder);
      ownerHTML = `
        <div class="slot-owner-row">
          <span class="slot-owner-orig">orig: ${origPlayer?.icon} ${owner.username}</span>
          <span class="slot-stolen-by">stolen by ${holP?.icon} ${holder}</span>
        </div>`;
    } else if (holder) {
      ownerHTML = `<div class="slot-owner">🟢 ${holderPlayer?.icon} ${holder} · ${owner.coins} coins</div>`;
    }
  } else if (!state.auctionLocked) {
    if (owner) {
      ownerHTML = `<div class="slot-owner">🟢 ${PLAYERS.find(p=>p.name===owner.username)?.icon} ${owner.username} · ${owner.coins} coins</div>`;
    } else if (topBid > 0) {
      const topBidder = Object.entries(allBids).find(([,v])=>v===topBid)?.[0];
      const tp = PLAYERS.find(p=>p.name===topBidder);
      ownerHTML = `<div class="slot-top-bid">🔥 Top bid: ${tp?.icon||''} ${topBidder} · ${topBid} coins</div>`;
    }
  }

  let eliminatedBadge = isEliminated ? `<div class="eliminated-badge">❌ Eliminated</div>` : '';

  card.innerHTML = `
    <div class="slot-flag">${actualSlot.flag}</div>
    <div class="slot-name">${actualSlot.name}</div>
    ${!actualSlot.confirmed ? `<div class="slot-placeholder">Either: ${slot.placeholder}</div>` : ''}
    <div class="slot-group-tag">Group ${actualSlot.group}</div>
    ${eliminatedBadge}
    ${ownerHTML}
  `;

  // Bid form — only pre-auction
  if (!owner && !state.auctionLocked && !isEliminated) {
    const coinsLeft  = getCoinsRemaining(currentUser);
    const bidSection = document.createElement('div');
    bidSection.className = 'bid-section';

    if (myBid > 0) {
      const upgradeMax = coinsLeft + myBid;
      bidSection.innerHTML = `
        <div class="my-bid-display">Your bid: <strong>${myBid} coins</strong></div>
        <div class="bid-row">
          <input type="number" min="5" max="${upgradeMax}" value="${myBid}" id="bid-input-${slot.id}" class="bid-input"/>
          <button class="bid-btn" onclick="placeBid('${slot.id}')">Update</button>
          <button class="bid-remove-btn" onclick="removeBid('${slot.id}')">✕</button>
        </div>
        <div class="bid-hint">min ${topBid+1} to lead · ${upgradeMax} coins available</div>`;
    } else {
      bidSection.innerHTML = `
        <div class="bid-row">
          <input type="number" min="5" max="${coinsLeft}" value="${Math.min(Math.max(topBid+1,5),coinsLeft)}" id="bid-input-${slot.id}" class="bid-input"/>
          <button class="bid-btn" onclick="placeBid('${slot.id}')">Bid 🪙</button>
        </div>
        <div class="bid-hint">${topBid>0?`min ${topBid+1} to lead · `:'min 5 coins · '}${coinsLeft} coins available</div>`;
    }
    card.appendChild(bidSection);
  }

  // Admin: update placeholder
  if (isAdmin && !actualSlot.confirmed) {
    const ov = document.createElement('div');
    ov.className = 'bid-section';
    ov.innerHTML = `
      <div class="bid-hint" style="margin-bottom:4px">Confirm team once known:</div>
      <input type="text" id="override-name-${slot.id}" class="bid-input" style="width:100%;margin-bottom:4px" placeholder="Team name"/>
      <input type="text" id="override-flag-${slot.id}" class="bid-input" style="width:60px;margin-bottom:4px" placeholder="🏳️"/>
      <button class="bid-btn" style="width:100%" onclick="confirmSlotTeam('${slot.id}')">Confirm Team</button>`;
    card.appendChild(ov);
  }

  return card;
}

// ============================================
// BIDDING
// ============================================
window.placeBid = async function(slotId) {
  const input  = document.getElementById(`bid-input-${slotId}`);
  const amount = parseInt(input?.value);
  const myCurrentBid   = (state.bids[slotId]||{})[currentUser] || 0;
  const coinsAvailable = getCoinsRemaining(currentUser) + myCurrentBid;

  if (isNaN(amount) || amount < 5) { showToast('Minimum bid is 5 coins!','error'); return; }
  if (amount > coinsAvailable) { showToast(`Only ${coinsAvailable} coins available!`,'error'); return; }

  // Notify anyone being outbid
  const existingBids = state.bids[slotId] || {};
  Object.entries(existingBids).forEach(([otherUser, otherBid]) => {
    if (otherUser !== currentUser && otherBid < amount) {
      const slot = getSlot(slotId);
      addNotification(otherUser,
        `🔥 ${currentUser} outbid you on ${slot?.flag} ${slot?.name} (your bid: ${otherBid} · their bid: ${amount})`,
        'outbid', slotId);
    }
  });

  if (!state.bids[slotId]) state.bids[slotId] = {};
  state.bids[slotId][currentUser] = amount;

  await saveToFirebase({ bids: state.bids, notifications: state.notifications });
  showToast(`Bid of ${amount} coins placed! 🪙`,'success');
  renderAuction();
  updateHeader();
};

window.removeBid = async function(slotId) {
  if (!confirm('Remove your bid?')) return;
  if (state.bids[slotId]) {
    delete state.bids[slotId][currentUser];
    await saveToFirebase({ bids: state.bids });
    showToast('Bid removed.','');
    renderAuction();
    updateHeader();
  }
};

window.confirmSlotTeam = async function(slotId) {
  const name = document.getElementById(`override-name-${slotId}`)?.value?.trim();
  const flag = document.getElementById(`override-flag-${slotId}`)?.value?.trim() || '🏳️';
  if (!name) { showToast('Enter the team name!','error'); return; }
  if (!confirm(`Confirm this slot is ${flag} ${name}?`)) return;
  if (!state.slotOverrides) state.slotOverrides = {};
  state.slotOverrides[slotId] = { name, flag };
  await saveToFirebase({ slotOverrides: state.slotOverrides });
  showToast(`Slot updated to ${name}!`,'success');
  renderAuction();
};

async function lockAuction() {
  if (!confirm('Lock the auction? Highest bidders automatically win their teams!')) return;
  if (!state.owners) state.owners = {};
  if (!state.collection) state.collection = {};

  // Assign owners and seed collections
  Object.entries(state.bids).forEach(([slotId, bids]) => {
    if (state.owners[slotId]) return;
    const entries = Object.entries(bids).sort(([,a],[,b]) => b-a);
    if (!entries.length) return;
    const [winner, coins] = entries[0];
    state.owners[slotId] = { username: winner, coins };
    // Add to winner's collection as 'original'
    if (!state.collection[winner]) state.collection[winner] = [];
    state.collection[winner].push({ slotId, how:'original' });
    // Notify losers
    entries.slice(1).forEach(([loser]) => {
      const slot = getSlot(slotId);
      addNotification(loser,
        `❌ You lost the auction for ${slot?.flag} ${slot?.name} — ${winner} won it`,
        'lost', slotId);
    });
    // Notify winner
    const slot = getSlot(slotId);
    addNotification(winner,
      `✅ You won the auction for ${slot?.flag} ${slot?.name}!`,
      'win', slotId);
  });

  state.auctionLocked = true;
  await saveToFirebase({ auctionLocked:true, owners:state.owners, collection:state.collection, notifications:state.notifications });
  showToast('Auction locked — squads confirmed! 🔒','success');
  renderAuction();
}

// ============================================
// MY PICKS
// ============================================
function renderMyPicks() {
  const container = document.getElementById('mypicks-container');
  if (!container) return;
  container.innerHTML = '';

  const myCol    = getCollection(currentUser);
  const coinsSpent = getCoinsSpent(currentUser);

  const summary = document.createElement('div');
  summary.className = 'squad-summary';
  summary.innerHTML = `
    <div class="squad-stat">
      <div class="squad-stat-val">🪙 ${coinsSpent}</div>
      <div class="squad-stat-lbl">coins spent</div>
    </div>
    <div class="squad-stat">
      <div class="squad-stat-val">🪙 ${getCoinsRemaining(currentUser)}</div>
      <div class="squad-stat-lbl">coins left</div>
    </div>
    <div class="squad-stat">
      <div class="squad-stat-val" style="color:var(--gold)">🏳️ ${myCol.length}</div>
      <div class="squad-stat-lbl">total teams</div>
    </div>
    <div class="squad-stat">
      <div class="squad-stat-val" style="color:var(--bet)">${myCol.filter(c=>c.how==='stolen'||c.how==='collected').length}</div>
      <div class="squad-stat-lbl">stolen/collected</div>
    </div>`;
  container.appendChild(summary);

  if (myCol.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'squad-empty';
    empty.innerHTML = `<div style="font-size:2.5rem;margin-bottom:12px">🏴‍☠️</div><div style="font-weight:600;margin-bottom:6px">No teams yet!</div><div style="color:var(--text2);font-size:.88rem">Head to the Auction tab to place your bids.</div>`;
    container.appendChild(empty);
  } else {
    const grid = document.createElement('div');
    grid.className = 'squad-grid';
    myCol.forEach(({ slotId, how }) => {
      const slot = getSlot(slotId);
      const isEliminated = Object.values(state.matchResults).some(r => r.loserSlot === slotId);
      const card = document.createElement('div');
      card.className = 'squad-card' + (isEliminated ? ' squad-eliminated' : '') + (how === 'original' ? ' squad-original' : ' squad-stolen');
      const howLabel = how === 'original' ? '🟢 Bought' : how === 'stolen' ? '🟣 Stolen' : '🟣 Collected';
      card.innerHTML = `
        <div class="squad-flag">${slot?.flag||'🏳️'}</div>
        <div class="squad-name">${slot?.name||slotId}</div>
        <div class="squad-how">${howLabel}</div>
        ${isEliminated ? '<div class="squad-status eliminated">❌ Eliminated</div>' : '<div class="squad-status active">✅ Still in</div>'}`;
      grid.appendChild(card);
    });
    container.appendChild(grid);
  }

  // Pending bids
  const pending = Object.entries(state.bids)
    .filter(([slotId, bids]) => bids[currentUser] && !state.owners[slotId])
    .map(([slotId, bids]) => ({ slotId, amount: bids[currentUser] }));

  if (pending.length > 0) {
    const pt = document.createElement('div');
    pt.className = 'auction-section-title';
    pt.style.marginTop = '28px';
    pt.textContent = '⏳ Pending Bids';
    container.appendChild(pt);
    const pg = document.createElement('div');
    pg.className = 'squad-grid';
    pending.forEach(({ slotId, amount }) => {
      const slot = getSlot(slotId);
      const allBids = state.bids[slotId] || {};
      const topBid = Math.max(...Object.values(allBids));
      const isLeading = topBid === amount;
      const card = document.createElement('div');
      card.className = 'squad-card';
      card.innerHTML = `
        <div class="squad-flag">${slot?.flag||'🏳️'}</div>
        <div class="squad-name">${slot?.name||slotId}</div>
        <div class="squad-coins">🪙 ${amount} coins bid</div>
        <div class="squad-status ${isLeading?'active':'eliminated'}">${isLeading?'🔥 Leading':`⚠️ Outbid! (top: ${topBid})`}</div>`;
      pg.appendChild(card);
    });
    container.appendChild(pg);
  }
}

// ============================================
// RESULTS (admin)
// ============================================
function renderResults() {
  const container = document.getElementById('results-container');
  if (!container) return;
  container.innerHTML = '';

  const title = document.createElement('div');
  title.className = 'auction-section-title';
  title.textContent = 'Round of 32 Results';
  container.appendChild(title);

  const grid = document.createElement('div');
  grid.className = 'results-grid';

  r32Matches.forEach(match => {
    const slotA   = getSlot(match.slotA);
    const slotB   = getSlot(match.slotB);
    const result  = state.matchResults[match.id];
    const holderA = getCurrentHolder(match.slotA);
    const holderB = getCurrentHolder(match.slotB);
    const pA = holderA ? PLAYERS.find(p=>p.name===holderA) : null;
    const pB = holderB ? PLAYERS.find(p=>p.name===holderB) : null;

    const card = document.createElement('div');
    card.className = 'result-card';

    if (result) {
      const winner = getSlot(result.winnerSlot);
      const loser  = getSlot(result.loserSlot);
      card.innerHTML = `
        <div class="result-done">
          <div class="result-winner">✅ ${winner?.flag} ${winner?.name} won</div>
          <div class="result-loser">❌ ${loser?.flag} ${loser?.name} eliminated</div>
          <button class="bid-remove-btn" style="margin-top:8px" onclick="clearResult('${match.id}')">↩ Undo</button>
        </div>`;
    } else {
      card.innerHTML = `
        <div class="result-teams">
          <div class="result-team">
            <span>${slotA?.flag||'🏳️'} ${slotA?.name||'TBD'}</span>
            ${pA ? `<span class="result-owner">${pA.icon} ${holderA}</span>` : '<span class="result-owner no-owner">unowned</span>'}
          </div>
          <div class="result-vs">VS</div>
          <div class="result-team">
            <span>${slotB?.flag||'🏳️'} ${slotB?.name||'TBD'}</span>
            ${pB ? `<span class="result-owner">${pB.icon} ${holderB}</span>` : '<span class="result-owner no-owner">unowned</span>'}
          </div>
        </div>
        <div class="result-btns">
          <button class="result-pick-btn" onclick="recordResult('${match.id}','${match.slotA}','${match.slotB}')">
            ${slotA?.flag||'🏳️'} ${slotA?.name||'?'} won
          </button>
          <button class="result-pick-btn" onclick="recordResult('${match.id}','${match.slotB}','${match.slotA}')">
            ${slotB?.flag||'🏳️'} ${slotB?.name||'?'} won
          </button>
        </div>`;
    }
    grid.appendChild(card);
  });
  container.appendChild(grid);
}

window.recordResult = async function(matchId, winnerSlot, loserSlot) {
  const winner     = getSlot(winnerSlot);
  const loser      = getSlot(loserSlot);
  if (!confirm(`${winner?.name} beat ${loser?.name}?`)) return;

  state.matchResults[matchId] = { winnerSlot, loserSlot };
  if (!state.playerPoints) state.playerPoints = {};

  const winnerHolder = getCurrentHolder(winnerSlot);
  const loserHolder  = getCurrentHolder(loserSlot);

  // Get original auction coins for points calculation
  const winnerCoins = state.owners[winnerSlot]?.coins || 0;
  const loserCoins  = state.owners[loserSlot]?.coins  || 0;
  const stolen      = Math.round(loserCoins * STEAL_PCT);

  if (winnerHolder && loserHolder && winnerHolder === loserHolder) {
    // SELF-OWN: same person owns both teams — winner stays, loser just disappears
    state.collection[winnerHolder] = (state.collection[winnerHolder]||[]).filter(c => c.slotId !== loserSlot);
    // Still earn flat win points
    state.playerPoints[winnerHolder] = (state.playerPoints[winnerHolder]||0) + WIN_POINTS;
    addNotification(winnerHolder,
      `⚽ Your ${winner?.flag} ${winner?.name} beat your own ${loser?.flag} ${loser?.name} — ${loser?.name} is eliminated, you earned ${WIN_POINTS} pts`,
      'win', winnerSlot);
    showToast(`${winner?.name} beat your own ${loser?.name} — ${loser?.name} eliminated`,'');

  } else if (winnerHolder) {
    // Winner is owned
    // Points: flat win + 50% of loser's coins as steal bonus
    state.playerPoints[winnerHolder] = (state.playerPoints[winnerHolder]||0) + WIN_POINTS + stolen;


    if (loserHolder) {
      // Loser is owned by someone else — steal their team + points
      state.collection[loserHolder] = (state.collection[loserHolder]||[]).filter(c => c.slotId !== loserSlot);
      if (!state.collection[winnerHolder]) state.collection[winnerHolder] = [];
      state.collection[winnerHolder].push({ slotId: loserSlot, how:'stolen' });

      // Loser loses the stolen points too
      state.playerPoints[loserHolder] = (state.playerPoints[loserHolder]||0) - stolen;

      addNotification(winnerHolder,
        `🔥 Your ${winner?.flag} ${winner?.name} beat ${loserHolder}'s ${loser?.flag} ${loser?.name} — you stole their team! +${WIN_POINTS} win pts + ${stolen} stolen from ${loserHolder} = +${WIN_POINTS + stolen} pts total`,
        'steal', loserSlot);
      addNotification(loserHolder,
        `💸 ${winnerHolder}'s ${winner?.flag} ${winner?.name} knocked out your ${loser?.flag} ${loser?.name} — ${winnerHolder} stole ${stolen} pts from you! (−${stolen} pts)`,
        'stolen', loserSlot);
      showToast(`${winnerHolder} stole ${loser?.name} from ${loserHolder}! +${WIN_POINTS + stolen} pts 🔥`,'success');
    } else {
      // Loser unowned — winner just collects them, no stolen points
      if (!state.collection[winnerHolder]) state.collection[winnerHolder] = [];
      state.collection[winnerHolder].push({ slotId: loserSlot, how:'collected' });
      addNotification(winnerHolder,
        `✅ Your ${winner?.flag} ${winner?.name} beat unowned ${loser?.flag} ${loser?.name} — collected! +${WIN_POINTS} pts`,
        'collect', loserSlot);
      showToast(`${winnerHolder} collected ${loser?.name}! +${WIN_POINTS} pts ✅`,'success');
    }
  } else {
    // Winner is unowned
    if (loserHolder) {
      // Loser owned but beaten by unowned team — team just disappears, no steal
      state.collection[loserHolder] = (state.collection[loserHolder]||[]).filter(c => c.slotId !== loserSlot);
      addNotification(loserHolder,
        `❌ Your ${loser?.flag} ${loser?.name} was knocked out by unowned ${winner?.flag} ${winner?.name} — your team is gone`,
        'loss', loserSlot);
      showToast(`${loser?.name} eliminated — ${loserHolder} loses their team`,'');
    }
  }

  await saveToFirebase({
    matchResults:  state.matchResults,
    collection:    state.collection,
    notifications: state.notifications,
    playerPoints:  state.playerPoints,
  });
  renderResults();
  renderLeaderboard();
  renderMyPicks();
};

window.clearResult = async function(matchId) {
  if (!confirm('Undo this result? Collections will NOT be automatically reversed.')) return;
  delete state.matchResults[matchId];
  await saveToFirebase({ matchResults: state.matchResults });
  showToast('Result undone.','');
  renderResults();
};

// ============================================
// LEADERBOARD
// ============================================
function renderLeaderboard() {
  const container = document.getElementById('leaderboard-container');
  if (!container) return;
  container.innerHTML = '';

  const scored = PLAYERS.map(p => ({
    ...p,
    total:    getTotalTeams(p.name),
    pts:      state.playerPoints[p.name] || 0,
    original: getCollection(p.name).filter(c=>c.how==='original').length,
    stolen:   getCollection(p.name).filter(c=>c.how==='stolen'||c.how==='collected').length,
    col:      getCollection(p.name),
  })).sort((a,b) => b.total !== a.total ? b.total - a.total : b.pts - a.pts);

  const medals  = ['🥇','🥈','🥉','4️⃣','5️⃣'];
  const classes = ['first','second','third','',''];

  scored.forEach((player, i) => {
    const row = document.createElement('div');
    row.className = `leaderboard-row ${classes[i]||''}`;

    const badges = player.col.map(({ slotId, how }) => {
      const slot = getSlot(slotId);
      const isElim = Object.values(state.matchResults).some(r => r.loserSlot === slotId);
      const cls = how === 'original' ? 'team-badge-green' : 'team-badge-purple';
      return `<span class="team-badge ${cls}" style="${isElim?'opacity:.4':''}">
        ${slot?.flag||'🏳️'} ${slot?.name||slotId}
      </span>`;
    }).join('');

    row.innerHTML = `
      <div class="lb-position">${medals[i]}</div>
      <div class="lb-info">
        <div class="lb-name">${player.icon} ${player.name}</div>
        <div class="lb-type">${player.original} bought · ${player.stolen} stolen/collected</div>
        ${badges ? `<div class="lb-teams">${badges}</div>` : '<div class="lb-breakdown" style="color:var(--text3);font-style:italic">No teams yet</div>'}
      </div>
      <div class="lb-scores">
        <div class="lb-score-col">
          <div class="lb-points" style="color:var(--gold)">${player.total}</div>
          <div class="lb-pts-label">TEAMS</div>
        </div>
        <div class="lb-score-divider"></div>
        <div class="lb-score-col">
          <div class="lb-points" style="color:var(--bet)">${player.pts}</div>
          <div class="lb-pts-label">PTS</div>
        </div>
      </div>`;
    container.appendChild(row);
  });

  if (Object.keys(state.matchResults).length === 0) {
    const note = document.createElement('div');
    note.className = 'leaderboard-empty';
    note.innerHTML = '⚽ Teams update as match results are entered.';
    container.appendChild(note);
  }
}

// ============================================
// INBOX
// ============================================
async function markAllRead() {
  const notifs = state.notifications[currentUser] || [];
  notifs.forEach(n => n.read = true);
  state.notifications[currentUser] = notifs;
  await saveToFirebase({ notifications: state.notifications });
  updateHeader();
}
window.markAllRead = markAllRead;

window.jumpToBid = function(slotId) {
  showSection('auction', { target: document.getElementById('nav-auction') });
  setTimeout(() => {
    const card = document.querySelector(`[data-slot-id="${slotId}"]`);
    if (card) card.scrollIntoView({ behavior:'smooth', block:'center' });
  }, 150);
};

function renderInbox() {
  const container = document.getElementById('inbox-container');
  if (!container) return;
  container.innerHTML = '';

  const notifs = state.notifications[currentUser] || [];
  const unread  = notifs.filter(n=>!n.read).length;

  if (notifs.length === 0) {
    container.innerHTML = `<div class="inbox-empty"><div style="font-size:2.5rem;margin-bottom:12px">📭</div><div style="font-weight:600;margin-bottom:6px">All quiet here</div><div style="color:var(--text2);font-size:.88rem">Outbid alerts and steal notifications will appear here.</div></div>`;
    return;
  }

  if (unread > 0) {
    const btn = document.createElement('button');
    btn.className = 'bid-btn';
    btn.style.cssText = 'margin-bottom:16px;padding:8px 20px;';
    btn.textContent = `Mark all as read (${unread})`;
    btn.onclick = () => { markAllRead(); renderInbox(); };
    container.appendChild(btn);
  }

  notifs.forEach(n => {
    const item = document.createElement('div');
    item.className = `inbox-item ${n.read?'inbox-read':'inbox-unread'} inbox-${n.type}`;
    const ts = new Date(n.ts);
    const timeStr = ts.toLocaleDateString('en-ZA',{day:'numeric',month:'short'}) + ' · ' + ts.toLocaleTimeString('en-ZA',{hour:'2-digit',minute:'2-digit'});
    item.innerHTML = `
      <div class="inbox-msg">${n.msg}</div>
      <div class="inbox-meta">
        ${!n.read ? '<span class="inbox-dot"></span>' : ''}
        <span class="inbox-time">${timeStr}</span>
        ${n.slotId && n.type==='outbid' && !state.auctionLocked
          ? `<button class="inbox-action-btn" onclick="jumpToBid('${n.slotId}')">Up my bid →</button>`
          : ''}
      </div>`;
    container.appendChild(item);
  });
}

// ============================================
// RULES
// ============================================
function renderRules() {
  const container = document.getElementById('rules-container');
  if (!container) return;
  container.innerHTML = `
    <div class="rules-block">
      <h3>A completely different game</h3>
      <p>Forget score predictions. The Round of 32 is a territory game. You buy teams at auction, then watch who ends up with the most flags when all 16 matches are done.</p>
    </div>
    <div class="rules-block">
      <h3>🪙 The Auction</h3>
      <p>Everyone starts with <strong>100 coins</strong>. All 32 teams are up for bid simultaneously. Highest bid wins. Minimum bid is 5 coins. No minimum teams required — but read below before going all in on one team!</p>
    </div>
    <div class="rules-block">
      <h3>📈 More Teams = More Chances</h3>
      <p>There are only 16 matches in the Round of 32. Every team plays exactly once. The more teams you own, the more matches you're involved in.</p>
      <div class="rules-scoring">
        <div class="rules-score-row"><span class="score-badge neutral">1 team</span> 1 match. Win and you earn. Lose and you're completely done — no more games.</div>
        <div class="rules-score-row"><span class="score-badge silver">5 teams</span> 5 matches. Even if 2 lose you still have 3 earning points and stealing teams.</div>
        <div class="rules-score-row"><span class="score-badge gold">8 teams</span> 8 matches. Maximum coverage — losses hurt less because you have more games running.</div>
      </div>
      <p style="margin-top:12px"><strong>Example:</strong> You spend all 100 coins on France. France beat Zac's Senegal (20 coins) → you earn 10 pts + steal 10 pts = 20 pts. That's it — France is done for the round and so are you. Meanwhile Zac spent only 20 on Senegal and has 80 coins left across 4 more teams, still earning in 4 more matches.</p>
      <p style="margin-top:8px">Spread your coins. More teams means more matches, more steals, and more chances to win 🏴 — but also more exposure to losing points. See the points rules below!</p>
    </div>
    <div class="rules-block">
      <h3>🟢 Bought vs 🟣 Stolen</h3>
      <p>Teams you win in the auction show with a <strong style="color:var(--teal)">green border</strong>. Teams you steal or collect during the tournament show with a <strong style="color:var(--bet)">purple border</strong>. Both count toward your total.</p>
    </div>
    <div class="rules-block">
      <h3>What happens when teams play?</h3>
      <div class="rules-scoring">
        <div class="rules-score-row"><span class="score-badge gold">🔥 Steal</span> Your team beats someone else's owned team → you steal their team</div>
        <div class="rules-score-row"><span class="score-badge gold">✅ Collect</span> Your team beats an unowned team → you collect that team</div>
        <div class="rules-score-row"><span class="score-badge neutral">❌ Lose</span> Your team loses → your team disappears, nobody gets it</div>
        <div class="rules-score-row"><span class="score-badge neutral">👻 Void</span> Unowned team beats unowned team → nothing changes</div>
      </div>
    </div>
    <div class="rules-block">
      <h3>⭐ Points (Tiebreaker)</h3>
      <p>Points run alongside the territory game as a tiebreaker. When your team wins you earn points equal to the coins you spent on them. When you steal someone's team you also steal <strong>50% of their coin investment</strong> as bonus points. If two players are tied on teams, the higher points total wins.</p>
      <div class="rules-scoring">
        <div class="rules-score-row"><span class="score-badge gold">Win</span> Earn points = coins you spent on that team</div>
        <div class="rules-score-row"><span class="score-badge gold">Steal</span> Earn win points + 50% of loser's coin investment</div>
        <div class="rules-score-row"><span class="score-badge neutral">Collect</span> Earn win points only (unowned team, no steal bonus)</div>
      </div>
    </div>
    <div class="rules-block">
      <h3>🏆 How to Win</h3>
      <p><strong>Primary:</strong> Most teams collected wins. <strong>Tiebreaker:</strong> Most points wins. Back the right teams in the auction and you'll end up with a bigger collection AND more points than anyone else.</p>
    </div>
    <div class="rules-block">
      <h3>⚽ What if I own both teams in a match?</h3>
      <p>Your winning team stays, your losing team is eliminated. No stealing from yourself! You still earn points for the win though.</p>
    </div>
    <div class="rules-block">
      <h3>📬 Inbox</h3>
      <p>Check your inbox — you'll get notified when someone outbids you during the auction, when your team steals another, or when your team gets eliminated.</p>
    </div>`;
}

// ============================================
// LOADING, TOAST, RESET
// ============================================
function showLoading(show) {
  let overlay = document.getElementById('loading-overlay');
  if (show && !overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `<div class="loading-spinner"></div><div class="loading-text">Loading...</div>`;
    document.body.appendChild(overlay);
  } else if (!show && overlay) {
    overlay.remove();
  }
}

function showToast(msg, type='') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

async function resetEverything() {
  if (!confirm('⚠️ RESET ALL AUCTION DATA?')) return;
  if (!confirm('100% sure?')) return;
  showLoading(true);
  await setDoc(doc(db,'worldcup2026_r32','shared'), {
    bids:{}, owners:{}, collection:{}, auctionLocked:false,
    matchResults:{}, slotOverrides:{}, notifications:{}, playerPoints:{}
  });
  state = { bids:{}, owners:{}, collection:{}, auctionLocked:false, matchResults:{}, slotOverrides:{}, notifications:{}, playerPoints:{} };
  showLoading(false);
  showToast('🗑️ All data reset!','success');
  renderAuction(); renderMyPicks(); renderLeaderboard(); updateHeader();
}
window.resetEverything = resetEverything;
