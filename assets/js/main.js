
let undergrads = [];
let grads = [];
let officers = [];
let sorted_by_pledge_year = {};
let view_undergrads = true;
let undergrad_years = [];
let grad_years = [];
let unsorted = {};

function toggleMenu() {
	let menu = $('#menu');

	if (menu.css('display') == 'none') {
		menu.show();
	} else {
		menu.hide();
	}
}

function openModal(url, type) {
	$.get('members/' + type + '/' + url, function(data) {
		let lines = data.split('\n');
		let id = '';
		let name = '';
		let title = '';
		let grad_year = '';
		let pledge_year = 0;
		let hometown = '';
		let concentration = '';
		let offices = [];
		let books = [];

		for (let i in lines) {
			let tokens = lines[i].split('::');
			let tag = tokens[0];

			if (tag == 'ID') {
				id = $.trim(tokens[1]);
			} else if (tag == 'Name') {
				name = tokens[1];
			} else if (tag == 'Member') {
				title = tokens[1];
			} else if (tag == 'Year') {
				grad_year = tokens[1].replace(/\s/g, '');

				if (grad_year.length > 4) {
					grad_year = grad_year.slice(-4);
				} else if (grad_year.length == 4 && grad_year.indexOf('.') == -1) {
					grad_year = grad_year.slice(-2);
				}

			} else if (tag == 'Pledge') {
				pledge_year = parseInt(tokens[1]) - 3;

			} else if (tag == 'Hometown') {
				hometown = tokens[1];
			} else if (tag == 'Concentration') {
				concentration = tokens[1];
			} else if (tag == 'Officer') {
				offices.push(tokens[1]);
			} else if (tag == 'Book') {
				books.push(tokens[1]);
			}
		}

		let book_string = '<ul>';

		for (let i in books) {
			book_string += '<li>' + books[i] + '</li>';
		}

		book_string += '</ul>';

		let office_string = '';

		if (offices.length > 0) {
			office_string += '<p>Offices: <ul>';

			for (let i in offices) {
				office_string += '<li>' + offices[i] + '</li>';
			}

			office_string += '</p></ul>';
		}

		let modal_string = '<div class="modal"><div class="modal__inner">' +
		'<div class="modal__close" onclick="closeModal();"></div>' + 
		'<div class="modal-zone"><h3>' + title + ' ' + name + ' \'' + grad_year + '</h3>' + 
		'<img src="composite/' + type + '/' + id + '.jpg" class="modal-img">' +
		'<div class="modal-text"><p>Pledge Class of ' + pledge_year + '</p>' + 
		'<p>Hometown: <strong>' + hometown + '</strong></p>' + 
		'<p>Concentration: <strong>' + concentration + '</strong></p>' + 
		office_string + '<p>Books: ' + book_string + '</p>';

		// secret secret secret
		if (id == "Linda_Chang") {
			modal_string += '<a id="rhubarb-link" href="assets/misc/rhubarbs.txt">List of Rhubarbs</a></div></div></div></div>';
		} else {
			modal_string += '</div></div></div></div>';
		}

		$('#member-container').append(modal_string);
	});
}

function closeModal() {
	$('.modal').remove();
}

function showMembersFromFilter() {
	showMembers(view_undergrads);
}

function showMembers(bool) {

	$('#pledge-btn').removeClass('active');
	$('#graduation-btn').addClass('active');

	if (bool) {
		view_undergrads = true;
		type = 'undergrad';
		list = undergrads;
		$('#undergrad-btn').addClass('active');
		$('#grad-btn').removeClass('active');
		$('#officers-btn').removeClass('active');
		$('.filter').show();

	} else {
		view_undergrads = false;
		type = 'grad';
		list = grads;
		$('#undergrad-btn').removeClass('active');
		$('#grad-btn').addClass('active');
		$('#officers-btn').removeClass('active');
		$('.filter').show();
	}

	let container = $('#member-wrapper');

	container.empty();	

	for (let i in list) {

		let year_full = list[i]['year'];
		let year = year_full.split(' ')[0];

		container.append('<h3>Class of ' + year_full + '</h3>');
		container.append('<div class="row 150%"><div class="12u member-composite" id="' + year + '-row">' +
			'</div></div>');

		members = list[i]['members'];

		for (let j in members) {
			let first_name = members[j]['first_name'];
			let last_name = members[j]['last_name'];
			let url = members[j]['url'];
			let graduation_year = members[j]['graduation_year'];
			let pledge_year = members[j]['pledge_year'];


			$('#' + year + '-row').append('<div class="member ' + type + '-' + graduation_year + 
				' pledge-' + pledge_year + '"><img onclick="openModal(\'' 
				+ first_name + '_' + last_name.split(' ').join('_') + '\',\'' + type + '\');" src="' + 
				'composite/' + type + '/' + url + '.jpg' + '"><p>' + 
				first_name + ' ' + last_name + '</p></div>');	
		}

	}

	sr.reveal('.member');
}


