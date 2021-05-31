// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyA9VBziwfkJVMkD9I9vDyHLdgTSBV3lrL8",
  authDomain: "fune-prototype-53bcd.firebaseapp.com",
  databaseURL: "https://fune-prototype-53bcd-default-rtdb.firebaseio.com",
  projectId: "fune-prototype-53bcd",
  storageBucket: "fune-prototype-53bcd.appspot.com",
  messagingSenderId: "237858483371",
  appId: "1:237858483371:web:51a5406f135f221dae5bee",
  measurementId: "G-J61W8QEVCG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var modalquiz = document.getElementById("quizgame"); // Question Num 1
var modalquiz2 = document.getElementById("quizgame2"); // Question Num 2
var trueAnswer_Q1 = 0; //dri firebase
var trueAnswer_Q2 = 0; //dri firebase

//setInterval(getStatus, 1000);
var statusQuiz = 0;

function getStatus(){
  var database = firebase.database().ref('event');
  database.on('value', function(snapshot) { 
    statusQuiz = snapshot.val().status;
    //alert('status: '+statusQuiz);
  });
}

function getQuizAnswer(){
  var quizz = firebase.database().ref('quiz');
  quizz.on('value', (snapshot) => {
    snapshot.forEach(function(childSnapshot){
      if(childSnapshot.val().nosoal == 1){
        trueAnswer_Q1 = childSnapshot.val().answer;
        //alert(trueAnswer_Q1);
      }
      else if(childSnapshot.val().nosoal == 2){
        trueAnswer_Q2 = childSnapshot.val().answer;
        //alert(trueAnswer_Q2);
      }
    });
  });
}

window.onload = function(){
  alert('masuk');

  getStatus();
  getQuizAnswer();
}

function modalQuiz(){
  alert('status: '+statusQuiz);
}

function clickAnswer(num, qnum){
  //alert('clicked answer: ' + num);
  cekAnswer(num, qnum);
}

function cekAnswer(num, questionNum){
  //alert(trueAnswer_Q1);
  //alert(trueAnswer_Q2);

  if(questionNum == 1){
    if (num == trueAnswer_Q1){
      alert('CORRECT');
    }else{
      alert('INCORRECT');
    }
  }
  else if(questionNum == 2){
    if (num == trueAnswer_Q2){
      alert('CORRECT');
    }else{
      alert('INCORRECT');
    }
  }  
}

function donequiz()
{
  $('#resultquiz').modal('show');
}
