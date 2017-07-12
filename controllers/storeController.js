/**
 * Created by navjotsingh1 on 7/6/17.
 */

const mongoose=require('mongoose');
const Store=mongoose.model('Store');
const multer=require('multer');
const uuid=require('uuid');
const jimp=require('jimp');


const multerOptions={

  storage: multer.memoryStorage(),
  fileFilter(req,file,next){
      const photoType=file.mimetype.startsWith('image/');
      if (!photoType){
          next("Wrong Image type.");
          return;
      }
      next(null,true);
    }

};





exports.adPage=(req,res)=>{

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
exports.editStore= async (req,res)=>{
    const store = await Store.findOne({_id:req.params.id});
    res.render('addPage',{title:`Edit Page ${store.name}`, store});
}


exports.resize = async (req,res,next)=>{
    if (!req.file) {
        next();
        return;
    }
    const fileType=req.file.mimetype.split('/')[1];
    const fileName=uuid.v4();
    req.body.image=`${fileName}.${fileType}`;

    const image=await jimp.read(req.file.buffer);
    await image.resize(800,jimp.AUTO);
    await image.write(`./public/uploads/${req.body.image}`);

    next();



}
exports.uploadPhoto=multer(multerOptions).single('image');
exports.updateStore= async (req,res)=>{
    req.body.position.type='Point';

    const store= await Store.findOneAndUpdate({_id:req.params.id},
    req.body,{
        new:true,
            runValidators: true
        }).exec();
    req.flash('success',`Updated store ${store.name}`);
    res.redirect(`/stores/${store.slug}`);
}
exports.viewStore = async (req,res)=>{

    const store = await Store.findOne({slug:req.params.storeName});

    res.render('storePage',{title:`${store.name}`, store});

};


//Or use same function instead of two.. Just get the tag and then make
//other const = tag || {$exists : true}  and pass in find
exports.getTags=async (req,res)=>{
 
    const tagsL=Store.getListOfTags();
    const storeS= Store.find();
    const [ tagsList,stores ]= await Promise.all([tagsL,storeS]);
  res.render('tagsPage',{stores, title:'Tags',tagsList});
}

exports.getEachTag=async(req,res)=>{
    const tag=req.params.id;
    const tagsL=Store.getListOfTags();
    const storeS= Store.find({tags:tag});
    const [ tagsList,stores ]= await Promise.all([tagsL,storeS]);

    res.render('tagsPage',{stores, title:tag, tagsList});
}