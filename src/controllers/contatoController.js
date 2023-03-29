const { async } = require('regenerator-runtime')
const Contato = require('../models/ContatoModel')

exports.index = function (req, res){
    res.render("contato", {contato:{}})
}

exports.register = async function (req, res){
    try {
        const contato = new Contato(req.body)
        await contato.register()
        if(contato.error.length > 0 ){
            req.flash('error', contato.error)
            req.session.save(() => res.redirect('/contato/index')) 
            return
        }
        req.flash('sucess', 'Contato registrado com sucesso.')
        req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`)) 
        return
    }catch(e){
        res.render('404')
    }
  }

exports.editIndex = async function(req, res){
    try{
        if(!req.params.id) return res.render('404')
        const contato = new Contato()
        const contatoPorID = await contato.buscaPorId(req.params.id)
        if(!contatoPorID)  return res.render('404')
        res.render('contato', {contato: contatoPorID})
    }catch(e){
        res.render('404')
    }
}

exports.edit = async function(req, res){
    try {
        if(!req.params.id) return res.render('404')
        const contato = new Contato(req.body)
        await contato.edit(req.params.id)
        if(contato.error.length > 0){
            req.flash('error', contato.error)
            req.session.save(() => res.redirect(`/contato/index/${req.params.id}`))
            return
        }
        req.flash('sucess', 'Contato editado com sucesso.')
        req.session.save(() => res.redirect(`/contato/index`)) 
        return
    } catch (e) {
        res.render('404')
    }
}

exports.delete = async function(req, res){
    try {
        if(!req.params.id) return
        const contato = new Contato()
        await contato.delete(req.params.id)

        if(contato.error.length > 0){
            req.flash('error', contato.error)
            req.session.save(() => res.redirect('/'))
            return
        }
        req.flash('sucess','Contato excluido com sucesso')
        req.session.save(() => res.redirect('/'))
        return
    }catch (e){
        res.render('404')
    }
}