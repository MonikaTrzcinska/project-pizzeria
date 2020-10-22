import { select, templates } from '../settings.js';
import { utils } from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Booking {
  constructor(element) {
    const thisBooking = this;
    thisBooking.render(element);
    thisBooking.initWidgets();

  }

  render() {
    const thisBooking = this;
    /* generować kod HTML za pomocą szablonu templates.bookingWidget bez podawanie mu jakiegokolwiek argumentu */
    const generatedHTML = templates.bookingWidget();
    /* tworzyć pusty obiekt thisBooking.dom */
    thisBooking.dom = {};
    /*zapisywać do tego obiektu właściwość wrapper równą otrzymanemu argumentowi */
    thisBooking.dom.wrapper = thisBooking.element;
    /*zawartość wrappera zamieniać na kod HTML wygenerowany z szablonu */
    thisBooking.dom.wrapper = utils.createDOMFromHTML(generatedHTML);
    /*we właściwości thisBooking.dom.peopleAmount zapisywać pojedynczy element znaleziony we wrapperze i pasujący do selektora select.booking.peopleAmount */
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    /*analogicznie do peopleAmount znaleźć i zapisać element dla hoursAmount */
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
  }

  initWidgets() {
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
  }
}

export default Booking;
