(function ($) {
		
		/* Options plugin
		 * - tab(string): Reference to container
		 *  - content(string) : Container of content tabs
		 *  - activeTab(string/number):Reference to tab active on init
		 *  - effect:Effects on tab
		 *  - onEvent:Event to tab
		*/
		
		var//Errors
		errors = {
		}, 
		
		//Defaults
		defaults = {
			'tab' 		: '#tabs', 
			'content' 	: '#tab-content', 
			'activeTab' : '0', 
			'effect' 	: false, 
			'onEvent' 	: 'click'
		}, 
		
		attributes = {
			'contentTab' 		: '', 
			'activeTab' 		: '', 
			'prevActiveTab' 	: '', 
			'activeItemTab' 	: '', 
			'activeTabIndex' 	: 0, 
			'contentFragment' 	: '', 
			'eventHandler' 		: '', 
			'targetTab' 		: '', 
			'tabElement' 		: '', 
			'nextTab'			: '', 
			'prevTab'			: ''
		}, 
		
		//Actions plugin:
		action = {
			
			init : function (options) {
				//Settings
				settings = helpers.makeSettings($.extend(defaults, options));
				
				return this.each(function () {
						methods.tabContent.apply(this);
					});
			}
		}, 
		
		//Methods plugin
		methods = {
			
			startTab : function (e) {
				
				if (typeof e !== 'undefined') {
					$this = $(this);
					e.preventDefault();
					attributes.targetTab = $this.attr('href').substr(1);
					attributes.tabElement = $this;
				}
				methods.activeTab();
				methods.eventHandler(methods.startTab);
			}, 
			
			/* tabContent
			 * Params:
			 *  - No Params
			*/
			tabContent : function () {
				if (!errors.content && !errors.tab && !errors.activeTab) {
					var contentFragment = document.createDocumentFragment(), 
					content = settings.content;
					
					$(content[0]).children().each(function () {
							contentFragment.appendChild(this);
						});
					attributes.contentTab = $(contentFragment.childNodes);
					methods.startTab.apply(this);
				}
			}, 
			
			activeTab : function () {
				if (!errors.activeTab && !errors.content) {
					var content = settings.content;
					
					if (!attributes.activeTab) {
						attributes.targetTab = settings.activeTab.attr('id');
					}
					
					for (var i = 0; i < attributes.contentTab.length; i++) {
						if (attributes.contentTab[i].id === attributes.targetTab) {
							attributes.activeTabIndex = i;
							if (!attributes.activeTab) {
								attributes.activeTab = settings.activeTab;
							} else {
								attributes.activeTab = attributes.contentTab[i];
							}
							content.html(attributes.activeTab);
							break;
						}
					}
					
					activeTab = function (tabLink) {
						var tabLink = tabLink, 
						tabItem = tabLink.parent(), 
						prevActiveTab;
						
						if (attributes.prevActiveTab) {
							attributes.prevActiveTab.removeClass('active-tab');
						}
						tabItem.addClass('active-tab');
						attributes.prevActiveTab = tabItem;
					};
					
					if (!attributes.tabElement) {
						settings.tab.find('a').each(function () {
								var $this = $(this);
								if ($this.attr('href').substr(1) === attributes.targetTab) {
									activeTab($this);
								}
							});
						
					} else {
						activeTab(attributes.tabElement);
					}
				}
			}, 
			
			getActiveTab : function () {
				return((!attributes.activeTab) ? settings.activeTab : attributes.activeTab);
			}, 
			
			getActiveTabIndex : function () {
				return attributes.activeTabIndex;
			}, 
			
			getPrevActiveTab : function () {
				return attributes.prevActiveTab;
			}, 
			
			eventHandler : function (fn, params) {
				var linkTab = settings.tab.find('a'), 
				onEvent = settings.onEvent;
				
				if (typeof params === 'undefined') {
					params = {
					};
				}
				
				if (onEvent.indexOf(' ') > 0) {
					onEvent = onEvent.split(' ');
					for (var i = 0; i < onEvent.length; i++) {
						linkTab.unbind(onEvent[i]).bind(onEvent[i], params, fn);
					}
				} else {
					linkTab.unbind(onEvent).bind(onEvent, params, fn);
				}
			}
		}, 
		
		//Helpers of plugins
		helpers = {
			
			/*makeSettings - Make settings of plugin, attr object elements, log errors and other configs.
			 * Params:
			 *  - settings:Reference to plugin settings
			*/
			makeSettings : function (settings) {
				var msgError = '', 
				paramMsg, 
				elem;
				
				try {
					for (param in settings) {
						if ((typeof settings[param] === 'string' || typeof settings[param] === 'number') && param !== 'onEvent') {
							
							elem = $(settings[param]);
							if (param === 'activeTab') {
								if (typeof settings.content === 'object') {
									if (!isNaN(settings[param])) {
										elem = $(settings.content.children().get(parseInt(settings[param])));
									}
								}
								
							}
							
							if (typeof elem === 'undefined' || elem.length === 0) {
								paramMsg = ((!isNaN(settings[param])) 
									 ? 'Element with index '
									 : 'Element with '
									 + 
									(((settings[param]).indexOf('.') === 0) 
										 ? 'class '
										 : (((settings[param]).indexOf('#') === 0) 
											 ? 'id '
											 : 'reference ')));
								msgError += paramMsg + settings[param] + ' not found \n';
								errors[param] = true;
							} else {
								settings[param] = elem;
							}
						}
					}
					
					if (msgError.length > 0) {
						throw msgError;
					}
					
				} catch (e) {
					this.debugMessage(e, 'warn');
				}
				return settings;
			}, 
			
			/*debugMessage - Log errors and warnings
			 * Params:
			 *  - message:Message to log
			 *  - type(optional):Type of log( warn, error, alert, blank(throw error) )
			*/
			debugMessage : function (message, type) {
				var title = 'jquery.tabs: \n\n';
				message = title + message;
				
				if (type === 'alert') {
					alert(message);
				} else if (window.console && window.console[type]) {
					console[type](message);
				} else {
					$.error(message);
				}
			}
			
		};
		
		$.fn.tabs = function (method) {
			if (action[method]) {
				return action[method].apply(this, Array.prototype.slice.call(arguments, 1));
				
			} else if (typeof method === 'object' || !method) {
				return action.init.apply(this, arguments);
				
			} else {
				helpers.debugMessage('Method ' + method + ' does not exist');
			}
		};
		
	})(jQuery);
 