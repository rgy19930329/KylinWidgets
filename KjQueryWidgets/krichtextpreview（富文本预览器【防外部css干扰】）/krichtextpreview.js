/*
* @desc 富文本浏览器，防止外部css干扰
* @author rgy19930329
* @date 2018-01-09
**/

$ && (function($) {
  $.fn.extend({
    /*rich text preview*/
    krtpv: function(rt) {
      var $target = $(this);
      var rt = rt || $target.data('content') || '';
      console.log(rt);
      var $iframe = $('<iframe frameborder="0" style="display:block;width:100%;"></iframe>');
      $iframe.on('load', function() {
        var conts = $iframe.contents(),
          iframeWin = $iframe.prop('contentWindow'),
          $head = conts.find('head'),
          $body = conts.find('body'),
          style = $(['<style>', '*{margin: 0; padding: 0;}', 'body{padding: 10px; line-height: 20px; overflow-x: hidden; word-wrap: break-word; font: 14px Helvetica Neue,Helvetica,PingFang SC,Microsoft YaHei,Tahoma,Arial,sans-serif; -webkit-box-sizing: border-box !important; -moz-box-sizing: border-box !important; box-sizing: border-box !important;}', 'a{color:#01AAED; text-decoration:none;}a:hover{color:#c00}', 'p{margin-bottom: 10px;}', 'img{display: inline-block; border: none; vertical-align: middle;}', 'pre{margin: 10px 0; padding: 10px; line-height: 20px; border: 1px solid #ddd; border-left-width: 6px; background-color: #F2F2F2; color: #333; font-family: Courier New; font-size: 12px;}', '</style>'].join(''));
        $head.append(style);
        $body.html(rt);
        var $lastElem = $body.children().last();
        var height = $lastElem.offset().top + $lastElem.height() + 20;
        $iframe.css({ 'height': height + 'px' });
      });

      $target.html($iframe);
    }
  });
})(jQuery);