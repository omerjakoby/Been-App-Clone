
// --- Country Name to ISO Map (Keep as is) ---
const countryExactNameToIsoMap = {
    "Fiji": "FJ", "Tanzania": "TZ", "W. Sahara": "EH", "Canada": "CA", "United States of America": "US",
    "Kazakhstan": "KZ", "Uzbekistan": "UZ", "Papua New Guinea": "PG", "Indonesia": "ID", "Argentina": "AR",
    "Chile": "CL", "Dem. Rep. Congo": "CD", "Somalia": "SO", "Kenya": "KE", "Sudan": "SD", "Chad": "TD",
    "Haiti": "HT", "Dominican Rep.": "DO", "Russia": "RU", "Bahamas": "BS", "Falkland Is.": "FK",
    "Norway": "NO", "Greenland": "GL", "Fr. S. Antarctic Lands": "TF", "Timor-Leste": "TL", "South Africa": "ZA",
    "Lesotho": "LS", "Mexico": "MX", "Uruguay": "UY", "Brazil": "BR", "Bolivia": "BO", "Peru": "PE",
    "Colombia": "CO", "Panama": "PA", "Costa Rica": "CR", "Nicaragua": "NI", "Honduras": "HN",
    "El Salvador": "SV", "Guatemala": "GT", "Belize": "BZ", "Venezuela": "VE", "Guyana": "GY",
    "Suriname": "SR", "France": "FR", "Ecuador": "EC", "Puerto Rico": "PR", "Jamaica": "JM", "Cuba": "CU",
    "Zimbabwe": "ZW", "Botswana": "BW", "Namibia": "NA", "Senegal": "SN", "Mali": "ML", "Mauritania": "MR",
    "Benin": "BJ", "Niger": "NE", "Nigeria": "NG", "Cameroon": "CM", "Togo": "TG", "Ghana": "GH",
    "Côte d'Ivoire": "CI", "Guinea": "GN", "Guinea-Bissau": "GW", "Liberia": "LR", "Sierra Leone": "SL",
    "Burkina Faso": "BF", "Central African Rep.": "CF", "Congo": "CG", "Gabon": "GA", "Eq. Guinea": "GQ",
    "Zambia": "ZM", "Malawi": "MW", "Mozambique": "MZ", "eSwatini": "SZ", "Angola": "AO", "Burundi": "BI",
    "Israel": "IL", "Lebanon": "LB", "Madagascar": "MG", "Palestine": "PS", "Gambia": "GM", "Tunisia": "TN",
    "Algeria": "DZ", "Jordan": "JO", "United Arab Emirates": "AE", "Qatar": "QA", "Kuwait": "KW",
    "Iraq": "IQ", "Oman": "OM", "Vanuatu": "VU", "Cambodia": "KH", "Thailand": "TH", "Laos": "LA",
    "Myanmar": "MM", "Vietnam": "VN", "North Korea": "KP", "South Korea": "KR", "Mongolia": "MN",
    "India": "IN", "Bangladesh": "BD", "Bhutan": "BT", "Nepal": "NP", "Pakistan": "PK", "Afghanistan": "AF",
    "Tajikistan": "TJ", "Kyrgyzstan": "KG", "Turkmenistan": "TM", "Iran": "IR", "Syria": "SY",
    "Armenia": "AM", "Sweden": "SE", "Belarus": "BY", "Ukraine": "UA", "Poland": "PL", "Austria": "AT",
    "Hungary": "HU", "Moldova": "MD", "Romania": "RO", "Lithuania": "LT", "Latvia": "LV", "Estonia": "EE",
    "Germany": "DE", "Bulgaria": "BG", "Greece": "GR", "Turkey": "TR", "Albania": "AL", "Croatia": "HR",
    "Switzerland": "CH", "Luxembourg": "LU", "Belgium": "BE", "Netherlands": "NL", "Portugal": "PT",
    "Spain": "ES", "Ireland": "IE", "New Caledonia": "NC", "Solomon Is.": "SB", "New Zealand": "NZ",
    "Australia": "AU", "Sri Lanka": "LK", "China": "CN", "Taiwan": "TW", "Italy": "IT", "Denmark": "DK",
    "United Kingdom": "GB", "Iceland": "IS", "Azerbaijan": "AZ", "Georgia": "GE", "Philippines": "PH",
    "Malaysia": "MY", "Brunei": "BN", "Slovenia": "SI", "Finland": "FI", "Slovakia": "SK", "Czechia": "CZ",
    "Eritrea": "ER", "Japan": "JP", "Paraguay": "PY", "Yemen": "YE", "Saudi Arabia": "SA", "Antarctica": "AQ",
    "N. Cyprus": null, "Cyprus": "CY", "Morocco": "MA", "Egypt": "EG", "Libya": "LY", "Ethiopia": "ET",
    "Djibouti": "DJ", "Somaliland": null, "Uganda": "UG", "Rwanda": "RW", "Bosnia and Herz.": "BA",
    "Macedonia": "MK", "Serbia": "RS", "Montenegro": "ME", "Kosovo": "XK", "Trinidad and Tobago": "TT",
    "S. Sudan": "SS"
};
// --- Firebase Configuration ---

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
 };

// --- Initialize Firebase ---
if (!firebase.apps.length) {
     firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();
const GoogleAuthProvider = new firebase.auth.GoogleAuthProvider();
const FieldValue = firebase.firestore.FieldValue;

// --- Configuration ---
const MAP_TOPOJSON_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'; // Using a public CDN
const MIN_ZOOM = 1; const MAX_ZOOM = 30;
const LABEL_VISIBILITY_THRESHOLD = 1.5; const MIN_LABEL_AREA_THRESHOLD = 10;
const SEARCH_DEBOUNCE_MS = 250; const MAX_SEARCH_RESULTS = 7;
const TOTAL_SOVEREIGN_STATES = 193; // For display in stats

// --- DOM Elements ---
const mainContent = document.getElementById('main-content');
const initialStateContainer = document.getElementById('initial-state-container');
const loginPrompt = document.getElementById('login-prompt');
const loadingText = document.getElementById('loading-text');
const usernamePrompt = document.getElementById('username-prompt');
const usernameInput = document.getElementById('username-input');
const usernameError = document.getElementById('username-error');
const saveUsernameButton = document.getElementById('save-username-button');
const authContainer = document.getElementById('auth-container');
const loginButton = document.getElementById('login-button');
const logoutButton = document.getElementById('logout-button');
const userInfo = document.getElementById('user-info');
const svg = d3.select("#world-map");
const mapGroup = d3.select("#map-group");
const mapContainer = document.getElementById('map-container');
const mapViewerIndicator = document.getElementById('map-viewer-indicator');
const mapTitle = document.getElementById('map-title');
const viewMyMapButton = document.getElementById('view-my-map-button');
const searchContainerWrapper = document.getElementById('search-container-wrapper');
const tooltip = d3.select("#tooltip");
// Confirmation Modal Elements
const confirmationModal = document.getElementById('confirmation-modal');
const modalTitle = document.getElementById('modal-title');
const modalCountryName = document.getElementById('modal-country-name');
const modalActionButtonsContainer = document.getElementById('modal-action-buttons');
const modalFriendsSection = document.getElementById('modal-friends-section');
const modalFriendsVisitedList = document.getElementById('modal-friends-visited-list');
const modalFriendsPlaceholder = document.getElementById('modal-friends-placeholder');
const confirmCancelButton = document.getElementById('confirm-cancel');

// Visited List Modal Elements
const viewListButton = document.getElementById('view-list-button');
const visitedListModal = document.getElementById('visited-list-modal');
const visitedListUl = document.getElementById('visited-list-ul');
const visitedListCloseButton = document.getElementById('visited-list-close-button');
const visitedListPlaceholder = document.getElementById('visited-list-placeholder');

// Bucket List Modal Elements (NEW)
const viewBucketListButton = document.getElementById('view-bucket-list-button');
const bucketListModal = document.getElementById('bucket-list-modal');
const bucketListUl = document.getElementById('bucket-list-ul');
const bucketListCloseButton = document.getElementById('bucket-list-close-button');
const bucketListPlaceholder = document.getElementById('bucket-list-placeholder');

// Stats Modal Elements
const statsModal = document.getElementById('stats-modal');
const statsCloseButton = document.getElementById('stats-close-button');
const statsButton = document.getElementById('stats-button');
const statsTotalCountries = document.getElementById('stats-total-countries');
const statsBucketListCountries = document.getElementById('stats-bucket-list-countries'); // NEW
const statsTotalVisits = document.getElementById('stats-total-visits');
const statsPercentage = document.getElementById('stats-percentage');
const statsMostVisited = document.getElementById('stats-most-visited'); // Changed ID for clarity
const statsProgressBar = document.getElementById('stats-progress-bar');

// Search Elements
const searchInput = document.getElementById('search-input');
const searchResultsContainer = document.getElementById('search-results');

// Friends Modal Elements
const friendsButton = document.getElementById('friends-button');
const friendsModal = document.getElementById('friends-modal');
const friendsCloseButton = document.getElementById('friends-close-button');
const friendsSearchInput = document.getElementById('friends-search-input');
const friendsSearchButton = document.getElementById('friends-search-button');
const friendsUserSearchResults = document.getElementById('friends-user-search-results');
const friendsPendingList = document.getElementById('friends-pending-list');
const friendsAcceptedList = document.getElementById('friends-accepted-list');
const friendsPendingPlaceholder = document.getElementById('friends-pending-placeholder');
const friendsAcceptedPlaceholder = document.getElementById('friends-accepted-placeholder');

// Leaderboard Modal Elements
const leaderboardButton = document.getElementById('leaderboard-button');
const leaderboardModal = document.getElementById('leaderboard-modal');
const leaderboardCloseButton = document.getElementById('leaderboard-close-button');
const leaderboardList = document.getElementById('leaderboard-list');
const leaderboardPlaceholder = document.getElementById('leaderboard-placeholder');

// --- State ---
let currentUserUid = null;
let currentUserData = null;
let visitedCountriesData = new Map(); // Map<countryId, { count: number }>
let bucketListCountriesData = new Map(); // Map<countryId, boolean> (NEW)
let countryDataMap = new Map(); // Map<countryId, geoJsonFeature>
let currentCountryDataForModal = null;
let currentWidth = 0;
let currentHeight = 0;
let searchDebounceTimer = null;
let userDocRef = null;
let isMapDrawn = false;
let friendsData = { accepted: [], pending: [], sent: [] };
let userCache = {};
let friendMapDataCache = {}; // MODIFIED: Cache for friend's visited AND bucket list
let currentlyViewing = 'self'; // 'self' or friendUid
let currentFriendMapData = { visited: new Map(), bucketList: new Map() }; // MODIFIED: Holds friend's data

// --- D3 Setup ---
let projection, path, zoom;

// --- Firebase Auth Functions ---
function signInWithGoogle() { setLoadingState('Connecting...'); auth.signInWithPopup(GoogleAuthProvider).catch(error => { console.error("Google Sign-In Error:", error); alert(`Login failed: ${error.message}`); showLoginPrompt(); }); }
function signOutUser() { auth.signOut().catch(error => console.error("Sign Out Error:", error)); }

// --- Firestore Functions ---

async function getUserProfile(uid) {
    if (userCache[uid]) return userCache[uid];
    try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (userDoc.exists) {
            const data = userDoc.data();
            const profile = {
                username: data.username || `User...${uid.substring(0,4)}`,
                displayName: data.displayName || data.email || 'User',
                uid: uid
            };
            userCache[uid] = profile;
            return profile;
        } else {
             console.warn(`User document for UID ${uid} not found.`);
             const profile = { username: 'Unknown User', displayName: 'Unknown', uid: uid };
             userCache[uid] = profile;
             return profile;
        }
    } catch (error) {
        console.error(`Error fetching profile for UID ${uid}:`, error);
        return { username: 'Error', displayName: 'Error', uid: uid };
    }
}

