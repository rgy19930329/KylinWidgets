/*
 * @desc 倒计时组件
 * @author rgy19930329
 * @date 2018-01-09
 **/

$ && (function($) {
  $.fn.extend({
    /*count down timer*/
    kcdtimer: function(opts) {
      var $trigger = $(this);

      var total = opts.total || 60;
      var display = opts.display || '重发验证码';
      var displayTemplate = opts.displayTemplate || '{second}s';
      var defaultTemplate = opts.defaultTemplate || '发送验证码';
      var disabledClassName = opts.disabledClassName || 'verif-code-disabled';
      var before = opts.before || function() {};

      $trigger.html(defaultTemplate);

      $trigger.on('click', function() {
        before && before(function() {
          var second = parseInt(total);
          $trigger.html(displayTemplate.replace(/\{second\}/g, second--)).addClass(disabledClassName).prop('disabled', true);
          var timer = setInterval(function() {
            $trigger.html(displayTemplate.replace(/\{second\}/g, second--));
            if (second == 0) {
              $trigger.html(display).removeClass(disabledClassName).prop('disabled', false);

              clearInterval(timer);
              timer = null;
            }
          }, 1000);
        }, function() {
          // console.log('fail');
        });
      });
    }
  });
})(jQuery);
