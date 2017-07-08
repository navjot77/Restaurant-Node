/**
 * Created by navjotsingh1 on 7/6/17.
 */
let mongoose=require('mongoose');
mongoose.Promise = global.Promise;

const slug=require('slugs');

const storeSchema = new mongoose.Schema({
                name: {
                    type:String,
                    trim: true,
                    required: "Please Enter Name for Store....."
                    },
                slug: String,
                description: {
                        type: String,
                            trim: true
                        },
                tags:[String],
                position:{
                    type:{
                        type: String,
                        default: 'Point'
                    },
                    address: {
                        type: String,
                        required: "Please Enter Address"
                    },
                    cordinates:[{
                        type: Number,
                        required: "Please Enter Address"
                    }]
                },
                created:{
                    type: Date,
                    default: Date.now()
                }

});

storeSchema.pre('save',function(next){

    if(!this.isModified('name')){
        next();
        return;
    }
    this.slug = slug(this.name);
    next();

})

module.exports=mongoose.model('Store',storeSchema)

