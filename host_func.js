var nomorsoal = 1;
var countCarousel = 1;


function getStatus(){
	var database = firebase.database().ref('event');
	database.on('value', function(snapshot) { 
		statusQuiz = snapshot.val().status;

		if(statusQuiz == 1){
			var backOfferButton = document.getElementById('buttonawal');
			backOfferButton.dataset.target = "#endquiz";
		}
		else{
			var backOfferButton = document.getElementById('buttonawal');
			backOfferButton.dataset.target = "#largeModal";

		}
	})
}

function endquiz(){
	var eventquiz = firebase.database().ref('event');
	eventquiz.update({
		status : 0
	});
}

function check(input) {

	//alert("inputtt nameee : " + input.name);
	var nama = input.name;

	var idku = nama.substring(16, nama.length);

	$('label[id="' + idku + '"]').html('Wrong Answer');
	var selected_Id = $('input[name="' + input.name + '"]:checked').attr('id');

	$('label[for=' + selected_Id + ']').html('Right Answer');
}

function previewFile(input) {

	var idku = input.id;
	var file = $("input[id=" + idku + "]").get(0).files[0];

	if (file) {
		var reader = new FileReader();


		reader.onload = function () {
			$("#previewImg" + idku).attr("src", reader.result);
		}
		reader.readAsDataURL(file);
	}
}


function deletebtn() {
	var currentIndex = $('div.active').index() + 1;

	//alert("soall : " + currentIndex);
	nomorsoal = $('.carousel-item').length;

	if (nomorsoal != 1) {
		var del = document.getElementsByClassName('carousel-item')[currentIndex-1];
		del.remove();
		var delLi = document.getElementsByClassName('indicator')[currentIndex-1];
		delLi.remove();

		nomorsoal -= 1;
		tiapsoal = nomorsoal * 4;

		for (var i = currentIndex; i <= nomorsoal + 1; i++) {    //1   2   mis no soal 3
			if (currentIndex >= 1 && nomorsoal + 1 > 1 && currentIndex <= nomorsoal + 1) {
				for (var j = i + 1; j <= nomorsoal + 1; j++) {
					if ((currentIndex - 1) != nomorsoal) {
						$('h1[class=ha' + (j) + ']').html('Soal ' + i);
					}
				}
			}
		}
	}
	var countItem = $('.carousel-item').length;
	//alert(countItem);
	var current = document.getElementsByClassName('carousel-item')[countItem-1];
	current.className = 'carousel-item active';

	// $('.carousel-item')[countItem-1].addClass('active');

	// if (currentIndex < currentIndex) {
	// 	$('#carousel' + countItem).addClass('active');
	// }
	// else {
	// 	$('#carousel' + (countItem-1)).addClass('active');
	// }
}


