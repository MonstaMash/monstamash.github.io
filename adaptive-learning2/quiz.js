
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

if (Varsections.getValue() != "0") {
	sections = JSON.parse(Varsections.getValue());
}

let currentSection;
let currentAnswer;
let currentConfidence;

var quizApp = function(quiz) {

	this.score = parseInt(Vartscore.getValue());
	this.currentque = parseInt(Varcurrentque.getValue());
	console.log("values");
	console.log(this.score, this.currentque);
	var totalque = quiz.JS.length;

	this.displayQuiz = function(cque) {

		$("#confidence1").show();
		$("#confidence2").show();
		$("#confidence3").show();
		$("#confidence4").show();
		$("#feedback").html('');

		$("#confidence1").prop( "disabled", true );
		$("#confidence2").prop( "disabled", true );
		$("#confidence3").prop( "disabled", true );

		$("#next").hide();
		currentAnswer, currentConfidence, currentSection = '';
		this.currentque = cque;

		if(this.currentque <  totalque) {

			currentSection = quiz.JS[this.currentque].module + "_" + quiz.JS[this.currentque].chapter;
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

				$(this).find(':radio').prop('checked', true)
				$("#confidence1").prop( "disabled", false );
				$("#confidence2").prop( "disabled", false );
				$("#confidence3").prop( "disabled", false );
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
			//END QUIZ STUFF
			console.log("You have finished and scored" + (this.score / totalque) * 100 + "%");
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
			currentAnswer = "correct"
		} else {
			quiz.JS[this.currentque].status = "wrong";
			currentAnswer = "wrong";
		}

	}

	this.changeQuestion = function(cque) {
			this.currentque = this.currentque + cque;
			this.displayQuiz(this.currentque);

	}

}

if (Varfullquiz.getValue() != "0") {
	fullquiz = JSON.parse(Varfullquiz.getValue());
	console.log("loaded quiz from memory")
}

var jsq = new quizApp(fullquiz);

var selectedopt;
	$(document).ready(function() {

		jsq.score = parseInt(Vartscore.getValue());
		jsq.currentque = parseInt(Varcurrentque.getValue());

		jsq.displayQuiz(jsq.currentque);


	});

	$('#confidence4').click(function(e) {
		// I dont know

		e.preventDefault();
		currentAnswer = "dontknow";
		showFeedback();
	});

	$('#confidence3').click(function(e) {
		// Im not sure

		e.preventDefault();
		jsq.checkAnswer(selectedopt);
		showFeedback();
	});

	$('#confidence2').click(function(e) {
		// I think I know

		e.preventDefault();
		jsq.checkAnswer(selectedopt);
		showFeedback();
	});

	$('#confidence1').click(function(e) {
		// I know it

		e.preventDefault();
		jsq.checkAnswer(selectedopt);
		showFeedback();
	});

	$('#next').click(function(e) {

		e.preventDefault();
		var result = sections.find( obj => obj.id == currentSection);


		result.seen++;
		if (currentAnswer == "correct") result.correct++;
		console.log(result, currentSection);
		if (result.completed == 0 && (currentAnswer == "dontknow" || currentAnswer == "wrong")) {

			result.completed = 1;
			Varsections.set(JSON.stringify(sections));
			Varfullquiz.set(JSON.stringify(fullquiz));
			Vartscore.set(jsq.score);
			Varcurrentque.set(jsq.currentque);
			//If the section has not been seen, and the question was answered wrong - show the section
			//For demo only
			trivExitPage( "content_" + currentSection + ".html", true )
		} else {
			jsq.changeQuestion(1);

		}

	});



	function showFeedback() {

		$("#confidence1").hide();
		$("#confidence2").hide();
		$("#confidence3").hide();
		$("#confidence4").hide();
		$("#next").show();

		if (currentAnswer == "correct") {
			$("#feedback").html('<h3><i class="fa-regular fa-circle-check c-correct"></i> You got it</h3>');
		} else if (currentAnswer == "wrong") {
			$("#feedback").html('<h3><i class="fa-regular fa-circle-xmark c-wrong"></i> Thats not the answer</h3>');
		} else if (currentAnswer == "dontknow") {
			$("#feedback").html('<h3><i class="fa-regular fa-circle-question c-dontknow"></i> OK, no worries</h3>');
		}
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
