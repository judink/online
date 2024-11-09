window.FIREBASE_MODULES = window.FM = {};
let db = null
let myCollection = null;
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
        db = getFirestore();

        // 사용할 Firestore 메서드 예시
        async function fetchData() {
            myCollection = collection(db, 'filters');
            const querySnapshot = await getDocs(myCollection);
            querySnapshot.forEach((doc) => {
                console.log(doc.id, ' => ', doc.data());
            });
        }

        async function addOrUpdateFilter(trigger, response) {
            try {
                // getFilters 함수를 사용해 모든 필터를 가져옵니다.
                const filters = await getFilters();

                // trigger가 일치하는 필터가 있는지 확인합니다.
                const existingFilter = filters.find(filter => filter.trigger === trigger);

                if (existingFilter) {
                    // 기존 필터가 있을 경우, 업데이트
                    await updateDoc(doc(db, "filters", existingFilter.id), { response });
                    return "Filter updated: " + trigger+"=>"+response;
                } else {
                    // 기존 필터가 없을 경우, 새 필터 추가
                    const docRef = await addDoc(collection(db, "filters"), { trigger, response });
                    return "Filter added: " + trigger+"=>"+response;
                }
            } catch (e) {
                console.error("Error adding or updating filter: ", e);
                return "Error handling filter: " + trigger;
            }
        }

        async function getFilterStr() {
            let result = "";
            const querySnapshot = await getDocs(collection(db, "filters"));

            querySnapshot.forEach((doc) => {
                result += doc.id+" => "+doc.data()+"\n";
            });
            return result;
        }
        async function getFilters() {
            let filters = [];
            const querySnapshot = await getDocs(collection(db, "filters"));

            querySnapshot.forEach((doc) => {
                filters.push({ id: doc.id, ...doc.data() });
            });
            return filters;
        }
        async function deleteFilter(filterId) {
            const filterRef = doc(db, "filters", filterId);
            // 문서가 존재하는지 확인
            const filterSnap = await getDoc(filterRef);
            if (filterSnap.exists()) {
                // 문서가 존재하면 삭제
                await deleteDoc(filterRef);
                return  filterId;
            } else {
                // 문서가 없으면 경고 메시지 출력
                return null;
            }
        }
        fetchData();
    })
    .catch((err) => {
        console.error('Failed to load Firestore module:', err);
    });
