/**
 * @desc 封装suggest组件
 * @author rgy19930329
 * @date 2017-12-27
 * @call 
 * $inputDom.suggest(callback);
 */

$ && (function() {

  // 生成随机字符串
  function randomString(len) {　　
    len = len || 32;　　
    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = $chars.length;　　
    var pwd = '';　　
    for (i = 0; i < len; i++) {　　　　
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));　　
    }　　
    return pwd;
  }

  // debounce 防反跳函数
  function debounce(fn, delay) {
    var timer = null;

    return function() {
      clearTimeout(timer);
      var _this = this,
        args = arguments;
      timer = setTimeout(function() {
        fn.apply(_this, args);
      }, delay);
    }
  }

  // jquery原型上扩展方法
  $.fn.ksuggest = function(opts) {
    var defaults = {
      hookClassName: '', // 自定义样式的类名钩子
      search: function(promises) { promises.resolve([]) }, // 自定义搜索函数
      callback: function() {} // 指定选择搜索项之后的回调方法
    }

    var cfg = $.extend({}, defaults, opts || {});

    var index = -1;

    // 计算尺寸及位置
    var $target = $(this);
    var w = $target.outerWidth();
    var h = $target.outerHeight();
    var x = $target.offset().top;
    var y = $target.offset().left;

    var fsize = $target.css('font-size');
    var id = 'su-' + randomString(5);
    var suggestArea =
      '<div class="suggest-area ' + cfg.hookClassName + '" id="' + id + '" style="position:absolute;">' +
      '<ul></ul>' +
      '</div>';
    $('body').append(suggestArea);
    var $su = $('#' + id);
    $su.css({
      width: w + 'px',
      top: (x + h) + 'px',
      left: y + 'px',
      lineHeight: h + 'px',
      fontSize: fsize
    });
    // 
    var $list = $su.find('ul');

    $list.on('click', 'a', function() {
      var key = $(this).text();
      $target.val(key);
      $list.html('');
      cfg.callback(key);
    });

    $target.on('keydown', function(event) {
      var len = $list.children().length;

      if (event.keyCode == 38 || event.keyCode == 40) {
        if (event.keyCode == 38) { // 向上
          index--;
        } else if (event.keyCode == 40) { // 向下
          index++;
        }

        if (index < 0) {
          index = len - 1;
        }

        if (index >= len) {
          index = 0;
        }

        $list.children('li').find('a').removeClass('active');
        var $targetInnter = $list.children('li').eq(index).find('a');
        var key = $targetInnter.text();
        $targetInnter.addClass('active');
        $target.val(key);
      }
    });

    $target.on('input', debounce(function(event) {
      var key = $(this).val();
      if (!key) {
        $list.html('');
        return;
      }

      var promises = $.Deferred();

      cfg.search(promises);

      $.when(promises).done(function(list) {
        var tpl = '';
        for (var i = 0; i < list.length; i++) {
          tpl += '<li><a href="javascript:;">' + list[i] + '</a></li>';
        }
        $list.html(tpl);
      }).fail(function(e) {
        console.log(e);
      });
    }, 100));
  }

})();