// RENAMED & MODIFIED: Fetches both visited and bucket list data for a friend
async function getFriendMapData(friendUid) {
    if (friendMapDataCache[friendUid]) {
        return friendMapDataCache[friendUid];
    }
    try {
        const friendDocSnap = await db.collection('users').doc(friendUid).get();
        const mapData = {
            visited: new Map(),
            bucketList: new Map()
        };

        if (friendDocSnap.exists) {
            const data = friendDocSnap.data();

            // Process Visited Countries
            if (data.countries && typeof data.countries === 'object') {
                for (const [countryId, countryInfo] of Object.entries(data.countries)) {
                    if (countryInfo && typeof countryInfo.count === 'number' && countryInfo.count > 0 && countryDataMap.has(countryId)) {
                        mapData.visited.set(countryId, { count: countryInfo.count });
                    }
                }
            }

            // Process Bucket List Countries
            if (data.bucketListCountries && typeof data.bucketListCountries === 'object') {
                for (const countryId of Object.keys(data.bucketListCountries)) {
                    if (data.bucketListCountries[countryId] && countryDataMap.has(countryId)) {
                        mapData.bucketList.set(countryId, true);
                    }
                }
            }
        } else {
            console.warn(`User document for friend UID ${friendUid} not found when fetching map data.`);
        }
        friendMapDataCache[friendUid] = mapData; // Cache the combined data
        return mapData;
    } catch (error) {
        console.error(`Error fetching map data for friend ${friendUid}:`, error);
        const emptyData = { visited: new Map(), bucketList: new Map() };
        friendMapDataCache[friendUid] = emptyData; // Cache empty data on error
        return emptyData;
    }
}


async function checkAndPromptUsername(user) {
     userDocRef = db.collection("users").doc(user.uid);
     try {
        const docSnap = await userDocRef.get();
        currentUserData = docSnap.exists ? docSnap.data() : {};
        if (currentUserData.username) {
            console.log("Username already set:", currentUserData.username);
            await loadUserAppData(user.uid); // Load data *after* confirming username
            transitionToMainApp();
        } else {
            console.log("Username not found, prompting user.");
            initialStateContainer.classList.remove('hidden');
            usernamePrompt.classList.remove('hidden');
            loginPrompt.classList.add('hidden');
            loadingText.classList.add('hidden');
        }
     } catch (error) { console.error("Error checking username:", error); setLoadingState('Error checking profile. Please refresh.', true); }
}

async function handleSaveUsername() {
    const desiredUsername = usernameInput.value.trim().toLowerCase();
    usernameError.classList.add('hidden'); usernameError.textContent = '';
    if (!/^[a-z0-9]{3,15}$/.test(desiredUsername)) { usernameError.textContent = 'Username must be 3-15 lowercase letters/numbers.'; usernameError.classList.remove('hidden'); return; }

    try {
        const usernameQuery = await db.collection('users').where('username', '==', desiredUsername).limit(1).get();
        if (!usernameQuery.empty) { usernameError.textContent = 'Username already taken.'; usernameError.classList.remove('hidden'); return; }

        const user = auth.currentUser;
        const userData = {
            username: desiredUsername,
            displayName: user.displayName || '',
            email: user.email || '',
            createdAt: FieldValue.serverTimestamp(),
            lastLogin: FieldValue.serverTimestamp(),
            // Initialize maps directly here to ensure they exist on first save
            countries: {},
            bucketListCountries: {} // Initialize bucket list
        };

        await userDocRef.set(userData, { merge: true }); // Use merge:true to avoid overwriting existing fields if any

        console.log("Username saved:", desiredUsername);
        currentUserData = { ...currentUserData, ...userData }; // Update local state
        usernamePrompt.classList.add('hidden');
        await loadUserAppData(user.uid); // Load data now that username is set
        transitionToMainApp();

    } catch (error) { console.error("Error saving username:", error); usernameError.textContent = 'Error saving username. Try again.'; usernameError.classList.remove('hidden'); }
}


async function loadUserAppData(uid) {
    setLoadingState('Loading your map data...');
    visitedCountriesData = new Map();
    bucketListCountriesData = new Map(); // Reset bucket list too
    friendsData = { accepted: [], pending: [], sent: [] };
    if (!uid) return;
    userDocRef = db.collection("users").doc(uid);

    try {
        // Fetch user doc first
        const docSnap = await userDocRef.get();
        if (docSnap.exists) {
            const data = docSnap.data();
            currentUserData = data; // Refresh currentUserData

            // Load Visited Countries
            if (data.countries && typeof data.countries === 'object') {
                for (const [countryId, countryInfo] of Object.entries(data.countries)) {
                    if (countryInfo?.count > 0 && countryDataMap.has(countryId)) {
                        visitedCountriesData.set(countryId, { count: countryInfo.count });
                    } else if (countryInfo?.count > 0) {
                        console.warn(`User ${uid} has visited data for unknown countryId ${countryId}. Skipping.`);
                    }
                }
            }
             // Load Bucket List Countries (NEW)
            if (data.bucketListCountries && typeof data.bucketListCountries === 'object') {
                 for (const countryId of Object.keys(data.bucketListCountries)) {
                     // Only add if the value is truthy (e.g., true) and the country ID is valid
                     if (data.bucketListCountries[countryId] && countryDataMap.has(countryId)) {
                         bucketListCountriesData.set(countryId, true); // Store just 'true'
                     } else if (data.bucketListCountries[countryId]) {
                         console.warn(`User ${uid} has bucket list data for unknown countryId ${countryId}. Skipping.`);
                     }
                 }
            }

        } else {
             console.log("User document not found while loading data. Creating placeholder.");
             // This shouldn't happen often after username prompt logic
             currentUserData = { username: 'Loading...', displayName: 'User', countries: {}, bucketListCountries: {} };
        }

        // Load Friendships (same as before)
        const friendshipsQuery = db.collection('friendships').where('users', 'array-contains', uid);
        const friendshipsSnapshot = await friendshipsQuery.get();
        friendsData = { accepted: [], pending: [], sent: [] }; // Reset before populating
        friendshipsSnapshot.forEach(doc => {
            const data = doc.data();
            const friendUid = data.users.find(id => id !== uid);
            if (!friendUid) return;

            if (data.status === 'accepted') {
                friendsData.accepted.push({ id: doc.id, uid: friendUid });
            } else if (data.status === 'pending') {
                if (data.requesterId !== uid) {
                    friendsData.pending.push({ id: doc.id, uid: data.requesterId });
                } else {
                    friendsData.sent.push({ id: doc.id, uid: friendUid });
                }
            }
        });

        console.log(`Loaded ${visitedCountriesData.size} visited, ${bucketListCountriesData.size} bucket list. Friends - Accepted: ${friendsData.accepted.length}, Pending: ${friendsData.pending.length}, Sent: ${friendsData.sent.length}`);

         // Pre-fetch accepted friends' profiles and data
         friendsData.accepted.forEach(friend => {
             getUserProfile(friend.uid);
             getFriendMapData(friend.uid); // MODIFIED: Use new function
         });

    } catch (error) {
         console.error("Error loading user app data:", error);
         alert("Could not load your data. Please try refreshing.");
         currentUserData = { username: 'Error', displayName: 'Error' };
         visitedCountriesData = new Map();
         bucketListCountriesData = new Map();
         friendsData = { accepted: [], pending: [], sent: [] };
    }
}


// --- Firestore Visited Country Updates ---
async function saveVisitedCountryToFirestore(countryId, countryData) {
    if (!userDocRef) { console.error("User ref missing for save visited."); return; }
    try {
        await userDocRef.update({ [`countries.${countryId}`]: countryData });
        console.log(`Saved/Updated visited country ${countryId}`);
    } catch (error) {
         if (error.code === 'not-found' || error.message.includes("No document to update")) {
            await userDocRef.set({ countries: { [countryId]: countryData } }, { merge: true });
            console.log(`Set visited country ${countryId} (doc/field created).`);
         } else {
             console.error("Error saving visited country:", error); alert("Could not save change."); throw error;
         }
    }
}

async function removeVisitedCountryFromFirestore(countryId) {
    if (!userDocRef) { console.error("User ref missing for remove visited."); return; }
    const updateData = { [`countries.${countryId}`]: FieldValue.delete() };
    try {
        await userDocRef.update(updateData);
        console.log(`Removed visited country ${countryId}`);
    } catch (error) {
         if (error.code !== 'not-found' && !error.message.includes("No document to update")) {
             console.error("Error removing visited country:", error); alert("Could not save removal."); throw error;
         } else { console.log(`Visited country ${countryId} already removed or doc structure issue.`); }
    }
}

