const mongoose = require('mongoose') 
const validator = require('validator') 

const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  telefone: { type: String, required: false, default: '' },
  criadoEm: { type: Date, default: Date.now },
}) 

const ContatoModel = mongoose.model('Contato', ContatoSchema) 

class Contato{
    constructor(body){
        this.body = body
        this.error = []
        this.contato = null
    }

    async register(){
        this.valida() 
        if(this.error.length > 0) return 
        this.contato = await ContatoModel.create(this.body) 
    }

    valida(){
        this.cleanUp() 
        // Validação
        // O e-mail precisa ser válido
        if(this.body.email && !validator.isEmail(this.body.email)) this.error.push('E-mail inválido') 
        if(!this.body.nome) this.error.push('Nome é um campo obrigatório.') 
        if(!this.body.email && !this.body.telefone) {
            this.error.push('Pelo menos um contato precisa ser enviado: e-mail ou telefone.') 
        }
    }

    cleanUp(){
        for(const key in this.body) {
            if(typeof this.body[key] !== 'string') {
              this.body[key] = '' 
            }
        }
        
        this.body = {
            nome: this.body.nome,
            sobrenome: this.body.sobrenome,
            email: this.body.email,
            telefone: this.body.telefone,
        } 
    }

    async buscaPorId(id){
        if(typeof id !== 'string') return
        const contato = await ContatoModel.findById(id)
        return contato
    }

    async edit(id){
        if(typeof id !== 'string') return
        this.valida()
        if(this.error.length > 0) return
        this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, {new: true})
    }
    
    async busca(){
        const contatos = await ContatoModel.find()
        return contatos
    }

    async delete(id){
        if(typeof id !== 'string') return
        const contato = await ContatoModel.findByIdAndDelete({_id: id})
        return contato
    }
}

module.exports = Contato