/*
 * @desc 表达验证工具
 * @author rgy19930329
 * @date 2018-01-09
 **/

$ && (function($) {
  $.fn.extend({
    /*validate*/
    kvalidate: function(validates, errorcb) {
      var $target = $(this);
      // 表单序列化
      var serializeForm = function($form) {
        var list = $form.serializeArray();
        var data = {};
        $.each(list, function() {
          data[this.name] = this.value;
        });
        return data;
      }

      var validate = function($form, validates, errorcb) {
        var data = serializeForm($form);

        for (var key in data) {
          for (var key2 in validates) {
            if (key == key2) {
              if (validates[key2]['required'] === true && !data[key]) {
                $form.find('[name=' + key + ']').focus();
                errorcb && errorcb(validates[key2]['explainMsg']);
                return false;
              } else {
                if (validates[key2]['rule'] && validates[key2]['rule'](data[key], validates[key2])) {
                  if (!!validates[key2].tips) {
                    validates[key2].tips(validates[key2]['explainMsg'], key);
                  } else {
                    $form.find('[name=' + key + ']').focus();
                    errorcb && errorcb(validates[key2]['explainMsg']);
                  }
                  return false;
                }
              }
            }
          }
        }
        return true;
      }

      return validate($target, validates, errorcb);
    }
  });
})(jQuery);
