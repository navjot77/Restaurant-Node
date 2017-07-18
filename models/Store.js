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
                    coordinates:[{
                        type: Number,
                        required: "Please Enter location"
                    }]

                },
                created:{
                    type: Date,
                    default: Date.now()
                },
                image: String,
                author:{
                    type: mongoose.Schema.ObjectId,
                    ref: 'User'
                }

},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

storeSchema.index({
   name: 'text',
   description:'text'

});


storeSchema.index({
    position: '2dsphere'
});



storeSchema.pre('save',async function(next){

    if(!this.isModified('name')){
        next();
        return;
    }

    this.slug = slug(this.name);

    const nameString=new RegExp(`^(${this.slug})((-[0-9]*)?)$`,'i');

    const checkName=await this.constructor.find({slug:nameString});
    console.log(checkName)
    if (checkName && checkName.length > 0){
        const newlen=checkName.length+1;
        const newSlug=`${this.name}-${newlen}`;
        this.slug=newSlug;
    }
    next();

});



storeSchema.virtual('reviews',{
    ref:'Review',
    localField:'_id',
    foreignField:'store'
});

storeSchema.statics.getListOfTags=function () {
    return this.aggregate([
        {
            $unwind:'$tags'
        },
        {
            $group:{_id:'$tags',total:{$sum:1}}
        },
        {
            $sort:{total: -1}
        }

    ]);
};

storeSchema.statics.topStores=function(){
    return this.aggregate([
        {
        $lookup : {
        from:'reviews',
            localField:'_id',
            foreignField:'store',
            as:'reviews'
    }},
        {
            $match:{
                'reviews.1':{$exists:true}
            }

        },{
        $project:{
            name:'$$ROOT.name',
            image:'$$ROOT.image',
            slug:'$$ROOT.slug',
            reviews: 1,
            score:{
                $avg: '$reviews.rating'
            }
        }
        },{

            $sort:{
                score:-1
            }
        },{
        $limit:7
        }

    ])


};


module.exports=mongoose.model('Store',storeSchema)

