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
            var template = item.attr('data-template');
            this.parentView.trigger('changeContent', template);
        }
    });

    var Content = Backbone.View.extend({
        events: {
            'click #contact-us': 'send-email'
        },

        initialize: function () {
            this.tmpl_cache = {};
            var renderedHtml = this.fetchTemplate('1', {});
            this.$el.append(renderedHtml);
        },

        fetchTemplate: function (tmpl_name, tmpl_data) {
            if (!this.tmpl_cache[tmpl_name]) {
                var tmpl_url = 'template' + tmpl_name + '.html';

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
                easing: 'linear'
            })
            if (template === '3') {
                $('#contact-us').on('click', {view: this}, this.validateContactForm);
            }
        },

        validateContactForm: function (e) {
            e.preventDefault();
            var view = e.data.view;

            var errorEl = $('.error');
            errorEl.empty();

            var hasError = false;
            _.each(['message', 'email', 'name'], function (field) {
                var fieldEl = view.$el.find('[name="' + field + '"]');
                if (fieldEl.val && $.trim(fieldEl.val()) === '') {
                    errorEl.empty();
                    errorEl.append('The ' + field + ' field cannot be blank.');
                    hasError = true;
                    fieldEl.click();
                }
            });

            if (!hasError) {
                view.sendEmail(view);
            }
        },

        sendEmail: function (view) {
            var fields = view.$el.find('input, textarea');
            var data = fields.serialize();
            $.ajax({
                url: 'php/ContactUs.php',
                data: data,
                method: 'POST',
                success: function (data, status, xhr) {
                    var feedbackEl = $('.feedback');
                    feedbackEl.empty();
                    feedbackEl.append('Your message has been sent.  Thank you for your feedback');
                    for (var i = 0; i < fields.length; i++) {
                        if ($(fields[i]).attr('type') !== 'submit') {
                            $(fields[i]).val('');
                        }
                    }
                },
                error: function (xhr, status, error) {
                    var errorEl = $('.error');
                    errorEl.empty();
                    errorEl.append('An unexpected error has occured.  Please try again later.');
                }
            });
        }
    });
    
    $(document).ready(function () {
        var main = new Main({el: $('#container')});
    });
    
})(jQuery);