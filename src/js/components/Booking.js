import { select, templates, settings, classNames } from '../settings.js';
import { utils } from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';
import TablePicker from './TablePicker.js';


class Booking {
  constructor(wrapper) {
    const thisBooking = this;
    thisBooking.render(wrapper);
    thisBooking.initWidgets();
    thisBooking.getData();
  }

  getData() {   // pobiera dane z API
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };

    const urls = {
      // http://localhost:3131/booking?date_gte=2019-01-01&date_lte=2019-12-31
      booking: settings.db.url + '/' + settings.db.booking
        + '?' + params.booking.join('&'),
      // http://localhost:3131/event?repeat=false&date_gte=2019-01-01&date_lte=2019-12-31
      eventsCurrent: settings.db.url + '/' + settings.db.event
        + '?' + params.eventsCurrent.join('&'),
      // http://localhost:3131/event?repeat_ne=false&date_lte=2019-12-31
      eventsRepeat: settings.db.url + '/' + settings.db.event
        + '?' + params.eventsRepeat.join('&'),
    };

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function (allResponses) {
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function ([bookings, eventsCurrent, eventsRepeat]) {
        // console.log(bookings);
        // console.log(eventsCurrent);
        // console.log(eventsRepeat);

        thisBooking.parsData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parsData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;

    thisBooking.booked = {};

    for (let item of bookings) {
      thisBooking.makeBooked(item.data, item.hour, item.duration, item.table);
    }
    for (let item of eventsCurrent) {
      thisBooking.makeBooked(item.data, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for (let item of eventsRepeat) {
      if (item.repeat == 'daily') {
        for (let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)) {
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }
    // console.log('thisBooking.booked', thisBooking.booked);
    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for (let hourBlock = 0; hourBlock < startHour + duration; hourBlock += 0.5) {
      //console.log('loop', hourBlock);

      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  updateDOM() {
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable = false;

    if (
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ) {
      allAvailable = true;
    }

    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      table.classList.remove(classNames.booking.tableSelected);
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }

      if (
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }

  /*getStarters() {
    const thisBooking = this;
    thisBooking.starters = [];
    const checks = document.queryselectorAll([name = starter]);
    for (let check of checks) {
      if (check.checked) {
        thisBooking.starters.push = [check.value];
      }
    }
  } */

  sendBooking() {
    const thisBooking = this;
    //const url = settings.db.url + '/' + settings.db.booking;
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(select.cart.address);
    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(select.cart.phone);
    thisBooking.dom.hours = thisBooking.dom.wrapper.querySelector(select.booking.hours);
    thisBooking.dom.people = thisBooking.dom.wrapper.querySelector(select.booking.people);

    const payload = {
      address: thisBooking.dom.address.value,
      phone: thisBooking.dom.phone.value,
      date: thisBooking.datePicker.value,
      hour: thisBooking.hourPicker.value,
      people: thisBooking.dom.people.value,
      duration: thisBooking.dom.hours.value,
      tableId: thisBooking.tablePicker.value,
      starters: thisBooking.starters,
    };
    console.log('booking send:', payload);

    /*const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function (responese) {
        return responese.json();
      })
      .then(function (parsedResponse) {
        console.log('parsedResponse for booking', parsedResponse);
      });*/
  }

  render(wrapper) {
    const thisBooking = this;
    /* generować kod HTML za pomocą szablonu templates.bookingWidget bez podawanie mu jakiegokolwiek argumentu */
    const generatedHTML = templates.bookingWidget();
    /* tworzyć pusty obiekt thisBooking.dom */
    thisBooking.dom = {};
    /*zapisywać do tego obiektu właściwość wrapper równą otrzymanemu argumentowi */
    thisBooking.dom.wrapper = wrapper;
    /*zawartość wrappera zamieniać na kod HTML wygenerowany z szablonu */
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    /*we właściwości thisBooking.dom.peopleAmount zapisywać pojedynczy element znaleziony we wrapperze i pasujący do selektora select.booking.peopleAmount */
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    /*analogicznie do peopleAmount znaleźć i zapisać element dla hoursAmount */
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.dom.submit = thisBooking.dom.wrapper.querySelector('.booking-form');
  }

  initWidgets() {
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    thisBooking.tablePicker = new TablePicker(thisBooking.dom.tablePicker);

    thisBooking.dom.submit.addEventListener('submit', function (event) {
      event.preventDefault;
      thisBooking.sendBooking();
    });

    thisBooking.dom.wrapper.addEventListener('updated', function () {
      thisBooking.updateDOM();
    });

  }
}

export default Booking;
