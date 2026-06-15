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
  { name: 'Micole',   icon: '🐻', isAI: false },
  { name: 'Mom',      icon: '🦒', isAI: false },
  { name: 'Zac',      icon: '🦥', isAI: false },
  { name: 'Sean',     icon: '🦅', isAI: false },
  { name: 'Patricia', icon: '🦩', isAI: false },
];

// ============================================
// STARTING COINS & RULES
// ============================================
const STARTING_COINS   = 100;
const MIN_TEAMS        = 3;
const WIN_POINTS_R32   = 10;   // points for winning a R32 match
const WIN_POINTS_R16   = 20;
const WIN_POINTS_QF    = 35;
const WIN_POINTS_SF    = 50;
const WIN_POINTS_FINAL = 75;
const STEAL_PCT        = 0.3;  // 30% of loser's bid stolen by winner's owner

// ============================================
// ROUND OF 32 SLOTS
// 25 confirmed teams + 7 placeholders
// ============================================
const slots = [
  // Confirmed teams
  { id: 's1',  name: 'Brazil',        flag: '🇧🇷', confirmed: true,  group: 'C' },
  { id: 's2',  name: 'France',        flag: '🇫🇷', confirmed: true,  group: 'I' },
  { id: 's3',  name: 'Argentina',     flag: '🇦🇷', confirmed: true,  group: 'J' },
  { id: 's4',  name: 'England',       flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', confirmed: true,  group: 'L' },
  { id: 's5',  name: 'Spain',         flag: '🇪🇸', confirmed: true,  group: 'H' },
  { id: 's6',  name: 'Germany',       flag: '🇩🇪', confirmed: true,  group: 'E' },
  { id: 's7',  name: 'Portugal',      flag: '🇵🇹', confirmed: true,  group: 'K' },
  { id: 's8',  name: 'Netherlands',   flag: '🇳🇱', confirmed: true,  group: 'F' },
  { id: 's9',  name: 'Belgium',       flag: '🇧🇪', confirmed: true,  group: 'G' },
  { id: 's10', name: 'Uruguay',       flag: '🇺🇾', confirmed: true,  group: 'H' },
  { id: 's11', name: 'USA',           flag: '🇺🇸', confirmed: true,  group: 'D' },
  { id: 's12', name: 'Canada',        flag: '🇨🇦', confirmed: true,  group: 'B' },
  { id: 's13', name: 'Mexico',        flag: '🇲🇽', confirmed: true,  group: 'A' },
  { id: 's14', name: 'Morocco',       flag: '🇲🇦', confirmed: true,  group: 'C' },
  { id: 's15', name: 'Japan',         flag: '🇯🇵', confirmed: true,  group: 'F' },
  { id: 's16', name: 'Senegal',       flag: '🇸🇳', confirmed: true,  group: 'I' },
  { id: 's17', name: 'Colombia',      flag: '🇨🇴', confirmed: true,  group: 'K' },
  { id: 's18', name: 'Ecuador',       flag: '🇪🇨', confirmed: true,  group: 'E' },
  { id: 's19', name: 'Croatia',       flag: '🇭🇷', confirmed: true,  group: 'L' },
  { id: 's20', name: 'South Korea',   flag: '🇰🇷', confirmed: true,  group: 'A' },
  { id: 's21', name: 'Switzerland',   flag: '🇨🇭', confirmed: true,  group: 'B' },
  { id: 's22', name: 'Austria',       flag: '🇦🇹', confirmed: true,  group: 'J' },
  { id: 's23', name: 'Norway',        flag: '🇳🇴', confirmed: true,  group: 'I' },
  { id: 's24', name: 'Türkiye',       flag: '🇹🇷', confirmed: true,  group: 'D' },
  { id: 's25', name: 'DR Congo',      flag: '🇨🇩', confirmed: true,  group: 'K' },

  // Placeholder slots — TBD from group stage
  { id: 's26', name: 'Group A Runner-up', flag: '🏳️', confirmed: false, placeholder: 'South Africa or Czechia',     group: 'A' },
  { id: 's27', name: 'Group B Runner-up', flag: '🏳️', confirmed: false, placeholder: 'Bosnia & Herz. or Qatar',      group: 'B' },
  { id: 's28', name: 'Group D Runner-up', flag: '🏳️', confirmed: false, placeholder: 'Australia or Paraguay',        group: 'D' },
  { id: 's29', name: 'Group E Runner-up', flag: '🏳️', confirmed: false, placeholder: 'Ivory Coast or Curaçao',       group: 'E' },
  { id: 's30', name: 'Group F Runner-up', flag: '🏳️', confirmed: false, placeholder: 'Sweden or Tunisia',            group: 'F' },
  { id: 's31', name: 'Group G Runner-up', flag: '🏳️', confirmed: false, placeholder: 'Egypt or Iran',                group: 'G' },
  { id: 's32', name: 'Group L Runner-up', flag: '🏳️', confirmed: false, placeholder: 'Ghana or Panama',              group: 'L' },
];

// ============================================
// ROUND OF 32 MATCH FIXTURES
// ============================================
const r32Matches = [
  { id: 'r32-1',  slotA: 's1',  slotB: 's26', label: 'Brazil vs Group A Runner-up' },
  { id: 'r32-2',  slotA: 's13', slotB: 's20', label: 'Mexico vs South Korea' },
  { id: 'r32-3',  slotA: 's12', slotB: 's21', label: 'Canada vs Switzerland' },
  { id: 'r32-4',  slotA: 's27', slotB: 's2',  label: 'Group B Runner-up vs France' },
  { id: 'r32-5',  slotA: 's14', slotB: 's4',  label: 'Morocco vs England' },
  { id: 'r32-6',  slotA: 's19', slotB: 's32', label: 'Croatia vs Group L Runner-up' },
  { id: 'r32-7',  slotA: 's11', slotB: 's24', label: 'USA vs Türkiye' },
  { id: 'r32-8',  slotA: 's28', slotB: 's6',  label: 'Group D Runner-up vs Germany' },
  { id: 'r32-9',  slotA: 's18', slotB: 's29', label: 'Ecuador vs Group E Runner-up' },
  { id: 'r32-10', slotA: 's31', slotB: 's9',  label: 'Group G Runner-up vs Belgium' },
  { id: 'r32-11', slotA: 's15', slotB: 's30', label: 'Japan vs Group F Runner-up' },
  { id: 'r32-12', slotA: 's8',  slotB: 's16', label: 'Netherlands vs Senegal' },
  { id: 'r32-13', slotA: 's5',  slotB: 's10', label: 'Spain vs Uruguay' },
  { id: 'r32-14', slotA: 's23', slotB: 's3',  label: 'Norway vs Argentina' },
  { id: 'r32-15', slotA: 's7',  slotB: 's17', label: 'Portugal vs Colombia' },
  { id: 'r32-16', slotA: 's25', slotB: 's22', label: 'DR Congo vs Austria' },
];

// ============================================
// APP STATE
// ============================================
let currentUser = null;
let state = {
  bids: {},          // bids[slotId][username] = coinAmount
  owners: {},        // owners[slotId] = { username, coins }
  auctionLocked: false,
  matchResults: {},  // matchResults[matchId] = { winnerSlot, loserSlot }
  playerPoints: {},  // playerPoints[username] = total points earned
  eliminatedSlots: [],
  // admin can update placeholder names
  slotOverrides: {}, // slotOverrides[slotId] = { name, flag }
};

let unsubscribe = null;

// ============================================
// FIREBASE HELPERS
// ============================================
async function saveToFirebase(docName, data) {
  try {
    await setDoc(doc(db, 'worldcup2026_r32', docName), data, { merge: true });
  } catch(e) {
    showToast('Save failed — check connection', 'error');
  }
}

async function loadFromFirebase(docName) {
  try {
    const snap = await getDoc(doc(db, 'worldcup2026_r32', docName));
    return snap.exists() ? snap.data() : {};
  } catch(e) { return {}; }
}

function startLiveListener() {
  if (unsubscribe) unsubscribe();
  unsubscribe = onSnapshot(doc(db, 'worldcup2026_r32', 'shared'), (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      state.bids           = data.bids           || {};
      state.owners         = data.owners         || {};
      state.auctionLocked  = data.auctionLocked  || false;
      state.matchResults   = data.matchResults   || {};
      state.playerPoints   = data.playerPoints   || {};
      state.eliminatedSlots= data.eliminatedSlots|| [];
      state.slotOverrides  = data.slotOverrides  || {};
      refreshAll();
    }
  });
}

