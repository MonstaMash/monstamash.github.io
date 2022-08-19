let sections =
[
    {id: "520_1", title: "What is meant by 'First Aid'", seen: 0, correct: 0, completed: 0, studied: 0},
    {id: "520_2", title: "The Principles of First Aid – the 3Ps", seen: 0, correct: 0, completed: 0, studied: 0},
    {id: "520_3", title: "The ABCDE technique", seen: 0, correct: 0, completed: 0, studied: 0},
    {id: "520_4", title: "The responsibilities of a First Aider", seen: 0, correct: 0, completed: 0, studied: 0},
    {id: "521_1", title: "Primary and secondary survey", seen: 0, correct: 0, completed: 0, studied: 0},
    {id: "521_2", title: "How to place a casualty in the recovery position", seen: 0, correct: 0, completed: 0, studied: 0},
    {id: "522_1", title: "Facilities and equipment", seen: 0, correct: 0, completed: 0, studied: 0},
    {id: "523_1", title: "Causes of unconsciousness", seen: 0, correct: 0, completed: 0, studied: 0},
    {id: "524_1", title: "How to approach a casualty suffering from a heart attack/cardiac arrest ", seen: 0, correct: 0, completed: 0, studied: 0},
    {id: "524_2", title: "How to perform CPR", seen: 0, correct: 0, completed: 0, studied: 0}
];

let finalResult = [
	{id: "520", title: "Principles of first aid", seen: 0, correct: 0},
	{id: "521", title: "Assessing the casualty", seen: 0, correct: 0},
	{id: "522", title: "Facilities and equipment", seen: 0, correct: 0},
	{id: "523", title: "Causes of unconsciousness", seen: 0, correct: 0},
	{id: "524", title: "Cardiopulmonary resuscitation", seen: 0, correct: 0}
]


let assess;
if (Varassess == -1) {
	assess = true;
} else {
	assess = Varassess.getValue();
	assess = JSON.parse(assess.toLowerCase())
}


var quizApp = function(quiz) {

	this.score = 0;
	this.qno = 1;
	this.currentque = 0;
	var totalque = quiz.JS.length;
	console.log()
	if (assess) {

		$("#results").hide();
		$("#final").hide();
		$("#quiz").show();
		$("#quizcount").show();

	} else {

		sections = JSON.parse(Varresult.getValue());
		$("#quiz").hide();
		$("#quizcount").hide();
		$("#final").show();
		$("#results").show();
		showResult();

	}



	this.displayQuiz = function(cque) {
        $("#next").attr("disabled", true);
		this.currentque = cque;

		if(this.currentque <  totalque) {
			console.log(this.currentque, totalque);
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

			$('.option-block').on('click', function(e){
				// Answer block
				e.preventDefault();
				$('#next').attr('disabled', false);
				$(this).find(':radio').prop('checked', true)
				$(this).prop("checked", true);
					selectedopt = $(this).text();
			});

		}

		if(this.currentque >= totalque) {


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
			assess = false;
			Varassess.set(assess);
			showResult();





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


var jsq = new quizApp(uncompletedQuestions(fullquiz));

function uncompletedQuestions(quiz) {
	let questions = { "JS" : [] };
	quiz.JS.forEach(element => {
		section = element.module + "_" + element.chapter;

		let sectionlookup = sections.find(obj => {
			return obj.id == section
		})
		if (sectionlookup.completed == 0 ) {
			//section not completed, add question
			questions.JS.push(element);
		}
	})

	return questions;
}

var selectedopt;

$(document).ready(function() {
		jsq.displayQuiz(0);

});


	$('#next').click(function(e) {
			e.preventDefault();
			if(selectedopt) {
				jsq.checkAnswer(selectedopt);
			}
			jsq.changeQuestion(1);
	});


	function showResult() {
		$("#completed").html('');
		$("#tostudy").html('');
		let allStudied = true;
		let allCompleted = true;
		sections.forEach((element, index) => {
			let perc = Math.round((element.correct / element.seen) * 100);
			if (perc >= 75) {
				element.completed = 1;
				element.studied = 1;
				$("#completed").append('<li><span class="fa-li"><i class="fa fa-check c-correct"></i></span>&nbsp;&nbsp;<a href="#" onclick="trivExitPage( &apos;content_' + element.id + '.html&apos;, true )">' + element.title + '</a> - ' + perc + '%</li>');
			} else {
				allCompleted = false;
			  if (element.studied == 0) {

				allStudied = false;
				ico = '<i class="fa-regular fa-circle lft"></i>';
				$("#tostudy").append('<div class="row row-btn"><a href = "#" class="btn btn-primary btn-block" onclick="trivExitPage( &apos;content_' + element.id + '.html&apos;, true )"> ' + ico + element.title +  '</a></div> ');
			  } else {
				ico = '<i class="fa-regular fa-circle-check lft"></i>';
				$("#tostudy").append('<div class="row row-btn"><a href = "#" class="btn btn-success btn-block" onclick="trivExitPage( &apos;content_' + element.id + '.html&apos;, true )"> ' + ico + element.title +  '</a></div> ');
			  }

			}

		});

		ico = '<i class="fas fa-list-ul"></i>';
		console.log('studied', allStudied);
		console.log('completed', allCompleted);


		if (allCompleted) {
			$("#results").html("<h3>Way to go! You finished!</h3>")
		} else {
			if (allStudied) {
				$("#final").append('<div class="row row-btn"><button class="btn btn-outline-primary btn-block" onclick="startFinalAssessment()"> ' + ico +  ' Retake Assessment</a></div> ');
			} else {
				$("#final").append('<div class="row row-btn"><button class="btn btn-outline-primary btn-block" disabled > ' + ico +  ' Retake Assessment</a></div> ');
			}
		}

		Varresult.set(JSON.stringify(sections));
		$("#results").show();
		$("#final").show();
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

		sections.forEach((element, index) => {
			if (element.completed == 0) {
				element.studied = 0;
				element.seen = 0;
				element.correct = 0;
			}

		});
		//repeat assessment
		console.log("final");
		$("#final").html("");
		$("#quiz").show();
		$("#quizcount").show();

		assess = true;
		Varassess.set(true);


		//Load in the questions from memory
		let finalquiz = JSON.parse(Varquiz.getValue());

		//Filter out the already correct

		jsq = new quizApp(uncompletedQuestions(finalquiz));
		jsq.displayQuiz(0);
	}