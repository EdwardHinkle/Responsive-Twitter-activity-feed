require.config({
	 baseURL : 'js/app'
	,paths: { 
		 jquery: 'libs/jquery'
		,twitter: 'components/responsive_twitter'
	}
	,shim: {
		twitter: ['jquery']
	}
});

require(['jquery', 'twitter'], function($){
	
});
