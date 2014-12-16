(function($) {

    var Main = Backbone.View.extend({
        initialize: function () {
            this.sidebar = new Sidebar({
                el: $('.sidebar'),
                parentView: this
            });

            this.content = new Content({
                el: $('#content')
            });

            this.on('changeContent', this.changeContent, this);
        },

        changeContent: function (template) {
            this.content.renderTemplate(template);
        }

    });

    var Sidebar = Backbone.View.extend({
        events: {
            'click .sidebar-list-el': 'clickHandle'
        },

        initialize: function (options) {
            this.parentView = options.parentView;
        },

        clickHandle: function (e) {
            var item = $(e.currentTarget);
            var template = 'template' + item.attr('data-template');
            this.parentView.trigger('changeContent', template)
        }
    });

    var Content = Backbone.View.extend({
        initialize: function () {
            this.tmpl_cache = {};
            var renderedHtml = this.fetchTemplate('template1', {});
            this.$el.append(renderedHtml);
        },

        fetchTemplate: function (tmpl_name, tmpl_data) {
            if (!this.tmpl_cache[tmpl_name]) {
                var tmpl_url = tmpl_name + '.html';

                var tmpl_string;
                $.ajax({
                    url: tmpl_url,
                    method: 'GET',
                    async: false,
                    success: function(data) {
                        tmpl_string = data;
                    }
                });
                this.tmpl_cache[tmpl_name] = _.template(tmpl_string);
            }
            return this.tmpl_cache[tmpl_name](tmpl_data);
        },

        renderTemplate: function (template) {
            this.$el.hide();
            this.$el.empty();
            var renderedHtml = this.fetchTemplate(template, {});
            this.$el.append(renderedHtml);
            this.$el.slideDown({
                duration: 400,
                easing: "linear"
            })
        }
    });
    
    $(document).ready(function () {
        var main = new Main({el: $('#container')});
    });
    
})(jQuery);