function showOfficers() {

	$('#undergrad-btn').removeClass('active');
	$('#grad-btn').removeClass('active');
	$('#officers-btn').addClass('active');
	$('.filter').hide();

	let container = $('#member-wrapper');

	container.empty();

	// Displaying Ex-Com members
	container.append('<div class="row 150%"><div class="12u member-composite" id="officer-composite"></div></div>');

	for (let i in officers) {

		let title = officers[i]['title'];
		let name = officers[i]['name'];

		let url = name.split(' ').join('_');

		$('#officer-composite').append('<div class="excom"><h4>' + title + '</h4><img onclick="openModal(\'' + url + '\', \'undergrad\');" src="' + 
			'composite/undergrad/' + url + '.jpg' + '"><p>' + 
			name + '</p></div>');

	}

	sr.reveal('.officer');
}

// function showByPledgeClass() {
// 	$('#pledge-btn').addClass('active');
// 	$('#graduation-btn').removeClass('active');

// 	to_show = (view_undergrads) ? undergrad_pledge : undergrad_pledge; // TODO CHANGE TO GRAD. 
// 	undergrad_pledge.keys(data).sort().forEach(function(year) {
		
// 	});
	
// }
function showByPledgeClass() {

	$('#pledge-btn').addClass('active');
	$('#graduation-btn').removeClass('active');

	for (let i in unsorted) {
		Object.keys(unsorted[i]).sort().forEach(function(key) {
			if (!(i in sorted_by_pledge_year)) {
				sorted_by_pledge_year[i] = {};
			}
			
			sorted_by_pledge_year[i][key] = unsorted[i][key];
		});
	}

	let container = $('#member-wrapper');

	container.empty();	

	let years_clean = [];

	if (view_undergrads) {
		let year_list = undergrad_years;
	} else {
		let year_list = grad_years;
	}

	for (let i in year_list) {
		let year_full = year_list[i];
		let year = year_full.split(' ')[0];
		years_clean.push(year);
	}

	for (let i in year_list) {
		let year = years_clean[i];

		container.append('<h3>Pledge Class of ' + (parseInt(year) - 3).toString() + '</h3>');
		container.append('<div class="row 150%"><div class="12u member-composite" id="' + year + '-row">' +
		'</div></div>');

		for (let j in sorted_by_pledge_year[year]) {
			let first_name = sorted_by_pledge_year[year][j]['first_name'];
			let last_name = sorted_by_pledge_year[year][j]['last_name'];
			let graduation_year = sorted_by_pledge_year[year][j]['graduation_year'];
			let pledge_year = sorted_by_pledge_year[year][j]['pledge_year'];
			let url = sorted_by_pledge_year[year][j]['url'];

			if (view_undergrads && years_clean.indexOf(graduation_year) > -1) {
				let type = 'undergrad';
			} else if (!view_undergrads && years_clean.indexOf(graduation_year) == -1) {
				let type = 'undergrad';
			} else {
				let type = 'grad';
			}
			

			$('#' + year + '-row').append('<div class="member grad-' + graduation_year + 
				' pledge-' + pledge_year + '"><img onclick="openModal(\'' + first_name 
				+ '_' + last_name.split(' ').join('_') + '\',\'' + type + '\');" src="' + 
				'composite/' + type + '/' + url + '.jpg' + '"><p>' + 
				first_name + ' ' + last_name + '</p></div>');
		}
	} 

	sr.reveal('.member');

}

