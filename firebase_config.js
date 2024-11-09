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
            appId: "1:52648731675:web:f35f51695537cc7f1604be",
            measurementId: "G-38B0YKEQJV"
        });
    });

loadFirebaseModule('storage', true) // import & ignore the error
    .then((firestoreModule) => {
        const {getFirestore, collection, getDocs, Timestamp} = firestoreModule;
        const db = getFirestore();  // Firestore 인스턴스 생성

        // Firestore에서 데이터 읽기
        async function fetchData() {
            const myCollection = collection(db, 'filters'); // filters 컬렉션
            try {
                const querySnapshot = await getDocs(myCollection);  // 컬렉션에서 문서 가져오기
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, ' => ', doc.data());  // 각 문서의 ID와 데이터를 콘솔에 출력
                });
            } catch (error) {
                console.error("Error getting documents: ", error);  // 오류 처리
            }
        }

        fetchData();  // 데이터 가져오기 호출
    })
    .catch((err) => {
        console.error('Failed to load Firebase module:', err);  // 모듈 로드 실패 시 오류 처리
    });
