const {AuthorizationError}=require('./errors')
const {ac}=require('../config/accessControl')

const authorize =(role,resource,actions,condition)=>{
    for (let i = 0; i < actions.length; i++) {
        const string=`ac.can('${role}').${actions[i]}('${resource}')`
        const permission=eval(string)
        if(permission.granted){
            if(actions[i].substring(actions[i].length-3)==='Own'){
                if(condition===false){
                    throw new AuthorizationError('You do not have access')
                }
            }
            return;
        }
      }

    throw new AuthorizationError('You do not have access')

}

module.exports=authorize