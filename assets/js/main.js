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
        display: 0,
        //modal info
        mname: '',
        mlastname: '',
        musername: '',
        mpass: '',
        memail: '',
        changepass: 0,
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
            if (this.foption === 'all') {//TODO: solve the position bug and filter and search bug
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
        triggermanage(){
            if (this.display == 0) {
                this.display = 1;
            }else{
                this.display = 0;
            }
        },
        update(item){
            /*
                mname: '',
                musername: '',
                mpass: '',
                memail: '',
            */

            this.mname = item.name.first;
            this.mlastname = item.name.last;
            this.musername = item.login.username
            this.memail = item.email;
            
        },
        enablepass(){
            this.changepass = 1;
        },
        disablepass(){
            this.changepass = 0;
            this.mpass = '';
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
        }else{
            this.listUsers();
        }
        if (localStorage.getItem('index') !== null) {
            this.pos = JSON.parse(localStorage.getItem('index'));
        }else{
            this.pos = this.pos
        }
    },
});
