/* Light-weight, responsive Twitter activity widget that gets configured via JSON. 
 * This module is dependent on require.js & jQuery and gets appended to '#twitter_container'.
 */

define(['jquery'], function($){
	
	var 	 tweets = {}
		,jsonURL = 
		,request_data = {
			 screen_name: 'twitter screen name' //change this to whatever screen name you are looking to request
			,include_rts: 'true'
			,count: '5'
		}
	
	$.ajax({
  		url: 'https://api.twitter.com/1/statuses/user_timeline.json',
  		dataType: 'jsonp',
  		data: request_data,
  		success: twitterCallback
	});
	
	//populate pertinent twitter data to local object
	function twitterCallback(event){
		
		$.each(event, function(index) {

			tweets[index] = {
				 retweeted_status: checkRetweetedStatus(event[index].retweeted_status)
				,name: getName(event[index])
				,screen_name: getScreenName(event[index])
				,profile_image_url: getProfileImageURL(event[index])
				,created_at: updateCreateTimeFormat(event[index].created_at)
				,text: event[index].text
				,tweet_id: event[index].id
			} 
		});
		
		populateFeed();
	}
	
	//if the current tweet is a retweet, then the profile information of the original tweeter should be displayed
	function checkRetweetedStatus(status) {
		if(status){
			return true;
		}
		else{
			return false;
		}	
	}
	
	function getName(tweetObject) {
		if(tweetObject.retweeted_status){
			return tweetObject.retweeted_status.user.name;
		}
		else{
			return tweetObject.user.name;
		}
	}
	
	function getScreenName(tweetObject){
		if(tweetObject.retweeted_status){
			return tweetObject.retweeted_status.user.screen_name;
		}
		else{
			return tweetObject.user.screen_name;
		}
	}
	
	function getProfileImageURL(tweetObject){
		if(tweetObject.retweeted_status){
			return tweetObject.retweeted_status.user.profile_image_url;
		}	
		else{
			return tweetObject.user.profile_image_url;
		}
	}
	
	function populateFeed(){
		$.each(tweets, function(index){
			$('#twitter_container').append(
				'<div>' + 
					'<img src="' + tweets[index].profile_image_url + '"/>' + 
					'<h4>' + tweets[index].name + ' <a class="screen_name" href="http://twitter.com/' + tweets[index].screen_name + '"> @' + tweets[index].screen_name + '</a></h4>' + 
					'<p >' + tweets[index].created_at + '</p>' +
					'<p>' + convertLinks(tweets[index].text) + '</p>' + 
				'</div>'
			);
		});
	}
	
	//scans for http urls and converts the text to links
	function convertLinks(tweetText){
		
		var httpIndex = tweetText.indexOf("http://");
		var httpsIndex = tweetText.indexOf("https://");
		
		if(httpsIndex > httpIndex){
			httpIndex = httpsIndex;
		}
		
		if(httpIndex > 0 || httpsIndex > 0){
			var preURL = tweetText.substr(0, httpIndex),
				urlToEnd= tweetText.substr(httpIndex),
				endOfURLIndex = function(){
					if(urlToEnd.indexOf(" ") > 0)
						return urlToEnd.indexOf(" ");
					else
						return urlToEnd.length;
				},
				httpURL = urlToEnd.substr(0, endOfURLIndex()),
				postURL = httpURL.substr(endOfURLIndex()),
				convertToLink = '<a href="' + httpURL + '" >' + httpURL + '</a>';
			
			tweetText = preURL + convertToLink + postURL;
		}

		return convertTwitterIDs(tweetText);
	}
	
	//scans for @twitterIDs and converts the text to links
	function convertTwitterIDs(tweetText){
		
		var idArray = tweetText.split('@');
		var convertedText = '';
		
		$.each(idArray, function(index){
			
			if(index > 0){
				var spaceIndex = idArray[index].indexOf(' ');
				if(spaceIndex < 0)
					spaceIndex = idArray[index].length;
				
				var userID = idArray[index].substr(0, spaceIndex);
				var userToLink = '<a href="https://twitter.com/' + userID + '">@' + userID + '</a>';
				idArray[index] = idArray[index].slice(spaceIndex, idArray[index].length)
				idArray[index] = userToLink.concat(idArray[index] + ' ')
			}

			convertedText = convertedText.concat(idArray[index]);
		})
		
		return convertHashTags(convertedText);
	}
	
	//scans for @twitterIDs and converts the text to links
	function convertHashTags(tweetText){
		
		var hashArray = tweetText.split('#');
		var convertedText = '';
		
		$.each(hashArray, function(index){
			
			if(index > 0){
				var spaceIndex = hashArray[index].indexOf(' ');
				if(spaceIndex < 0)
					spaceIndex = hashArray[index].length;
				
				var hashID = hashArray[index].substr(0, spaceIndex);
				var hashToLink = '<a href="https://twitter.com/search?q=%23' + hashID + '&src=hash">#' + hashID + '</a>';
				hashArray[index] = hashArray[index].slice(spaceIndex, hashArray[index].length)
				hashArray[index] = hashToLink.concat(hashArray[index] + ' ')
			}

			convertedText = convertedText.concat(hashArray[index]);
		})
		
		return convertedText;
	}
	
	function updateCreateTimeFormat(createTime){
		var timeArray = createTime.split(' ');
		var newFormat = timeArray[1] + ' ' + timeArray[2] + ' ' + timeArray[5];
		
		return newFormat;	
	}
	
});
