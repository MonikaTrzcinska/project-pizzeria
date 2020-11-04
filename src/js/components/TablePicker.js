//import BaseWidget from './BaseWidget.js';
import { select, settings, classNames } from '../settings.js';

class TablePicker {
  constructor(wrapper) {
    const thisWidget = this;
    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapper;
    thisWidget.chooseTable();
  }

  chooseTable() {
    const thisWidget = this;
    console.log('choose table widget', thisWidget);
    thisWidget.dom.tables = document.querySelectorAll(select.booking.tables);
    console.log('stoliki:', thisWidget.dom.tables);

    for (let table of thisWidget.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      table.addEventListener('click', function () {
        if (table.classList.contains(classNames.booking.tableBooked)) {
          console.log('this table is booked already:', tableId);
        }
        else {
          table.classList.add(classNames.booking.tableSelected);
          console.log('chosen table:', tableId);
        }
      });
    }

    //for (let table of thisBooking.dom.tables) {
    //let tableId = table.getAttribute(settings.booking.tableIdAttribute);
    //if (!isNaN(tableId)) {
    //tableId = parseInt(tableId);
    //};
    //table.addEventListener('click', function () {
    //table.classList.add(classNames.booking.tableBooked);
    //});
    //}
  }

}

export default TablePicker;
