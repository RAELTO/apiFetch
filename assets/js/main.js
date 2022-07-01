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
        newpass: '',
        oldpass: '',
        memail: '',
        changepass: 0,
        updindex: '',
        actualpass: '',
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
    
                if(index != -1 && this.passinput === this.newUsers[index].login.password){
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
        update(index){
            this.updindex = index;
            this.mname = this.newUsers[index].name.first;
            this.mlastname = this.newUsers[index].name.last;
            this.musername = this.newUsers[index].login.username;
            this.memail = this.newUsers[index].email;
            this.actualpass = this.newUsers[index].login.password;
        },
        saveUpdate(index){
            if (this.mname.length > 0 && this.mlastname.length > 0 
                && this.musername.length > 0 && this.memail.length > 0) {
                if (this.changepass === 1) {
                    if (this.oldpass === this.newUsers[this.updindex].login.password) {
                        if (this.newpass.length >= 8) {
                            this.newUsers[this.updindex].login.password = this.newpass;
                            this.newUsers[this.updindex].name.first= this.mname;
                            this.newUsers[this.updindex].name.last = this.mlastname;
                            this.newUsers[this.updindex].login.username = this.musername;
                            this.newUsers[this.updindex].email = this.memail;
                            this.disablepass();
                            this.updateLocalStorage();
                            this.mensaje("Changes have been made", "success");
                        }else{
                            this.mensaje("The new password must have at least 8 characters", "error");
                        }
                    }else{
                        this.mensaje("Old password do not match with actual password", "error");
                    }
                }else{
                    this.newUsers[index].name.first= this.mname;
                    this.newUsers[index].name.last = this.mlastname;
                    this.newUsers[index].login.username = this.musername;
                    this.newUsers[index].email = this.memail;
                    this.updateLocalStorage();
                    this.mensaje("Changes have been made", "success");
                }
            }else{
                this.mensaje("Please fill every field", "error");
            }
        },
        enablepass(){
            this.changepass = 1;
        },
        disablepass(){
            this.changepass = 0;
            this.newpass = '';
            this.oldpass = '';
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
