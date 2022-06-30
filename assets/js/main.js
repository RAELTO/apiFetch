var app = new Vue({
    el: '#app',
    data: {
        users: [],
        newUsers: [],
        foption: '',
        soption: '',
    },
    methods: {
        async listUsers(){

            await fetch('https://randomuser.me/api/?results=8')
                .then(response => response.json())
                .then(data => this.users = data);

            this.users = this.users.results.map(e => {
                return{
                    ...e,
                    flag: `https://countryflagsapi.com/png/${e.nat}`
                }
            });

            this.newUsers = this.users;

            this.updateLocalStorage();

        },
        filter(){
            if (this.foption === 'all') {
                this.newUsers = this.users;
                this.updateLocalStorage();
            }else{
                this.newUsers = this.users.filter(e => e.gender === this.foption);
                this.updateLocalStorage();
            }
        },
        search(){
            this.newUsers = this.users.filter(e => e.name.first.toLowerCase().includes(this.soption.toLowerCase()));
        },
        updateLocalStorage(){
            localStorage.setItem('users', JSON.stringify(this.newUsers));
            localStorage.setItem('mainusers', JSON.stringify(this.users));
        },
        
    },
    created() {
        if (localStorage.getItem('users') !== null) {
            this.newUsers = JSON.parse(localStorage.getItem('users'));
            this.users = JSON.parse(localStorage.getItem('mainusers'));
        }else{
            this.listUsers();
        }
    },
});