function refreshAll() {
  updateHeaderCoins();
  if (!document.getElementById('auction').classList.contains('hidden'))    renderAuction();
  if (!document.getElementById('mypicks').classList.contains('hidden'))    renderMyPicks();
  if (!document.getElementById('leaderboard').classList.contains('hidden'))renderLeaderboard();
  if (!document.getElementById('results').classList.contains('hidden'))    renderResults();
}

// ============================================
// COIN HELPERS
// ============================================
function getCoinsSpent(username) {
  // Only count confirmed owned teams
  let spent = 0;
  Object.values(state.owners).forEach(o => {
    if (o.username === username) spent += o.coins;
  });
  return spent;
}

function getCoinsCommitted(username) {
  // Coins tied up in active bids on unowned slots
  let committed = 0;
  Object.entries(state.bids).forEach(([slotId, bids]) => {
    if (state.owners[slotId]) return;
    if (bids[username]) committed += bids[username];
  });
  return committed;
}

function getCoinsRemaining(username) {
  // Available = starting minus confirmed purchases minus active bids
  return STARTING_COINS - getCoinsSpent(username) - getCoinsCommitted(username);
}

function getTeamsOwned(username) {
  return Object.entries(state.owners)
    .filter(([, o]) => o.username === username)
    .map(([slotId]) => slotId);
}

