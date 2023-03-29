const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const RegisterSchema = new mongoose.Schema({
    email: {type: String, require: true},
    password: {type: String, require: true}
})

const RegisterModel = mongoose.model('Register', RegisterSchema)

class Register{
    constructor(body){
        this.body = body
        this.error = []
        this.user = null
    }

    async register(){
        this.valida()
        if(this.error.length > 0) return

        await this.userExist()

        if(this.error.length > 0) return

        
            const salt = bcrypt.genSaltSync()
            this.body.password = bcrypt.hashSync(this.body.password, salt)
            this.user = await RegisterModel.create(this.body)
        
            return 
    }

    async userExist(){
        const user = await RegisterModel.findOne({email: this.body.email})
        if(user) this.error.push('Este usuario ja esta cadastrado')

    }

    valida(){
        this.cleanUp()
        //valida email
        if(!validator.isEmail(this.body.email)) this.error.push('Email invalido')
        //valida password
        if(this.body.password.length < 3 || this.body.password.length > 10){
            this.error.push('A senha deve conter enter 3 e 10 caracteres')
        }
    }

    cleanUp(){
        for(let keys in this.body){
            if(typeof this.body[keys] !== 'string'){
                this.body[keys] = ''
            }
        }

        this.body = {
            email:this.body.email,
            password:this.body.password
        }
    }

}

class Login{
    constructor(body){
        this.body = body
        this.error = []
        this.user = null
    }

    async verifica(){
        this.valida()
        if(this.error.length > 0) return
    
        this.user = await RegisterModel.findOne({email: this.body.email})
        if(!this.user){
            this.error.push('Este usuario não existe')
            return
        }
        if(!bcrypt.compareSync(this.body.password, this.user.password)) {
            this.error.push('Senha inválida');
            this.user = null;
            return;
          }
        return

    }

    valida(){
        this.cleanUp()
        if(!validator.isEmail(this.body.email)){
            this.error.push('email invalido')
        }
        if(this.body.password.length < 3 || this.body.password.length > 10){
            this.error.push('A senha deve conter enter 3 e 10 caracteres')
        }
    }

    cleanUp(){
        for(let keys in this.body){
            if(typeof this.body[keys] !== 'string'){
                this.body[keys] = ''
            }
        }

        this.body = {email: this.body.email, password: this.body.password}

    }
}

module.exports = {Register,Login}