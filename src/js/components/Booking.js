import { select, templates } from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';

class Booking {
  constructor(element) {
    const thisBooking = this;
    thisBooking.render(element);
    thisBooking.initWidgets();

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
  }

  initWidgets() {
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicked = new DatePicker(thisBooking.dom.datePicker);
  }
}

export default Booking;
