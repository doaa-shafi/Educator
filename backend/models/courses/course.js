const mongoose= require("mongoose");
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');
const uniqueValidator =require("mongoose-unique-validator");
const { getVideoThumbnailUrl } =require("../../helpers/videoHelpers");


const Schema = mongoose.Schema

const courseSchema = new Schema ({
    title:{
        type: String,
        required: true,
        unique:true,
        trim:true,
    },
    description: {
        type: String,
        trim:true,
    },
    subject:{
        type: String,
    },
    previewVideo: {
        type: String,
    },
    instructor: {
        type: mongoose.Types.ObjectId,
        ref:'Instructor',
    },
    totalMins: {
        type: Number,
        default:0
    },
    price: {
        type: Number,
        min:0,
    },
    discount: {
        quantity:{
            type: Number,
            min:0,
            max:100,
            default: 0
        },
        discountStart: {
            type: Date
        },
        discountEnd:{
            type:Date
        },
    },
    enrolledStudents:{
        type:Number,
        default:0,
    },
    avgRating: {
        type: Number,
        default:0
    },
    ratings: [{ 
        type: mongoose.Types.ObjectId,
        ref: "Rating", 
        default: [] 
    }],     
    skills: [{ 
        type: String,
        default: [],
        validate: [arrayLimit, 'skills exceed the limit of 10'] 
    }], 
    learnings: [{ 
        type: String,
        default: [],
        validate: [arrayLimit, 'skills exceed the limit of 10']
    }], 
    requirements: [{ 
        type: String,
        default: [],
        validate: [arrayLimit, 'skills exceed the limit of 10']
    }],   
    level:{
        type:String,
    },
    status:{
        type:String,
        default:'draft',
        enum: {
            values: ['draft', 'published','closed'],
            message: '{VALUE} is not supported'
          }
    }
}, {timestamps: true})

courseSchema.virtual("thumbnail").get(function () {
    return getVideoThumbnailUrl(this.previewVideo);
});
courseSchema.plugin(uniqueValidator, { message: "is already taken." });
courseSchema.plugin(mongoose_fuzzy_searching, {
    fields: [
        {
            name: "title",
            minSize: 3,
            prefixOnly: true
        },
        {
            name: "subject",
            minSize: 3,
            prefixOnly: true
        }
    ]
});
function arrayLimit(val) {
    return val.length <= 10;
}
module.exports = mongoose.model('Course', courseSchema) 