// --- Firestore Bucket List Country Updates (NEW) ---
async function saveBucketListCountryToFirestore(countryId) {
    if (!userDocRef) { console.error("User ref missing for save bucket list."); return; }
    try {
        await userDocRef.update({ [`bucketListCountries.${countryId}`]: true });
        console.log(`Saved bucket list country ${countryId}`);
    } catch (error) {
        if (error.code === 'not-found' || error.message.includes("No document to update")) {
            await userDocRef.set({ bucketListCountries: { [countryId]: true } }, { merge: true });
            console.log(`Set bucket list country ${countryId} (doc/field created).`);
        } else {
            console.error("Error saving bucket list country:", error); alert("Could not save change."); throw error;
        }
    }
}

async function removeBucketListCountryFromFirestore(countryId) {
    if (!userDocRef) { console.error("User ref missing for remove bucket list."); return; }
    const updateData = { [`bucketListCountries.${countryId}`]: FieldValue.delete() };
    try {
        await userDocRef.update(updateData);
        console.log(`Removed bucket list country ${countryId}`);
    } catch (error) {
         if (error.code !== 'not-found' && !error.message.includes("No document to update")) {
             console.error("Error removing bucket list country:", error); alert("Could not save removal."); throw error;
         } else { console.log(`Bucket list country ${countryId} already removed or doc structure issue.`); }
    }
}


// --- Friend Management Functions ---
async function searchUsers() { /* ... no changes needed ... */
     const searchTerm = friendsSearchInput.value.trim().toLowerCase();
     friendsUserSearchResults.innerHTML = '<div class="px-3 py-2 text-sm text-gray-500 italic">Searching...</div>';
     friendsUserSearchResults.classList.remove('hidden');

     if (!searchTerm || searchTerm.length < 3) { friendsUserSearchResults.innerHTML = '<div class="px-3 py-2 text-sm text-gray-500 italic">Enter at least 3 chars.</div>'; return; }

     try {
        const usersRef = db.collection('users');
        const query = usersRef.where('username', '>=', searchTerm)
                              .where('username', '<=', searchTerm + '\uf8ff')
                              .limit(10);
        const querySnapshot = await query.get();
        friendsUserSearchResults.innerHTML = '';

        if (querySnapshot.empty) { friendsUserSearchResults.innerHTML = '<div class="px-3 py-2 text-sm text-gray-500 italic">No users found.</div>'; return; }

        let resultCount = 0;
        const allRelatedUids = new Set([
            currentUserUid,
            ...friendsData.accepted.map(f => f.uid),
            ...friendsData.pending.map(p => p.uid),
            ...friendsData.sent.map(s => s.uid)
        ]);


        querySnapshot.forEach(doc => {
            const userData = doc.data(); const userId = doc.id;
            if (allRelatedUids.has(userId)) { return; }

            resultCount++;
            const resultDiv = document.createElement('div');
            resultDiv.className = 'flex items-center justify-between px-3 py-2 border-b border-gray-100 last:border-b-0';
            resultDiv.innerHTML = `
                <span class="text-gray-700">${userData.username} (${userData.displayName || 'User'})</span>
                <button data-user-id="${userId}" data-username="${userData.username}" class="friend-action-button add-friend-button px-2 py-1 text-xs font-medium rounded bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-green-500 transition">Add</button>
            `;
            friendsUserSearchResults.appendChild(resultDiv);
        });

        if (resultCount === 0) { friendsUserSearchResults.innerHTML = '<div class="px-3 py-2 text-sm text-gray-500 italic">No new users found.</div>'; }

     } catch (error) { console.error("Error searching users:", error); friendsUserSearchResults.innerHTML = '<div class="px-3 py-2 text-sm text-red-500">Error searching.</div>'; }
 }
async function sendFriendRequest(targetUserId, targetUsername) { /* ... no changes needed ... */
     if (!currentUserUid || !targetUserId || currentUserUid === targetUserId) return;
     const usersArray = [currentUserUid, targetUserId].sort();
     const friendshipId = `${usersArray[0]}_${usersArray[1]}`;
     const friendshipRef = db.collection('friendships').doc(friendshipId);
     try {
         const docSnap = await friendshipRef.get();
         if (docSnap.exists) {
             console.log(`Friendship document ${friendshipId} already exists with status: ${docSnap.data().status}`);
             alert(`You already have a connection (or pending request) with ${targetUsername}.`);
              const button = friendsUserSearchResults.querySelector(`button[data-user-id="${targetUserId}"]`);
              if (button) {
                   button.textContent = 'Request Exists'; button.disabled = true;
                   button.className = button.className.replace(/bg-green-\d+ hover:bg-green-\d+/, 'bg-gray-400 cursor-not-allowed');
              }
             return;
         }
        await friendshipRef.set({
            users: usersArray,
            requesterId: currentUserUid,
            status: 'pending',
            createdAt: FieldValue.serverTimestamp()
        });
        console.log(`Friend request sent to ${targetUsername}`);
        friendsData.sent.push({ id: friendshipId, uid: targetUserId });
         const button = friendsUserSearchResults.querySelector(`button[data-user-id="${targetUserId}"]`);
         if (button) {
              button.textContent = 'Sent'; button.disabled = true;
              button.className = button.className.replace(/bg-green-\d+ hover:bg-green-\d+/, 'bg-gray-400 cursor-not-allowed');
          }
     } catch (error) {
          console.error("Error sending friend request:", error);
          alert(`Could not send request to ${targetUsername}. Error: ${error.message}`);
     }
 }
async function handleFriendAction(event) { /* ... no changes needed ... */
      const button = event.target.closest('.friend-action-button');
      if (!button || button.disabled) return;

      const userId = button.dataset.userId;
      const username = button.dataset.username;
      const friendshipId = button.dataset.friendshipId;
      const friendName = button.dataset.friendName; // Added for view map button

      button.disabled = true; // Disable immediately

      try {
          if (button.classList.contains('add-friend-button')) {
              if (userId && username) {
                  await sendFriendRequest(userId, username);
                  // State handled within sendFriendRequest (updates button)
              } else console.error("Missing userId or username for add friend action");
          } else if (button.classList.contains('accept-friend-button')) {
               if (friendshipId && userId) {
                   await updateFriendRequest(friendshipId, userId, 'accepted');
                   await populateFriendsModal(); // Refresh modal after action
               } else console.error("Missing friendshipId or userId for accept action");
          } else if (button.classList.contains('decline-friend-button')) {
               if (friendshipId && userId) {
                   await updateFriendRequest(friendshipId, userId, 'declined');
                    await populateFriendsModal(); // Refresh modal after action
                } else console.error("Missing friendshipId or userId for decline action");
          } else if (button.classList.contains('view-friend-map-button')) {
               if (userId && friendName) {
                  await viewFriendMap(userId, friendName);
                  hideFriendsModal(); // Close modal after viewing
              } else console.error("Missing userId or friendName for view map action");
               button.disabled = false; // Re-enable view button immediately
          }
      } catch (error) {
         console.error("Error during friend action:", error);
         alert("An error occurred performing the friend action.");
         // Re-enable button on error *if* it still exists in the DOM and wasn't handled by state update
         const currentButton = friendsModal.querySelector(`button[data-friendship-id="${friendshipId}"]`) || friendsModal.querySelector(`button[data-user-id="${userId}"]`);
         if (currentButton && !currentButton.textContent.includes('Sent') && !currentButton.textContent.includes('Exists') && !currentButton.classList.contains('view-friend-map-button')) {
            currentButton.disabled = false;
         }
      }
  }
async function updateFriendRequest(friendshipId, friendUid, newStatus) { /* MODIFIED */
     if (!friendshipId || !['accepted', 'declined'].includes(newStatus)) {
         console.error("Invalid parameters for updateFriendRequest", {friendshipId, friendUid, newStatus});
         return;
     }
     const friendshipRef = db.collection('friendships').doc(friendshipId);
     try {
        const updateData = { status: newStatus };
        if (newStatus === 'accepted') updateData.acceptedAt = FieldValue.serverTimestamp();

        await friendshipRef.update(updateData);
        console.log(`Friend request ${friendshipId} updated to ${newStatus}`);

        const initialPendingCount = friendsData.pending.length;
        friendsData.pending = friendsData.pending.filter(p => p.id !== friendshipId);

        if (newStatus === 'accepted') {
            if (!friendsData.accepted.some(f => f.id === friendshipId)) {
                friendsData.accepted.push({ id: friendshipId, uid: friendUid });
                 getUserProfile(friendUid); // Pre-fetch profile
                 getFriendMapData(friendUid); // MODIFIED: Use new function to pre-fetch data
            }
        }
        console.log(`Local state updated: Pending count ${initialPendingCount} -> ${friendsData.pending.length}, Accepted count -> ${friendsData.accepted.length}`);

        // Refreshing the modal is now handled in handleFriendAction after this promise resolves
     } catch (error) {
          console.error(`Error updating request ${friendshipId} to ${newStatus}:`, error);
          alert(`Could not ${newStatus} request. Please try again.`);
          throw error; // Re-throw to be caught by handleFriendAction
    }
 }
async function populateFriendsModal() { /* ... no changes needed ... */
      if (!currentUserUid) return;
      friendsPendingList.innerHTML = ''; friendsAcceptedList.innerHTML = '';
      friendsPendingPlaceholder.classList.add('hidden'); friendsAcceptedPlaceholder.classList.add('hidden');
      let hasPending = false, hasAccepted = false;

      // Efficiently pre-fetch profiles for *all* pending and accepted friends if not cached
      const allFriendUids = new Set([...friendsData.pending.map(p => p.uid), ...friendsData.accepted.map(f => f.uid)]);
      const uidsToFetch = Array.from(allFriendUids).filter(uid => !userCache[uid]);
      if(uidsToFetch.length > 0) {
          console.log(`Fetching profiles for ${uidsToFetch.length} friends in modal...`)
          const profilePromises = uidsToFetch.map(uid => getUserProfile(uid));
          try {
              await Promise.all(profilePromises);
          } catch (fetchError) {
              console.error("Error pre-fetching friend profiles for modal:", fetchError);
              // Continue rendering with placeholders for failed fetches
          }
      }

      // Render Pending Requests
      friendsData.pending.forEach(req => {
          const profile = userCache[req.uid] || { username: 'Loading...', displayName: '', uid: req.uid };
          const li = document.createElement('li');
          li.className = 'flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0';
          li.innerHTML = `
              <span class="text-gray-700 truncate pr-2" title="${profile.username} (${profile.displayName || 'User'})">${profile.username} (${profile.displayName || 'User'})</span>
              <div class="flex space-x-2 flex-shrink-0">
                  <button data-friendship-id="${req.id}" data-user-id="${req.uid}" class="friend-action-button accept-friend-button px-2 py-1 text-xs font-medium rounded bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-green-500 transition">Accept</button>
                  <button data-friendship-id="${req.id}" data-user-id="${req.uid}" class="friend-action-button decline-friend-button px-2 py-1 text-xs font-medium rounded bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500 transition">Decline</button>
              </div>`;
          friendsPendingList.appendChild(li); hasPending = true;
      });

       // Render Accepted Friends
      friendsData.accepted.forEach(friend => {
          const profile = userCache[friend.uid] || { username: 'Loading...', displayName: '', uid: friend.uid };
          const li = document.createElement('li');
          li.className = 'flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0';
          li.innerHTML = `
              <span class="text-gray-700 truncate pr-2" title="${profile.username} (${profile.displayName || 'User'})">${profile.username} (${profile.displayName || 'User'})</span>
              <button data-user-id="${friend.uid}" data-friend-name="${profile.username}" class="friend-action-button view-friend-map-button px-2 py-1 text-xs font-medium rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500 transition flex-shrink-0">View Map</button>
          `;
          friendsAcceptedList.appendChild(li); hasAccepted = true;
      });

      friendsPendingPlaceholder.style.display = hasPending ? 'none' : 'block';
      friendsAcceptedPlaceholder.style.display = hasAccepted ? 'none' : 'block';
 }
