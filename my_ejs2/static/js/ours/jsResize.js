/*
    属性
            size:窗体或控件大小,值类型为{width:0,height:0}
            interval:检查时间间隔,单位为毫秒
    方法
            destroy:释放资源
    事件
            resize:控件大小发生变化,function (size) 

    //示例
	var g_resize_count = 0;  
    $(document).ready(function () {  
        try {  
            $window = $(window);  
            var resize = $window.jqElemResize();  
            //resize.$self.on("resize", function (size)或  
            $(resize).on("resize", function (size) {  
                ++g_resize_count;  
                document.title = g_resize_count.toString();  
            });  
        } catch (exp) {  
            alert(exp.message);  
        }  
    });  
  
    //页面卸载时 
    $(window).unload(function () {  
        try {  
            $(window).jqElemResize("destroy");  
        } catch (exp) {  
            alert(exp.message);  
        }  
    });  

*/
(function ($) {
    $.jqElemResize = function (elem, options) {

        var defaults = {
            handle: null,
            oldsize: { width: 0, height: 0 },
            newsize: { width: 0, height: 0 },
            /************************************************************/
            interval: 400,
            events: { resize: null }
        };

        this.callMethod = function (method, key, val) {
            switch (method.toLowerCase()) {
                case "option":
                    return optionsEx(self, key, val);
                case "destroy":
                    if (null != self.settings.handle) {
                        clearInterval(self.settings.handle);
                        self.settings.handle = null;
                    }
                    self.$self.off();
                    self.$elem.off();
                    self.$elem.removeData("{192B6792-A9EA-47C6-8C08-0F6A31BC8C7D}");
                    break;
                default:
                    return false;
            }
        };

        function optionsEx(pself, key, val) {
            switch (key.toLowerCase()) {
                case "interval":
                    return (function (pself1, val) {
                        if (val === undefined)
                            return pself1.settings.interval;
                        pself1.settings.interval = parseInt(val, 10);
                        return true;
                    })(pself, val);
                case "this":
                    return pself.$self;
                default:
                    return false;
            }
        };

        var self = this;

        (function () {
            self.$self = $(self);
            self.elem = elem; /*self.doc = jsCore.get_document(elem);*/
            self.$elem = $(self.elem);
            self.$elem.data("{192B6792-A9EA-47C6-8C08-0F6A31BC8C7D}", self);    /*绑定当前数据*/

            self.settings = (undefined === options) ? $.extend({}, defaults) || {} : $.extend({}, defaults, options) || {};
            self.settings.events = (undefined === options || undefined === options.events) ? $.extend({}, defaults.events) || {} : $.extend({}, defaults.events, options.events) || {};
            $.each(self.settings.events, function (type) {
                if ($.isFunction(self.settings.events[type]))
                    self.$self.on(type, self.settings.events[type]);
            });

            self.$elem.on("resize", { pself: self }, function (e) {
                var $window = $(this);
                e.data.pself.settings.newsize.width = $window.width();
                e.data.pself.settings.newsize.height = $window.height();

                (function start($window, pself1) {
                    if (null != pself1.settings.handle) return;
                    pself1.settings.handle = setInterval(function () {
                        pself1.settings.oldsize.width = $window.width();
                        pself1.settings.oldsize.height = $window.height();
                        if (pself1.settings.newsize.width === pself1.settings.oldsize.width &&
                        pself1.settings.newsize.height === pself1.settings.oldsize.height) {
                            clearInterval(pself1.settings.handle);
                            pself1.settings.handle = null;
                            pself1.$self.triggerHandler("resize", pself1.settings.newsize);
                        }
                    }, pself1.settings.interval);
                })($window, e.data.pself);

            });
        })();
        return self;
    };

    $.fn.jqElemResize = function () {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        if (typeof args[0] === "string") {
            if (self.length > 1)
                self = self.eq(0);
            var $plugin = $(self).data("{192B6792-A9EA-47C6-8C08-0F6A31BC8C7D}");
            return $plugin.callMethod(args[0], args[1], args[2]);
        }
        if (self.length > 1)
            throw new jsCore.error("jqElemResize对象只支持window元素初始化!");
        var elem = self[0];
        if (!elem.location)
            throw new jsCore.error("jqElemResize对象只支持window元素!");
        return new $.jqElemResize(elem, args[0]);
        //      多个元素初始化不支持
        //        self.each(function () {
        //            (new $.jqElemResize(this, args[0]));
        //        });
    };
})(jQuery);