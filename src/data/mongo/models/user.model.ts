import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required']
    },
    email:{
        type:String,
        required:[true,'email is required'],
        unique:true
    },
    emailValidate:{
        type:Boolean,
        default:false
    },
    password:{
        type:String,
        required:[true,'password is required']
    },
    img:{
        type:String,
        
    },
    role:{
        type:[String],
        default:['USER ROLE'],
        enum:['ADMIN ROLE','USER ROLE']
    }
});

userSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform: function(doc,ret,options){
        delete ret._id;
        delete ret.password
    }
})

export const UserModel = mongoose.model('User',userSchema);