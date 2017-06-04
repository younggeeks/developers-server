/**
 * Created by Samjunior on 07/04/2017.
 */

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let projectSchema= new Schema({
    title:{
        type:String,
        require:true,
        unique:true
    },
    image:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    link:String,
    category:String,
    author:String,
    technologies:[String],
    status:{
        type:String,
        //We make sure this field expects only One of the mentioned
        enum:['Completed','Development'],
        default:'Completed'
    }
},{
    timestamps:true
});
module.exports=mongoose.model('Project',projectSchema);
