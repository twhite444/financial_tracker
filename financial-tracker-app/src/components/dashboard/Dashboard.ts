export class Dashboard {
    constructor() {
        this.init();
    }

    init() {
        this.render();
    }

    render() {
        const dashboardContainer = document.createElement('div');
        dashboardContainer.className = 'dashboard';

        const header = this.createHeader();
        const accountList = this.createAccountList();
        const transactionList = this.createTransactionList();
        const paymentCalendar = this.createPaymentCalendar();

        dashboardContainer.appendChild(header);
        dashboardContainer.appendChild(accountList);
        dashboardContainer.appendChild(transactionList);
        dashboardContainer.appendChild(paymentCalendar);

        document.body.appendChild(dashboardContainer);
    }

    createHeader() {
        const header = document.createElement('h1');
        header.innerText = 'Financial Tracker Dashboard';
        return header;
    }

    createAccountList() {
        const accountList = document.createElement('div');
        accountList.className = 'account-list';
        accountList.innerText = 'Account List Component Placeholder';
        return accountList;
    }

    createTransactionList() {
        const transactionList = document.createElement('div');
        transactionList.className = 'transaction-list';
        transactionList.innerText = 'Transaction List Component Placeholder';
        return transactionList;
    }

    createPaymentCalendar() {
        const paymentCalendar = document.createElement('div');
        paymentCalendar.className = 'payment-calendar';
        paymentCalendar.innerText = 'Payment Calendar Component Placeholder';
        return paymentCalendar;
    }
}