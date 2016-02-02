(function($){

    var initialized = false;
    var ignoreEvent = false;

    var initialURL = document.location.href;
    
    $.fn.putsch = function(options) {
        var settings = $.extend({
            type: null,
            container: null,
            loader: loader
        }, options );

        if (!initialized) {
            initialize(settings);
        }

        defaultHandler.configure(this, settings);

        return this;
    }

    initialize = function(settings) {

        $(window).on('popstate', function(event) {
            event.preventDefault();
            event.stopPropagation();
            popStateHandler(event, settings);
        });
        
        $(window).on('putsch:popstate', defaultHandler.popState);
        
        // we push current State, so it's reachable
        if (isHistoryAvalaible()) {
            var state = {
                source: 'putsch',
                type: 'default',
                container: settings.container,
                url: document.location.href
            }
            window.history.pushState(state, window.document.title, document.location.href);
        }
        initialized = true;
    }

    popStateHandler = function(event, settings) {
        var state = event.originalEvent.state;

        if (state && state.source == 'putsch') {
            var ev= $.Event('putsch:popstate', {state: state, settings: settings});
            $(window).trigger(ev);
        }
    }

    loader = function(url, container, settings) {
        $.ajax({
            url: url,
            cache: false,
            type: 'get',
            success: function (html) {
                $(container).html(html);
            },
        });
    }

    isHistoryAvalaible = function() {
        return window.history && window.history.pushState;
    }

    defaultHandler = {
        configure: function(elts, settings) {
            
            $(elts).on('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                defaultHandler.handleEvent(event, settings);
            });
        },

        handleEvent: function(event, settings) {
            if (ignoreEvent) {
                return;
            }

            var $link     = $(event.target);
            var url       = $link.attr('href');
            var container = $link.data('putsch-target') || settings.container;

            if (isHistoryAvalaible()) {
                var state = {
                    source: 'putsch',
                    type: 'default',
                    container: container,
                    url: url
                }
                window.history.pushState(state, window.document.title, url);
            }

            settings.loader(url, container, settings);
        },

        popState: function (event) {
            var state = event.state;
            var settings = event.settings;

            if (!state || state.source !== 'putsch' || state.type !== 'default') {
                return;
            }

            settings.loader(state.url, state.container, settings);
        }
    }

})(jQuery);