(function($) {

	skel.breakpoints({
		xlarge: '(max-width: 1680px)',
		large: '(max-width: 1140px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)',
		xxsmall: '(max-width: 320px)'
	});

	$(function() {

		var	$window = $(window),
			$body = $('body');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 50);
			});

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on mobile.
			skel.on('+mobile -mobile', function() {
				$.prioritize(
					'.important\\28 mobile\\29',
					skel.breakpoint('mobile').active
				);
			});

		// Scrolly.
			$('.scrolly').scrolly();

			$('#nav').affix({
		      offset: {
		        top: $('#one').height()
		      }
		    });


			// Smooth scrolling for anchor tags in the nav bar
		    $('a[href*="#"]:not([href="#"])').click(function() {
			    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') 
			    	&& location.hostname == this.hostname) {

			      let target = $(this.hash);
			      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');

			      if (target.length) {
			        $('html, body').animate({
			          scrollTop: target.offset().top
			        }, 800);
			        return false;
			      }
			    }
		  	});


			// for the songs in the history section
			let playlist = ['Theres_Beauty', 'Heaven_Bless_Thee', 'Gay_Gallant_Ship', 'Another_Busy_Week_(piano)', 'Another_Busy_Week_(a_capella)', 
				'Vive_le_Compagnie', 'Come_Troll_a_Stave', 'Manus_Multae', 'We_Come', 'Would_You_Know'];

			let titles = ['There\'s Beauty', 'Heaven Bless', 'A Gay, Gallant Ship', 'Another Busy Week Has Passed (piano)', 
			'Another Busy Week Has Passed (a capella)', 'Vive la Compagnie', 'Come Troll a Stave and Drink a Measure', 
			'Manus Multae, Cor Unum', 'The Marching Song (We Come)', 'Would You Know?']

			i = 1;

			let audio = $("#player")[0];
			let first_playback = true;

			audio.addEventListener('ended', function() {
				if (i > 9 && !first_playback) {
			    	i = 0;
			    }

			    first_playback = false;

			    $('#song-title').text((i + 1) + '. ' + titles[i]);

			    audio.src = 'music/' + playlist[i] + '.mp3';
			    audio.pause();
			    audio.load();
			    audio.play();

			    i++;
			});


			// For the Members section
			window.sr = ScrollReveal();

			// Parsing undergrad layout file
			get_members();
			$.get('members/layout/undergrad', function(data) {
				let lines = data.split('\n');

				let index = 0;
				let graduation_year = '';

				for (let i in lines) {
					let line = lines[i].split(',');

					if (line.length == 1) {
						graduation_year = line[0].split(' ')[0];
						undergrad_years.push(line[0]);

						index++;
						undergrads.push({
							year: line[0],
							members: {}
						});

					} else if (line.length > 1) {
						let first_name = line[1].substr(0, line[1].indexOf(' ')); 
						let last_name = line[1].substr(line[1].indexOf(' ') + 1);
						let url = line[0];
						let pledge_year = line[2].replace(/\s/g, '');

						if (last_name in undergrads[index - 1]['members']) {
							key = last_name + String(1);
							
						} else {
							key = last_name;
						}

						undergrads[index - 1]['members'][key] = {
							first_name: first_name,
							last_name: last_name,
							url: url,
							graduation_year: graduation_year,
							pledge_year: pledge_year
						};

						if (!(pledge_year in unsorted)) {
							unsorted[pledge_year] = {};
						}
						
						if (!(key in unsorted[pledge_year])) {
							unsorted[pledge_year][key] = {};
						}

						unsorted[pledge_year][key]['first_name'] = first_name;
						unsorted[pledge_year][key]['last_name'] = last_name;
						unsorted[pledge_year][key]['url'] = url;
						unsorted[pledge_year][key]['graduation_year'] = graduation_year;
					}
				}

			}, 'text');

			// Parsing grad layout file
			$.get('members/layout/grad', function(data) {
				let lines = data.split('\n');

				let index = 0;
				let graduation_year = '';

				for (let i in lines) {
					let line = lines[i].split(',');

					if (line.length == 1) {
						graduation_year = line[0].split(' ')[0];

						if (line[0] != '2018') {
							grad_years.push(line[0]);
						}

						index++;
						grads.push({
							year: line[0],
							members: {}
						});

					} else if (line.length > 1) {
						let first_name = line[1].substr(0, line[1].indexOf(' ')); 
						let last_name = line[1].substr(line[1].indexOf(' ') + 1);
						let url = line[0];
						let pledge_year = line[2].replace(/\s/g, '');

						if (last_name in grads[index - 1]['members']) {
							key = last_name + String(1);
							
						} else {
							key = last_name;
						}

						grads[index - 1]['members'][key] = {
							first_name: first_name,
							last_name: last_name,
							url: url,
							graduation_year: graduation_year,
							pledge_year: pledge_year
						};

						if (!(pledge_year in unsorted)) {
							unsorted[pledge_year] = {};
						}
						
						if (!(key in unsorted[pledge_year])) {
							unsorted[pledge_year][key] = {};
						}

						unsorted[pledge_year][key]['first_name'] = first_name;
						unsorted[pledge_year][key]['last_name'] = last_name;
						unsorted[pledge_year][key]['url'] = url;
						unsorted[pledge_year][key]['graduation_year'] = graduation_year;
					}
				}

			}, 'text');


			// Parsing officers layout file
			$.get('members/layout/officer', function(data) {
				let lines = data.split('\n');

				let index = -1;
				
				for (let i in lines) {
					let tokens = lines[i].split('::');

					let title = tokens[0];
					let name = tokens[1];

					officers.push({
						title: title,
						name: name
					});
					
				}

			}, 'text');

		});

})(jQuery);

undergrad_pledge = {};
undergrad_year = {};
function get_members() {
	const undergrad_location = "conversion/undergrad";
	$.get(undergrad_location, function(data) {
		undergrad = JSON.parse(data);
		undergrad.forEach(function(member){
			let pledge_year = member["Pledge"];
			if(!(pledge_year in undergrad_pledge)) {
				undergrad_pledge[pledge_year] = [];
			}
			undergrad_pledge[pledge_year].push(member);

			let year = member["Year"];
			if(!(year in undergrad_year)) {
				undergrad_year[year] = [];
			}
			undergrad_year[year].push(member);
		});
	}).then(function() {
		console.log(undergrad_pledge);
		Object.keys(undergrad_pledge).forEach(function(year, index) {
			undergrad_pledge[year].sort(function(a, b) {
				if(a["Name"] < b["Name"]) { return -1; }
				if(a["Name"] > b["Name"]) { return 1; }
				return 0;
			});
		});
		console.log(undergrad_pledge);
	});
	
}