function showFriendsModal() { /* ... no changes needed ... */
      friendsModal.setAttribute('aria-hidden', 'false');
      friendsSearchInput.value = '';
      friendsUserSearchResults.classList.add('hidden');
      friendsUserSearchResults.innerHTML = '';
      populateFriendsModal(); // Always repopulate when opening
 }
function hideFriendsModal() { friendsModal.setAttribute('aria-hidden', 'true'); }


// --- Map View Switching (MODIFIED) ---
async function viewFriendMap(friendId, friendName) {
     if (!friendId || currentlyViewing === friendId) return;
     console.log(`Attempting to view map for friend: ${friendName} (UID: ${friendId})`);
     setLoadingState(`Loading ${friendName}'s map...`);

     try {
        // Fetch BOTH visited and bucket list data
        currentFriendMapData = await getFriendMapData(friendId); // MODIFIED: Use new function and store result
        console.log(`Loaded ${currentFriendMapData.visited.size} visited and ${currentFriendMapData.bucketList.size} bucket list countries for friend ${friendName}.`);

        currentlyViewing = friendId;
        updateMapVisuals(); // Update map - will use friend's visited AND bucket list data
        mapTitle.textContent = `${friendName}'s Map`; // Keep title simple or adjust as needed
        viewMyMapButton.classList.remove('hidden');
        searchContainerWrapper.classList.add('hidden');
        mapGroup.selectAll(".country").classed("viewing-friend", true); // Add class to disable clicks/styles

     } catch (error) {
         console.error(`Error viewing friend (${friendName}) map:`, error);
         alert(`An error occurred loading ${friendName}'s map.`);
         viewMyMap(); // Go back to own map on error
     } finally {
         initialStateContainer.classList.add('hidden');
         mainContent.classList.remove('hidden');
         authContainer.classList.remove('hidden');
     }
}
function viewMyMap() {
    if (currentlyViewing === 'self') return;
    console.log("Switching back to My Map");
    currentlyViewing = 'self';
    // Reset friend data holder
    currentFriendMapData = { visited: new Map(), bucketList: new Map() }; // MODIFIED: Reset friend data holder
    updateMapVisuals(); // Update with own visited & bucket list data
    mapTitle.textContent = `My Map`;
    viewMyMapButton.classList.add('hidden');
    searchContainerWrapper.classList.remove('hidden'); // Show search bar again
    mapGroup.selectAll(".country").classed("viewing-friend", false); // Remove class to enable clicks/styles
}


// --- Core Application Functions ---
function updateMapVisuals() { // MODIFIED
    if (!mapGroup || !isMapDrawn) {
        console.warn("Attempted to update map visuals before map was drawn or mapGroup is missing.");
        return;
    }

    // Determine which data source to use
    let visitedData, bucketData;
    if (currentlyViewing === 'self') {
        visitedData = visitedCountriesData;
        bucketData = bucketListCountriesData;
    } else {
        // Use the friend's data stored in currentFriendMapData
        visitedData = currentFriendMapData?.visited || new Map();
        bucketData = currentFriendMapData?.bucketList || new Map();
    }

    mapGroup.selectAll(".country")
        .each(function(d) {
            if (!d || !d.id) return;
            const countryElement = d3.select(this);
            const countryId = d.id;

            // Check against the determined data source (own or friend's)
            const isVisited = visitedData.has(countryId);
            const isOnBucketList = bucketData.has(countryId);

            // Apply classes: Visited takes precedence over bucket list for fill
            countryElement.classed("visited", isVisited);
            // Only apply bucket-list class if it's NOT visited AND on the bucket list
            countryElement.classed("bucket-list", !isVisited && isOnBucketList);
            // Make sure other classes are removed if neither apply
            if (!isVisited && !isOnBucketList) {
                countryElement.classed("visited", false).classed("bucket-list", false);
            }
        });

     // Update dependent UI elements only if they are currently relevant/visible and user is viewing own map
     if (currentlyViewing === 'self') {
         updateSearchResultsUI(); // Refresh search results buttons
         if (statsModal.getAttribute('aria-hidden') === 'false') {
             showStatsModal(); // Refresh stats (now includes bucket list count)
         }
         if (visitedListModal.getAttribute('aria-hidden') === 'false') {
             showVisitedListModal(); // Refresh visited list
         }
         if (bucketListModal.getAttribute('aria-hidden') === 'false') {
             showBucketListModal(); // Refresh bucket list modal (NEW)
         }
     }
}

function getIsoA2Code(properties) { /* ... no changes needed ... */
     if (!properties) return null;
     const potentialKeys = ['iso_a2', 'ISO_A2', 'adm0_a2'];
     for (const key of potentialKeys) {
         if (properties[key] && typeof properties[key] === 'string' && properties[key].length === 2 && properties[key] !== '-99') {
             return properties[key].toUpperCase();
         }
     }
     // Fallback using the name map (less reliable)
     const name = properties.name || properties.NAME;
     if (name && countryExactNameToIsoMap[name]) {
         return countryExactNameToIsoMap[name];
     }
     return null;
 }

function getFlagEmoji(countryName) { /* ... no changes needed ... */
    const isoCode = countryExactNameToIsoMap[countryName];
    if (!isoCode || typeof isoCode !== 'string' || isoCode.length !== 2 || !/^[A-Z]{2}$/.test(isoCode)) {
         return '🏳️'; // Return white flag for invalid codes
    }
    try {
        const codePoints = isoCode.toUpperCase().split('').map(char => 0x1F1E6 + (char.charCodeAt(0) - 65));
        return String.fromCodePoint(...codePoints);
    } catch (error) {
        console.error(`Error converting ISO code "${isoCode}" to emoji:`, error);
        return '🏳️'; // Fallback
    }
}


// REVISED: Show Confirmation Modal - Dynamically adds buttons for Visited & Bucket List
async function showConfirmationModal(countryData) { // MODIFIED: Fetch friend data logic
     if (currentlyViewing !== 'self' || !currentUserUid) return; // Only allow actions on own map when logged in

     currentCountryDataForModal = countryData;
     const countryName = countryData?.properties?.name || 'this country';
     const countryId = countryData?.id;

     if (!countryId) {
         console.error("Cannot open modal: Missing country ID.");
         return;
     }

     modalCountryName.textContent = countryName;
     modalTitle.textContent = `${countryName}`; // Use country name as title

     // Determine current status (of the logged-in user)
     const isVisited = visitedCountriesData.has(countryId);
     const isOnBucketList = bucketListCountriesData.has(countryId);

     // Clear previous dynamic buttons
     modalActionButtonsContainer.innerHTML = '';

     // --- Add Buttons Based on State ---
     if (isVisited) {
          // State: Visited
          modalActionButtonsContainer.innerHTML += `
              <button id="confirm-remove-visited" class="confirm-action-button bg-red-500 text-white hover:bg-red-600 focus:ring-red-500">Remove from Visited</button>
          `;
          // Option to add to/remove from bucket list *even if visited*
          if (isOnBucketList) {
             modalActionButtonsContainer.innerHTML += `
                 <button id="confirm-remove-bucket" class="confirm-action-button bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500">Remove from Bucket List</button>
             `;
          } else {
              modalActionButtonsContainer.innerHTML += `
                 <button id="confirm-add-bucket" class="confirm-action-button bg-yellow-400 text-gray-800 hover:bg-yellow-500 focus:ring-yellow-400">Add to Bucket List</button>
             `;
          }
     } else {
          // State: Not Visited
          modalActionButtonsContainer.innerHTML += `
             <button id="confirm-mark-visited" class="confirm-action-button bg-green-500 text-white hover:bg-green-600 focus:ring-green-500">Mark as Visited</button>
         `;
          if (isOnBucketList) {
              // State: Not Visited, but on Bucket List
              modalActionButtonsContainer.innerHTML += `
                 <button id="confirm-remove-bucket" class="confirm-action-button bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500">Remove from Bucket List</button>
              `;
          } else {
              // State: Not Visited, Not on Bucket List
              modalActionButtonsContainer.innerHTML += `
                 <button id="confirm-add-bucket" class="confirm-action-button bg-yellow-400 text-gray-800 hover:bg-yellow-500 focus:ring-yellow-400">Add to Bucket List</button>
              `;
          }
     }
     // --- End Button Logic ---

     // --- Fetch and Display Friends Who Visited (MODIFIED) ---
     modalFriendsVisitedList.innerHTML = '';
     modalFriendsPlaceholder.textContent = 'Loading friend info...';
     modalFriendsPlaceholder.classList.remove('hidden');
     modalFriendsSection.classList.remove('hidden'); // Show section regardless of friends

     if (friendsData.accepted.length === 0) {
         modalFriendsPlaceholder.textContent = "You have no friends to show.";
     } else {
         const visitingFriendsInfo = [];
         const friendDataPromises = friendsData.accepted.map(async (friend) => {
             try {
                 const friendUid = friend.uid;
                 // Fetch the combined data, but only use the 'visited' part here
                 const friendData = await getFriendMapData(friendUid); // MODIFIED: Use new function
                 const friendVisitedMap = friendData.visited; // MODIFIED: Extract visited map

                 if (friendVisitedMap.has(countryId)) {
                     const visitData = friendVisitedMap.get(countryId);
                     const profile = await getUserProfile(friendUid);
                     if (profile && profile.username !== 'Error' && profile.username !== 'Unknown User') {
                          visitingFriendsInfo.push({ name: profile.username, count: visitData.count });
                     }
                 }
             } catch (err) {
                 console.error(`Error processing friend data for UID ${friend.uid} in confirmation modal:`, err);
             }
         });

         try {
             await Promise.all(friendDataPromises);
             if (visitingFriendsInfo.length > 0) {
                 visitingFriendsInfo.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
                 const maxFriendsToShow = 5;
                 visitingFriendsInfo.slice(0, maxFriendsToShow).forEach(friend => {
                     const li = document.createElement('li');
                     li.className = "flex justify-between items-center text-gray-600";
                     li.innerHTML = `<span>${friend.name}</span><span class="font-medium text-gray-800">${friend.count} ${friend.count === 1 ? 'visit' : 'visits'}</span>`;
                     modalFriendsVisitedList.appendChild(li);
                 });
                 if (visitingFriendsInfo.length > maxFriendsToShow) {
                      const li = document.createElement('li');
                      li.className = "text-gray-500 italic text-center text-xs pt-1";
                      li.textContent = `...and ${visitingFriendsInfo.length - maxFriendsToShow} more`;
                      modalFriendsVisitedList.appendChild(li);
                 }
                 modalFriendsPlaceholder.classList.add('hidden');
             } else {
                 modalFriendsPlaceholder.textContent = "None of your friends have marked this country yet.";
             }
         } catch (error) {
             console.error("Error fetching friend visit data for modal:", error);
             modalFriendsPlaceholder.textContent = "Error loading friend info.";
         }
    }

     confirmationModal.setAttribute('aria-hidden', 'false'); // Show the modal now
 }

