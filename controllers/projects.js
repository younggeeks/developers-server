/**
 * Created by Samjunior on 07/04/2017.
 */

let Project = require('../models/Project');
let mongoose = require('mongoose');
let ObjectId = mongoose.Types.ObjectId;


//for inserting new project and description
exports.insert=function (req, res) {

    //grabbing user input from the request
    let title= req.body.title;
    let description  = req.body.description;
    let link = req.body.link;
    let author = req.body.link;
    let image = req.body.image;
    let category = req.body.category;
    let technologies = req.body.technologies;

    //getting technologies separated by comma and adding them to array
    technologies = technologies.split(',');

    //preparing new project Object and filling in details from the form (Submitted by user)
    let newProject = new Project({
        title:title,
        description:description,
        link:link,
        author:author,
        image:image,
        category:category,
        technologies:technologies
    });

    //saving new Project object into the DB
    newProject.save((error,project)=>{
        if(error) return  res.status(422).json(error);
        res.status(201).json({
            success:true,
            message:'Project has been saved successfully',
            project:project
        });
    });
};

//showing Single Project Details
exports.show=function (req, res) {
    let id = extractId(req);
    console.log(id);
};
//Listing all projects from the DB
exports.all=function(req, res) {
    Project.find({},{},(error,projects)=>{
        if(error) res.status(400).json(error);
      return  res.json(projects);
    })
};

//Retrieving projects by tag
exports.getByTag=function (req, res) {
    let tag = req.params.tag;
    Project.find({})
};

extractId=(req)=>{
    let id = new ObjectId(req.params.id);
    return id;
}