/* global rangeSlider */

import BaseWidget from './BaseWidget.js';
import { select, settings } from '../settings.js';
import { utils } from '../utils.js';

class HourPicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, settings.hours.open);
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);
    thisWidget.initPlugin();
    thisWidget.value = thisWidget.dom.input.value;

  }

  initPlugin() {
    const thisWidget = this;
    rangeSlider.create(thisWidget.dom.input);
    thisWidget.dom.input.addEventListener('input', function () {
      thisWidget.value = thisWidget.dom.input.value;
    });

  }

  parseValue() {
    const thisWidget = this;
    const pickedHour = utils.numberToHour(thisWidget.value);
    // console.log('picked hour', pickedHour);
    return pickedHour;
  }

  isValid() {
    const thisWidget = this;
    thisWidget.isValid = true;
    // console.log(thisWidget.isValid);
    return thisWidget.isValid;
  }

  renderValue() {
    const thisWidget = this;
    thisWidget.dom.output = thisWidget.value;
    // console.log('output:', thisWidget.dom.output);
  }
}

export default HourPicker;
