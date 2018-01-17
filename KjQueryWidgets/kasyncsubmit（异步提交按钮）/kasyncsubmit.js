/*
 * @desc 异步提交按钮
 * @author rgy19930329
 * @date 2018-01-17
 **/

$ && (function($) {
  /**
   * @desc 设置异步按钮
   * @param [object] [jquery object]
   */
  var makeAsyncButton = function($node) {
    if (!$node.hasClass('icon-loading')) {
      $node.prop('disabled', true).append('<b class="icon-loading"></b>');
    }
  }

  /**
   * @desc 恢复异步按钮
   * @param [object] [jquery object]
   */
  var recoverAsyncButton = function($node) {
    $node.prop('disabled', false).find('.icon-loading').remove();
  }

  /**
   * @desc 校验数据类型
   * @param [rule] [object] [规则] | [opts] [object] [数据源] | [errorcb] [function] [错误时的回调方法]
   */
  var verifyType = function(rule, opts, errorcb) {
    var type = '';
    for (var key in rule) {
      if (opts[key] && (type = typeof opts[key]) !== rule[key]) {
        errorcb && errorcb(key, type, rule[key]);
        return false;
      }
    }
    return true;
  }

  $.fn.extend({
    /*async submit*/
    kasyncSubmit: function(opts) {
      var me = this;

      if (me[0].tagName.toLowerCase() !== 'button') {
        alert('异步提交按钮必须为button类型');
        return;
      }

      if (!me.attr('type')) {
        me.attr('type', 'button');
      }

      if (!opts.url) {
        alert('参数url不能为空');
        return;
      }

      // 校验数据类型
      var rule = {
        before: 'function',
        data: 'function',
        beforeSend: 'function',
        success: 'function',
        error: 'function',
        complete: 'function'
      }

      var vrs = verifyType(rule, opts, function(key, ctype, stype) {
        alert('参数 ' + key + ' 数据类型不正确，应为 ' + stype);
      });

      if (!vrs) {
        return;
      }

      // 初始化参数
      var defaults = {
        before: function(promises) { promises.resolve(); },
        url: '',
        type: 'get',
        dataType: 'json',
        jsonp: 'callback',
        data: function() { return {} },
        beforeSend: function() {},
        success: function() {},
        error: function() {},
        complete: function() {}
      }

      var cfg = $.extend({}, defaults, opts || {});

      // 添加事件
      me.on('click', function() {
        var $target = $(this);
        // ajax 参数构造
        var ajaxOpts = {
          crossDomain: true,
          url: cfg.url,
          type: cfg.type,
          data: cfg.data.call($target),
          dataType: cfg.dataType,
          beforeSend: function() {
            makeAsyncButton($target);
            cfg.beforeSend && cfg.beforeSend();
          },
          success: function(rs) {
            cfg.success && cfg.success(rs);
          },
          error: function(e) {
            cfg.error && cfg.error(e);
            !cfg.error && (function() {
              alert('网络不稳定，请稍后再试');
            })();
          },
          complete: function() {
            recoverAsyncButton($target);
            cfg.complete && cfg.complete();
          }
        }
        // jsonp hack
        if (opts.dataType === 'jsonp') {
          ajaxOpts = $.extend({}, ajaxOpts, { jsonp: cfg.jsonp });
        }

        // before 操作 -> 数据提交
        var promises = $.Deferred();

        cfg.before(promises);
        
        $.when(promises).done(function(rs) {
          console.log(rs);
          $.ajax(ajaxOpts);
        }).fail(function(e) {
          console.log(e);
        });
      });
    }
  });
})(jQuery);
