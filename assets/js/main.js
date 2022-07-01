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
        newpass2: '',
        oldpass: '',
        memail: '',
        changepass: 0,
        updindex: '',
        actualpass: '',
        newUser: [
            {
                gender: '',
                name: {
                    first: '',
                    last: ''
                },
                email: '',
                location: {
                    city: '',
                    country: '',
                },
                login: {
                    username: '',
                    password: '',
                },
                dob: {
                    age: '',
                },
                cell: ''
            }
        ],
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
                const index = this.newUsers.findIndex((object) => {
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
                            if (this.newpass === this.newpass2) {
                                this.newUsers[this.updindex].login.password = this.newpass;
                                this.newUsers[this.updindex].name.first= this.mname;
                                this.newUsers[this.updindex].name.last = this.mlastname;
                                this.newUsers[this.updindex].login.username = this.musername;
                                this.newUsers[this.updindex].email = this.memail;
                                this.disablepass();
                                this.updateLocalStorage();
                                this.mensaje("Changes have been made", "success");
                            }else{
                                this.mensaje("Both new passwords doesn't match", "error");
                            }
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
        delUser(index){
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false
            })       
            swalWithBootstrapButtons.fire({
                title: 'Are you sure?',
                text: "This is a permanent action!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Delete',
                cancelButtonText: 'No, Cancel',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    this.newUsers.splice(index, 1);
                    this.updateLocalStorage();
                    this.mensaje("User deleted successfully", "success");
                } else if (
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                }
            });
        },
        addUser(){
            if (
                this.newUser[0].gender.length > 0 && this.newUser[0].name.first.length > 0 && this.newUser[0].name.last.length > 0 &&
                this.newUser[0].location.city.length > 0 && this.newUser[0].location.country.length > 0 && this.newUser[0].login.username.length > 0
                && this.newUser[0].login.password.length > 0 && this.newUser[0].dob.age > 0 && this.newUser[0].cell.length > 0
                ) {
                    
                    function random(min, max) {
                        return Math.floor((Math.random() * (max - min + 1)) + min);
                    }
                    const randomimg = random(1, 100);
                    let gender
                    switch (this.newUser[0].gender) {//convert the user gender in order to be compatible with the picture endpoint from API
                        case "male":
                            gender = 'men';
                            break;
                        
                        case "female":
                            gender = 'women';
                            break;

                        default:
                            break;
                    }

                    this.newUsers.push({
                        gender: this.newUser[0].gender,
                        name: {
                            first: this.newUser[0].name.first,
                            last: this.newUser[0].name.last
                        },
                        location: {
                            city: this.newUser[0].location.city,
                            country: this.newUser[0].location.country
                        },
                        email: this.newUser[0].email,
                        login: {
                            username: this.newUser[0].login.username,
                            password: this.newUser[0].login.password,
                        },
                        dob: {
                            age: this.newUser[0].dob.age,
                        },
                        cell: this.newUser[0].cell,
                        picture: {
                            large: `https://randomuser.me/api/portraits/${gender}/${randomimg}.jpg`,
                            thumbnail: `https://randomuser.me/api/portraits/thumb/${gender}/${randomimg}.jpg`
                        },
                        nat: this.newUser[0].location.country,
                        flag: `https://countryflagsapi.com/png/${this.newUser[0].location.country}`
                    });
                    this.updateLocalStorage();
                    this.resetfields();//reset the fields for newUser array
                    this.mensaje("The user was successfully created", "success");

            }else{
                this.mensaje("Please fill every field", "error");
            }
        },
        resetfields(){
            this.newUser = [
                {
                    gender: '',
                    name: {
                        first: '',
                        last: ''
                    },
                    location: {
                        city: '',
                        country: '',
                    },
                    login: {
                        username: '',
                        password: '',
                    },
                    dob: {
                        age: '',
                    },
                    cell: ''
                }
            ];
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
            this.users = this.users;
        }
        if (localStorage.getItem('index') !== null) {
            this.pos = JSON.parse(localStorage.getItem('index'));
        }else{
            this.pos = this.pos
        }
    },
});
