import { RequestHandler } from "express"
import * as yup from 'yup'

export const validate =(schema : any): RequestHandler =>{
    return async (req , res: any, next)=>{
        if(!req.body) return res.status(422).json({error : "Empty body is not accepte"})

        const schemaToValidate = yup.object({
            body: schema
        });

        try{
            await  schemaToValidate.validate({
                body: req.body
            }, {
                abortEarly : true
            })
            next()
        }catch(e){
            if (e instanceof yup.ValidationError){
                res.status(422).json({error: e.message})
            }
        }
        
    }
}