function hideConfirmationModal() {
     confirmationModal.setAttribute('aria-hidden', 'true');
     currentCountryDataForModal = null; // Clear context
     modalActionButtonsContainer.innerHTML = ''; // Clear buttons
}

// REVISED: Handle clicks within the confirmation modal (delegated)
async function handleConfirmationAction(event) {
    const button = event.target.closest('.confirm-action-button');
    // Handle clicks outside content area or on the general cancel button
    if ((event.target === confirmationModal && !event.target.closest('.modal-content-gradient')) || event.target.id === 'confirm-cancel') {
         hideConfirmationModal();
         return;
    }

    // Only proceed if an action button was clicked and context is valid
    if (!button || !currentCountryDataForModal || !currentUserUid || currentlyViewing !== 'self') {
        return;
    }

    const countryId = currentCountryDataForModal.id;
    const countryName = currentCountryDataForModal.properties.name; // For logging
    if (!countryId) {
        console.error("Missing country ID for action.");
        hideConfirmationModal();
        return;
    }

    // Disable buttons while processing
    modalActionButtonsContainer.querySelectorAll('button').forEach(btn => btn.disabled = true);

    try {
        // Perform action based on button ID
        switch (button.id) {
            case 'confirm-mark-visited':
                console.log(`Action: Mark ${countryName} (${countryId}) as visited`);
                const currentVisitData = visitedCountriesData.get(countryId);
                const newVisitData = { count: 1 }; // Default to 1 visit when marking from map/modal
                visitedCountriesData.set(countryId, newVisitData);
                await saveVisitedCountryToFirestore(countryId, newVisitData);

                // --- Crucial: Remove from bucket list if it was there ---
                if (bucketListCountriesData.has(countryId)) {
                    console.log(`Also removing ${countryName} (${countryId}) from bucket list as it's now visited.`);
                    bucketListCountriesData.delete(countryId);
                    await removeBucketListCountryFromFirestore(countryId); // Wait for removal
                }
                break;

            case 'confirm-add-bucket':
                console.log(`Action: Add ${countryName} (${countryId}) to bucket list`);
                if (!bucketListCountriesData.has(countryId)) {
                    bucketListCountriesData.set(countryId, true);
                    await saveBucketListCountryToFirestore(countryId);
                }
                break;

            case 'confirm-remove-visited':
                console.log(`Action: Remove ${countryName} (${countryId}) from visited`);
                if (visitedCountriesData.has(countryId)) {
                    visitedCountriesData.delete(countryId);
                    await removeVisitedCountryFromFirestore(countryId);
                    // Does NOT automatically add to bucket list upon removal.
                }
                break;

            case 'confirm-remove-bucket':
                 console.log(`Action: Remove ${countryName} (${countryId}) from bucket list`);
                if (bucketListCountriesData.has(countryId)) {
                    bucketListCountriesData.delete(countryId);
                    await removeBucketListCountryFromFirestore(countryId);
                }
                break;

             default:
                console.warn("Unknown confirmation action button ID:", button.id);
                break; // Should not happen
        }

        // Update UI after *successful* action
        updateMapVisuals();
        // No need to call showXXXModal here, updateMapVisuals handles refreshing open modals
    } catch (error) {
        console.error(`Error performing action ${button.id} for ${countryId}:`, error);
        alert(`Failed to update ${countryName}. Please try again.`);
        // Re-enable buttons on error
        modalActionButtonsContainer.querySelectorAll('button').forEach(btn => btn.disabled = false);
        return; // Don't hide modal on error
    }


    hideConfirmationModal(); // Close modal only after successful action
}


// --- Visited List Modal Functions ---
function showVisitedListModal() {
     visitedListUl.innerHTML = ''; // Clear previous items

     if (currentlyViewing !== 'self') {
         visitedListPlaceholder.textContent = `Viewing ${mapTitle.textContent}. Cannot edit visited list.`;
         visitedListPlaceholder.classList.remove('hidden');
         visitedListModal.setAttribute('aria-hidden', 'false');
         return;
     }

     visitedListPlaceholder.classList.add('hidden'); // Hide initially

     if (visitedCountriesData.size === 0) {
         visitedListPlaceholder.textContent = "You haven't marked any countries as visited yet.";
         visitedListPlaceholder.classList.remove('hidden');
         visitedListUl.innerHTML =  `<li><span class="text-gray-500 italic text-center py-4 block">You haven't marked any countries as visited yet.</span></li>`; // Use li for structure

     } else {
         const sortedVisitedCountries = Array.from(visitedCountriesData.entries())
             .map(([id, data]) => {
                 const feature = countryDataMap.get(id);
                 return feature ? { id, ...data, properties: feature.properties } : null;
             })
             .filter(item => item && item.properties?.name)
             .sort((a, b) => a.properties.name.localeCompare(b.properties.name));

         if(sortedVisitedCountries.length === 0 && visitedCountriesData.size > 0) {
             console.warn("Visited countries exist but couldn't map to names.");
             visitedListPlaceholder.textContent = "Error displaying visited countries.";
             visitedListPlaceholder.classList.remove('hidden');
         } else {
            sortedVisitedCountries.forEach(country => {
                 const li = document.createElement('li');
                 li.setAttribute('data-country-id', country.id);
                 li.className = 'flex items-center justify-between py-2 px-1 border-b border-gray-100 last:border-b-0';
                 const flag = getFlagEmoji(country.properties.name);

                 li.innerHTML = `
                    <div class="flex items-center flex-grow mr-4 overflow-hidden">
                       <span class="flag-emoji">${flag}</span>
                       <span class="list-country-name text-gray-700 truncate" title="${country.properties.name}">${country.properties.name}</span>
                    </div>
                    <div class="flex items-center flex-shrink-0 space-x-2">
                       <button class="count-button decrement-button" aria-label="Decrease visits" ${country.count <= 1 ? 'disabled' : ''}>-</button>
                       <span class="visit-count font-medium text-gray-800 w-6 text-center">${country.count}</span>
                       <button class="count-button increment-button" aria-label="Increase visits">+</button>
                       <!-- Optional: Add remove from list button maybe? Keep +/- for now -->
                    </div>`;
                 visitedListUl.appendChild(li);
             });
         }
     }
     visitedListModal.setAttribute('aria-hidden', 'false');
}

function hideVisitedListModal() { visitedListModal.setAttribute('aria-hidden', 'true'); }

async function handleVisitedListClick(event) { // Only affects visited counts/removal
     if (currentlyViewing !== 'self' || !currentUserUid) { return; }

     const button = event.target.closest('.count-button');
     if (!button) return;

     const listItem = button.closest('li[data-country-id]');
     if (!listItem) return;

     const countryId = listItem.dataset.countryId;
     if (!countryId || !visitedCountriesData.has(countryId)) {
          console.error(`Invalid countryId (${countryId}) or data missing for list interaction.`);
          return;
     }

     button.disabled = true; // Disable the clicked button during processing

     const countryData = visitedCountriesData.get(countryId);
     let newCount = countryData.count;
     const countSpan = listItem.querySelector('.visit-count');
     const minusButton = listItem.querySelector('.decrement-button');
     const plusButton = listItem.querySelector('.increment-button'); // Get plus button too

     if (button.classList.contains('increment-button')) {
         newCount++;
     } else if (button.classList.contains('decrement-button')) {
         newCount--;
     }

    try {
         if (newCount <= 0) {
             // Remove from visited
             console.log(`Removing ${countryId} via visited list decrement.`);
             visitedCountriesData.delete(countryId);
             await removeVisitedCountryFromFirestore(countryId);
             listItem.remove(); // Remove from DOM
             if (visitedCountriesData.size === 0) showVisitedListModal(); // Re-show placeholder if now empty
         } else {
             // Update visit count
             console.log(`Updating ${countryId} count to ${newCount} via visited list.`);
             const updatedData = { count: newCount };
             visitedCountriesData.set(countryId, updatedData);
             await saveVisitedCountryToFirestore(countryId, updatedData);
             if (countSpan) countSpan.textContent = newCount;
             if (minusButton) minusButton.disabled = newCount <= 1;
         }

         updateMapVisuals(); // Update map and potentially other open modals

     } catch (error) {
         console.error("Error updating visited list count:", error);
         alert("Failed to update visit count. Please try again.");
         // Restore previous state visually on error? More complex. For now, just log.
     } finally {
          // Re-enable buttons if they still exist
          if(minusButton) minusButton.disabled = newCount <= 1; // Re-evaluate minus button state
          if(plusButton && !plusButton.disabled) plusButton.disabled = false; // Re-enable plus if it wasn't the one clicked, or if count logic allows
          if (button.classList.contains('decrement-button') && newCount > 0) button.disabled = false; // Re-enable clicked minus if count > 0
          if (button.classList.contains('increment-button')) button.disabled = false; // Always re-enable clicked plus
     }
}

