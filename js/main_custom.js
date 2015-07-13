(function(){
	// specify Moment.jS time format
	moment.locale('en');

	var listId = '#rss_list';
/**
 * [Model]
 */
	function Model (charLimit) {
		this.charLimit = charLimit;
	}

/**
 * [Controller]
 */
	function Controller () {}

	Controller.prototype = {

		parseRSS: function (url, id) {
			$.ajax({
				url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(url),
				dataType: 'json',
				success: function(data) {
					console.log(data.responseData.feed);
					view.renderListOfMessages(id, data);
					$('#inputRSS').val('');
				}
			}); 
		},

		storeRSS: function () {
			localStorage.setItem($("#inputRSS").val(), $("#inputRSS").val());
			$('#inputRSS').val('');

		},

		getRSS: function () {
			localStorage.getItem($("#inputRSS").val() ,$("#inputRSS").val());
		},

		removeRSS: function () {
			localStorage.removeItem($("#inputRSS").val() ,$("#inputRSS").val());
			$('#inputRSS').val('');
		}
	};

/**
 * [View]
 */
	function View () {}

	View.prototype = {
		capitaliseFirstLetter: function (string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		},

		renderListOfChannels: function (id) {
			for ( var i = 0, len = localStorage.length; i < len; ++i ) {
				console.log( localStorage.getItem( localStorage.key( i ) ) );
				var title = '<a class="list-group-item" href="#" id="' + localStorage.getItem( localStorage.key( i ) ) + '">' + localStorage.getItem( localStorage.key( i ) ) + '</a>';
				$(id).append(title);

			}
		},

		renderListOfMessages: function (id, data) {
			//add title
			$(id).html('<h2>' + this.capitaliseFirstLetter(data.responseData.feed.title)+'</h2>');

			$.each(data.responseData.feed.entries, function(key, value){
				var date =  new Date (value.publishedDate);
				var message = '<a class="list-group-item" href="#"> <h4 class="list-group-item-heading" >' + value.title +'<br> <small>' + moment(date).format("LLLL") + '</small> </h4>' + '<p class="list-group-item-text">' + value.content.substr(0, model.charLimit) + '...</p>';
			$(id).append(message);
			});
		}
		
	};

	var model = new Model(30), controller = new Controller(), view = new View();

	$(view.renderListOfChannels(listId));

	$('#addRSSElement').on("click", function(){
		controller.storeRSS();
		$(listId + ' a').remove();
		view.renderListOfChannels(listId);
	});

	$('#removeRSSElement').on("click", function(){
		controller.removeRSS();
		$(listId + ' a').remove();
		view.renderListOfChannels(listId);
	});

	$(listId).children().closest('a').on("click", function(){controller.parseRSS(this.id, '#rss_news')});

})();