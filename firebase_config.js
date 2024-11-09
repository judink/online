window.FIREBASE_MODULES = window.FM = {};

async function loadFirebaseModule(serviceName, sinkErrors
) {
    const name = serviceName.toLowerCase();
    if (window.FIREBASE_MODULES[name]) return window.FIREBASE_MODULES[name];

    try {
        // uses unpkg to get the latest semver
        if (!loadFirebaseModule.version) {
            const response = await fetch("https://unpkg.com/firebase/firebase-app.js", {method: "HEAD"});
            const match = /@\d+(?:\.\d+)*/.exec(response.url);
            if (!match) {
                console.log("Unexpected resource URL (SemVer could not be determined, falling back to v9.0.0): " + response.url);
                loadFirebaseModule.version = "9.0.0";
            } else {
                loadFirebaseModule.version = match[0].slice(1);
            }
        }

        // use the found semver to pull from Google's CDN
        const module = await import(`https://www.gstatic.com/firebasejs/${loadFirebaseModule.version}/firebase-${name}.js`);
        window.FIREBASE_MODULES[name] = module;

        console.log(`Successfully imported "${name}" module`)
        return module;
    } catch (err) {
        if (sinkErrors) {
            console.error(`Failed to import "${name}" module`, err);
        } else {
            throw err;
        }
    }
}
window.loadFirebaseModule = loadFirebaseModule;

loadFirebaseModule('app')
    .then(({initializeApp}) => {
        initializeApp({
            apiKey: "AIzaSyAgG4H6wjiZkck0Uz3wyDyu8SwFAYyCneQ",
            authDomain: "onlineeth-6dcea.firebaseapp.com",
            projectId: "onlineeth-6dcea",
            storageBucket: "onlineeth-6dcea.firebasestorage.app",
            messagingSenderId: "52648731675",
            appId: "52648731675",
            measurementId: "52648731675"
        });
    });


loadFirebaseModule('firestore')
    .then((firestoreModule) => {
        const { getFirestore, collection, getDocs, addDoc, Timestamp } = firestoreModule;

        // Firestore 초기화
        const db = getFirestore();

        // 사용할 Firestore 메서드 예시
        async function fetchData() {
            const myCollection = collection(db, 'filters');
            const querySnapshot = await getDocs(myCollection);
            querySnapshot.forEach((doc) => {
                console.log(doc.id, ' => ', doc.data());
            });
        }

        fetchData();
    })
    .catch((err) => {
        console.error('Failed to load Firestore module:', err);
    });
