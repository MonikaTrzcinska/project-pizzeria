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
    thisWidget.value = [];

    for (let table of thisWidget.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      table.addEventListener('click', function () {
        if (table.classList.contains(classNames.booking.tableBooked)) {
          console.log('this table is already booked:', tableId);
        }
        else {
          table.classList.toggle(classNames.booking.tableSelected);
          if (table.classList.contains(classNames.booking.tableSelected)) {
            thisWidget.value.push(tableId);
            console.log('chosen tables:', thisWidget.value);
          }
          else {
            const IndexOfRemovedTable = thisWidget.value.indexOf(tableId);
            thisWidget.value.splice(IndexOfRemovedTable, 1);
            console.log('chosen tables:', thisWidget.value);
          }
        }
      });
    }
  }

}

export default TablePicker;