// --- NEW Bucket List Modal Functions ---
function showBucketListModal() {
    bucketListUl.innerHTML = ''; // Clear previous items

    if (currentlyViewing !== 'self') {
         bucketListPlaceholder.textContent = `Viewing ${mapTitle.textContent}. Bucket list only applies to your map.`;
         bucketListPlaceholder.classList.remove('hidden');
         bucketListModal.setAttribute('aria-hidden', 'false');
         return;
     }

    bucketListPlaceholder.classList.add('hidden'); // Hide initially

    if (bucketListCountriesData.size === 0) {
        // *** UPDATED PLACEHOLDER TEXT ***
         bucketListPlaceholder.textContent = "Your bucket list is empty. Click countries on the map to add places you want to visit!";
         bucketListPlaceholder.classList.remove('hidden');
         bucketListUl.innerHTML = `<li><span class="text-gray-500 italic text-center py-4 block">Your bucket list is empty. Click countries on the map to add places you want to visit!</span></li>`; // Use li for structure
    } else {
        const sortedBucketList = Array.from(bucketListCountriesData.keys())
            .map(id => countryDataMap.get(id))
            .filter(feature => feature && feature.properties?.name)
            .sort((a, b) => a.properties.name.localeCompare(b.properties.name));

        if(sortedBucketList.length === 0 && bucketListCountriesData.size > 0) {
            console.warn("Bucket list countries exist but couldn't map to names.");
            bucketListPlaceholder.textContent = "Error displaying bucket list countries.";
            bucketListPlaceholder.classList.remove('hidden');
        } else {
            sortedBucketList.forEach(country => {
                const li = document.createElement('li');
                li.setAttribute('data-country-id', country.id);
                li.className = 'flex items-center justify-between py-2 px-1 border-b border-gray-100 last:border-b-0';
                const flag = getFlagEmoji(country.properties.name);

                li.innerHTML = `
                   <div class="flex items-center flex-grow mr-4 overflow-hidden">
                      <span class="flag-emoji">${flag}</span>
                      <span class="list-country-name text-gray-700 truncate" title="${country.properties.name}">${country.properties.name}</span>
                   </div>
                   <div class="flex-shrink-0">
                      <button class="remove-button remove-from-bucket-list-button" data-country-id="${country.id}" aria-label="Remove ${country.properties.name} from bucket list">
                          ×
                      </button>
                   </div>`;
                bucketListUl.appendChild(li);
            });
        }
    }
    bucketListModal.setAttribute('aria-hidden', 'false');
}

function hideBucketListModal() { bucketListModal.setAttribute('aria-hidden', 'true'); }

async function handleBucketListAction(event) {
     if (currentlyViewing !== 'self' || !currentUserUid) { return; }

     const removeButton = event.target.closest('.remove-from-bucket-list-button');
     if (!removeButton) return;

     const listItem = removeButton.closest('li[data-country-id]');
     if (!listItem) return;

     const countryId = listItem.dataset.countryId;
     if (!countryId || !bucketListCountriesData.has(countryId)) {
          console.error(`Invalid countryId (${countryId}) or data missing for bucket list removal.`);
          return;
     }

     removeButton.disabled = true; // Disable button

     try {
         console.log(`Removing ${countryId} from bucket list via modal.`);
         bucketListCountriesData.delete(countryId);
         await removeBucketListCountryFromFirestore(countryId);

         listItem.remove(); // Remove from DOM
         if (bucketListCountriesData.size === 0) {
             showBucketListModal(); // Re-render to show placeholder
         }

         updateMapVisuals(); // Update map & other potential UI

     } catch (error) {
         console.error("Error removing from bucket list:", error);
         alert("Failed to remove country from bucket list. Please try again.");
         removeButton.disabled = false; // Re-enable on error
     }
}


// --- Stats Calculation & Modal ---
function findMostVisitedCountry() {
    let mostVisited = null;
    let maxCount = 0;
    for (const [id, data] of visitedCountriesData.entries()) {
        if (data.count > maxCount) {
            maxCount = data.count;
            const feature = countryDataMap.get(id);
            if (feature && feature.properties?.name) {
                 mostVisited = { name: feature.properties.name, count: data.count };
            }
        }
    }
     return mostVisited;
}

function calculateStats() {
    const totalVisitedCount = visitedCountriesData.size;
    const totalBucketListCount = bucketListCountriesData.size; // NEW
    const totalMapCountries = countryDataMap.size > 0 ? countryDataMap.size : 1; // Base percentage on actual map data
    const percentageVisited = totalMapCountries > 0 ? (totalVisitedCount / totalMapCountries) * 100 : 0;

    let totalIndividualVisits = 0;
    visitedCountriesData.forEach(data => { totalIndividualVisits += (data.count || 0); });

    const mostVisited = findMostVisitedCountry();
    let mostVisitedText = '-';
    if (mostVisited) {
         mostVisitedText = `${getFlagEmoji(mostVisited.name)} ${mostVisited.name} (${mostVisited.count} visits)`;
    }


    return {
         totalVisited: totalVisitedCount,
         totalBucketList: totalBucketListCount,
         totalVisits: totalIndividualVisits,
         percentageVisited: percentageVisited.toFixed(1),
         mostVisitedText: mostVisitedText,
         totalMapCountries: countryDataMap.size // For display context
    };
}

function showStatsModal() {
     if (currentlyViewing !== 'self') return; // Only show own stats

     const stats = calculateStats();

     statsTotalCountries.textContent = `${stats.totalVisited} / ${stats.totalMapCountries} (Map Entities)`;
     statsBucketListCountries.textContent = stats.totalBucketList; // NEW
     statsTotalVisits.textContent = stats.totalVisits;
     statsPercentage.textContent = `${stats.percentageVisited}%`;
     statsMostVisited.innerHTML = stats.mostVisitedText; // Use innerHTML for emoji
     statsProgressBar.style.width = `${stats.percentageVisited}%`;

     statsModal.setAttribute('aria-hidden', 'false');
}
function hideStatsModal() { statsModal.setAttribute('aria-hidden', 'true'); }

// --- Country Search (MODIFIED for Bucket List) ---
function performSearch() {
     if (currentlyViewing !== 'self') {
         searchResultsContainer.innerHTML = '';
         searchResultsContainer.classList.add('hidden');
         return;
     }
     const searchTerm = searchInput.value.trim().toLowerCase();
     searchResultsContainer.innerHTML = ''; // Clear previous results

     if (!searchTerm) {
         searchResultsContainer.classList.add('hidden');
         return;
     }

     const matches = [];
     for (const country of countryDataMap.values()) {
         if (country.properties?.name?.toLowerCase().includes(searchTerm)) {
             matches.push(country);
         }
         if (matches.length >= MAX_SEARCH_RESULTS) break;
     }

     if (matches.length > 0) {
        searchResultsContainer.classList.remove('hidden');
        matches.forEach(country => {
             searchResultsContainer.appendChild(createSearchResultItem(country.id));
        });
     } else {
         searchResultsContainer.innerHTML = '<div class="px-4 py-2 text-sm text-gray-500 italic">No countries found.</div>';
         searchResultsContainer.classList.remove('hidden');
     }
 }
function handleSearchInput() { clearTimeout(searchDebounceTimer); searchDebounceTimer = setTimeout(performSearch, SEARCH_DEBOUNCE_MS); }

// Helper to create/update a single search result item
function createSearchResultItem(countryId) {
    const country = countryDataMap.get(countryId);
    if (!country || !country.properties?.name) return null; // Should not happen if called correctly

    const countryName = country.properties.name;
    const isVisited = visitedCountriesData.has(countryId);
    const isOnBucketList = bucketListCountriesData.has(countryId);

    const resultDiv = document.createElement('div');
    resultDiv.className = 'flex justify-between items-center px-4 py-2 text-sm border-b border-gray-100 last:border-b-0';
    resultDiv.setAttribute('data-country-id', countryId);

    let buttonsHtml = '';

    if (isVisited) {
        buttonsHtml = `<span class="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">Visited</span>`;
        // Optionally add remove bucket button if visited AND on bucket list
         if (isOnBucketList) {
             buttonsHtml += `<button class="search-result-action-button remove-bucket-button bg-orange-100 text-orange-700 hover:bg-orange-200 ml-2" data-action="remove-bucket" aria-label="Remove ${countryName} from Bucket List">Remove Bucket</button>`;
         } else {
              // Optionally add add bucket button if visited but NOT on bucket list
              buttonsHtml += `<button class="search-result-action-button add-bucket-button bg-yellow-400 text-gray-800 hover:bg-yellow-500 ml-2" data-action="add-bucket" aria-label="Add ${countryName} to Bucket List">Add Bucket</button>`;
         }
    } else if (isOnBucketList) {
        // Not Visited, On Bucket List
        buttonsHtml = `
            <button class="search-result-action-button add-visited-button bg-green-500 text-white hover:bg-green-600" data-action="add-visited" aria-label="Mark ${countryName} as visited">Mark Visited</button>
            <button class="search-result-action-button remove-bucket-button bg-orange-100 text-orange-700 hover:bg-orange-200 ml-2" data-action="remove-bucket" aria-label="Remove ${countryName} from Bucket List">Remove Bucket</button>
            `; // Added remove bucket button here too
         // <span class="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded ml-2">On Bucket List</span>
    } else {
        // Neither visited nor on bucket list
        buttonsHtml = `
            <button class="search-result-action-button add-visited-button bg-green-500 text-white hover:bg-green-600" data-action="add-visited" aria-label="Mark ${countryName} as visited">Mark Visited</button>
            <button class="search-result-action-button add-bucket-button bg-yellow-400 text-gray-800 hover:bg-yellow-500 ml-2" data-action="add-bucket" aria-label="Add ${countryName} to Bucket List">Add Bucket</button>
        `;
    }


    resultDiv.innerHTML = `
       <span class="text-gray-700 truncate pr-2" title="${countryName}">${countryName}</span>
       <div class="flex items-center space-x-2 flex-shrink-0"> ${buttonsHtml} </div>
    `;
    return resultDiv;
}

