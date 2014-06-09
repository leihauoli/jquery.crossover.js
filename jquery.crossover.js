/*!
 * jquery.qtouch.js v0.9 - jQuery custom event for through the responsive breakpoint.
 * Copyright (c) 2014 Lei Hau'oli Co.,Ltd. - https://github.com/leihauoli/jquery.crossover.js
 * License: MIT
 */
;(function ($) {
	// breakpoints: array.string | 'max??? or min???' | ? = int
	var Crossover = function (fn, breakpoints) {
		this.fn = fn;
		this.flgInit = false;
		this.breakpoints = breakpoints;
		this.breakpointsFormatted = [];
		this.breakpointLast = 'min1';
		this.breakpointLastFormatted = '1px 1px';
		this.$body = $('body');
		this.$head = $('head');
		this.$win = $(window);

		this.init();
	};
	Crossover.prototype = {
		init: function () {
			this.generateBreakpointsFormatted();
			this.generateMediaQueries();
			this.judgeCrossoverToRunFn();
			this.bindEvents();
		},
		bindEvents: function () {
			this.$win.on('resize orientationchange', $.proxy(this.judgeCrossoverToRunFn, this));
		},
		generateBreakpointsFormatted: function () {
			var _self = this;

			$.each(this.breakpoints, function () {
				var valueFormatted = '';

				if (/max/.test(this)) {
					valueFormatted = this.replace(/max/, '-');
				} else if (/min/.test(this)) {
					valueFormatted = this.replace(/min/, '');
				}

				valueFormatted += 'px 1px';

				_self.breakpointsFormatted.push(valueFormatted);
			});
		},
		generateMediaQueries: function () {
			var _self = this;

			this.generateMediaQuery();

			$.each(this.breakpoints, function (index) {
				var
					breakpoint = _self.breakpoints[index],
					breakpointFormatted = _self.breakpointsFormatted[index];

				_self.generateMediaQuery(breakpointFormatted, breakpoint);
			});
		},
		generateMediaQuery: function (breakpointFormatted, breakpoint) {
			var
				$style4Append = $('<style>'),
				css = '',
				maxOrMin = '',
				numberWidth = '';

			if (breakpointFormatted && breakpoint) {
				maxOrMin = /max/.test(breakpoint) ? 'max' : 'min';
				numberWidth = breakpoint.replace(/(max|min)/, '');
				css = '@media screen and (' + maxOrMin + '-width: ' + numberWidth + 'px) { body { background-position: ' + breakpointFormatted + '; } }';
			} else {
				// default
				css = 'body { background-position: 1px 1px; }';
			}

			$style4Append.text(css);
			this.$head.append($style4Append);
		},
		judgeCrossoverToRunFn: function () {
			var
				breakpointCurrentFormatted = this.$body.css('backgroundPosition'),
				breakpointCurrent = '';

			if (this.breakpointLastFormatted !== breakpointCurrentFormatted || !this.flgInit) {
				this.breakpointLastFormatted = breakpointCurrentFormatted;
				this.breakpointLast = this.breakpoints[$.inArray(this.breakpointLastFormatted, this.breakpointsFormatted)];
				this.fn(this.breakpointLast);

				this.flgInit = true;
			}
		}
	};
	// Only use $(window).
	$.fn.crossover = function (fn, breakpoints) {
		return this.each(function () {
			new Crossover(fn, breakpoints);
		});
	};
})(jQuery);
