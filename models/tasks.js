const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId : { type:mongoose.Schema.Types.ObjectId, ref:'UserDetails', required:true},
    task : {type:String , required:true},
    date : {type:Date, required:true},
    category : {type:String , required:true},
    priority : {type:String},
    status : {type:String}
}, { timestamps: true })

module.exports=mongoose.model('Task',taskSchema);