// MODIFIED: Handles different actions based on button clicked in search results
async function handleSearchResultAction(event) {
     const button = event.target.closest('.search-result-action-button');
     if (!button || button.disabled || currentlyViewing !== 'self' || !currentUserUid) {
         return;
     }

     const resultDiv = button.closest('div[data-country-id]');
     if (!resultDiv) return;

     const countryId = resultDiv.dataset.countryId;
     const action = button.dataset.action;

     if (!countryId || !action || !countryDataMap.has(countryId)) {
         console.error("Invalid search result action parameters:", { countryId, action });
         return;
     }

     button.disabled = true; // Disable button immediately

     try {
         if (action === 'add-visited') {
             console.log(`Search Action: Add Visited ${countryId}`);
             const newData = { count: 1 }; // Default to 1 visit from search
             visitedCountriesData.set(countryId, newData);
             await saveVisitedCountryToFirestore(countryId, newData);

             // --- If it was on bucket list, remove it ---
             if (bucketListCountriesData.has(countryId)) {
                 console.log(`Also removing ${countryId} from bucket list (marked visited via search).`);
                 bucketListCountriesData.delete(countryId);
                 await removeBucketListCountryFromFirestore(countryId);
             }

         } else if (action === 'add-bucket') {
             console.log(`Search Action: Add Bucket ${countryId}`);
             // Add to bucket list only if NOT already visited and NOT already on list
             if (!visitedCountriesData.has(countryId) && !bucketListCountriesData.has(countryId)) {
                 bucketListCountriesData.set(countryId, true);
                 await saveBucketListCountryToFirestore(countryId);
             } else {
                 console.warn(`Cannot add ${countryId} to bucket list via search, already visited or on list.`);
             }
         } else if (action === 'remove-bucket') {
             console.log(`Search Action: Remove Bucket ${countryId}`);
             if (bucketListCountriesData.has(countryId)) {
                 bucketListCountriesData.delete(countryId);
                 await removeBucketListCountryFromFirestore(countryId);
             }
         }

         updateMapVisuals(); // Update map, which also triggers updates for open modals/search UI
         // No need to call updateSearchResultsUI explicitly IF updateMapVisuals handles it


     } catch (error) {
         console.error("Error handling search result action:", error);
         alert("An error occurred updating your lists.");
         button.disabled = false; // Re-enable on error
     } finally {
        // Ensure the specific item is updated/re-rendered *after* the async operations
        updateSearchResultsUI(); // Explicitly refresh search results after potential state change
    }
}

function clearSearchResults() { searchInput.value = ''; searchResultsContainer.innerHTML = ''; searchResultsContainer.classList.add('hidden'); }

// MODIFIED: Update button states in search results based on both lists
function updateSearchResultsUI() {
     if (searchResultsContainer.classList.contains('hidden') || currentlyViewing !== 'self') return;

     searchResultsContainer.querySelectorAll('div[data-country-id]').forEach(resultDiv => {
         const countryId = resultDiv.dataset.countryId;
         if (!countryId) return;

         const newItem = createSearchResultItem(countryId); // Re-create the item with current state
         if(newItem) {
            resultDiv.replaceWith(newItem); // Replace the old div with the updated one
         } else {
            resultDiv.remove(); // Remove if country data somehow became invalid
         }
     });
}


// --- D3 Zoom & Pan (Keep as is) ---
function zoomed(event) { /* ... no changes needed ... */
     const { transform } = event;
     mapGroup.attr("transform", transform);
     const k = transform.k;
     mapGroup.selectAll(".country").style("stroke-width", 0.5 / k + "px");
     mapGroup.selectAll(".country-label")
         .style("font-size", Math.min(8, Math.max(1, 3 / Math.sqrt(k))) + "px")
         .style("display", k < LABEL_VISIBILITY_THRESHOLD ? "none" : "block");
}

// --- Map Drawing (Click handler modified) ---
async function drawMap() {
    if (isMapDrawn) {
        console.log("Map already drawn, skipping redraw.");
        return;
    }
    isMapDrawn = false;
    mapGroup.selectAll("*").remove();
    console.log("Starting map draw...");
    setLoadingState('Drawing map...');

    try {
        const world = await d3.json(MAP_TOPOJSON_URL);
        const countries = topojson.feature(world, world.objects.countries);
        const validFeatures = countries.features.filter(d =>
            d && d.id && d.geometry && d.id !== '010' // Filter out Antarctica outline if needed
        );

        countryDataMap.clear();
        validFeatures.forEach(feature => {
             if (feature.properties && feature.properties.NAME && !feature.properties.name) {
                 feature.properties.name = feature.properties.NAME;
             }
             countryDataMap.set(feature.id, feature);
        });
        console.log(`Processed ${countryDataMap.size} valid country features.`);

        currentWidth = mapContainer.clientWidth || 960;
        currentHeight = currentWidth * 0.58;
        projection = d3.geoMercator().fitSize([currentWidth, currentHeight], {type: "FeatureCollection", features: validFeatures});
        path = d3.geoPath().projection(projection);

        svg.attr("viewBox", `0 0 ${currentWidth} ${currentHeight}`)
           .attr("preserveAspectRatio", "xMidYMid meet");

        mapGroup.selectAll(".country")
            .data(validFeatures, d => d.id)
            .join("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("data-country-id", d => d.id)
            .attr("aria-label", d => d.properties?.name || 'Country')
            .on("click", function(event, d) { // Click handler now just opens the main confirmation modal
                if (currentlyViewing !== 'self' || !currentUserUid) return; // Only handle clicks on own map if logged in
                if (event.defaultPrevented || !d || !d.id) return; // Ignore zoom drag or invalid data
                event.stopPropagation(); // Prevent triggering SVG click/zoom
                showConfirmationModal(d); // Call the revised modal function
            })
            .on("mouseover", function(event, d) { /* ... tooltip logic ... */
                if (d && d.properties?.name) {
                    tooltip.style("opacity", 0.9).html(d.properties.name);
                }
             })
            .on("mousemove", function(event) { /* ... tooltip logic ... */
                  tooltip.style("left", (event.pageX + 10) + "px")
                         .style("top", (event.pageY - 28) + "px");
             })
            .on("mouseout", function() { /* ... tooltip logic ... */
                tooltip.style("opacity", 0);
             });


        mapGroup.selectAll(".country-label")
            .data(validFeatures.filter(d => d.properties?.name && path.area(d) > MIN_LABEL_AREA_THRESHOLD), d => d.id)
            .join("text")
            .attr("class", "country-label")
            .attr("transform", d => {
                 const centroid = path.centroid(d);
                 return (centroid && !isNaN(centroid[0]) && !isNaN(centroid[1])) ? `translate(${centroid[0]}, ${centroid[1]})` : null;
            })
            .text(d => d.properties.name)
            .attr("dy", "0.35em")
            .style("display", "none"); // Initially hidden, shown by zoom

        zoom = d3.zoom()
            .scaleExtent([MIN_ZOOM, MAX_ZOOM])
            .on("zoom", zoomed);

        svg.call(zoom); // Apply zoom behavior to the SVG
        svg.call(zoom.transform, d3.zoomIdentity); // Set initial zoom transform

        isMapDrawn = true;
        console.log("Base map drawn successfully.");

    } catch (error) {
         console.error("Error loading or drawing map:", error);
         setLoadingState('Error loading map data. Please refresh.', true);
         isMapDrawn = false;
    }
}

// --- UI State Management (Keep as is) ---
function setLoadingState(message = 'Loading...', isError = false) { /* ... */
     initialStateContainer.classList.remove('hidden');
     loadingText.classList.remove('hidden');
     loadingText.querySelector('p').textContent = message;
     loadingText.querySelector('.spinner').style.display = isError ? 'none' : 'block';
     loginPrompt.classList.add('hidden');
     usernamePrompt.classList.add('hidden');
     mainContent.classList.add('hidden');
     authContainer.classList.add('hidden');
 }
function showLoginPrompt() { /* ... */
     initialStateContainer.classList.remove('hidden');
     loginPrompt.classList.remove('hidden');
     loadingText.classList.add('hidden');
     usernamePrompt.classList.add('hidden');
     mainContent.classList.add('hidden');
     authContainer.classList.add('hidden');
 }
function transitionToMainApp() { /* ... */
     initialStateContainer.classList.add('hidden');
     loginPrompt.classList.add('hidden');
     usernamePrompt.classList.add('hidden');
     loadingText.classList.add('hidden');
     mainContent.classList.remove('hidden');
     authContainer.classList.remove('hidden');

     // Update visuals now that data is likely loaded and main content is shown
     updateMapVisuals();


     const user = auth.currentUser;
     if(user) {
         userInfo.textContent = currentUserData?.username || user.displayName || user.email || 'Logged In';
         userInfo.classList.remove('hidden');
         logoutButton.classList.remove('hidden');
     } else {
         userInfo.classList.add('hidden');
         logoutButton.classList.add('hidden');
     }
 }


// --- Auth State Change Listener (Reset Bucket List Data) ---
auth.onAuthStateChanged(async user => { // MODIFIED
    //console.log("Auth state changed. User:", user ? user.uid : 'None');

    viewMyMap(); // Reset view first
    // Hide all modals on auth change
    hideConfirmationModal();
    hideVisitedListModal();
    hideBucketListModal(); // NEW
    hideStatsModal();
    hideFriendsModal();
    hideLeaderboardModal();
    clearSearchResults();

    if (user) {
        currentUserUid = user.uid;
        //console.log("User logged in:", currentUserUid);

         db.collection('users').doc(currentUserUid).set({ lastLogin: FieldValue.serverTimestamp() }, { merge: true })
             .catch(e => console.warn("Could not update lastLogin:", e));

        setLoadingState('Checking profile...');

        if (!isMapDrawn) {
            await drawMap();
            if (!isMapDrawn) {
                console.error("Failed to draw map during auth change. Aborting.");
                setLoadingState('Error loading map. Please refresh.', true);
                return;
            }
        }

        await checkAndPromptUsername(user);

    } else {
        // User is signed out
        currentUserUid = null; userDocRef = null; currentUserData = null;
        visitedCountriesData = new Map();
        bucketListCountriesData = new Map(); // Reset bucket list data
        friendsData = { accepted: [], pending: [], sent: [] };
        userCache = {};
        friendMapDataCache = {}; // MODIFIED: Clear the renamed cache
        currentFriendMapData = { visited: new Map(), bucketList: new Map() }; // MODIFIED: Reset friend data holder
        currentlyViewing = 'self';
        console.log("User logged out.");

        showLoginPrompt();
        userInfo.classList.add('hidden');
        logoutButton.classList.add('hidden');

         if (isMapDrawn) {
             updateMapVisuals(); // Clear highlights
             if (svg && zoom) {
                 svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity);
             }
         } else {
            setLoadingState('Loading map data...');
             await drawMap();
             showLoginPrompt();
         }
    }
});


