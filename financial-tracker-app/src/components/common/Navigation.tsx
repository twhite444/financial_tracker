class Navigation {
    constructor() {
        this.menuItems = [
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'Accounts', path: '/accounts' },
            { name: 'Transactions', path: '/transactions' },
            { name: 'Settings', path: '/settings' },
        ];
    }

    render() {
        const nav = document.createElement('nav');
        const ul = document.createElement('ul');

        this.menuItems.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${item.path}">${item.name}</a>`;
            ul.appendChild(li);
        });

        nav.appendChild(ul);
        return nav;
    }
}

export default Navigation;