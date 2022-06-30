var app = new Vue({
    el: '#app',
    data: {
        users: [],
        newUsers: [],
        foption: '',
        soption: '',
        userinput: '',
        passinput: '',
        pos: '',
    },
    methods: {
        async listUsers(){

            await fetch('https://randomuser.me/api/?results=10')
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
        login(){
            if (this.userinput.length > 0 && this.passinput.length > 0) {
                const index = this.users.findIndex((object) => {
                    return object.login.username == this.userinput;
                });
    
                if(index != -1 && this.passinput === this.users[index].login.password){
                    this.pos = index;
                    this.updateLocalStorage();
                    this.mensaje("Login success", "success");

                    setTimeout(function(){ location.href = "index.html" }, 1500);

                }else{
                    this.mensaje("Wrong user or password", "error");
                }
            }else{
                this.mensaje("User and password are required", "error");
            }
        },
        logout(){
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false
            })       
            swalWithBootstrapButtons.fire({
                title: 'Do you want to logout?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, logout',
                cancelButtonText: 'Cancel',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    this.pos = '';
                    this.updateLocalStorage();
                    this.mensaje("Successfully logged out", "success");
                    setTimeout(function(){ location.href = "login.html" }, 1500);
                } else if (
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                }
            })
        },
        mensaje: function (msj, icono) {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-center',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: icono,
                title: msj
            })
        },
        updateLocalStorage(){
            localStorage.setItem('users', JSON.stringify(this.newUsers));
            localStorage.setItem('mainusers', JSON.stringify(this.users));
            localStorage.setItem('index', JSON.stringify(this.pos));
        },
        
    },
    created() {
        if (localStorage.getItem('users') !== null) {
            this.newUsers = JSON.parse(localStorage.getItem('users'));
            this.users = JSON.parse(localStorage.getItem('mainusers'));
            this.pos = JSON.parse(localStorage.getItem('index'));
        }else{
            this.listUsers();
            this.pos = this.pos
        }
    },
});
