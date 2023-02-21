const fs = require("fs");

const express = require("express");
const Tour = require("./../models/tourModels"); 
const app = express();
const https = require("https");
const bodyParser = require("body-parser");
const { log } = require("console");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");



exports.aliasTopTours = function (req, res, next) {
    req.query.limit = "5";
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = "name,price,ratingsAverage,summary,difficulty";
    next();
}


exports.getAllTours = catchAsync(async function (req, res) {
    const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const tours =await features.query; 
        

        res.status(200).json({
            status: "success",
            results: tours.length,
            data: {
                tours: tours
            }
        });
        
  
   
});
exports.getTour = catchAsync(async function (req, res, next) {
    const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: "success",
            data: {
                tour: tour
            }
        });   
    
});

exports.createTour = catchAsync(async function (req, res) {
    
   
    const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        });
    
});
exports.updateTour = catchAsync(async function (req, res, next) {
    
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true

    })
    res.status(204).json({
        status: "success",
        data: {
            tour: tour
        }
    });
    
});


exports.deleteTour = catchAsync(async function (req, res,next) {
    const tour = await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: "success",
            data: null 
        });
});
exports.getTourStats = catchAsync(async function (req, res,next) {
    const stats = await Tour.aggregate([
        {
            $match: {ratingsAverage: {$gte: 4.5}}
        },
        {
            $group: {
                _id: {$toUpper: "$difficulty"},
                numRatings: {$sum: "$ratingsQuantity"},
                avgRating: {$avg: "$ratingsAverage"},
                avgPrice: {$avg: "$price"},
                minPrice: {$min: "$price"},
                maxPrice: {$max: "$price"},
                numTours: {$sum: 1}
            }
        },
        {
            $sort: {avgPrice: 1}
        }
    ]);
    res.status(200).json({
        status: "success",
        data: {
            stats: stats
        }
    });
});
exports.getMonthlyPlan = catchAsync(async function (req, res, next) {
    const year =  req.params.year * 1;
        const plan = await Tour.aggregate([
            {
                $unwind: "$startDates"
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: {$month: "$startDates"},
                    numTourStarts: {$sum: 1},
                    tours: {$push: "$name"} 
                }
            },
            {
                $addFields: {month: "$_id"}
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: {numTourStarts: -1}
            },
            {
                $limit: 12
            }
        ]);
        res.status(200).json({
            status: "success",
            data: {
                plan: plan
            }
        });
});