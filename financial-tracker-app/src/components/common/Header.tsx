export class Header {
    constructor() {
        this.createHeader();
    }

    createHeader() {
        const header = document.createElement('header');
        header.innerHTML = `
            <h1>Financial Tracker</h1>
            <nav>
                <ul>
                    <li><a href="#dashboard">Dashboard</a></li>
                    <li><a href="#accounts">Accounts</a></li>
                    <li><a href="#transactions">Transactions</a></li>
                </ul>
            </nav>
        `;
        document.body.appendChild(header);
    }
}