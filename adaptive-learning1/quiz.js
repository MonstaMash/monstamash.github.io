
let sections =
[
    {id: "520_1", title: "What is meant by 'First Aid'", seen: 0, correct: 0, completed: 0},
    {id: "520_2", title: "The Principles of First Aid – the 3Ps", seen: 0, correct: 0, completed: 0},
    {id: "520_3", title: "The ABCDE technique", seen: 0, correct: 0, completed: 0},
    {id: "520_4", title: "The responsibilities of a First Aider", seen: 0, correct: 0, completed: 0},
    {id: "521_1", title: "Primary and secondary survey", seen: 0, correct: 0, completed: 0},
    {id: "521_2", title: "How to place a casualty in the recovery position", seen: 0, correct: 0, completed: 0},
    {id: "522_1", title: "Facilities and equipment", seen: 0, correct: 0, completed: 0},
    {id: "523_1", title: "Causes of unconsciousness", seen: 0, correct: 0, completed: 0},
    {id: "524_1", title: "How to approach a casualty suffering from a heart attack/cardiac arrest ", seen: 0, correct: 0, completed: 0},
    {id: "524_2", title: "How to perform CPR", seen: 0, correct: 0, completed: 0}
];

let finalResult = [
	{id: "520", title: "Principles of first aid", seen: 0, correct: 0},
	{id: "521", title: "Assessing the casualty", seen: 0, correct: 0},
	{id: "522", title: "Facilities and equipment", seen: 0, correct: 0},
	{id: "523", title: "Causes of unconsciousness", seen: 0, correct: 0},
	{id: "524", title: "Cardiopulmonary resuscitation", seen: 0, correct: 0}
]

let finalAssessment = false;
let finalquiz;