function getSlot(slotId) {
  const base = slots.find(s => s.id === slotId);
  if (!base) return null;
  const override = state.slotOverrides[slotId];
  if (override) return { ...base, name: override.name, flag: override.flag, confirmed: true };
  return base;
}

function updateHeaderCoins() {
  const el = document.getElementById('welcome-msg');
  if (!el || !currentUser) return;
  const remaining = getCoinsRemaining(currentUser);
  const owned = getTeamsOwned(currentUser).length;
  el.textContent = `${currentUser} · 🪙 ${remaining} coins · ${owned} teams`;
}

// ============================================
// LOGIN / LOGOUT
// ============================================
async function login(name) {
  showLoading(true);
  const shared = await loadFromFirebase('shared');
  state.bids            = shared.bids            || {};
  state.owners          = shared.owners          || {};
  state.auctionLocked   = shared.auctionLocked   || false;
  state.matchResults    = shared.matchResults    || {};
  state.playerPoints    = shared.playerPoints    || {};
  state.eliminatedSlots = shared.eliminatedSlots || [];
  state.slotOverrides   = shared.slotOverrides   || {};

  currentUser = name;
  const isAdmin = name === 'Micole';

  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');

  document.getElementById('reset-btn').classList.toggle('hidden', !isAdmin);
  document.getElementById('nav-results').classList.toggle('hidden', !isAdmin);

  updateHeaderCoins();
  renderRules();
  renderAuction();
  renderMyPicks();
  renderLeaderboard();
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
}
window.showSection = showSection;

