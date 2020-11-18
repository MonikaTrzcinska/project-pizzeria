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
    //console.log('choose table widget', thisWidget);
    thisWidget.dom.tables = document.querySelectorAll(select.booking.tables);
    //console.log('stoliki:', thisWidget.dom.tables);
    thisWidget.value = parseInt('0');

    for (let table of thisWidget.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      table.addEventListener('click', function () {
        if (table.classList.contains(classNames.booking.tableBooked)) {
          console.log('this table is already booked:', tableId);
        }
        else {
          if (table.classList.contains(classNames.booking.tableSelected)) {
            table.classList.remove(classNames.booking.tableSelected);
            console.log('you didnt choose any table');
          }
          else {
            thisWidget.clearTables();
            table.classList.add(classNames.booking.tableSelected);
            console.log('Table Id:', tableId);
            thisWidget.value = parseInt(tableId);
            console.log('chosen tables:', thisWidget.value);
          }
        }
      });
    }
  }



  clearTables() {
    const thisWidget = this;
    thisWidget.dom.tables = document.querySelectorAll(select.booking.tables);

    for (let table of thisWidget.dom.tables) {
      if (table.classList.contains(classNames.booking.tableSelected)) {
        table.classList.remove(classNames.booking.tableSelected);
      }
    }
    console.log('clearTables()');
  }

}

export default TablePicker;