function addnew() {
	//alert("masuk new");
	nomorsoal += 1;

	var tiapsoal = nomorsoal * 4;

	$('.carousel-indicators').append("<li id='li" + nomorsoal + "' data-target='#carouselExampleIndicators' data-slide-to='" + (nomorsoal - 1) + "' class='indicator'></li>");

	$('.carousel-inner').append('<div class="carousel-item" id="carousel' + nomorsoal + '"><h1 class="ha' + nomorsoal + '">Soal ' + nomorsoal + '</h1><div class="row"><div class="col-md-6 d-block"><div class="card d-block shadow p-3 mb-5 bg-body rounded"><div class="card-body"><div class="image-upload"><label for="' + (tiapsoal - 3) + '"><img id="previewImg' + (tiapsoal - 3) + '" src="assets/image/outline_add_photo_alternate_black_48dp.png"style="width: 150px; height: 150px;" /></label><input id="' + (tiapsoal - 3) + '" type="file" onchange="previewFile(this);" style="display: none;" /></div><input type="text" class="form-control" placeholder="ex. Ayam" aria-label="txtket" id="txt' + (tiapsoal - 3) + '"> <input type="text" placeholder="ex. Ayam" aria-label="txtket" id="lbl' + (tiapsoal - 3) + '" style="display: none;"><div class="form-check" style="position:left; margin-top: 5px;"><input class="form-check-input" type="radio" onchange="check(this)" name="flexRadioDefault' + nomorsoal + '" id="flexRadioDefault' + (tiapsoal - 3) + '"><label class="form-check-label" id="' + nomorsoal + '" for="flexRadioDefault' + (tiapsoal - 3) + '">Wrong Answer</label></div></div></div></div><div class="col-md-6 d-block"><div class="card d-block shadow p-3 mb-5 bg-body rounded"><div class="card-body"><div class="image-upload"><label for="' + (tiapsoal - 2) + '"><img id="previewImg' + (tiapsoal - 2) + '" src="assets/image/outline_add_photo_alternate_black_48dp.png" style="width: 150px; height: 150px;" /></label><input id="' + (tiapsoal - 2) + '" type="file" onchange="previewFile(this);" style="display: none;" /></div><input type="text" class="form-control" placeholder="ex. Ayam" aria-label="txtket" id="txt' + (tiapsoal - 2) + '"> <input type="text" placeholder="ex. Ayam" aria-label="txtket" id="lbl' + (tiapsoal - 2) + '" style="display: none;"><div class="form-check" style="position:left; margin-top: 5px;"><input class="form-check-input" onchange="check(this)" type="radio" name="flexRadioDefault' + nomorsoal + '" id="flexRadioDefault' + (tiapsoal - 2) + '"><label class="form-check-label" id="' + nomorsoal + '" for="flexRadioDefault' + (tiapsoal - 2) + '">Wrong Answer</label></div></div></div></div></div><div class="row"><div class="col-md-6 d-block"><div class="card d-block shadow p-3 mb-5 bg-body rounded"><div class="card-body"><div class="image-upload"><label for="' + (tiapsoal - 1) + '"><img id="previewImg' + (tiapsoal - 1) + '" src="assets/image/outline_add_photo_alternate_black_48dp.png"style="width: 150px; height: 150px;" /></label><input id="' + (tiapsoal - 1) + '" type="file" onchange="previewFile(this);" style="display: none;" /></div><input type="text" placeholder="ex. Ayam" aria-label="txtket" id="txt' + (tiapsoal - 1) + '"><input type="text" class="form-control" placeholder="ex. Ayam" aria-label="txtket" id="lbl' + (tiapsoal - 1) + '" style="display: none;"><div class="form-check" style="position:left; margin-top: 5px;"><input class="form-check-input" onchange="check(this)" type="radio" name="flexRadioDefault' + nomorsoal + '" id="flexRadioDefault' + (tiapsoal - 1) + '"><label class="form-check-label" id="' + nomorsoal + '" for="flexRadioDefault' + (tiapsoal - 1) + '">Wrong Answer</label></div></div></div></div><div class="col-md-6 d-block"><div class="card d-block shadow p-3 mb-5 bg-body rounded"><div class="card-body"><div class="image-upload"><label for="' + tiapsoal + '"><img id="previewImg' + tiapsoal + '" src="assets/image/outline_add_photo_alternate_black_48dp.png" style="width: 150px; height: 150px;" /></label><input id="' + tiapsoal + '" type="file" onchange="previewFile(this);" style="display: none;" /></div><input type="text" placeholder="ex. Ayam" aria-label="txtket" id="txt' + (tiapsoal) + '"> <input type="text" class="form-control" placeholder="ex. Ayam" aria-label="txtket" id="lbl' + (tiapsoal) + '" style="display: none;"> <div class="form-check" style="position:left; margin-top: 5px;"><input class="form-check-input" onchange="check(this)" type="radio" name="flexRadioDefault' + nomorsoal + '" id="flexRadioDefault' + tiapsoal + '"><label class="form-check-label" id="' + nomorsoal + '"for="flexRadioDefault' + tiapsoal + '">Wrong Answer</label></div></div></div></div></div>');

	countCarousel++;
}

function save() {

	var eventquiz = firebase.database().ref('event');
	eventquiz.update({
		status : 1
	});


	for (var i = 1; i <= nomorsoal; i++) {
		var mausoal = i * 4;
		var jawaban = $('input[name="flexRadioDefault' + i + '"]:checked').attr('id');
		jawaban = jawaban.substring(16, 17);
		var gettxt = "";
		var getgambar = "";

		// var jwbnbnr;
		for (var j = mausoal - 3; j <= mausoal; j++) {

			gettxt += document.getElementById("txt" + j).value + "_";
			var gambar = $("input[id=" + j + "]").val();
			var fieldVal = gambar.replace("C:\\fakepath\\", "Pictures\\");
			getgambar += fieldVal + "*";

			if (i != 1) {
				jawaban = jawaban % 4;
				if (jawaban == 0) {
					jawaban = 4;
				}
			}
		}
		var newData = firebase.database().ref('quiz').push();
		newData.set({
			nosoal: i,
			answer: jawaban,
			soaltxt: gettxt,
			gambarpath: getgambar,
		});
	}



	$('#largeModal').modal('hide');
	$('#endquiz').modal('show');


}