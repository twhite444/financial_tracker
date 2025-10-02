import React from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { PaymentReminder } from '../../models/PaymentReminder';

interface PaymentCalendarProps {
    paymentReminders: PaymentReminder[];
}

interface PaymentCalendarState {
    date: Date;
}

export class PaymentCalendar extends React.Component<PaymentCalendarProps, PaymentCalendarState> {
    constructor(props: PaymentCalendarProps) {
        super(props);
        this.state = {
            date: new Date(),
        };
    }

    onChange = (date: Date) => {
        this.setState({ date });
    };

    render() {
        const { paymentReminders } = this.props;
        const { date } = this.state;

        const remindersForSelectedDate = paymentReminders.filter(reminder => 
            new Date(reminder.dueDate).toDateString() === date.toDateString()
        );

        return (
            <div>
                <h2>Payment Calendar</h2>
                <Calendar
                    onChange={this.onChange}
                    value={date}
                />
                <div>
                    <h3>Reminders for {date.toDateString()}:</h3>
                    <ul>
                        {remindersForSelectedDate.length > 0 ? (
                            remindersForSelectedDate.map(reminder => (
                                <li key={reminder.id}>
                                    Due: {reminder.amount} on {reminder.dueDate}
                                </li>
                            ))
                        ) : (
                            <li>No reminders for this date.</li>
                        )}
                    </ul>
                </div>
            </div>
        );
    }
}