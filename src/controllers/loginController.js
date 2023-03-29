
const { async } = require('regenerator-runtime')
const {Register, Login} = require('../models/LoginModel')

exports.index = (req, res) => {
    res.render('login')
}

exports.register = async function (req, res){
    
    try{
        const register = new Register(req.body)
        await register.register()
        if(register.error.length > 0){
            req.flash('error', register.error)

            req.session.save(function(){
                res.redirect('/login/index')
                return
            })
            return
        }
        req.flash('sucess','Seu usuario foi cadastrado com sucesso')
        req.session.save(function(){
            res.redirect('/login/index')
            return
        })
    }catch(e){
        res.render('404')
    }
}

exports.login = async function (req, res){
    try{
        const login = new Login(req.body)
        await login.verifica()
        if(login.error.length > 0){
            req.flash('error', login.error)
            req.session.save(function(){
                res.redirect('/login/index')
                return
            })
            return
        }
        
        req.flash('sucess', 'Usuario logado')
        req.session.user = login.user
        req.session.save(function(){
            res.redirect('/login/index')
            return
        })
        return

    }catch(e){
        res.render('404')
    }
}

exports.logout = function(req, res) {
    req.session.destroy()
    res.redirect('/')
}