const Contato = require('../models/ContatoModel')
const contatos = require('../models/ContatoModel')

module.exports.index = async (req, res) => {
    const contato = new Contato()
    const contatos = await contato.busca()
    res.render('index', {contatos})
}
