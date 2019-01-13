
//Detta kör när sidan har laddats
$(document).ready(function() {
	makeRequest();
	newsLightBox();


	// Event för CountryKnapparna #LandsEvent
	$('#usrBtnSwe').click(event => {
		console.log('Klickade SWE button');
		makeRequest('se');
		localStorage.setItem('newsLocation', 'se');
	});

	$('#usrBtnUS').click(event => {
		console.log('Klickade US button');
		makeRequest('us');
		localStorage.setItem('newsLocation', 'us');
	}); // Event för CountryKnapparna #LandsEvent

	let value = localStorage.getItem('newsLocation');
	if( value !== null) {
			makeRequest(value);
	}

});  // document ready

//Function för "lightboxen"
function newsLightBox () {
	// Open up a 'lightbox' if user clicks on update newsSource.
	$('#updateNewsSource').on('click', () => {
		$('#newSelectorBox').fadeIn(400);
		// now loop the new source inside the #newSelectorBox > div and let the user select the new source.

		// add so that the selected news source update the news list, saves the newSelectorBoxtting in a cookie and closes the 'lightbox'

		// add so the 'lightbox' closes if you click anywhere but the #newSelectorBox > div.
		$('#newSelectorBox > div > .close').on('click', () => {
			$('#newSelectorBox').fadeOut(300);
		});
	});
} // light box

//Anrop till API via function
function makeRequest(requestCountry='se', typeOfRequest='top-headlines', newsSources, pageSize, sortBy, language) {
	console.log('A new request was sent');
	//requestCountry = localStorage.getItem(requestCountry);
	let url = '';

	switch (typeOfRequest) { // Check that it's a valid request being made and which api url we need to use.
		case 'top-headlines':
			console.log('Requested: top-headlines');
			// 'Top headlines' possible Request parameters is: country, category, sources, q, pageSize, page
			url = `https://newsapi.org/v2/${typeOfRequest}?` +
			`country=${requestCountry}&` +
			'apiKey=515e289985aa4ee8bfa95ea816773b14';
		break;
		case 'everything':
			console.log('Requested: everything');
			// 'Everything' possible Request parameters is: sources, q, pageSize, page, domains, excludeDomains, from, to, language, sortBy
			url = `https://newsapi.org/v2/${typeOfRequest}?` +
			`country=${requestCountry}&` +
			'apiKey=515e289985aa4ee8bfa95ea816773b14';
		break;
		case 'sources':
			console.log('Requested: sources');
			// 'Everything' possible Request parameters is: category, language, country
			url = `https://newsapi.org/v2/${typeOfRequest}?` +
			`country=${requestCountry}&` +
			'apiKey=515e289985aa4ee8bfa95ea816773b14';
		break;
		default:
			console.log('Error not a correct type of request');
		break;

	}
	let req = new Request(url);
	fetch(req)
	.then(function(response) {
		// Detta skall köras när & om man fick svar
		return response.json();
	})
	.then(whenDataRecieved);
} // makeRequest

function whenDataRecieved(data) {
	console.log('data: ', data);
	$('#articlesLeft').html('');
	for(let i=0; i < 3; i++) {
		let newsText = convertArticleToHtml(data.articles[i])
		//console.log(newsText);
		$('#articlesLeft').append(newsText);
	}
// function whenArticlesRight(data)
	$('#articlesRight').html('');
	for(let x=5; x < 10; x++) {
		let newsRight = convertArticleRightToHtml(data.articles[x])
		//console.log(newsText);
		$('#articlesRight').append(newsRight);

	}

}

	// 1. hämta datan vi vill göra något med
	// 2. formatera datan - producera en sträng som innehåller bland annat titeln
	// 3. skapa HTML-element med den formaterade strängen
	// 4. lägg in HTML-elementen på sidan (i <ul>-elementet)

function convertArticleToHtml(artRight) {
	//console.log('Artikel-objektet ser ut så här:', article);
	// for(i=0; i<4; i++) {
	return ` <article>
		<img class="" src="${artRight.urlToImage}">
		<h1 class="newsTitle">${artRight.title}</h1>
		<p class="">${artRight.description} </p>
		<div class="">${artRight.publishedAt}</div>
			</article>`
		}

function convertArticleRightToHtml(artLeft) {
	//console.log('Artikel-objektet ser ut så här:', article);
	// for(i=0; i<4; i++) {
	return `<div>
		<img class="" src="${artLeft.urlToImage}">
		<h2 class="">${artLeft.title}</h2>
			</div>`
		}
