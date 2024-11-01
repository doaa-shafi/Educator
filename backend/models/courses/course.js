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
    thumbnail:{
        type:String,
    },
    instructor: {
        type: mongoose.Types.ObjectId,
        ref:'Instructor',
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
    learnings: [{ 
        type: String,
        default: [],
    }], 
    requirements: [{ 
        type: String,
        default: [],
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

courseSchema.pre('save', function (next) {
    if (!this.thumbnail && this.previewVideo) {
        const generatedThumbnail = getVideoThumbnailUrl(this.previewVideo);
        console.log("Generated Thumbnail URL:", generatedThumbnail); // Debugging
        this.thumbnail = generatedThumbnail; // Store the thumbnail
    }
    next();
});

courseSchema.plugin(mongoose_fuzzy_searching, {
    fields: [
        {
            name: "title",
            minSize: 3,
            prefixOnly: true
        },
    ]
});

module.exports = mongoose.model('Course', courseSchema) 