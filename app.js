class Utilities {
    static generateId() {
        let increment = 1
        return function () {
            return increment++

        }
    }

    static renderPage() {
        // register
        const $registerForm = document.getElementById('registerForm');
        const $inputName = document.getElementById('user_name');
        const $inputEmail = document.getElementById('user_email');
        const $inputPassword = document.getElementById('user_password');
        const $buttonRegister = document.getElementById('button_register');
        const $buttonAdmin = document.getElementById('button_register_admin');
        

        // admin
            $buttonAdmin.addEventListener('click', (e) => {
                e.preventDefault();
                if (!$inputName.value || !$inputEmail.value || !$inputPassword.value) {
                    alert('You should fill all the fields');
                    return;
                }
                const promptKey = Number(prompt("Enter Admin Key"))
                if (!promptKey) {
                    alert('You should enter a key')
                    return;
                }
                if (promptKey !== 123456){
                    alert("Invalid Key")
                    return;
                }

                AdminUser.createAdminUser(promptKey, $inputName.value, $inputEmail.value, $inputPassword.value);
                $inputName.value = "";
                $inputEmail.value = "";
                $inputPassword.value = "";
            });

        // user
        document.addEventListener('DOMContentLoaded', () => {
            $buttonRegister.addEventListener('click', (e) => {
                e.preventDefault();
                if (!$inputName.value || !$inputEmail.value || !$inputPassword.value) {
                    alert('You should fill all the fields')
                } else {
                    Person.createUser($inputName.value, $inputEmail.value, $inputPassword.value);
                    $inputName.value = "";
                    $inputEmail.value = "";
                    $inputPassword.value = "";
                    // return;
                }

            });

        //login
        const $loginForm = document.getElementById('loginForm');
        const $loginEmail = document.getElementById('login_email');
        const $loginPassword = document.getElementById('login_password');
        $loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = localStorage.getItem('users')
            if (!user) {
                alert('There are no users registered')
            } else {
                const users = JSON.parse(user);
                const admin = users.find(user => user.role === "admin")
                if (admin){
                    // console.log("si es admin")
                    if (admin.email === $loginEmail.value && admin.password === $loginPassword.value) {
                        alert("Logged as admin")
                    } else {
                        alert("Invalid email or password")
                    }
                }
            }
        })
        
        

        }); //Cierre DomContentLoaded

    };


    static newId = Utilities.generateId();
}

Utilities.renderPage();

class Person {
    static users = [];
    constructor(name, email, password) {
        this.id = Utilities.newId()
        this.name = name
        this.email = email
        this.password = password
        this.role = "costumer"

    }

    static createUser(name, email, password) {
        const newUser = new RegularUser(name, email, password)
        Person.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
    }


}

class RegularUser extends Person {
    constructor(id, name, email, password) {
        super(id, name, email, password);
    }
}

class AdminUser extends Person {
    static #adminKey = 123456
    constructor(name, email, password) {
        super(name, email, password);
        this.role = "admin";

    }


    static createAdminUser(adminKeySent, name, email, password) {
        if (adminKeySent === this.#adminKey) {
            const newAdmin = new AdminUser(name, email, password);
            this.users.push(newAdmin)
            localStorage.setItem('users', JSON.stringify(Person.users));
        } else {
            throw new Error('Invalid Admin Key');
        }
    }

}


class Book {
    static books = []
    constructor(startDate, endDate, userId, price, peopleNumber) {
        this.id = Utilities.newId();
        this.startDate = startDate
        this.endDate = endDate
        this.userId = userId
        this.price = price
        this.peopleNumber = peopleNumber

    }

    static createBook(startDate, endDate, userId, peopleNumber) {
        const user = Person.users.find(user => user.id === userId);
        if (!user) throw new Error('User not found');

        if (user.role === "admin") {
            const newBook = new Book(startDate, endDate, userId, 200, peopleNumber);
            this.books.push(newBook)
        } else {
            const newBook = new Book(startDate, endDate, userId, 200, 1);
            this.books.push(newBook)
        }
    }

}