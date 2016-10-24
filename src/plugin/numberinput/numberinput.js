define(function(require, exports, module){
    // var jQuery = require('jquery');

    /**
     * 数字输入框插件
     * 对type为text的input表单进行数字三位一逗指定小数位数显示进行格式化
     * 前置一个原输入框的备份作为展示输入框，并将展示输入框的id和name置空，且将原输入框隐藏处理
     * 三个特点：
     * 1、展示输入框只能输入数字（1-9、负号和小数点）
     * 2、当展示输入框获取焦点时，将展示真实值
     * 3、当展示输入框失去焦点时，将展示三位一逗保留指定小数位数
     */
    (function($){

        /**
         * 数字输入框组件对象
         * @param el
         * @param options
         * @constructor
         */
        var NumberInput = function(el, options){
            this.el = el;
            this.options = options;
            this.parseDataFormat(this.options.format);

            var $el = $(el);
            var className = this.el.className;
            var style = this.el.getAttribute('style');
            var value = this.el.value;
            var readonly = typeof($el.attr('readonly')) != 'undefined' ?true:false ;
            var disabled = typeof($el.attr('disabled')) != 'undefined' ?true:false ;

            var displayInput = $('<input />').insertBefore($el.hide());
            $el.data('show-element', displayInput);
            this.displayInput = displayInput[0];
            this.displayInput.className = className;
            if(style){
                this.displayInput.setAttribute('style', style);
            }
            if(readonly){
                this.displayInput.setAttribute('readonly', readonly);
            }
            if(disabled){
                this.displayInput.setAttribute('disabled', disabled);
            }

            var that = this;
            displayInput.focus(function(){
                //var pos = that.getSelectPoint();
                if(that._disabled || that._readonly){
                    return ;
                }
                displayInput.val(that.getValue(that.el));
                //that.setSelectPoint(pos);
            }).blur(function(){
                that.setValue(that.displayInput.value);
            }).change(function(){
                that.setValue(that.displayInput.value);
            }).keypress(function(e){
                return that.canInput(e);
            });

            that.setValue(value);
            that.setReadonly(readonly);
            that.setDisabled(disabled);

            // 转嫁事件到数字真实输入框
            displayInput.bind('click focus blur change dbclick keydown keyup keypress mousedown mouseup mouseover mousemove', function(e){
                $el.trigger(e.type);
            });

            $el.on("disabledset",function(e,el,v){
                that.setDisplayDisabled(v);
            });


            // 监听属性readonly、disabled修改事件
            this.addAttrListener(function (idx, mutation) {

                if(arguments.length>1){
                    if (mutation.attributeName.toLowerCase() == 'readonly') {
                        that.setDisplayReadonly(typeof($el.attr('readonly')) != 'undefined' ?true:false);
                    }

                }else{
                    mutation = arguments[0];
                    if(mutation.propertyName){
                        if (mutation.propertyName.toLowerCase() == 'readonly') {
                            that.setDisplayReadonly(typeof($el.attr("readonly")) != "undefined" ?true:false);
                        }
                    }
                }

            });
        };

        /**
         * 添加数字输入框属性修改事件
         * @param event
         */
        NumberInput.prototype.addAttrListener = function(event){
            if ($(this.el)[0].attachEvent) {
                $(this.el)[0].attachEvent('onpropertychange', event);
                return;
            }
            var observer = window.MutationObserver ||
                window.WebKitMutationObserver ||
                window.MozMutationObserver;
            if (observer != null) {
                var _observer = new observer(function (mutations) {
                    $.each(mutations, event);
                });
                _observer.observe(this.el, {
                    attributes: true,
                    subtree: false
                });
            } else if (this.el.addEventListener) {
                this.el.addEventListener('DOMAttrModified', event, false);
            }
        };

        /**
         * 获取展示输入框对象
         * @returns {HTMLInputElement}
         */
        NumberInput.prototype.getDisplayElement = function(){
            return this.displayInput;
        };

        /**
         * 显示域只读设置
         * @param bReadonly
         */
        NumberInput.prototype.setDisplayReadonly = function(bReadonly){
            if (bReadonly != false) {
                if(typeof($(this.displayInput).attr('readonly')) == 'undefined'){
                    $(this.displayInput).attr('readonly',true);
                }
                this._readonly = true;
            } else {
                if(typeof($(this.displayInput).attr('readonly')) != 'undefined'){
                    $(this.displayInput).removeAttr('readonly');
                }
                this._readonly = false;
            }
        };

        /**
         * 显示域禁用设置
         * @param disabled
         */
        NumberInput.prototype.setDisplayDisabled = function(disabled){
            if (disabled != false) {
                if(typeof($(this.displayInput).attr('disabled')) == 'undefined'){
                    $(this.displayInput).attr('disabled',true);
                }
                this._disabled = true;
            } else {
                if(typeof($(this.displayInput).attr('disabled')) != 'undefined'){
                    $(this.displayInput).removeAttr('disabled');
                }
                this._disabled = false;
            }
        };

        /**
         * 设置数字输入框是否只读
         * @param bReadonly
         */
        NumberInput.prototype.setReadonly = function(bReadonly){
            if (bReadonly != false) {
                if(typeof($(this.el).attr('readonly')) == 'undefined'){
                    $(this.el).attr('readonly', true);
                }
                this._readonly = true;
            } else {
                if(typeof($(this.el).attr('readonly')) != 'undefined'){
                    $(this.el).removeAttr('readonly');
                }
                this._readonly = false;
            }
        };

        /**
         * 组件设置禁用
         * @param disabled
         */
        NumberInput.prototype.setDisabled = function(disabled){
            if (disabled != false) {
                if(typeof($(this.el).attr('disabled')) == 'undefined'){
                    $(this.el).attr('disabled', true);
                }
                this._disabled = true;
            } else {
                if(typeof($(this.el).attr('disabled')) != 'undefined'){
                    $(this.el).removeAttr('disabled');
                }
                this._disabled = false;
            }
        };

        /**
         * 使数字输入框获取焦点
         */
        NumberInput.prototype.focus = function(){
            $(this.displayInput).focus();
        };

        /**
         * 使数字输入框获取焦点
         */
        NumberInput.prototype.parseDataFormat = function (format) {
            this.options.allowNegative = /.*-.*/.test(format);
            format = format.replace("\(", "").replace("\)", "").replace("\-", "");
            format = format.split(",");
            this.options.integerLength = parseInt(format[0] || 0,10);
            this.options.scaleLength = parseInt(format[1] || 0,10);
        };
        /*function getInteger(integer, scale){
         return integer;
         };

         function getScale(integer, scale){
         return scale;
         };*/

        /**
         * 根据键盘keypress事件对象判断输入框是否可输入
         * @param e
         * @returns {boolean}
         */
        NumberInput.prototype.canInput = function(e){
            var keyCode = e.keyCode;

            if(keyCode >= 48 && keyCode <= 57){
                var value = this.displayInput.value;
                var index = value.indexOf('.');
                console.log(value);
                if(index < 0){ // 只输入了整数，判断整数位长度
                    if(value.length >= this.options.integerLength){
                        return false;
                    }
                }else{
                    var pos = this.getSelectPoint();
                    if(pos > index){ // 光标在小数点后，判断小数位数长度
                        if(value.slice(index+1).length >= this.options.scaleLength){
                            return false;
                        }
                    }else{ // 光标在小数点前，判断整数位长度
                        if(value.slice(0, index).length >= this.options.integerLength){
                            return false;
                        }
                    }
                }
                return true;
            }

            if(keyCode == 45){ // 负号只能在最前面输入
                if(this.options.allowNegative == false){
                    return false;
                }
                var pos = this.getSelectPoint();
                if(pos == 0){
                    return true;
                }
            }else if(keyCode == 46){ // 只能输入一个小数点
                if( this.options.scaleLength < 1){
                    return false;
                }else if(this.displayInput.value.indexOf('.') < 0){
                    return true;
                }
            }

            return false;
        };

        /**
         * 获取数字输入框光标位置
         * @returns {number}
         */
        NumberInput.prototype.getSelectPoint = function(){
            this.displayInput.focus();
            var pos = 0;
            if (document.selection) {
                var sel = document.selection.createRange();
                sel.moveStart('character', -this.displayInput.value.length);
                pos = sel.text.length;
            }else if(this.displayInput.selectionStart || this.displayInput.selectionStart == '0'){
                pos = this.displayInput.selectionStart;
            }
            return pos;
        };

        /**
         * 设置数字输入框光标位置
         * @param pos
         */
        NumberInput.prototype.setSelectPoint = function(pos){
            if(this.displayInput.setSelectionRange){
                this.displayInput.setSelectionRange(pos, pos);
            }else{
                var rang = this.displayInput.createTextRange();
                range.collapse(true);
                range.moveStart('character', pos);
                range.moveEnd('character', pos);
                range.select();
            }
        };

        /**
         * 获取数字输入框的显示字符串
         * @returns {string}
         */
        NumberInput.prototype.getDisplayValue = function(){
            var value;
            if(arguments.length > 0) value = arguments[0];
            else value = this.getValue(this.displayInput);
            if(value == '') return '';

            var scale = this.options.scaleLength;
            var sign = '';
            if(value.charAt(0) == '-'){
                sign = '-';
                value = value.slice(1);
            }

            var num = value;
            if(scale > 0){
                num = value.substring(0, value.length - scale - 1);
            }
            var display = '';
            while(num.length > 3){
                display = ',' + num.slice(-3) + display;
                num = num.slice(0, num.length - 3);
            }
            if(num){
                display = num + display;
            }
            if(scale > 0){
                display += value.slice(-scale-1);
            }

            return sign+display;
        };

        /**
         * 设置数字输入框的值
         * @param value 建议为字符串
         */
        NumberInput.prototype.setValue = function(value){
            this.displayInput.value = value;

            var value = this.getValue(this.displayInput);
            this.el.value = value;
            this.displayInput.value = this.getDisplayValue(value);
        };

        /**
         * 获取数字输入框的真实值
         * @returns {string} 字符串形式
         */
        NumberInput.prototype.getValue = function(){
            if(arguments.length == 0 || arguments[0] == this.el){
                return this.el.value;
            }

            var input = arguments[0];
            var str = input.value;
            if(str == '') return '';
            var scale = this.options.scaleLength;

            var strs = new Array();
            var dot = -1;
            for(var i = 0; i < str.length; i++){
                var char = str.charAt(i);
                if(char == '.'){
                    if(dot < 0){
                        if(strs.length == 0){
                            strs.push('0');
                        }
                        strs.push(char);
                        dot = 0;
                    }
                }else if(char == '-'){
                    if(i == 0){
                        strs.push(char);
                    }
                }else if(char >= '0' && char <= '9'){
                    if(char == 0 && strs.length == 0) continue;
                    if(dot >= scale) break;
                    strs.push(char);
                    if(dot >= 0) dot++;
                }
            }
            if (scale > 0) {
                for (; dot < scale; dot++) {
                    if (dot < 0) {
                        strs.push('.');
                        dot = 0;
                    }
                    strs.push('0');
                }
            }


            var length = this.options.integerLength;
            if(scale > 0){
                length += scale + 1;
            }

            if(strs.length <= length) return strs.join('');
            return strs.slice(strs.length - length).join('');
        };


        /**
         * 获取数字输入框的真实值
         * @returns {string} 字符串形式
         */
        NumberInput.prototype.getValueFormated = function(format){
            format = format || '0.00';
            var value = this.getValue();
            if(!!value){
                return this.formatNumber(value,format);
            }else{
                return this.formatNumber(0,format);
            }
        };

        /**
         * 设置数字输入框格式
         * @param format
         */
        NumberInput.prototype.setFormat = function(format){
            this.options.format = format;
            this.parseDataFormat(format);
            this.displayInput.value = this.getDisplayValue();
            this.el.value = this.getValue(this.displayInput);
        };

        /**
         * 设置数字输入框格式
         * @param format
         */
        NumberInput.prototype.setFormatByName = function(formatName){
            if(this.options.formatMap[formatName]) {
                this.setFormat(this.options.formatMap[formatName]);
            }

        };

        /**
         * 格式化数字显示方式
         * 用法
         * formatNumber(12345.999,'#,##0.00');
         * formatNumber(12345.999,'#,##0.##');
         * formatNumber(123,'000000');
         * @param num
         * @param pattern
         */
        NumberInput.prototype.formatNumber = function (num, pattern) {
            var strarr = num ? num.toString().split('.') : ['0'];
            var fmtarr = pattern ? pattern.split('.') : [''];
            var retstr = '';

            // 整数部分
            var str = strarr[0];
            var fmt = fmtarr[0];
            var i = str.length - 1;
            var comma = false;
            for (var f = fmt.length - 1; f >= 0; f--) {
                switch (fmt.substr(f, 1)) {
                    case '#':
                        if (i >= 0) retstr = str.substr(i--, 1) + retstr;
                        break;
                    case '0':
                        if (i >= 0) retstr = str.substr(i--, 1) + retstr;
                        else retstr = '0' + retstr;
                        break;
                    case ',':
                        comma = true;
                        retstr = ',' + retstr;
                        break;
                }
            }
            if (i >= 0) {
                if (comma) {
                    var l = str.length;
                    for (; i >= 0; i--) {
                        retstr = str.substr(i, 1) + retstr;
                        if (i > 0 && ((l - i) % 3) == 0) retstr = ',' + retstr;
                    }
                }
                else retstr = str.substr(0, i + 1) + retstr;
            }

            retstr = retstr + '.';
            // 处理小数部分
            str = strarr.length > 1 ? strarr[1] : '';
            fmt = fmtarr.length > 1 ? fmtarr[1] : '';
            i = 0;
            for (var f = 0; f < fmt.length; f++) {
                switch (fmt.substr(f, 1)) {
                    case '#':
                        if (i < str.length) retstr += str.substr(i++, 1);
                        break;
                    case '0':
                        if (i < str.length) retstr += str.substr(i++, 1);
                        else retstr += '0';
                        break;
                }
            }
            return retstr.replace(/^,+/, '').replace(/\.$/, '');
        };

        NumberInput.DEFAULT = {
            format: '(15,2)',
            formatMap: { 'rate':'(2,7)', 'amount' : '(15,2)', 'money':'-(15,2)','integer':'(15,0)'},
            allowNegative : true
        };

        /*
         * 数字输入框允许的方法
         */
        var allowedMethods = [
            /*'scale',*/ 'getValue', 'getValueFormated', 'setValue', 'setReadonly', 'setDisabled', 'focus', 'setFormatByName'
        ];

        /**
         * 数字输入框jQuery插件定义
         * @param option
         * @returns {$.fn}
         */
        $.fn.numberInput = function(option){
            var value,
                args = Array.prototype.slice.call(arguments, 1);

            this.each(function(){
                var $this = $(this),
                    data = $this.data('number-input');

                if (typeof option === 'string') {
                    if ($.inArray(option, allowedMethods) < 0) {
                        throw new Error('Unknown method: ' + option);
                    }

                    if (!data) {
                        return;
                    }

                    value = data[option].apply(data, args);
                }

                if (!data) {
                    var options = $.extend({}, NumberInput.DEFAULT, $this.data(), typeof option === 'object' && option);

                    if(options.format == 'rate'){
                        options.format = '(2,7)';
                    }else if(options.format == 'amount'){
                        options.format = '(15,2)';
                    }else if(options.format == 'money'){
                        options.format = '-(15,2)';
                    }else if(options.format == 'integer'){
                        options.format = '(15,0)';
                    }

                    $this.data('number-input', (data = new NumberInput(this, options)));
                }
            });

            return typeof value === 'undefined' ? this : value;
        };
        $.propHooks.disabled = {
            set : function(el,value){
                if(value != false){
                    el.setAttribute("disabled", value + "");
                }else{
                    el.removeAttribute("disabled");
                }
                $(el).trigger("disabledset" ,[el,value]);
                return value;
            }
        };
        $.attrHooks.disabled = {
            set : function(el,value){
                if(value != false){
                    el.setAttribute("disabled", value + "");
                }else{
                    el.removeAttribute("disabled");
                }
                $(el).trigger("disabledset" ,[el,value]);

                return value;
            }
        };
    })(jQuery);

    return jQuery;
});