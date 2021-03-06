/************************************
 *
 * jQuery Popovers by Gary Hepting
 *
************************************/

(function($) {
  return $.fn.popover = function(options) {
    var closePopover, defaults, delayAdjust, delayHide, getElementPosition, popover, resetPopover, setPosition, showPopover, trigger;
    defaults = {
      hover: false,
      click: true,
      resize: true,
      scroll: true,
      topOffset: 0,
      delay: 500,
      speed: 100
    };
    options = $.extend(defaults, options);
    popover = $('#popover');
    delayHide = '';
    delayAdjust = '';
    trigger = '';
    getElementPosition = function(el) {
      var bottom, left, offset, right, top, win;
      offset = el.offset();
      win = $(window);
      return {
        top: top = offset.top - win.scrollTop(),
        left: left = offset.left - win.scrollLeft(),
        bottom: bottom = win.height() - top - el.outerHeight(),
        right: right = win.width() - left - el.outerWidth()
      };
    };
    resetPopover = function(resize) {
      popover.css({
        top: 'auto',
        right: 'auto',
        bottom: 'auto',
        left: 'auto'
      });
      if (resize) {
        popover.css({
          width: 'auto'
        });
      }
      popover.removeClass('top');
      popover.removeClass('right');
      popover.removeClass('bottom');
      return popover.removeClass('left');
    };
    setPosition = function(trigger, skipAnimation, resize) {
      var attrs, coords, height, width;
      if (trigger) {
        if (resize) {
          resetPopover(true);
        } else {
          resetPopover();
        }
        coords = getElementPosition(trigger);
        if (popover.outerWidth() > ($(window).width() - 20)) {
          popover.css('width', $(window).width() - 20);
        }
        popover.css('max-width', Math.min($(window).width() - parseInt($('body').css('padding-left')) - parseInt($('body').css('padding-right')), parseInt(popover.css('max-width'))));
        width = popover.outerWidth();
        height = popover.outerHeight();
        attrs = {};
        if (coords.left <= coords.right) {
          popover.addClass('left');
          attrs.left = coords.left;
        } else {
          popover.addClass('right');
          attrs.right = coords.right;
        }
        if ((coords.top - options.topOffset) > (height + 20)) {
          popover.addClass('top');
          attrs.top = trigger.offset().top - height - 20;
        } else {
          popover.addClass('bottom');
          attrs.top = trigger.offset().top + 15;
        }
        popover.css(attrs);
        if (skipAnimation) {
          return popover.css({
            top: '+=10'
          });
        }
      }
    };
    closePopover = function() {
      $('.popover-trigger').removeClass('popover-trigger');
      return popover.removeClass('sticky').remove();
    };
    showPopover = function(e) {
      var tip;
      trigger = $(e.target);
      if (!trigger.hasClass('popover-trigger')) {
        closePopover();
        trigger.addClass('popover-trigger');
      }
      tip = $('#' + trigger.attr('data-content')).html();
      popover = $("<div id=\"popover\"></div>");
      if (!tip || tip === "") {
        return false;
      }
      trigger.removeAttr("title");
      popover.css("opacity", 0).html(tip).appendTo("body");
      setPosition(trigger);
      popover.animate({
        top: "+=10",
        opacity: 1
      }, options.speed);
      popover.bind("click", function(e) {
        if (e.target.tagName !== 'a') {
          popover.addClass('sticky');
          e.stopPropagation();
          e.preventDefault();
          return false;
        }
      });
      popover.find('.close').bind("click", function(e) {
        $('.popover-trigger').removeClass('popover-trigger');
        popover.removeClass('sticky').remove();
        e.stopPropagation();
        e.preventDefault();
        return false;
      });
      return popover.bind({
        mouseenter: function() {
          return clearTimeout(delayHide);
        },
        mouseleave: function() {
          if (!popover.hasClass('sticky')) {
            return delayHide = setTimeout((function() {
              $('.popover-trigger').removeClass('popover-trigger');
              return popover.removeClass('sticky').remove();
            }), 500);
          }
        }
      });
    };
    return this.each(function() {
      var $this;
      $this = $(this);
      if (options.hover) {
        $this.bind({
          mouseenter: function(e) {
            trigger = $(e.target);
            clearTimeout(delayHide);
            if (!$this.hasClass('popover-trigger') && !popover.hasClass('sticky')) {
              return showPopover(e);
            }
          },
          mouseleave: function() {
            if (!popover.hasClass('sticky')) {
              return delayHide = setTimeout(function() {
                return closePopover();
              }, options.delay);
            }
          }
        });
      }
      if (options.click) {
        $this.bind("click", function(e) {
          trigger = $(e.target);
          if (!trigger.hasClass('popover-trigger')) {
            closePopover();
            showPopover(e);
          }
          popover.addClass('sticky');
          e.preventDefault();
          e.stopPropagation();
          return false;
        });
      }
      if (options.resize) {
        $(window).resize(function() {
          clearTimeout(delayAdjust);
          return delayAdjust = setTimeout(function() {
            return setPosition(trigger, true, true);
          }, 100);
        });
      }
      if (options.scroll) {
        $(window).scroll(function() {
          return setPosition(trigger, true);
        });
      }
      return $('html, body').bind("click", function(e) {
        $('.popover-trigger').removeClass('popover-trigger');
        return popover.removeClass('sticky').remove();
      });
    });
  };
})(jQuery);
