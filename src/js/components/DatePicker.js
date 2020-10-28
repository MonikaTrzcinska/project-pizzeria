/* global flatpickr */

import BaseWidget from './BaseWidget.js';
import { select, settings } from '../settings.js';
import { utils } from '../utils.js';

class DatePicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelectorAll(select.widgets.datePicker.input);
    thisWidget.initPlugin();
  }

  initPlugin() {
    const thisWidget = this;

    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);
    flatpickr(thisWidget.dom.input, {
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      disable: [
        function (date) {
          // return true to disable
          return (date.getDay() === 1);
        }
      ],
      locale: {
        firstDayOfWeek: 1 // start week on Monday
      },
      // instance.config.onChange.push(function() { } ),
    });
  }

  parseValue(value) {
    const thisWidget = this;
    thisWidget.value = value;
  }

  isValid() {
    const thisWidget = this;
    thisWidget.isValid = true;
    return thisWidget.isValid;
  }
}

export default DatePicker;