// --- Leaderboard Functions ---
function showLeaderboardModal() {
     leaderboardModal.setAttribute('aria-hidden', 'false');
     populateLeaderboard();
 }
function hideLeaderboardModal() {
     leaderboardModal.setAttribute('aria-hidden', 'true');
 }
 async function populateLeaderboard() { 
     leaderboardList.innerHTML = ''; 
     leaderboardPlaceholder.textContent = 'Loading leaderboard...';
     leaderboardPlaceholder.classList.remove('hidden'); 

     if (!currentUserUid || !currentUserData) {
         console.warn("Leaderboard cannot be populated: User not logged in or data not loaded.");
         leaderboardPlaceholder.textContent = 'Log in to see the leaderboard.';
         return;
     }

     const acceptedFriends = friendsData.accepted || [];
     let leaderboardData = [];

     try {
         // Add current user
         const myStats = calculateStats();
         leaderboardData.push({
             uid: currentUserUid,
             name: currentUserData.username ? `${currentUserData.username} (You)` : 'You',
             countriesVisited: myStats.totalVisited,
             totalVisits: myStats.totalVisits
         });

         // Fetch friends' data concurrently only if friends exist
         if (acceptedFriends.length > 0) {
             const friendDataPromises = acceptedFriends.map(async (friend) => {
                 try {
                     const profilePromise = getUserProfile(friend.uid);
                     // Fetch combined data, but only use 'visited' for leaderboard
                     const mapDataPromise = getFriendMapData(friend.uid); // MODIFIED: Use new function
                     const [profile, mapData] = await Promise.all([profilePromise, mapDataPromise]);

                     if (!profile || profile.username === 'Error' || profile.username === 'Unknown User') return null;

                     let friendCountries = 0; let friendTotalVisits = 0;
                     const visitedMap = mapData.visited; // MODIFIED: Extract visited map

                     if (visitedMap instanceof Map) {
                         friendCountries = visitedMap.size;
                         visitedMap.forEach(data => { friendTotalVisits += (data.count || 0); });
                     }
                     // Only include friends with > 0 countries visited, or keep all? Let's keep all for now.
                     return { uid: friend.uid, name: profile.username, countriesVisited: friendCountries, totalVisits: friendTotalVisits };
                 } catch (error) {
                     console.error(`Error processing leaderboard data for friend ${friend.uid}:`, error);
                     return null;
                  }
             });

             const results = await Promise.all(friendDataPromises);
              results.forEach(result => { if (result) leaderboardData.push(result); });
         }

         // Sort leaderboard
         leaderboardData.sort((a, b) => b.countriesVisited - a.countriesVisited || b.totalVisits - a.totalVisits || a.name.localeCompare(b.name));

         // Render leaderboard
         leaderboardList.innerHTML = ''; // Clear list before rendering

         if (leaderboardData.length > 0) {
             leaderboardData.forEach((entry, index) => {
                const isCurrentUser = entry.uid === currentUserUid;
                const rankIndicator = index === 0 ? ' 👑' : (index === 1 ? ' 🥈' : (index === 2 ? ' 🥉' : ''));
                // Show rank indicator only if more than one person is on the leaderboard
                const finalRankIndicator = leaderboardData.length > 1 ? rankIndicator : '';
                const displayName = `${entry.name}${finalRankIndicator}`;

                const li = document.createElement('li');
                li.className = `flex items-center justify-between py-2.5 px-3 rounded-md border border-gray-200 ${isCurrentUser ? 'leaderboard-user-highlight shadow-sm' : 'bg-white'}`;
                li.innerHTML = `
                     <div class="flex items-center space-x-3 min-w-0">
                         <span class="text-sm font-medium text-gray-500 w-6 text-right">${index + 1}.</span>
                         <span class="text-base font-medium text-gray-800 truncate" title="${entry.name}">${displayName}</span>
                     </div>
                     <div class="text-right flex-shrink-0 ml-4">
                         <div class="text-sm font-semibold text-indigo-700">${entry.countriesVisited} ${entry.countriesVisited === 1 ? 'Country' : 'Countries'}</div>
                         <div class="text-xs text-gray-500">${entry.totalVisits} Total Visits</div>
                     </div>`;
                 leaderboardList.appendChild(li);
             });

             // *** Conditional Placeholder Logic ***
             if (leaderboardData.length === 1 && acceptedFriends.length === 0) {
                 // Only the current user is shown AND they have no friends
                 leaderboardPlaceholder.textContent = "Add some friends to see how you compare on the leaderboard!";
                 leaderboardPlaceholder.classList.remove('hidden'); // Ensure it's visible
             } else {
                 // Either friends exist OR the list somehow errored (length 0)
                 leaderboardPlaceholder.classList.add('hidden'); // Hide placeholder if list has content or friends exist
             }

         } else {
              // Should not happen if user is logged in, but handle defensively
              leaderboardPlaceholder.textContent = 'Leaderboard is currently empty.';
              leaderboardPlaceholder.classList.remove('hidden');
         }

     } catch (error) {
         console.error("Error populating leaderboard:", error);
         leaderboardList.innerHTML = ''; // Clear potentially partial list
         leaderboardPlaceholder.textContent = 'Error loading leaderboard data.';
         leaderboardPlaceholder.classList.remove('hidden');
     }
 }


// --- Event Listeners ---
loginButton.addEventListener('click', signInWithGoogle);
logoutButton.addEventListener('click', signOutUser);
saveUsernameButton.addEventListener('click', handleSaveUsername);

confirmationModal.addEventListener('click', handleConfirmationAction); // Delegate actions AND outside click/cancel

// Visited List Modal
viewListButton.addEventListener('click', showVisitedListModal);
visitedListCloseButton.addEventListener('click', hideVisitedListModal);
visitedListModal.addEventListener('click', (event) => { if (event.target === visitedListModal) hideVisitedListModal(); });
visitedListUl.addEventListener('click', handleVisitedListClick); // Handles +/- in visited list

// Bucket List Modal (NEW)
viewBucketListButton.addEventListener('click', showBucketListModal);
bucketListCloseButton.addEventListener('click', hideBucketListModal);
bucketListModal.addEventListener('click', (event) => { if (event.target === bucketListModal) hideBucketListModal(); });
bucketListUl.addEventListener('click', handleBucketListAction); // Handles remove in bucket list

// Stats Modal
statsButton.addEventListener('click', showStatsModal);
statsCloseButton.addEventListener('click', hideStatsModal);
statsModal.addEventListener('click', (event) => { if (event.target === statsModal) hideStatsModal(); });

// Search
searchInput.addEventListener('input', handleSearchInput);
searchInput.addEventListener('focus', performSearch);
searchResultsContainer.addEventListener('click', handleSearchResultAction); // Delegate search result button clicks

// Friends Modal
friendsButton.addEventListener('click', showFriendsModal);
friendsCloseButton.addEventListener('click', hideFriendsModal);
friendsModal.addEventListener('click', (event) => { if (event.target === friendsModal) hideFriendsModal(); });
friendsSearchButton.addEventListener('click', searchUsers);
friendsSearchInput.addEventListener('keypress', (event) => { if (event.key === 'Enter') searchUsers(); });
friendsSearchInput.addEventListener('input', () => { // Hide results if search input is cleared
    if (friendsSearchInput.value.trim() === '') {
        friendsUserSearchResults.classList.add('hidden');
        friendsUserSearchResults.innerHTML = '';
    }
});
friendsModal.addEventListener('click', handleFriendAction); // Handles add/accept/decline/view map

// Leaderboard Modal
leaderboardButton.addEventListener('click', showLeaderboardModal);
leaderboardCloseButton.addEventListener('click', hideLeaderboardModal);
leaderboardModal.addEventListener('click', (event) => { if (event.target === leaderboardModal) hideLeaderboardModal(); });

// View My Map Button
viewMyMapButton.addEventListener('click', viewMyMap);

// Global Click Listener (Hide Popups)
document.addEventListener('click', (event) => {
    // Hide search results on outside click
    const searchContainer = document.getElementById('search-container');
    if (searchContainer && !searchContainer.contains(event.target) && !searchResultsContainer.contains(event.target)) {
         clearSearchResults();
     }
    // Hide friend search results on outside click
    const friendsSearchContainer = document.getElementById('friends-search-input')?.parentElement;
    const friendsResults = document.getElementById('friends-user-search-results');
    if (friendsSearchContainer && friendsResults && !friendsSearchContainer.contains(event.target) && !friendsResults.contains(event.target) ) {
         friendsResults.classList.add('hidden');
     }
});


// --- Resize Handling (Keep as is) ---
let resizeTimer;
window.addEventListener('resize', () => {
    if (!isMapDrawn || !mapContainer) return;
    const newWidth = mapContainer.clientWidth;
    if (newWidth > 0 && Math.abs(newWidth - currentWidth) > 5) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            console.log(`Map container resized. Adjusting...`);
            currentWidth = newWidth;
            currentHeight = currentWidth * 0.58;
            svg.attr("viewBox", `0 0 ${currentWidth} ${currentHeight}`);

            const features = Array.from(countryDataMap.values());
            if (features.length > 0) {
                 projection.fitSize([currentWidth, currentHeight], { type: "FeatureCollection", features: features });
                 path.projection(projection);
            } else {
                console.warn("Cannot resize projection, countryDataMap is empty."); return;
            }

            mapGroup.selectAll(".country").attr("d", path);
            mapGroup.selectAll(".country-label").attr("transform", d => {
                const centroid = path.centroid(d);
                return (centroid && !isNaN(centroid[0]) && !isNaN(centroid[1])) ? `translate(${centroid[0]}, ${centroid[1]})` : null;
            });

            const currentTransform = d3.zoomTransform(svg.node());
            zoomed({ transform: currentTransform });

            console.log("Map view adjusted.");
        }, 250);
    }
});
// --- Initial Call ---
setLoadingState('Initializing...');
// Auth listener handles drawing map and loading user data subsequently.