var quizApp = function(quiz) {

	this.score = 0;
	this.qno = 1;
	this.currentque = 0;
	var totalque = quiz.JS.length;

	if (Varresult.getValue() != 0 && finalAssessment == false) {
		sections = JSON.parse(Varresult.getValue());
		showResult();
	} else {
		$("#results").hide();
	}



	this.displayQuiz = function(cque) {
        $("#next").attr("disabled", true);
		this.currentque = cque;

		if(this.currentque <  totalque) {


            let optionsArr = [];
			$("#tque").html(this.currentque+1 + ' of ' + totalque);
			$("#qid").html(quiz.JS[this.currentque].id + '.');
			$("#question").html(quiz.JS[this.currentque].question);
			$("#question-options").html("");
			for (var key in quiz.JS[this.currentque].options[0]) {
			  if (quiz.JS[this.currentque].options[0].hasOwnProperty(key)) {
                optionsArr.push(quiz.JS[this.currentque].options[0][key])}
			}
            shuffle(optionsArr);
            optionsArr.forEach((element, index) => {
                $("#question-options").append(
					"<div class='form-check option-block'>" +
					"<label class='form-check-label'>" +
					"<input type='radio' class='form-check-input' name='option'   id='q"+index+"' value='" + element + "'><span id='optionval'>" + element + "</span></label>"
				);
            });

		}

		if(this.currentque >= totalque) {

			if (finalAssessment) {



				showFinalResult();

			} else {

				$('#next').attr('disabled', true);
				for(var i = 0; i < totalque; i++) {
					let section = quiz.JS[i].module + "_" + quiz.JS[i].chapter
					this.score = this.score + quiz.JS[i].score;
					const res = sections.find(element => {
					if (element.id == section) {
						return true;
					}
						return false;
					});
					if (res) {
						res.seen++;
						res.correct = res.correct + quiz.JS[i].score;
					}
				}

				Varquiz.set(JSON.stringify(quiz));
				showResult();
			}




		}
	}



	this.checkAnswer = function(option) {
		var answer = quiz.JS[this.currentque].answer;
		option = option.replace(/\</g,"&lt;")   //for <
		option = option.replace(/\>/g,"&gt;")   //for >
		option = option.replace(/"/g, "&quot;")

		if(option ==  quiz.JS[this.currentque].answer) {
			if(quiz.JS[this.currentque].score == "") {
				quiz.JS[this.currentque].score = 1;
				quiz.JS[this.currentque].status = "correct";
		}
		} else {
			quiz.JS[this.currentque].status = "wrong";
		}

	}

	this.changeQuestion = function(cque) {
			this.currentque = this.currentque + cque;
			this.displayQuiz(this.currentque);

	}

}


var jsq = new quizApp(fullquiz);

var selectedopt;
	$(document).ready(function() {
			jsq.displayQuiz(0);

	$('#question-options').on('change', 'input[type=radio][name=option]', function(e) {
            $("#next").attr("disabled", false);
			//var radio = $(this).find('input:radio');
			$(this).prop("checked", true);
				selectedopt = $(this).val();
		});



	});


	$('#next').click(function(e) {
			e.preventDefault();
			if(selectedopt) {
				jsq.checkAnswer(selectedopt);
			}
			jsq.changeQuestion(1);
	});

	function showFinalResult() {
		$("#results").append('<p>FINAL RESULT WILL GO HERE</p>');
		$("#results").show();
		$("#quiz").hide();
		$("#quizcount").hide();
	}

	function showResult() {
		let allCompleted = true;
		sections.forEach((element, index) => {
			let perc = Math.round((element.correct / element.seen) * 100);
			if (perc >= 75) {
				element.completed = 1;
				$("#completed").append('<li><span class="fa-li"><i class="fa fa-check c-correct"></i></span>&nbsp;&nbsp;<a href="#" onclick="trivExitPage( &apos;content_' + element.id + '.html&apos;, true )">' + element.title + '</a> - ' + perc + '%</li>');
			} else {
			  if (element.completed == 0) {
				allCompleted = false;
				ico = '<i class="fa-regular fa-circle lft"></i>';
				$("#tostudy").append('<div class="row row-btn"><a href = "#" class="btn btn-primary btn-block" onclick="trivExitPage( &apos;content_' + element.id + '.html&apos;, true )"> ' + ico + element.title +  '</a></div> ');
			  } else {
				ico = '<i class="fa-regular fa-circle-check lft"></i>';
				$("#tostudy").append('<div class="row row-btn"><a href = "#" class="btn btn-success btn-block" onclick="trivExitPage( &apos;content_' + element.id + '.html&apos;, true )"> ' + ico + element.title +  '</a></div> ');
			  }

			}

		});

		ico = '<i class="fas fa-list-ul"></i>';
		if (allCompleted) {
			$("#final").append('<div class="row row-btn"><a href = "#" class="btn btn-outline-primary btn-block" onclick="startFinalAssessment()"> ' + ico +  ' Final Assessment</a></div> ');
		} else {
			//$("#final").append('<div class="row row-btn"><a href = "#" class="btn btn-outline-primary btn-block disabled" aria-disabled="true" > ' + ico +  ' Final Assessment</a></div> ');
			$("#final").append('<div class="row row-btn"><a href = "#" class="btn btn-outline-primary btn-block" onclick="startFinalAssessment()"> ' + ico +  ' Final Assessment</a></div> ');
		}

		Varresult.set(JSON.stringify(sections));
		$("#results").show();
		$("#quiz").hide();
		$("#quizcount").hide();


	}

    function shuffle(array) {
        let currentIndex = array.length,  randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;

          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }

        return array;
      }

	function startFinalAssessment() {
		console.log("final");
		finalAssessment = true;
		$("#results").html("");
		$("#final").html("");
		$("#quiz").show();
		$("#quizcount").show();


		//Load in the questions from memory
		finalquiz = JSON.parse(Varquiz.getValue());
		console.log(finalquiz);
		//Filter out the already correct
		var filteredquiz = finalquiz.JS.filter(finalquiz => {
			return finalquiz.score == 0
		  })
		  console.log(filteredquiz);
		  let filteredfinalquiz = { "JS" : filteredquiz};
		  console.log(filteredfinalquiz);
		jsq = new quizApp(filteredfinalquiz);
		jsq.displayQuiz(0);
	}