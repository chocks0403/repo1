function loadIFrame(url, iframeId) {
	var $mainFrame = $('iframe#' + iframeId),
		$iframeWrapper = $('#main_body_iframe');

	$('ul#nav li.AddBGTraiangle').removeClass('AddBGTraiangle');

	if ($mainFrame.hasClass('c10ReportFrame')) {
		$mainFrame
			.removeClass('c10ReportFrame');
			// .animate({
			// 	width: $mainFrame.data('oldWidth'),
			// 	marginLeft: '0px'
			// }, $mainFrame.data('animatespeed'));

		// $iframeWrapper.animate({paddingTop: 30}, $mainFrame.data('animatespeed'));
	}
	if (iframeId === '_blank') {
		window.open(url);
	}
	else {
		document.getElementById(iframeId).src = url;
	}
}

$(document).ready(function () {
	var intervalId,
		bodyOffsetHeightPrev = -1,
		bodyOffsetWidthPrev = -1,
		menuLeftMargin = $('#brandLogo').offset().left + 10 ;

	/*
		Since the div#navDiv is absolutely positioned, this seems to be
		the way to give the left margin , relative to the grey bar menu.
		Home should come just beneath the 'N' of TriNet
	*/ 

	$('ul#nav').css('margin-left',  menuLeftMargin+'px') ;

	$("ul#nav li").hover(function(){
		$(this).addClass('AddBGTraiangle');
	}, 
	function(){
		$(this).removeClass('AddBGTraiangle');
	});

	function calculate_iframe_width(bodyElement) {
		var bodyWidth = -1;
		if (bodyElement !== undefined && bodyElement !== null) {
			bodyWidth = bodyElement.offsetWidth;
			if (bodyWidth === undefined || (bodyElement.scrollWidth && bodyElement.scrollWidth > bodyWidth)) {
				bodyWidth = bodyElement.scrollWidth;
			}
			if (bodyWidth === undefined || (bodyElement.clientWidth && bodyElement.clientWidth > bodyWidth)) {
				bodyWidth = bodyElement.clientWidth;
			}
		}

		if (bodyElement && bodyElement.offsetWidth && bodyElement.offsetWidth !== bodyOffsetWidthPrev) {
			bodyOffsetWidthPrev = bodyElement.offsetWidth;
			bodyWidth = bodyElement.offsetWidth;
		}
		return bodyWidth;
	}

	function calculate_iframe_height(bodyElement) {
		var bodyHeight = -1;
		if (bodyElement !== undefined && bodyElement !== null) {
			bodyHeight = bodyElement.offsetHeight;
			if (bodyHeight === undefined || (bodyElement.scrollHeight && bodyElement.scrollHeight > bodyHeight)) {
				bodyHeight = bodyElement.scrollHeight;
			}
			if (bodyHeight === undefined || (bodyElement.clientHeight && bodyElement.clientHeight > bodyHeight)) {
				bodyHeight = bodyElement.clientHeight;
			}
		}

		if (bodyElement && bodyElement.offsetHeight && bodyElement.offsetHeight !== bodyOffsetHeightPrev) {
			bodyOffsetHeightPrev = bodyElement.offsetHeight;
			bodyHeight = bodyElement.offsetHeight;
		}

		return bodyHeight;
	}

	/**
	 * takes a DOM element and checks for any app specific elements that
	 * have a matching class.
	 * @param  {[type]} element [description]
	 * @return {[type]}         [description]
	 */
	function getAppSpecificFrameSize(element) {
		var appdimensions = { 
								'execdashboard' : { height : 1200, width: 1293 },
								'execdashboard-disabled' : { height : 570, width: 990 },
								'c10ReportFrame' : { height : 1200, width: 1293 },
								'c10ReportApp' : { height : 1200, width: 1293 },
								'otherapp' : { height: 650, width: 1024 }
							},
			$sizeEl = $(element);

		for (app in appdimensions) {
			// check the main iframe for a particular class....
			// as well as the iframe contents
			if (($sizeEl.hasClass(app)) || $sizeEl.find('.' + app).length > 0) {
				return appdimensions[app];
			};
		}
	}

	/**
	 * Takes the iframe and tries to establish the height and width for the
	 * contents
	 * @param  {[type]} iframe [description]
	 * @return {[type]}        [description]
	 */
	function getDefaultFrameSize(iframe) {
		var additionalHeightPx = 25, // FireFox clips the bottom without this
			// iframe body element.
			bodyElement = iframe.contents().find('body')[0],
			heightForIframe = calculate_iframe_height(bodyElement),
			// we are only using 984 as defaut right now.
			widthForIframe = 984;//calculate_iframe_width(bodyElement);

		if (heightForIframe >= 0) {
			//  Testing this range avoids the changing-height issues
			if ( (iframe.height()) < (heightForIframe) || (iframe.height()) > (heightForIframe + additionalHeightPx) ) {
				heightForIframe = Math.max(400, heightForIframe + additionalHeightPx);
			}
		}

		return {
			height : heightForIframe,
			width  : widthForIframe
		}
	}

	/**
	 * Method to set the frame height and width
	 * @param {object} frameSize - has a height and width property both of which are numbers
	 */
	function setFrameSize(frameSize) {
		var $frame = $('#frame');
		if (($frame.height() != frameSize.height) ||
						($frame.width() != frameSize.width)) {
			// then resize it.
			$frame
				.animate({
					height: frameSize.height,
					width: frameSize.width

				});
			// Need to set the BODY iFrame back to 100% since some portal apps manipulate it
			$('#BODY').css('height', '100%');
			$('#BODY').css('width', '100%');

			setNavDivWidth(frameSize.width);

		}
	}
	

	/*
	    With the main menu bar extending through the screen width , 
	    this seems to be the right spot to dynamically determine 
	    the frame width , to extend the div#navDiv accordingly.
	 */
	function setNavDivWidth(frameWidth){
		var newWidth = frameWidth + parseInt($('#frame').css('padding-left')) +
							parseInt($('#frame').css('padding-right')) + 
							parseInt($('body').css('padding-left')) +
							parseInt($('body').css('padding-right')) ;



		if(newWidth > $('#navDiv').width()){
			$('#navDiv').css('min-width' , newWidth+'px');
		}else{
			$('#navDiv').css('min-width', '760px');
		}
	}

	function handleXDomainFrame(iframe, frameDoc){
		iframe.height(iframe.attr('height'));
		iframe.css({overflow:"auto"});
	}

	/**
	 * gdodd Safer method for getting the framedocument
	 * @return {[type]} [description]
	 */
	function getFrameDoc() {
		var body,
			contentDoc,
			contentWindow,
			contentWindowDoc,
			frameDoc;
		try {
			body = document.getElementById('BODY');
			if (body) {
				contentDoc = body.contentDocument;
				contentWindow = body.contentWindow;
				if (contentWindow) {
					contentWindowDoc = contentWindow.document;
				}
				frameDoc = contentDoc || contentWindowDoc;
			}

		} catch (e) {
			return undefined;
		}
		return frameDoc;
	}

	$('body').addClass('jsenabled');
	// resize iframe
	$('#BODY')
		.load(function() {
			var iframe = $(this),
				$frame = $('#frame'),
				parentLocation = document.location,
				lastAppSpecificHeight = 0,
				frameSize = null,
				frameDoc = null;

			//  Set the height outside the I-frame to accomodate the content inside the I-frame.
			if (!intervalId) {
				intervalId = setInterval(function () {
					try{
						// first check the actual iframe for a class
						frameSize = getAppSpecificFrameSize(iframe);
						if (!frameSize) {
							// check in the iframe contents
							frameDoc = getFrameDoc();
							if (typeof frameDoc === "undefined") {
								// We're assuming that since we can't grab the base-level document object from the iframe, that we've got a cross-domain iframe, since Chrome has an outstanding bug for try-catches on SECURITY_ERR:
								// https://code.google.com/p/chromium/issues/detail?can=2&start=0&num=100&q=&colspec=ID%20Pri%20M%20Iteration%20ReleaseBlock%20Cr%20Status%20Owner%20Summary%20Modified&groupby=&sort=&id=17325
								// ~mmarcus
								handleXDomainFrame(iframe, frameDoc);
							} else {
								if (frameDoc) {
									// Here we check inside the iframe for a specific sizing class
									frameSize = getAppSpecificFrameSize(frameDoc);
								}
								if (!frameSize) {
									// otherwise get the default frame size.
									frameSize = getDefaultFrameSize(iframe);
								}
							}

						}
						// set the framesize (only if its different)
						setFrameSize(frameSize);

					} catch (e) {
						if (e.message.indexOf('Permission denied') !== -1){
							handleXDomainFrame(iframe, frameDoc);
						}
					}
				}, 1000);
			}
		});



	// DesignMap main navigation fixups
	var $nav = $('#nav');
	// Only make the last two menu items open to the left if we need the room. ~mmarcus
	var $navContainers = $nav.find('div.container'),
		$frame = $('#frame'),
		contentThreshold = $frame.offset().left - $(window).scrollLeft() + $frame.width();

	// // Not sure why they're doing this since they have a css selector in main_$nav.css to force the last item to open to the left regardless  ~mmarcus
	// $nav.children(':last-child').addClass('right');

	$('.container', $nav).each(function() {
		var el = $(this);
		var cw = 0;
		el
			.children('.col')
			.each(function() {
				cw += $(this).outerWidth();
			})
			.end()
			.width(cw)
			.addClass('col_'+el.children('.col').length);
	});

	$navContainers.each(function(){
		var elWidth = Number($(this).css('width').replace('px', '')),
			parentLeft = Number(Math.ceil($(this).parent().offset().left));
		if( (parentLeft + elWidth) > contentThreshold){
			console.log('Forcing the following to open to the left: ');
			console.log($(this).parent());
			$(this).addClass('left');
		}
	});


	$(".c10_report_link").click(function(e){
		e.preventDefault();
		var $mainIframe = $('iframe#BODY');
		$mainIframe.addClass('c10ReportFrame');
	});

	/**
	 * Handle setting the current menu section to be highlighted.
	 */
	$('#nav li a.submenu_item').each(function () {
			$(this).click(function (event) {
				$('#menuhome').removeClass('current');
				$('#navDiv>#nav>li.current').removeClass('current');
				$(this).closest('#nav>li').addClass('current');
			});
	});

	$('#menuhome').click(function (e) {
		// Remove the current class from the current menu item
		$('#navDiv>#nav>li.current').removeClass('current');
		$(this).addClass('current');
	});


});