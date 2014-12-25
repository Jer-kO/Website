(function($) {

    var Main = Backbone.View.extend({
        initialize: function () {
            this.navbar = new Navbar({
                el: $('.navbar'),
                parentView: this
            });

            this.hamburger = new Hamburger({
                el: $('.hamburger'),
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

    var Navbar = Backbone.View.extend({
        events: {
            'click .navbar-list-el': 'navClick'
        },

        initialize: function (options) {
            this.parentView = options.parentView;
        },

        navClick: function (e) {
            var item = $(e.currentTarget);
            var template = item.attr('data-template');
            this.parentView.trigger('changeContent', template);
        }
    });

    var Hamburger = Backbone.View.extend({
        events: {
            'click .dropdown-item': 'dropdownClick'
        },

        initialize: function (options) {
            this.parentView = options.parentView;
            this.$el.bind('click', {view: this}, this.toggleDropdown);
            this.$el.hover(this.inHover, this.outHover);
        },

        inHover: function (e) {
            $(e.currentTarget).find('.patty').animate({
                marginBottom: '6px',
                marginTop: '6px'
            }, 100);
        },

        outHover: function (e) {
            $(e.currentTarget).find('.patty').animate({
                marginBottom: '4px',
                marginTop: '4px'
            }, 100);
            $(e.currentTarget).find('.dropdown').hide();
        },

        toggleDropdown: function (e) {
            var view = e.data.view;
            var dropdown = view.$el.find('.dropdown');
            dropdown.toggle();
        },

        dropdownClick: function (e) {
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
            var renderedHtml = this.fetchTemplate('home', {});
            this.$el.append(renderedHtml);
            var homepage = new HomePage({
                el: $('#home')
            });
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
            this.$el.show();
            if (template === 'contact') {
                var contactPage = new ContactPage({
                    el: $('#contact')
                });
            }
            if (template === 'home') {
                var homePage = new HomePage({
                    el: $('#home')
                });
            }
        }
    });

    var HomePage = Backbone.View.extend({
        events: {
            'click .panel': 'panelClick'
        },

        initialize: function (options) {
        },

        panelClick: function (e) {
            e.preventDefault();
            var panel = $(e.currentTarget);
            var panelContent = panel.next('.panel-content');

            if (panel.hasClass('panel-open')) {
                panelContent.slideUp({
                    easing: 'linear',
                    duration: 200,
                    complete: function () {
                        panel.toggleClass('panel-open');
                    }
                });
            } else {
                panel.toggleClass('panel-open');
                panelContent.slideDown({
                    easing: 'linear',
                    duration: 200
                });

                if (panelContent.hasClass('connect4-app')) {
                    var connect4 = new Connect4({
                        el: panelContent
                    });
                }
            }
        }
    });

    var ContactPage = Backbone.View.extend({
        events: {
            'click #contact-us': 'validateContactForm'
        },

        initialize: function (options) {
        },

        validateContactForm: function (e) {
            e.preventDefault();
            var view = this;

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
                this.sendEmail(view);
            }
        },

        sendEmail: function (view) {
            var spinner = view.$el.find('.spinner');
            spinner.show();
            var submitBtn = $('#contact-us');
            submitBtn.addClass('disabled');
            submitBtn.attr('disabled', 'disabled');

            var fields = view.$el.find('input, textarea');
            var data = fields.serialize();
            $.ajax({
                url: 'php/ContactUs.php',
                data: data,
                method: 'POST',
                success: function (data, status, xhr) {
                    spinner.hide();
                    submitBtn.removeClass('disabled');
                    submitBtn.removeAttr('disabled');

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
                    spinner.hide();
                    submitBtn.removeClass('disabled');
                    submitBtn.removeAttr('disabled');

                    var errorEl = $('.error');
                    errorEl.empty();
                    errorEl.append('An unexpected error has occured.  Please try again later.');
                }
            });
        }
    });
    
    $(document).ready(function () {
        var main = new Main({el: $('#container')});
        $(window).trigger('resize');
    });

    $(window).bind('resize', function () {
        var width = $(window).width();
        var navbar = $('#navbar');
        var hamburger = $('#hamburger');

        if (width < 1020) {
            navbar.hide();
            hamburger.show();
        } else {
            navbar.show();
            hamburger.hide();
        }
    });
    
})(jQuery);