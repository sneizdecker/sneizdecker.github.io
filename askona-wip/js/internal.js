$(document).ready(function() {

    $('.js_main-slider').slick({
        slide: '.main-slider__item',
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        prevArrow: '<button class="main-slider__arrow-prev">',
        nextArrow: '<button class="main-slider__arrow-next">',
        dotsClass: 'main-slider__dots'
    });

    /**
     * Глобальные переменные, которые используются многократно
     */
    var global = {
        // время для анимаций
        time:  200,

        // контрольные точки адаптива
        desktopXlSize: 1599,
        desktopLgSize: 1379,
        desktopSize:   1199,
        tabletLgSize:   959,
        tabletSize:     767,
        mobileSize:     479,

        // проверка touch устройств
        isTouch: function() {
            var md = new MobileDetect(window.navigator.userAgent);
            if (md.mobile() == null) {
                return false;
            } else {
                return true;
            }
        }
    };

    $(window).load(function() {
        if (global.isTouch()) {
            $('body').removeClass('no-touch');
        } else {
            $('body').addClass('no-touch');
        }

        if (Modernizr.flexbox) {
            // Modern Flexbox with `flex-wrap` is supported
        } else {
            flexibility(document.documentElement);
        } 
    });


    /**
     * Подключение js partials
     */
    /* form_style.js должен быть выполнен перед form_validation.js */
    /**
     * Стилизует селекты с помощью плагина select2
     * https://select2.github.io
     */
    $.fn.customSelect = function() {
        var self = this;

        self.each(function() {
            if ($(this).hasClass('select2-hidden-accessible')) {
                return;
            } else {
                var selectSearch = $(this).data('search');
                var minimumResultsForSearch;

                if (selectSearch) {
                    minimumResultsForSearch = 1; // показываем поле поиска
                } else {
                    minimumResultsForSearch = Infinity; // не показываем поле поиска
                }

                $(this).select2({
                    minimumResultsForSearch: minimumResultsForSearch,
                    selectOnBlur: true,
                    dropdownCssClass: 'error'
                });

                $(this).on('change', function(e) {
                    $(this).valid();

                    // нужно для вылидации на лету
                    $(this).find('option[value="' + $(this).context.value + '"]').click();
                });
            }
        });
    };

    /**
     * Стилизует file input
     * http://gregpike.net/demos/bootstrap-file-input/demo.html
     */
    $.fn.customFileInput = function() {

        this.each(function(i, elem) {

            var $elem = $(elem);

            // Maybe some fields don't need to be standardized.
            if (typeof $elem.attr('data-bfi-disabled') != 'undefined') {
                return;
            }

            // Set the word to be displayed on the button
            var buttonWord = 'Browse';

            if (typeof $elem.attr('title') != 'undefined') {
                buttonWord = $elem.attr('title');
            }

            var className = '';

            if (!!$elem.attr('class')) {
                className = ' ' + $elem.attr('class');
            }

            // Now we're going to wrap that input field with a button.
            // The input will actually still be there, it will just be float above and transparent (done with the CSS).
            $elem.wrap('<div class="custom-file"><a class="btn ' + className + '"></a></div>').parent().prepend($('<span></span>').html(buttonWord));
        })

        // After we have found all of the file inputs let's apply a listener for tracking the mouse movement.
        // This is important because the in order to give the illusion that this is a button in FF we actually need to move the button from the file input under the cursor. Ugh.
        .promise().done(function() {

            // As the cursor moves over our new button we need to adjust the position of the invisible file input Browse button to be under the cursor.
            // This gives us the pointer cursor that FF denies us
            $('.custom-file').mousemove(function(cursor) {

                var input, wrapper,
                    wrapperX, wrapperY,
                    inputWidth, inputHeight,
                    cursorX, cursorY;

                // This wrapper element (the button surround this file input)
                wrapper = $(this);
                // The invisible file input element
                input = wrapper.find("input");
                // The left-most position of the wrapper
                wrapperX = wrapper.offset().left;
                // The top-most position of the wrapper
                wrapperY = wrapper.offset().top;
                // The with of the browsers input field
                inputWidth = input.width();
                // The height of the browsers input field
                inputHeight = input.height();
                //The position of the cursor in the wrapper
                cursorX = cursor.pageX;
                cursorY = cursor.pageY;

                //The positions we are to move the invisible file input
                // The 20 at the end is an arbitrary number of pixels that we can shift the input such that cursor is not pointing at the end of the Browse button but somewhere nearer the middle
                moveInputX = cursorX - wrapperX - inputWidth + 20;
                // Slides the invisible input Browse button to be positioned middle under the cursor
                moveInputY = cursorY - wrapperY - (inputHeight / 2);

                // Apply the positioning styles to actually move the invisible file input
                input.css({
                    left: moveInputX,
                    top: moveInputY
                });
            });

            $('body').on('change', '.custom-file input[type=file]', function() {

                var fileName;
                fileName = $(this).val();

                // Remove any previous file names
                $(this).parent().next('.custom-file__name').remove();
                if (!!$(this).prop('files') && $(this).prop('files').length > 1) {
                    fileName = $(this)[0].files.length + ' files';
                } else {
                    fileName = fileName.substring(fileName.lastIndexOf('\\') + 1, fileName.length);
                }

                // Don't try to show the name if there is none
                if (!fileName) {
                    return;
                }

                var selectedFileNamePlacement = $(this).data('filename-placement');
                if (selectedFileNamePlacement === 'inside') {
                    // Print the fileName inside
                    $(this).siblings('span').html(fileName);
                    $(this).attr('title', fileName);
                } else {
                    // Print the fileName aside (right after the the button)
                    $(this).parent().after('<span class="custom-file__name">' + fileName + '</span>');
                }
            });

        });

    };

    $('input[type="file"]').customFileInput();
    $('select').customSelect();
    /* TODO:
    Если после ввода некорректного значения в поле даты выбрать дату в календаре кликом, то не вызывается событие change -> не срабатывает валидация 
    Переписать стили для чекбоксов типа slide
    Проверить новые чекбоксы во всех браузерах -> поправить, если что не так
    */
    Parsley.addMessages('ru', {
        defaultMessage: "Некорректное значение.",
        type: {
            email:        "Введите адрес электронной почты.",
            url:          "Введите URL адрес.",
            integer:      "Введите целое число.",
            digits:       "Введите только цифры.",
            alphanum:     "Введите только английские буквы и цифры."
        },
        required:       "Обязательное поле.",
        pattern:        "Это значение некорректно.",
        min:            "Это значение должно быть не менее чем %s.",
        max:            "Это значение должно быть не более чем %s.",
        range:          "Это значение должно быть от %s до %s.",
        minlength:      "Это значение должно содержать не менее %s символов.",
        maxlength:      "Это значение должно содержать не более %s символов.",
        length:         "Это значение должно содержать от %s до %s символов.",
        mincheck:       "Выберите не менее %s значений.",
        maxcheck:       "Выберите не более %s значений.",
        check:          "Выберите от %s до %s значений.",
        equalto:        "Это значение должно совпадать с предыдущим."
    });

    Parsley.setLocale('ru');

    /*Настройки Parsley*/
    $.extend(Parsley.options, {
        trigger: 'input change', //change нужен для select'а
        validationThreshold: '0',
        errorsWrapper: '<div></div>',
        errorTemplate: '<p class="parsley-error-message"></p>',
        classHandler: function(instance) {
            var $element = instance.$element,
                type = $element.attr('type'),
                $handler;
            if (type == 'checkbox' || type == 'radio')
                $handler = $element; //то есть ничего не выделяем (input скрыт), иначе выделяет родительский блок
            else if ($element.hasClass('select2-hidden-accessible'))
                $handler = $('.select2-selection--single', $element.next('.select2'));

            return $handler;
        },
        errorsContainer: function(instance) {
            var $element = instance.$element,
                type = $element.attr('type'),
                $container;

            if (type == 'checkbox' || type == 'radio')
                $container = $('[name="' + $element.attr('name') + '"]:last + label').next('.errors-placement');
            else if ($element.hasClass('select2-hidden-accessible'))
                $container = $element.next('.select2').next('.errors-placement');
            else if (type == 'file')
                $container = $element.closest('.custom-file').next('.errors-placement');

            return $container;
        }
    });

    /*Кастомные валидаторы*/

    /* Только русские буквы, тире, пробелы */
    Parsley.addValidator('nameRu', {
        validateString: function(value) {
            return /^[а-яё\- ]*$/i.test(value);
        },
        messages: {
            ru: 'Cимволы А-Я, а-я, " ", "-".'
        }
    });

    /* Только латинские буквы, тире, пробелы */
    Parsley.addValidator('nameEn', {
        validateString: function(value) {
            return /^[a-z\- ]*$/i.test(value);
        },
        messages: {
            ru: 'Cимволы A-Z, a-z, " ", "-".'
        }
    });

    /* Только латинские и русские буквы, тире, пробелы */
    Parsley.addValidator('name', {
        validateString: function(value) {
            return /^[а-яёa-z\- ]*$/i.test(value);
        },
        messages: {
            ru: 'Cимволы A-Z, a-z, А-Я, а-я, " ", "-".'
        }
    });

    /* Только цифры и русские буквы */
    Parsley.addValidator('numLetterRu', {
        validateString: function(value) {
            return /^[0-9а-яё]*$/i.test(value);
        },
        messages: {
            ru: 'Cимволы А-Я, а-я, 0-9.'
        }
    });

    /* Только цифры, латинские и русские буквы */
    Parsley.addValidator('numLetter', {
        validateString: function(value) {
            return /^[а-яёa-z0-9]*$/i.test(value);
        },
        messages: {
            ru: 'Cимволы A-Z, a-z, А-Я, а-я, 0-9.'
        }
    });

    /* Телефонный номер */
    Parsley.addValidator('phone', {
        validateString: function(value) {
            return /^[-+0-9() ]*$/i.test(value);
        },
        messages: {
            ru: 'Некорректный телефонный номер.'
        }
    });

    /* Формат даты DD.MM.YYYY */
    Parsley.addValidator('date', {
        validateString: function(value) {
            var regTest = /^(?:(?:31(\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{4})$/,
                regMatch = /(\d{1,2})\.(\d{1,2})\.(\d{4})/,
                min = arguments[2].$element.data('dateMin'),
                max = arguments[2].$element.data('dateMax'),
                minDate, maxDate, valueDate, result;

            if (min && (result = min.match(regMatch)))
                minDate = new Date(+result[3], result[2] - 1, +result[1]);
            if (max && (result = max.match(regMatch)))
                maxDate = new Date(+result[3], result[2] - 1, +result[1]);
            if (result = value.match(regMatch))
                valueDate = new Date(+result[3], result[2] - 1, +result[1]);

            return regTest.test(value) && (minDate ? valueDate >= minDate : true) && (maxDate ? valueDate <= maxDate : true);
        },
        messages: {
            ru: 'Некорректная дата.'
        }
    });

    /* Файл ограниченного размера */
    Parsley.addValidator('maxFileSize', {
        validateString: function(value, maxSize, parsleyInstance) {
            var files = parsleyInstance.$element[0].files;
            return files.length != 1  || files[0].size <= maxSize * 1024;
        },
        requirementType: 'integer',
        messages: {
            ru: 'Файл должен весить не более, чем %s Kb'
        }
    });

    /*Включает/отключает кнопку submit'а*/
    Parsley.on('field:validated', function() {
        var $form = this.$element.closest('form');
        $form.find('[type="submit"], [data-submit="true"]').prop('disabled', !$form.parsley().isValid());
    });

    /*Создаёт контейнеры для ошибок у нетипичных элементов*/
    Parsley.on('field:init', function() {
        var $element = this.$element,
            type = $element.attr('type'),
            $block = $('<div/>').addClass('errors-placement'),
            $last;

        if (type == 'checkbox' || type == 'radio') {
            $last = $('[name="' + $element.attr('name') + '"]:last + label');
            if (!$last.next('.errors-placement').length)
                $last.after($block);
        } else if ($element.hasClass('select2-hidden-accessible')) {
            $last = $element.next('.select2');
            if (!$last.next('.errors-placement').length)
                $last.after($block);
        } else if (type == 'file') {
            $last = $element.closest('.custom-file');
            if (!$last.next('.errors-placement').length)
                $last.after($('<div/>').addClass('errors-placement'));
        }
    });

    $('form[data-validate="true"]').parsley();
    /**
     * Добавляет маски в поля форм
     * @see  https://github.com/RobinHerbots/Inputmask
     *
     * @example
     * <input type="tel" name="tel" id="tel" data-mask="phoneRu">
     */
    $('[data-mask="phoneRu"]').inputmask('+7(999) 999-99-99', {
        clearMaskOnLostFocus: false
    });
    /**
     * Делает выпадющие календарики
     * @see  http://api.jqueryui.com/datepicker/
     *
     * @example
     * // в data-date-min и data-date-max можно задать дату в формате dd.mm.yyyy
     * <input type="text" name="dateInput" id="" class="datepicker" data-date-min="06.11.2015" data-date-max="10.12.2015">
     */
    var Datepicker = function() {
        var datepicker = $('.datepicker'),
            minDate,
            maxDate;

        datepicker.each(function () {

            minDate = $(this).data('date-min');
            maxDate = $(this).data('date-max');

            $(this).datepicker({
                showOtherMonths: true,
                minDate: minDate || null,
                maxDate: maxDate || null,
                onSelect: function () {
                    console.log(1);
                    $(this).change();
                }
            });
        });
    };

    var datepicker = new Datepicker();
    /**
     * Реализует переключение табов
     *
     * @example
     * <ul class="tabs">
     *     <li class="tabs__item">
     *         <span class="is-active tabs__link">Tab name</span>
     *         <div class="tabs__cnt">
     *             <p>Tab content</p>
     *         </div>
     *     </li>
     * </ul>
     */
    var TabSwitcher = function() {
        var self = this,
            tabs = $('.tabs');

        tabs.each(function() {
            $(this).find('.tabs__link.is-active').next().addClass('is-open');
        });

        tabs.on('click', '.tabs__link', function(event) {
            self.open($(this), event);

            // return false;
        });

        /**
         * Открывает таб по клику на какой-то другой элемент
         *
         * @example
         * <span data-tab-open="#tab-login">Open login tab</span>
         */
        $(document).on('click', '[data-tab-open]', function(event) {
            var tabElem = $(this).data('tab-open');
            self.open($(tabElem), event);

            if ($(this).data('popup') == undefined) {
                return false;
            }
        });

        /**
         * Открывает таб
         * @param  {Element} elem элемент .tabs__link, на который нужно переключить
         *
         * @example
         * // вызов метода open, откроет таб
         * tabSwitcher.open($('#some-tab'));
         */
        self.open = function(elem, event) {
            if (!elem.hasClass('is-active')) {
                event.preventDefault();
                var parentTabs = elem.closest(tabs);
                parentTabs.find('.is-open').removeClass('is-open');

                elem.next().toggleClass('is-open');
                parentTabs.find('.is-active').removeClass('is-active');
                elem.addClass('is-active');
            } else {
                event.preventDefault();
            }
        };
    };

    var tabSwitcher = new TabSwitcher();

    /**
     * Скрывает элемент hiddenElem при клике за пределами элемента targetElem
     * 
     * @param  {Element}   targetElem
     * @param  {Element}   hiddenElem
     * @param  {Function}  [optionalCb] отрабатывает сразу не дожидаясь завершения анимации
     */
    function onOutsideClickHide(targetElem, hiddenElem, optionalCb) {
        $(document).bind('mouseup touchend', function(e) {
            if (!targetElem.is(e.target) && $(e.target).closest(targetElem).length == 0) {
                hiddenElem.stop(true, true).fadeOut(global.time);
                if (optionalCb) {
                    optionalCb();
                }
            }
        });
    }

    /**
     * Хэлпер для показа, скрытия или чередования видимости элементов
     *
     * @example
     * <button type="button" data-visibility="show" data-show="#elemId1"></button>
     *
     * или
     * <button type="button" data-visibility="hide" data-hide="#elemId2"></button>
     *
     * или
     * <button type="button" data-visibility="toggle" data-toggle="#elemId3"></button>
     * 
     * или
     * <button type="button" data-visibility="show" data-show="#elemId1|#elemId3"></button>
     *
     * или
     * // если есть атрибут data-queue="show", то будет сначала скрыт элемент #elemId2, а потом показан #elemId1
     * <button type="button" data-visibility="show" data-show="#elemId1" data-visibility="hide" data-hide="#elemId2" data-queue="show"></button>
     * 
     * <div id="elemId1" style="display: none;">Text</div>
     * <div id="elemId2">Text</div>
     * <div id="elemId3" style="display: none;">Text</div>
     */
    var visibilityControl = function() {
        var settings = {
            types: [
                'show',
                'hide',
                'toggle'
            ]
        };

        if ($('[data-visibility]').length > 0) {

            $(document).on('click', '[data-visibility]', function() {
                var dataType;
                for (var i = 0; i < settings.types.length; i++) {
                    dataType = settings.types[i];

                    if ($(this).data(dataType)) {
                        var visibilityList = $(this).data(dataType).split('|'),
                            delay = 0;

                        if ($(this).data('queue') == 'show') {
                            delay = global.time;
                        } else {
                            delay = 0;
                        }
                        setVisibility(dataType, visibilityList, delay);
                    }
                }

                if (!$(this).hasClass('tabs__link') && $(this).attr('type') != 'radio' && $(this).attr('type') != 'checkbox') {
                    return false;
                }
            });

            /**
             * Устанавливает видимость
             * @param {String}  visibilityType тип отображения
             * @param {Array}   list массив элементов, с которым работаем
             * @param {Number}  delay задержка при показе элемента в ms
             */
            function setVisibility(visibilityType, list, delay) {
                for (var i = 0; i < list.length; i++) {
                    if (visibilityType == settings.types[0]) {
                        $(list[i]).delay(delay).fadeIn(global.time);
                    }

                    if (visibilityType == settings.types[1]) {
                        $(list[i]).fadeOut(global.time);
                    }

                    if (visibilityType == settings.types[2]) {
                        if ($(list[i]).is(':visible')) {
                            $(list[i]).fadeOut(global.time);
                        } else {
                            $(list[i]).fadeIn(global.time);
                        }
                    }
                }
            }

        }
    };

    visibilityControl();
    /* include('accordion.js')
    include('custom_scrollbar.js') */
    /**
     * Делает слайдер
     * @see  http://api.jqueryui.com/slider/
     *
     * @example
     * // в data-min и data-max задаются минимальное и максимальное значение
     * // в data-step шаг, 
     * // в data-values дефолтные значения "min, max"
     * <div class="slider">
     *      <div class="slider__range" data-min="0" data-max="100" data-step="1" data-values="10, 55"></div>
     * </div>
     */
    var Slider = function() {
        var slider = $('.slider'),
            min,
            max,
            step,
            values;

        slider.each(function () {

            var self = $(this),
                range = self.find('.slider__range');

            min = range.data('min');
            max = range.data('max');
            step = range.data('step');
            values = range.data('values').split(', ');

            range.slider({
                range: true,
                min: min || null,
                max: max || null,
                step: step || 1,
                values: values,
                slide: function(event, ui) {
                    self.find('.ui-slider-handle').children('span').remove();
                    self.find('.ui-slider-handle:nth-child(2)').append('<span>' + ui.values[0] + '</span>');
                    self.find('.ui-slider-handle:nth-child(3)').append('<span>' + ui.values[1] + '</span>');
                }
            });

            self.find('.ui-slider-handle:nth-child(2)').append('<span>' + range.slider('values', 0) + '</span>');
            self.find('.ui-slider-handle:nth-child(3)').append('<span>' + range.slider('values', 1) + '</span>');

        });
    };

    var slider = new Slider();
    /**
     * Открывает и закрывает попапы и модальные окна
     *
     * @example
     * <a href="#popupId" data-popup="open">Text</a>
     * <a href="#modalId" data-modal="open">Text</a>
     *
     * <div id="popupId" style="display: none;">Popup content</div>
     * <div id="modalId" style="display: none;">Modal content</div>
     *
     * Закроет все попапы и модальные окна
     * <button type="button" data-popup="close">Text</button>
     */
    var Popups = function() {
        var self = this,
            btnOpen = $('[data-popup="open"]'),
            btnModalOpen = $('[data-modal="open"]'),
            btnIframeOpen = $('[data-popup="iframe"]'),
            btnClose = $('[data-popup="close"]'),
            settings = {
                fitToView: false,
                margin: 0,
                padding: 0,
                openSpeed: global.time,
                closeSpeed: global.time,
                helpers: {
                    title: null
                }
            };

        /**
         * Открывает попап
         * @param  {String} id       id попапа, который надо открыть
         * @param  {Object} options  параметры попапа (необязательный)
         *
         * @example
         * popups.open('#some-popup')
         */
        self.open = function(id, options) {
            options = options || {};
            if (!options || Object.keys(options).length == 0) {
                $.each(settings, function(key, value) {
                    options[key] = value;
                });
            }

            options.href = id;
            $.fancybox(options);
        };

        /**
         * Закрывает попап
         */
        self.close = function() {
            $.fancybox.close();
        };

        if (btnOpen.length > 0) {
            btnOpen.on('click', function () {
                var id = $(this).attr('href') || $(this).data('href'),
                    options = {};

                $.each(settings, function(key, value) {
                    options[key] = value;
                });

                self.open(id, options);

                // return false;
            });
        }

        if (btnModalOpen.length > 0) {
            btnOpen.on('click', function () {
                var id = $(this).attr('href') || $(this).data('href'),
                    optionsModal = {};

                $.each(settings, function(key, value) {
                    optionsModal[key] = value;
                });

                optionsModal['modal'] = true;
                optionsModal['beforeShow'] = function() {
                    $('.fancybox-overlay').addClass('fancybox-overlay_type_modal');
                };
                optionsModal['afterClose'] = function() {
                    setTimeout(function() {
                        $('.fancybox-overlay').removeClass('fancybox-overlay_type_modal');
                    }, global.time);
                };

                self.open(id, optionsModal);
            });
        }

        if (btnIframeOpen.length > 0) {
            var optionsIframe = {};
            $.each(settings, function(key, value) {
                optionsIframe[key] = value;
            });

            optionsIframe['padding'] = 48;
            optionsIframe['beforeShow'] = function() {
                $('.fancybox-overlay').addClass('fancybox-overlay_type_iframe');
            };
            optionsIframe['afterClose'] = function() {
                setTimeout(function() {
                    $('.fancybox-overlay').removeClass('fancybox-overlay_type_iframe');
                }, global.time);
            };

            btnIframeOpen.fancybox(optionsIframe);
        }

        if ($('[data-popup="close"]').length > 0) {
            $('[data-popup="close"]').on('click', function () {
                self.close();
            });
        }
    };

    var popups = new Popups();
    /**
     * Проверка поддержки svg, если нет, то заменяем на картинку
     */
    $(window).load(function() {
        if (!Modernizr.svg) {
            // $('.logo img').attr('src', 'img/logo.png');
        }
    });
    /* include('tooltip.js') */
    var ReviewPopup = (function() {

        var togglePopup = function (e) {
            if($('.js-popup-review') && $('.js-popup-review').hasClass('product-head__review-popup_hidden')) {
                $('.js-popup-review').removeClass('product-head__review-popup_hidden');
            } else if ($('.js-popup-review')) {
                $('.js-popup-review').addClass('product-head__review-popup_hidden');
            }
        };

        var init = function () {
            $('.js-reviews-btn').on('click', togglePopup);
            $('js-review-popup-close').on('click', togglePopup);
        };

        return {
            init: init
        };

    })();

    var ImagePreviewPopup = (function() {

        var flag = 0; //Init slider in first time

        var togglePopup = function (e) {
            if($('.js-image-preview') && $('.js-image-preview').hasClass('product-preview__popup-image-full_hidden')) {
                $('.js-image-preview').removeClass('product-preview__popup-image-full_hidden');
                if (!flag) {
                    MainSlickSlider.init();
                    flag = 1;
                }
            } else if ($('.js-image-preview')) {
                $('.js-image-preview').addClass('product-preview__popup-image-full_hidden');
            }
        };

        var init = function () {
            $('.js-image-preview-open').on('click', togglePopup);
            $('.js-image-preview-close').on('click', togglePopup);
        };

        return {
            init: init
        };

    })();

    var ToggleMainImage = (function () {

        var setURL = function (e) {
            document.querySelector('.product-preview__img_active').classList.remove('product-preview__img_active');
            e.target.classList.add('product-preview__img_active');
            document.querySelector('.js-product-main-image').setAttribute('src', e.target.dataset.path);
        };

        var init = function () {
            var preIcon = document.querySelector('.js-pre-icon-container');
            var length = preIcon.children.length;
            while (length--) {
                if (preIcon.children[length].classList.contains('product-preview__img'))
                    $(preIcon.children[length]).on('click', setURL);
            }
        };

        return {
            init: init
        };

    })();

    var MainSlickSlider = (function () {

        var init = function () {
            var galleryTop = new Swiper('.product-preview__big-slider-container', {
                direction: 'horizontal',
                nextButton: '.product-preview__slider-big-next',
                prevButton: '.product-preview__slider-big-prev',
                spaceBetween: 10,
                slidesPerView: 1
            });
            var galleryThumbs = new Swiper('.product-preview__left-bar-container', {
                direction: 'vertical',
                slidesPerView: 'auto',
                spaceBetween: 30,
                centeredSlides: true,
                slideToClickedSlide: true,
                nextButton: '.product-preview__slider-thumb-next',
                prevButton: '.product-preview__slider-thumb-prev'
            });
            galleryTop.params.control = galleryThumbs;
            galleryThumbs.params.control = galleryTop;
        };

        return {
            init: init
        };

    })();

    var SelectScroll = (function () {

        var init = function () {
            if ($('.product-buy__drop-size')) {
                $('.product-buy__drop-size').select2({
                    containerCssClass: 'product-buy__drop-size-container',
                    dropdownCssClass: 'product-buy__drop-size-dropdown'
                })
                .on("select2:open", function () {
                    $('.select2-results__options').niceScroll({
                        cursorcolor:"#27979d",
                        cursoropacitymin: 1,
                        cursorborder: "0px solid #fff"
                    });
                    $(".select2-search--dropdown .select2-search__field").attr("placeholder", "Поиск размера");
                })
                .on("select2:close", function() {
                    $(".select2-search--dropdown .select2-search__field").attr("placeholder", null);
                });
            }
        };

        return {
            init: init
        };

    })();

    var Tabs = (function () {
        var changeTab = (e) => {
            if (!e.target.classList.contains(e.target.classList[0] + '_active')) {
                var oldId = document.querySelector('.' + e.target.classList[0] + '_active').getAttribute('data-id');
                document.querySelector('.' + e.target.classList[0] + '_active').classList.remove(e.target.classList[0] + '_active');
                e.target.classList.add(e.target.classList[0] + '_active');
                var id = e.target.getAttribute('data-id');
                document.querySelector('.js-tab-sections').children[oldId].classList.remove('product-buy__tab-content_active');
                document.querySelector('.js-tab-sections').children[id].classList.add('product-buy__tab-content_active');
            }
        };

        var init = () => {
            var tabs = document.querySelector('.js-tabs').children;
            var contents = document.querySelector('.js-tab-sections').children;
            var length = tabs.length;
            while (length--) {
                tabs[length].addEventListener('click', changeTab, false);
                tabs[length].setAttribute('data-id', length);
            }
            length = contents.length;
            while (length--) {
                contents[length].setAttribute('data-id', length);
            }
        };

        return {
            init
        };

    })();

    var Timer = (() => {

        var calculate = function (endtime) {
            var t = Date.parse(endtime) - Date.parse(new Date());
            var seconds = Math.floor( (t/1000) % 60 );
            var minutes = Math.floor( (t/1000/60) % 60 );
            var hours = Math.floor( (t/(1000*60*60)) % 24 );
            var days = Math.floor( t/(1000*60*60*24) );
            return {
                'total': t,
                'days': days,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds
            };
        };

        var init = function () {
            var deadline = document.querySelector('.js-timer').dataset.date;
            if (document.querySelector('.js-timer') && deadline)
                var timeinterval = setInterval(function(){
                    var t = calculate(deadline);
                    document.querySelector('.js-timer-days').innerHTML = t.days;
                    document.querySelector('.js-timer-hours').innerHTML = t.hours;
                    document.querySelector('.js-timer-minutes').innerHTML = t.minutes;
                    document.querySelector('.js-timer-sec').innerHTML = t.seconds;
                    if(t.total<=0){
                      clearInterval(timeinterval);
                    }
                },1000);

                calculate(deadline);
        };

        return {
            init: init
        };

    })();

    var StickyBuyBlock = (() => {

        var calculate = () => {
            var window_top = $(window).scrollTop();
            var div_top = $('.product-head').offset().top;
            if (window_top > div_top) {
                $('.product-buy').addClass('product-buy__style_fixed');
            } else {
                $('.product-buy__style_fixed').removeClass('product-buy__style_fixed');
            }
        };

        var init = () => {
            $(window).scroll(calculate);
            calculate();
        };

        return {
            init
        }

    })();

    $(document).ready(function() {
        ReviewPopup.init();
        ImagePreviewPopup.init();
        ToggleMainImage.init();
        SelectScroll.init();
        StickyBuyBlock.init();
        Tabs.init();
        Timer.init();
    });
    




    var resizeTimer;
    $(window).resize(function(e) {
        clearTimeout(resizeTimer);
        /**
         * Отрабатывает после завершения события ресайза
         */
        resizeTimer = setTimeout(function() {
            
        }, 250);
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJpbnRlcm5hbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuXHJcbiAgICAkKCcuanNfbWFpbi1zbGlkZXInKS5zbGljayh7XHJcbiAgICAgICAgc2xpZGU6ICcubWFpbi1zbGlkZXJfX2l0ZW0nLFxyXG4gICAgICAgIGluZmluaXRlOiB0cnVlLFxyXG4gICAgICAgIHNsaWRlc1RvU2hvdzogMSxcclxuICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgIHByZXZBcnJvdzogJzxidXR0b24gY2xhc3M9XCJtYWluLXNsaWRlcl9fYXJyb3ctcHJldlwiPicsXHJcbiAgICAgICAgbmV4dEFycm93OiAnPGJ1dHRvbiBjbGFzcz1cIm1haW4tc2xpZGVyX19hcnJvdy1uZXh0XCI+JyxcclxuICAgICAgICBkb3RzQ2xhc3M6ICdtYWluLXNsaWRlcl9fZG90cydcclxuICAgIH0pO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JPQu9C+0LHQsNC70YzQvdGL0LUg0L/QtdGA0LXQvNC10L3QvdGL0LUsINC60L7RgtC+0YDRi9C1INC40YHQv9C+0LvRjNC30YPRjtGC0YHRjyDQvNC90L7Qs9C+0LrRgNCw0YLQvdC+XHJcbiAgICAgKi9cclxuICAgIHZhciBnbG9iYWwgPSB7XHJcbiAgICAgICAgLy8g0LLRgNC10LzRjyDQtNC70Y8g0LDQvdC40LzQsNGG0LjQuVxyXG4gICAgICAgIHRpbWU6ICAyMDAsXHJcblxyXG4gICAgICAgIC8vINC60L7QvdGC0YDQvtC70YzQvdGL0LUg0YLQvtGH0LrQuCDQsNC00LDQv9GC0LjQstCwXHJcbiAgICAgICAgZGVza3RvcFhsU2l6ZTogMTU5OSxcclxuICAgICAgICBkZXNrdG9wTGdTaXplOiAxMzc5LFxyXG4gICAgICAgIGRlc2t0b3BTaXplOiAgIDExOTksXHJcbiAgICAgICAgdGFibGV0TGdTaXplOiAgIDk1OSxcclxuICAgICAgICB0YWJsZXRTaXplOiAgICAgNzY3LFxyXG4gICAgICAgIG1vYmlsZVNpemU6ICAgICA0NzksXHJcblxyXG4gICAgICAgIC8vINC/0YDQvtCy0LXRgNC60LAgdG91Y2gg0YPRgdGC0YDQvtC50YHRgtCyXHJcbiAgICAgICAgaXNUb3VjaDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBtZCA9IG5ldyBNb2JpbGVEZXRlY3Qod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpO1xyXG4gICAgICAgICAgICBpZiAobWQubW9iaWxlKCkgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgICQod2luZG93KS5sb2FkKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmIChnbG9iYWwuaXNUb3VjaCgpKSB7XHJcbiAgICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnbm8tdG91Y2gnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ25vLXRvdWNoJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoTW9kZXJuaXpyLmZsZXhib3gpIHtcclxuICAgICAgICAgICAgLy8gTW9kZXJuIEZsZXhib3ggd2l0aCBgZmxleC13cmFwYCBpcyBzdXBwb3J0ZWRcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBmbGV4aWJpbGl0eShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpO1xyXG4gICAgICAgIH0gXHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9C+0LTQutC70Y7Rh9C10L3QuNC1IGpzIHBhcnRpYWxzXHJcbiAgICAgKi9cclxuICAgIEBAaW5jbHVkZSgncGFydGlhbHMvcGFydGlhbHMuanMnKVxyXG5cclxuXHJcbiAgICB2YXIgcmVzaXplVGltZXI7XHJcbiAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBjbGVhclRpbWVvdXQocmVzaXplVGltZXIpO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqINCe0YLRgNCw0LHQsNGC0YvQstCw0LXRgiDQv9C+0YHQu9C1INC30LDQstC10YDRiNC10L3QuNGPINGB0L7QsdGL0YLQuNGPINGA0LXRgdCw0LnQt9CwXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcmVzaXplVGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9LCAyNTApO1xyXG4gICAgfSk7XHJcbn0pOyJdLCJmaWxlIjoiaW50ZXJuYWwuanMifQ==
