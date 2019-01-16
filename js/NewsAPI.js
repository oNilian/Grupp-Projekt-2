
const countrys = [ { 'code': 'us', 'country': 'United States of America' }, { 'code': 'au', 'country': 'Commonwealth of Australia' }, { 'code': 'no', 'country': 'Kongeriket Norge' }, { 'code': 'it', 'country': 'Repubblica Italiana' }, { 'code': 'gb', 'country': 'United Kingdom of Great Britain and Northern Ireland' }, { 'code': 'de', 'country': 'Bundesrepublik Deutschland' }, { 'code': 'br', 'country': 'República Federativa do Brasil' }, { 'code': 'ca', 'country': 'Canada' }, { 'code': 'ar', 'country': 'República Argentina' }, { 'code': 'fr', 'country': 'République française' }, { 'code': 'in', 'country': 'Bhārat Gaṇarājya' }, { 'code': 'ru', 'country': 'Росси́йская Федера́ция' }, { 'code': 'se', 'country': 'Konungariket Sverige' }, { 'code': 'za', 'country': 'Republic of South Africa' }, { 'code': 'ie', 'country': 'Éire' }, { 'code': 'nl', 'country': 'Nederland' } ];

//Detta kör när sidan har laddats
$(document).ready(function() {
	//makeRequest('sources'); - api doesn't work so fuck it...
	countrys.forEach(data => {
		$('#updateNewsSource').append(`<option value="${data.code}">${data.country}</option>`);
	});

	$('#updateNewsSource').change(() => {
		selectedNewsSourceCountry = $('#updateNewsSource').val();
		// console.log('You change the option to: ', selectedNewsSourceCountry);

		makeRequest('top-headlines', selectedNewsSourceCountry);
		localStorage.setItem('newsLocation', selectedNewsSourceCountry);
		$('html').attr('lang', selectedNewsSourceCountry);
	});

	let value = localStorage.getItem('newsLocation');
	if( value !== null) {
			makeRequest('top-headlines', value);
			$('html').attr('lang', value);
			$('#updateNewsSource').val(value);
	} else {
		makeRequest('top-headlines', 'se');
	}
});  // document ready


//Anrop till API via function
function makeRequest(typeOfRequest, userLanguage) {
	// console.log('With typeOfRequest=' + typeOfRequest);
	// console.log('With userLanguage=' + userLanguage);

	//requestCountry = localStorage.getItem(requestCountry);
	let url = '';

	switch (typeOfRequest) { // Check that it's a valid request being made and which api url we need to use.
		case 'top-headlines':
			// console.log('Requested: everything');
			url = `https://newsapi.org/v2/${typeOfRequest}?` +
			`country=${userLanguage}&` +
			`pageSize=100&` +
			'apiKey=515e289985aa4ee8bfa95ea816773b14';
		break;
		case 'sources':
			// console.log('Requested: sources');
			url = `https://newsapi.org/v2/${typeOfRequest}?` +
			'apiKey=515e289985aa4ee8bfa95ea816773b14';
		break;
		default:
			console.log('Error not a correct type of request');
		break;

	}
	let req = new Request(url);
	fetch(req)
	.then(response => response.json())
	.then(whenDataRecieved);
} // makeRequest

function whenDataRecieved(data) {
	// console.log(data);
	if(typeof data.sources == 'object') {
		// display all the countrys...
		// console.log('data.sources is here');
		let countrys = [];
		for (let i=0; i < data.sources.length; i++) {
			if(!countrys.includes(data.sources[i].country)) {
				//if source country is not in the array, we add it to the list of possible countrys..
				// console.log('we added ' + data.sources[i].country + ' to our list of countrys');
				countrys.push(data.sources[i].country);
				$('#updateNewsSource').append(`<option value="${data.sources[i].country}">${data.sources[i].country}</option>`);
			}
		}
		// console.log('countrys array is: ', countrys);
	} else {
		// display all the article
		// console.log('data.sources is not here so list all the news sources');
		$('#articlesLeft').html('');
		for(let i=0; i < 10; i++) {
			let newsText = convertArticleToHtml(data.articles[i])
			//console.log(newsText);
			$('#articlesLeft').append(newsText);
		}
		$('#articlesRight').html('');
		let properArticles = 0;
		for(let x=10; properArticles < 40 && x < data.articles.length; x++) {
			if( data.articles[x] ) {
				properArticles++;
				let newsRight = convertArticleRightToHtml(data.articles[x])
				//console.log(newsText);
				$('#articlesRight').append(newsRight);
			}
		}
}
}

	// 1. hämta datan vi vill göra något med
	// 2. formatera datan - producera en sträng som innehåller bland annat titeln
	// 3. skapa HTML-element med den formaterade strängen
	// 4. lägg in HTML-elementen på sidan (i <ul>-elementet)

function convertArticleToHtml(artLeft) {
	//console.log('Artikel-objektet ser ut så här:', article);
	// for(i=0; i<4; i++) {
	let imgUrl = 'img/404-Darkside.png'
	if( artLeft && artLeft.urlToImage )
		imgUrl = artLeft.urlToImage;
	return `
		<article>
			<img class="" src="${imgUrl}">
			<h1 class="newsTitle"><a href="${artLeft.url}">${artLeft.title}</a></h1>
			<p><a href="${artLeft.url}">${artLeft.description}</a></p>
			<div class="">${artLeft.publishedAt}</div>
		</article>`;
}

function convertArticleRightToHtml(artRight) {
	//console.log('Artikel-objektet ser ut så här:', article);
	// for(i=0; i<4; i++) {
	//console.log('Converting article:', artLeft);
	let imgUrl = 'img/404-Darkside.png';
	let title = 'Fail title';
	if( artRight && artRight.urlToImage )
		imgUrl = artRight.urlToImage;
	if( artRight && artRight.title )
		title = artRight.title;
	return `<div>
		<img class="" src="${imgUrl}">
		<h2 class=""><a href="${artRight.url}">${title}</a></h2>
			</div>`
}
