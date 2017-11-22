import React, {Component} from 'react';
import moment from 'moment';

class Week extends Component {

  render() {
    let days = [],
      date = this.props.date,
      month = this.props.month;

    for (let i = 0; i < 7; i++) {
      const isBefore = date.isBefore(moment("2017-03-01"));
      let day = {
        name: date.format("dd").substring(0, 1),
        number: date.date(),
        lastMonth: date.month() <= month.month(),
        isCurrentMonth: date.month() === month.month(),
        nextMonth: date.month() >= month.month(),
        disableMonth: date.month() >= month.month(),
        isToday: date.isSame(new Date(), "day"),
        disable: date.isAfter(new Date(), "day") || isBefore,
        date: date
      };
      let _className = "rc-calendar-cell" +
        (day.isToday ? " rc-calendar-today" : "") +
        (day.date.isSame(this.props.selected) ? " rc-calendar-selected-day" : "");
      if (!day.isCurrentMonth) {
        _className +=
          (day.lastMonth ? " rc-calendar-last-month-cell" : "") +
          (day.nextMonth ? " rc-calendar-next-month-btn-day" : "");
      }
      _className += (day.disable ? " rc-calendar-disabled-cell" : "");
      const title = day.date.format('YYYY-MM-DD');
      days.push(
        <td role="gridcell" title={title} className={_className}
            key={day.date.toString()}>
          <div className="rc-calendar-date"
               onClick={day.disable ? null : this.props.select.bind(this, day)}>
            {day.number}
          </div>
        </td>
      );
      date = date.clone();
      date.add(1, "d");
    }

    return (
      <tr role="row" key={days[0].toString()}>
        {days}
      </tr>
    )
  }
}


export default Week;

