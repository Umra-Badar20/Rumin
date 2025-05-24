import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your full name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    age: {
      type: Number,
      required: [true, "Please provide your age"],
      min: [16, "Minimum age must be 16"],
      max: [60, "Maximum age must be 60"],
    },
    qualification: {
      type: String,
      required: [true, "Please provide your last qualification"],
      maxlength: [100, "Qualification cannot be more than 100 characters"],
    },
    percentage: {
      type: String,
      required: [true, "Please provide your percentage"],
      validate: {
        validator: function (v) {
          return /^\d{1,3}(\.\d{1,2})?$/.test(v); // Allows up to 3 digits and optional 2 decimal places
        },
        message: "Percentage must be a valid number with up to 2 decimal places",
      },
    },
    englishTest: {
      type: String,
      required: [true, "Please provide information about English test"],
      maxlength: [100, "English test info cannot be more than 100 characters"],
    },
    country: {
      type: String,
      required: [true, "Please select a country"],
      maxlength: [50, "Country name cannot be more than 50 characters"],
    },
    message: {
      type: String,
      maxlength: [500, "Message cannot be more than 500 characters"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.model("Contact", ContactSchema);
