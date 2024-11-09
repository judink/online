window.loadFirebaseModule('app')
    .then(({ initializeApp }) => {
        const app = initializeApp({
            apiKey: "AIzaSyAgG4H6wjiZkck0Uz3wyDyu8SwFAYyCneQ",
            authDomain: "onlineeth-6dcea.firebaseapp.com",
            projectId: "onlineeth-6dcea",
            storageBucket: "onlineeth-6dcea.firebasestorage.app",
            messagingSenderId: "52648731675",
            appId: "52648731675",
            measurementId: "52648731675"
        });
        return app;
    })
    .then(() => loadFirebaseModule('firestore'))
    .then((firestoreModule) => {
        // Firestore 모듈에서 필요한 함수 가져오기
        const { getFirestore, collection, getDocs, addDoc, Timestamp } = firestoreModule;

        // Firestore 초기화
        const db = getFirestore();

        // 예시 함수: Firestore에서 데이터 가져오기
        async function fetchData() {
            try {
                const myCollection = collection(db, 'filters');
                const querySnapshot = await getDocs(myCollection);
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, ' => ', doc.data());
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        // 예시 함수: Firestore에 데이터 추가하기


        // 함수 호출 예시
        fetchData();
        addData();
    })
    .catch((err) => {
        console.error("Failed to load Firebase module:", err);
    });