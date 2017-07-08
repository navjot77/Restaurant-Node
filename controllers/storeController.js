/**
 * Created by navjotsingh1 on 7/6/17.
 */

const mongoose=require('mongoose');
const Store=mongoose.model('Store');

exports.homeMiddle=(req,res,next)=>{
    req.name="Navjot Singh"
  next();
};



exports.homePage = (req,res)=>{
    res.render('index',{title:"Home",     name:"elvus"   });
}



exports.addPage=(req,res)=>{

    res.render('addPage',{title:"Add Page"})
}

exports.saveFormController= async (req,res)=>{

    const store= await (new Store(req.body)).save();
    console.log(store)
    console.log("Data uploaded to database....");
    req.flash('success','Data Uploaded successfully... ');
    res.redirect(`/add/${store.slug}`);


}

exports.getStores= async (req,res)=>{

    const stores= await Store.find();
    res.render('stores',{title:"Stores Page",stores});

}