import firebase from 'firebase'

var config = {
  apiKey: 'AIzaSyDymLDCjtu_FZ8wCysT1cpFsKLlfAFg7vg',
  authDomain: 'kanbanjustin.firebaseapp.com',
  databaseURL: 'https://kanbanjustin.firebaseio.com',
  projectId: 'kanbanjustin',
  storageBucket: '',
  messagingSenderId: '394470370687'
}
let app = firebase.initializeApp(config)
let db = app.database()
let directory = function (x) {
  if (x === undefined) x = ''
  return db.ref('/' + x)
}

export const firebaseapp = app
export const database = directory