// ============================================
// RENDER AUCTION
// ============================================
function renderAuction() {
  const container = document.getElementById('auction-container');
  const statusBar  = document.getElementById('auction-status-bar');
  if (!container) return;

  const isAdmin = currentUser === 'Micole';
  const coinsLeft = getCoinsRemaining(currentUser);
  const teamsOwned = getTeamsOwned(currentUser).length;

  // Status bar
  statusBar.innerHTML = `
    <div class="auction-status">
      <div class="auction-stat">
        <div class="auction-stat-val">🪙 ${coinsLeft}</div>
        <div class="auction-stat-lbl">coins left</div>
      </div>
      <div class="auction-stat">
        <div class="auction-stat-val">🏳️ ${teamsOwned}</div>
        <div class="auction-stat-lbl">teams owned</div>
      </div>
      <div class="auction-stat">
        <div class="auction-stat-val" style="color:${teamsOwned >= MIN_TEAMS ? 'var(--teal)' : 'var(--red)'}">
          ${teamsOwned >= MIN_TEAMS ? '✅' : '⚠️'} ${MIN_TEAMS} min
        </div>
        <div class="auction-stat-lbl">required</div>
      </div>
      ${state.auctionLocked ? '<div class="auction-locked-banner">🔒 Auction closed — squads are final</div>' : ''}
    </div>
  `;

  container.innerHTML = '';

  // Group confirmed vs placeholder
  const confirmed   = slots.filter(s => s.confirmed || state.slotOverrides[s.id]);
  const placeholder = slots.filter(s => !s.confirmed && !state.slotOverrides[s.id]);

  // CONFIRMED TEAMS
  const confirmedTitle = document.createElement('div');
  confirmedTitle.className = 'auction-section-title';
  confirmedTitle.textContent = '✅ Confirmed Teams';
  container.appendChild(confirmedTitle);

  const confirmedGrid = document.createElement('div');
  confirmedGrid.className = 'auction-grid';
  confirmed.forEach(slot => confirmedGrid.appendChild(buildSlotCard(slot, isAdmin)));
  container.appendChild(confirmedGrid);

  // PLACEHOLDER SLOTS
  const placeholderTitle = document.createElement('div');
  placeholderTitle.className = 'auction-section-title';
  placeholderTitle.style.marginTop = '32px';
  placeholderTitle.textContent = '⏳ TBD Slots — bid now, team confirmed later';
  container.appendChild(placeholderTitle);

  const placeholderGrid = document.createElement('div');
  placeholderGrid.className = 'auction-grid';
  placeholder.forEach(slot => placeholderGrid.appendChild(buildSlotCard(slot, isAdmin)));
  container.appendChild(placeholderGrid);

  // Admin: lock auction button
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
  const actualSlot   = getSlot(slot.id);
  const owner        = state.owners[slot.id];
  const myBid        = (state.bids[slot.id] || {})[currentUser] || 0;
  const allBids      = state.bids[slot.id] || {};
  const topBid       = Math.max(0, ...Object.values(allBids));
  const isMine       = owner?.username === currentUser;
  const isEliminated = state.eliminatedSlots.includes(slot.id);

  const card = document.createElement('div');
  card.className = 'slot-card' +
    (isMine ? ' slot-mine' : '') +
    (isEliminated ? ' slot-eliminated' : '') +
    (!actualSlot.confirmed ? ' slot-tbd' : '');

  // Header
  let ownerHTML = '';
  if (owner) {
    const ownerPlayer = PLAYERS.find(p => p.name === owner.username);
    ownerHTML = `<div class="slot-owner">${ownerPlayer?.icon || ''} ${owner.username} · ${owner.coins} coins</div>`;
  } else {
    // Show top bidder if no owner yet
    if (topBid > 0) {
      const topBidder = Object.entries(allBids).find(([,v]) => v === topBid)?.[0];
      const tp = PLAYERS.find(p => p.name === topBidder);
      ownerHTML = `<div class="slot-top-bid">🔥 Top bid: ${tp?.icon || ''} ${topBidder} · ${topBid} coins</div>`;
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

  // Bid form (only if no owner yet and auction not locked)
  if (!owner && !state.auctionLocked && !isEliminated) {
    const coinsLeft = getCoinsRemaining(currentUser);
    const bidSection = document.createElement('div');
    bidSection.className = 'bid-section';

    if (myBid > 0) {
      // coinsLeft already excludes myBid via getCoinsCommitted, so max = coinsLeft + myBid (upgrading existing bid)
      const upgradeMax = coinsLeft + myBid;
      bidSection.innerHTML = `
        <div class="my-bid-display">Your bid: <strong>${myBid} coins</strong></div>
        <div class="bid-row">
          <input type="number" min="${Math.min(myBid,1)}" max="${upgradeMax}" value="${myBid}" id="bid-input-${slot.id}" class="bid-input"/>
          <button class="bid-btn" onclick="placeBid('${slot.id}')">Update</button>
          <button class="bid-remove-btn" onclick="removeBid('${slot.id}')">✕</button>
        </div>
        <div class="bid-hint">min ${topBid + 1} to lead · ${upgradeMax} coins available to bid</div>
      `;
    } else {
      bidSection.innerHTML = `
        <div class="bid-row">
          <input type="number" min="5" max="${coinsLeft}" value="${Math.min(Math.max(topBid + 1, 5), coinsLeft)}" id="bid-input-${slot.id}" class="bid-input"/>
          <button class="bid-btn" onclick="placeBid('${slot.id}')">Bid 🪙</button>
        </div>
        <div class="bid-hint">${topBid > 0 ? `min ${topBid + 1} to lead · ` : 'min 5 coins · '}${coinsLeft} coins available</div>
      `;
    }
    card.appendChild(bidSection);
  }

  // Admin: confirm winner button if auction locked and no owner
  if (isAdmin && state.auctionLocked && !owner) {
    const adminSection = document.createElement('div');
    adminSection.className = 'bid-section';
    const allBidEntries = Object.entries(allBids).sort(([,a],[,b]) => b - a);
    if (allBidEntries.length > 0) {
      const [topUser, topAmt] = allBidEntries[0];
      adminSection.innerHTML = `
        <div class="admin-winner-label">Highest: ${topUser} · ${topAmt} coins</div>
        <button class="bid-btn" style="width:100%;margin-top:6px" onclick="confirmOwner('${slot.id}','${topUser}',${topAmt})">✅ Confirm Owner</button>
      `;
    } else {
      adminSection.innerHTML = `<div class="bid-hint" style="text-align:center">No bids placed</div>`;
    }
    card.appendChild(adminSection);
  }

  // Admin: update placeholder name
  if (isAdmin && !actualSlot.confirmed) {
    const overrideSection = document.createElement('div');
    overrideSection.className = 'bid-section';
    overrideSection.innerHTML = `
      <div class="bid-hint" style="margin-bottom:4px">Confirm team once known:</div>
      <input type="text" id="override-name-${slot.id}" class="bid-input" style="width:100%;margin-bottom:4px" placeholder="Team name e.g. Ghana"/>
      <input type="text" id="override-flag-${slot.id}" class="bid-input" style="width:60px;margin-bottom:4px" placeholder="🏳️"/>
      <button class="bid-btn" style="width:100%" onclick="confirmSlotTeam('${slot.id}')">Confirm Team</button>
    `;
    card.appendChild(overrideSection);
  }

  return card;
}

// ============================================
// BIDDING ACTIONS
// ============================================
window.placeBid = async function(slotId) {
  const input = document.getElementById(`bid-input-${slotId}`);
  const amount = parseInt(input?.value);
  const myCurrentBid = (state.bids[slotId] || {})[currentUser] || 0;
  // When updating a bid, coins available = remaining + what we already committed here
  const coinsAvailable = getCoinsRemaining(currentUser) + myCurrentBid;

  if (isNaN(amount) || amount < 5) { showToast('Minimum bid is 5 coins!', 'error'); return; }
  if (amount > coinsAvailable) {
    showToast(`Not enough coins! You have ${coinsAvailable} available.`, 'error'); return;
  }

  if (!state.bids[slotId]) state.bids[slotId] = {};
  state.bids[slotId][currentUser] = amount;

  await saveToFirebase('shared', { bids: state.bids });
  showToast(`Bid of ${amount} coins placed! 🪙`, 'success');
  renderAuction();
  updateHeaderCoins();
};

window.removeBid = async function(slotId) {
  if (!confirm('Remove your bid on this team?')) return;
  if (state.bids[slotId]) {
    delete state.bids[slotId][currentUser];
    await saveToFirebase('shared', { bids: state.bids });
    showToast('Bid removed.', '');
    renderAuction();
    updateHeaderCoins();
  }
};

window.confirmOwner = async function(slotId, username, coins) {
  if (!confirm(`Confirm ${username} owns this team for ${coins} coins?`)) return;
  if (!state.owners) state.owners = {};
  state.owners[slotId] = { username, coins };
  await saveToFirebase('shared', { owners: state.owners });
  showToast(`${username} now owns this team! ✅`, 'success');
  renderAuction();
};

window.confirmSlotTeam = async function(slotId) {
  const nameEl = document.getElementById(`override-name-${slotId}`);
  const flagEl = document.getElementById(`override-flag-${slotId}`);
  const name = nameEl?.value?.trim();
  const flag = flagEl?.value?.trim() || '🏳️';
  if (!name) { showToast('Enter the team name!', 'error'); return; }
  if (!confirm(`Confirm this slot is now ${flag} ${name}?`)) return;
  if (!state.slotOverrides) state.slotOverrides = {};
  state.slotOverrides[slotId] = { name, flag };
  await saveToFirebase('shared', { slotOverrides: state.slotOverrides });
  showToast(`Slot updated to ${name}! ✅`, 'success');
  renderAuction();
};

async function lockAuction() {
  if (!confirm('Lock the auction? No more bids can be placed. You can still confirm owners.')) return;
  state.auctionLocked = true;
  await saveToFirebase('shared', { auctionLocked: true });
  showToast('Auction locked! 🔒', 'success');
  renderAuction();
}

// ============================================
// MY SQUAD
// ============================================
function renderMyPicks() {
  const container = document.getElementById('mypicks-container');
  if (!container) return;
  container.innerHTML = '';

  const mySlotIds = getTeamsOwned(currentUser);
  const totalPoints = state.playerPoints[currentUser] || 0;
  const coinsSpent = getCoinsSpent(currentUser);
  const coinsLeft = getCoinsRemaining(currentUser);

  // Summary bar
  const summary = document.createElement('div');
  summary.className = 'squad-summary';
  summary.innerHTML = `
    <div class="squad-stat">
      <div class="squad-stat-val">🪙 ${coinsSpent}</div>
      <div class="squad-stat-lbl">coins spent</div>
    </div>
    <div class="squad-stat">
      <div class="squad-stat-val">🪙 ${coinsLeft}</div>
      <div class="squad-stat-lbl">coins left</div>
    </div>
    <div class="squad-stat">
      <div class="squad-stat-val" style="color:var(--gold)">⭐ ${totalPoints}</div>
      <div class="squad-stat-lbl">points earned</div>
    </div>
    <div class="squad-stat">
      <div class="squad-stat-val">${mySlotIds.length} / ${MIN_TEAMS}</div>
      <div class="squad-stat-lbl">teams owned</div>
    </div>
  `;
  container.appendChild(summary);

  if (mySlotIds.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'squad-empty';
    empty.innerHTML = `
      <div style="font-size:2.5rem;margin-bottom:12px">🏴‍☠️</div>
      <div style="font-size:1rem;font-weight:600;margin-bottom:6px">No teams yet!</div>
      <div style="color:var(--text2);font-size:.88rem">Head to the Auction tab to place your bids.</div>
    `;
    container.appendChild(empty);
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'squad-grid';

  mySlotIds.forEach(slotId => {
    const slot = getSlot(slotId);
    const owner = state.owners[slotId];
    const isEliminated = state.eliminatedSlots.includes(slotId);

    // Calculate points earned from this team
    let teamPts = 0;
    Object.entries(state.matchResults).forEach(([matchId, result]) => {
      if (result.winnerSlot === slotId) {
        const round = matchId.startsWith('r32') ? WIN_POINTS_R32 : WIN_POINTS_R16;
        teamPts += round;
      }
    });

    const card = document.createElement('div');
    card.className = 'squad-card' + (isEliminated ? ' squad-eliminated' : '');
    card.innerHTML = `
      <div class="squad-flag">${slot?.flag || '🏳️'}</div>
      <div class="squad-name">${slot?.name || slotId}</div>
      <div class="squad-coins">🪙 ${owner?.coins || 0} coins invested</div>
      ${isEliminated
        ? `<div class="squad-status eliminated">❌ Eliminated</div>`
        : `<div class="squad-status active">✅ Still in</div>`
      }
      ${teamPts > 0 ? `<div class="squad-pts">+${teamPts} pts earned</div>` : ''}
    `;
    grid.appendChild(card);
  });

  container.appendChild(grid);

  // Pending bids (not yet won)
  const pendingBids = Object.entries(state.bids)
    .filter(([slotId, bids]) => bids[currentUser] && !state.owners[slotId])
    .map(([slotId, bids]) => ({ slotId, amount: bids[currentUser] }));

  if (pendingBids.length > 0) {
    const pendingTitle = document.createElement('div');
    pendingTitle.className = 'auction-section-title';
    pendingTitle.style.marginTop = '28px';
    pendingTitle.textContent = '⏳ Pending Bids';
    container.appendChild(pendingTitle);

    const pendingGrid = document.createElement('div');
    pendingGrid.className = 'squad-grid';
    pendingBids.forEach(({ slotId, amount }) => {
      const slot = getSlot(slotId);
      const allBids = state.bids[slotId] || {};
      const topBid = Math.max(...Object.values(allBids));
      const isLeading = topBid === amount;
      const card = document.createElement('div');
      card.className = 'squad-card';
      card.innerHTML = `
        <div class="squad-flag">${slot?.flag || '🏳️'}</div>
        <div class="squad-name">${slot?.name || slotId}</div>
        <div class="squad-coins">🪙 ${amount} coins bid</div>
        <div class="squad-status ${isLeading ? 'active' : 'eliminated'}">
          ${isLeading ? '🔥 Leading' : `⚠️ Outbid! (top: ${topBid})`}
        </div>
      `;
      pendingGrid.appendChild(card);
    });
    container.appendChild(pendingGrid);
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
    const slotA = getSlot(match.slotA);
    const slotB = getSlot(match.slotB);
    const result = state.matchResults[match.id];
    const ownerA = state.owners[match.slotA];
    const ownerB = state.owners[match.slotB];
    const playerA = ownerA ? PLAYERS.find(p => p.name === ownerA.username) : null;
    const playerB = ownerB ? PLAYERS.find(p => p.name === ownerB.username) : null;

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
        </div>
      `;
    } else {
      card.innerHTML = `
        <div class="result-teams">
          <div class="result-team">
            <span>${slotA?.flag || '🏳️'} ${slotA?.name || match.slotA}</span>
            ${playerA ? `<span class="result-owner">${playerA.icon} ${ownerA.username}</span>` : '<span class="result-owner no-owner">unowned</span>'}
          </div>
          <div class="result-vs">VS</div>
          <div class="result-team">
            <span>${slotB?.flag || '🏳️'} ${slotB?.name || match.slotB}</span>
            ${playerB ? `<span class="result-owner">${playerB.icon} ${ownerB.username}</span>` : '<span class="result-owner no-owner">unowned</span>'}
          </div>
        </div>
        <div class="result-btns">
          <button class="result-pick-btn" onclick="recordResult('${match.id}','${match.slotA}','${match.slotB}')">
            ${slotA?.flag || '🏳️'} ${slotA?.name || '?'} won
          </button>
          <button class="result-pick-btn" onclick="recordResult('${match.id}','${match.slotB}','${match.slotA}')">
            ${slotB?.flag || '🏳️'} ${slotB?.name || '?'} won
          </button>
        </div>
      `;
    }
    grid.appendChild(card);
  });

  container.appendChild(grid);
}

window.recordResult = async function(matchId, winnerSlot, loserSlot) {
  const winner = getSlot(winnerSlot);
  const loser  = getSlot(loserSlot);
  if (!confirm(`${winner?.name} beat ${loser?.name}?`)) return;

  state.matchResults[matchId] = { winnerSlot, loserSlot };

  // Eliminate loser
  if (!state.eliminatedSlots.includes(loserSlot)) {
    state.eliminatedSlots.push(loserSlot);
  }

  // Award points — proportional to coins invested
  const winnerOwner = state.owners[winnerSlot];
  const loserOwner  = state.owners[loserSlot];

  if (!state.playerPoints) state.playerPoints = {};

  if (winnerOwner) {
    const pts = winnerOwner.coins; // you earn what you invested
    state.playerPoints[winnerOwner.username] = (state.playerPoints[winnerOwner.username] || 0) + pts;

    // Steal: winner's owner steals 30% of loser's coins too
    if (loserOwner) {
      const stolen = Math.round(loserOwner.coins * STEAL_PCT);
      state.playerPoints[winnerOwner.username] += stolen;
      showToast(`${winnerOwner.username} earned ${pts} pts + stole ${stolen} pts from ${loserOwner.username}! 🔥`, 'success');
    } else {
      showToast(`${winnerOwner.username} earned ${pts} pts! ✅`, 'success');
    }
  }

  await saveToFirebase('shared', {
    matchResults: state.matchResults,
    eliminatedSlots: state.eliminatedSlots,
    playerPoints: state.playerPoints,
  });

  renderResults();
  renderLeaderboard();
  renderMyPicks();
};

window.clearResult = async function(matchId) {
  if (!confirm('Undo this result? Points will NOT be reversed automatically.')) return;
  const result = state.matchResults[matchId];
  if (result) {
    state.eliminatedSlots = state.eliminatedSlots.filter(s => s !== result.loserSlot);
    delete state.matchResults[matchId];
    await saveToFirebase('shared', {
      matchResults: state.matchResults,
      eliminatedSlots: state.eliminatedSlots,
    });
    showToast('Result undone.', '');
    renderResults();
  }
};

// ============================================
// LEADERBOARD
// ============================================
function renderLeaderboard() {
  const container = document.getElementById('leaderboard-container');
  if (!container) return;
  container.innerHTML = '';

  const scored = PLAYERS.map(player => {
    const pts     = state.playerPoints[player.name] || 0;
    const teams   = getTeamsOwned(player.name);
    const alive   = teams.filter(s => !state.eliminatedSlots.includes(s));
    const spent   = getCoinsSpent(player.name);
    return { ...player, pts, teams, alive, spent };
  }).sort((a, b) => b.pts - a.pts);

  const medals  = ['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣','7️⃣'];
  const classes = ['first','second','third','','','',''];

  scored.forEach((player, i) => {
    const row = document.createElement('div');
    row.className = `leaderboard-row ${classes[i] || ''}`;

    const teamBadges = player.alive.map(slotId => {
      const slot = getSlot(slotId);
      return `<span class="team-badge">${slot?.flag || '🏳️'} ${slot?.name || slotId}</span>`;
    }).join('');

    row.innerHTML = `
      <div class="lb-position">${medals[i]}</div>
      <div class="lb-info">
        <div class="lb-name">${player.icon} ${player.name}</div>
        <div class="lb-type">${player.isAI ? 'AI' : 'Human'} · ${player.teams.length} teams · 🪙${player.spent} spent</div>
        ${teamBadges ? `<div class="lb-teams">${teamBadges}</div>` : '<div class="lb-breakdown" style="color:var(--text3);font-style:italic">No teams owned yet</div>'}
      </div>
      <div>
        <div class="lb-points" style="color:var(--gold)">${player.pts}</div>
        <div class="lb-pts-label">PTS</div>
      </div>
    `;
    container.appendChild(row);
  });

  if (Object.keys(state.matchResults).length === 0) {
    const note = document.createElement('div');
    note.className = 'leaderboard-empty';
    note.innerHTML = '⚽ Points activate once match results are entered.';
    container.appendChild(note);
  }
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
      <p>Forget score predictions — the Round of 32 is an auction. You buy teams. Your teams earn you points as they win. No predicting, just strategy and drama.</p>
    </div>
    <div class="rules-block">
      <h3>🪙 Your Budget</h3>
      <p>Every player starts with <strong>100 coins</strong>. That's it. Spend wisely — you can never get more.</p>
    </div>
    <div class="rules-block">
      <h3>🔨 How Bidding Works</h3>
      <p>All 32 teams are up for auction simultaneously. Place bids on as many teams as you want. When the auction closes, the highest bidder on each team wins that team. Outbid someone and they lose the team!</p>
      <div class="rules-scoring">
        <div class="rules-score-row"><span class="score-badge gold">Rule 1</span> Highest bid wins the team</div>
        <div class="rules-score-row"><span class="score-badge gold">Rule 2</span> You must own at least 3 teams</div>
        <div class="rules-score-row"><span class="score-badge gold">Rule 3</span> You can't spend more coins than you have</div>
      </div>
    </div>
    <div class="rules-block">
      <h3>⭐ Earning Points</h3>
      <p>When your team wins a match, you earn points equal to <strong>the coins you spent on them</strong>. Spent 40 coins on France? France win → you earn 40 points. This means big bets on big teams carry big rewards.</p>
    </div>
    <div class="rules-block">
      <h3>🔥 The Steal</h3>
      <p>Here's where it gets spicy. When your team knocks out someone else's team, you steal <strong>30% of their coin investment</strong> as bonus points. So if Zac spent 30 coins on Ivory Coast and your France knock them out, you earn your own points PLUS 9 stolen points from Zac. 😈</p>
    </div>
    <div class="rules-block">
      <h3>⏳ TBD Slots</h3>
      <p>Some slots aren't confirmed yet — they show two possible teams (e.g. "Ghana or Panama"). You can still bid on them now! Once the group stage confirms the team, your bid stays on that slot.</p>
    </div>
    <div class="rules-block">
      <h3>The Strategy</h3>
      <p>Go all-in on France? You'll earn big if they win every match — but you'll have little left for backup teams. Spread across 5 dark horses? You're earning from multiple matches simultaneously. The auction IS the game.</p>
    </div>
  `;
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

function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

async function resetEverything() {
  if (!confirm('⚠️ RESET ALL AUCTION DATA? Cannot be undone!')) return;
  if (!confirm('100% sure?')) return;
  showLoading(true);
  await setDoc(doc(db, 'worldcup2026_r32', 'shared'), {
    bids: {}, owners: {}, auctionLocked: false,
    matchResults: {}, playerPoints: {}, eliminatedSlots: [], slotOverrides: {}
  });
  state = {
    bids:{}, owners:{}, auctionLocked:false,
    matchResults:{}, playerPoints:{}, eliminatedSlots:[], slotOverrides:{}
  };
  showLoading(false);
  showToast('🗑️ All auction data reset!', 'success');
  renderAuction();
  renderMyPicks();
  renderLeaderboard();
  updateHeaderCoins();
}
window.resetEverything = resetEverything;
