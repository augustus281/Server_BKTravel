'use strict'

const cloudinary = require("../utils/cloudinary")

const Comment = require("../models/comment.model")
const Tour = require("../models/tour.model")
const Schedule = require("../models/schedule.model")
const Sequelize = require("sequelize")
const Destination = require("../models/destination.model")
const DestinationTour = require("../models/destination_tour.model")
const Op = Sequelize.Op
const Attraction = require("../models/attraction.model")
const { StatusTour, TypeNotification } = require("../common/status")
const { findTourById } = require("../services/tour.service")
const AttractionTour = require("../models/attraction_tour.model")
const { pushNotiToSystem } = require("../services/notification.service")
const Review = require("../models/review.model")

const slugify = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           
        .replace(/[^\w\-]+/g, '')       

        .replace(/\-\-+/g, '-')        
        .replace(/^-+/, '')            
        .replace(/-+$/, '');          
};
``
class TourController {

    createTour = async (req, res, next) => {
        try {
            const {
                name,
                max_customer,
                departure_date,
                departure_time,
                departure_place,
                destination_places,
                time,
                price,
                highlight,
                note,
                description,
                deadline_book_time
            } = req.fields;
        
            const destinations = destination_places.split(',').map(destination => destination.trim());
            
            let list_image = []
            let i = 0;
            while(req.files[`image[${i}]`]) {
                const path_image = req.files[`image[${i}]`].path
                const image = await cloudinary.uploader.upload(path_image)
                list_image.push(image.secure_url)
                i++;
            }
            
            // Create destinations if they don't exist
            for (const dest of destinations) {
                const [destination, created] = await Destination.findOrCreate({
                    where: { name: dest },
                    defaults: { name: dest },
                });
            }

            // list attractions
            let list_attractions = []

            // Create attractions and associate them with destinations
            for (const dest of destinations) {
                const destination = await Destination.findOne({ where: { name: dest } });

                for (let k = 0; req.fields[`attractions[${k}][${dest}]`]; k++) {
                    const attraction_name = req.fields[`attractions[${k}][${dest}]`];
                    list_attractions.push(attraction_name)
                    const [attraction, created] = await Attraction.findOrCreate({
                        where: { name: attraction_name, destination_id: destination.destination_id },
                        defaults: { name: attraction_name, destination_id: destination.destination_id }
                    })
                }
            }

            // Upload cover image of the tour
            const result = req.files.cover_image.path;
            const link_cover_image = await cloudinary.uploader.upload(result);

            // Create the tour
            const newTour = await Tour.create({
                name,
                max_customer,
                departure_date,
                departure_time,
                departure_place,
                destination_place: destination_places,
                time,
                price,
                highlight,
                note,
                description,
                deadline_book_time,
                cover_image: link_cover_image.secure_url,
                current_customers: 0,
                list_image: JSON.stringify(list_image)
            });
            
            // Associate destinations with the tour
            for (const dest of destinations) {
                const destination = await Destination.findOne({ where: { name: dest } });
        
                await DestinationTour.create({
                    tour_id: newTour.tour_id,
                    destination_id: destination.destination_id,
                });
            }
            

            // Associate attractions with the tour
            for (const attraction of list_attractions) {
                const exist_attraction = await Attraction.findOne({
                    where: { name: attraction }
                })
                const [attraction_tour, created] = await AttractionTour.findOrCreate({
                    where: { attraction_id: exist_attraction.attraction_id, tour_id: newTour.tour_id },
                    defaults: { attraction_id: exist_attraction.attraction_id, tour_id: newTour.tour_id }
                })
            }
            
            return res.status(201).json({
                message: 'Create tour successfully!',
                data: newTour
            });
                    
            } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    updateTour = async (req, res, next) => {
        const tour_id = req.params.tour_id;

        try {
            const tour = await findTourById(tour_id)
            if (!tour) return res.status(404).json({ Message: "Not found tour"})
            
            const data = req.fields;
            const updated_tour = await Tour.update(data, {
                where: { tour_id: tour_id }
            })
            
            if (req.files.cover_image.path) {
                const link_cover_image = await cloudinary.uploader.upload(req.files.cover_image.path)
                tour.cover_image = link_cover_image.secure_url
                await tour.save()
            } 

            return res.status(200).json({
                message: "Update tour successfully!",
                updated_tour: await Tour.findOne({ where: { tour_id }})
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    updateCoverImageTour = async(req, res, next) => {
        const tour_id = req.params.tour_id
        try {
            const tour = await findTourById(tour_id)
            if (!tour) return res.status(404).json({ message: "Not found tour" })

            const cover_image = req.files.cover_image.path
            const link_image = await cloudinary.uploader.upload(cover_image)
            tour.cover_image = link_image.secure_url
            await tour.save()
            return res.status(200).json({
                message: "Upload cover image successfully!",
                link_image: link_image.secure_url
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    getTour = async (req, res, next) => {
        try {
            const tour_id = req.params.tour_id;
            const tour = findTourById(tour_id)
            if (!tour) return res.status(404).json({ message: "Not found tour!" })
    
            const result = await Tour.findByPk(tour_id, {
                include: [
                    {
                        model: Destination,
                        as: "destinations",
                        attributes: ["name"],
                    },
                    {
                        model: Attraction,
                        as: "attractions",
                        attributes: ["name"],
                        through: AttractionTour 
                    }
                ]
            });

            const attractions = await Attraction.findAll({
                include: [{
                    model: Tour,
                    as: "tours",
                    where: { tour_id: tour_id },
                    attributes: []
                }],
                attributes: ["name", "destination_id"]
            });
    
            const destinations = await Destination.findAll({
                include: [{
                    model: Tour,
                    as: "tours",
                    where: { tour_id: tour_id },
                    attributes: []
                }],
                attributes: ["destination_id", "name"]
            })

            const groupedAttractions = attractions.reduce((acc, attraction) => {
                const destinationId = attraction.destination_id;
            
                if (!acc[destinationId]) {
                    acc[destinationId] = [];
                }
            
                acc[destinationId].push({ name: attraction.name });
                return acc;
            }, {});
            
            // asign attractions to destination
            const destinationsWithAttractions = destinations.map(destination => ({
                destination: {
                    name: destination.name
                },
                attractions: groupedAttractions[destination.destination_id] || []
            }));
    
            return res.status(200).json({
                message: "Get tour successfully!",
                data: JSON.parse(JSON.stringify(result)),
                date_for_schedule: JSON.parse(JSON.stringify(destinationsWithAttractions))
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };

    getCommentOfTour = async (req, res, next) => {
        try {
            const tour_id = req.params.tour_id;
            const comments = await Comment.findAll({
                where: {
                    tour_id: tour_id
                },
                order:[['createdAt', 'DESC']]
            })

            return res.status(200).json({
                message: "Get comment of tour successfully!",
                comments: comments
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    getReviewByNumberRate = async (req, res, next) => {
        const { tour_id, number_rate } = req.query;

        const tour = await findTourById(tour_id);
        if (!tour) return res.status(404).json({ message: "Not found tour!" })

        const comments = await Comment.findAll({
            where: {
                rating: number_rate
            }
        })

        return res.status(200).json({
            message: "Get comments by number_rate successfully!",
            comments: comments
        })
    }

    getAllReviewsByTourId = async (req, res, next) => {
        try {
            const tour_id = req.params.tour_id
            const tour = await findTourById(tour_id)
            if (!tour) return res.status(404).json({ message: "Not found tour!" })
    
            const all_reviews = await Review.findAll({
                where: { tour_id: tour_id },
                include: [ Comment ]
            })

            return res.status(200).json({
                message: "Get all reviews of tour successfully!",
                all_reviews: all_reviews
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
     
    getDestinationTour = async(req, res, next) => {
        try {
            const tour_id = req.params.tour_id;
            const tour = findTourById(tour_id)
            if (!tour) return res.status(404).json({ message: "Not found tour!" })
    
            const attractions = await Attraction.findAll({
                include: [{
                    model: Tour,
                    as: "tours",
                    where: { tour_id: tour_id },
                    attributes: []
                }],
                attributes: ["name", "destination_id"]
            });
    
            const destinations = await Destination.findAll({
                include: [{
                    model: Tour,
                    as: "tours",
                    where: { tour_id: tour_id },
                    attributes: []
                }],
                attributes: ["destination_id", "name"]
            })

            const groupedAttractions = attractions.reduce((acc, attraction) => {
                const destinationId = attraction.destination_id;
            
                if (!acc[destinationId]) {
                    acc[destinationId] = [];
                }
            
                acc[destinationId].push({ name: attraction.name });
                return acc;
            }, {});
            
            // asign attractions to destination
            const destinationsWithAttractions = destinations.map(destination => ({
                destination: {
                    name: destination.name
                },
                attractions: groupedAttractions[destination.destination_id] || []
            }));
            
            return res.status(200).json({
                message: "Get tour successfully!",
                data: JSON.parse(JSON.stringify(destinationsWithAttractions))
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    getScheduleByIdTour = async(req, res, next) => {
        const tour_id = req.params.tour_id
        try {
            const schedule_tour = await Schedule.findOne({
                where: { tour_id: tour_id }
            })
    
            if (!schedule_tour) return res.status(404).json({ message: "Not found schedule of tour!" })
            return res.status(200).json({
                schedule_tour: schedule_tour
            })
        } catch(error) {
            return res.status(500).json({ message: error.message })
        }
    }

    getAllTours = async(req, res, next) => {
        try {
            const all_tours = await Tour.findAll({
                attributes: {
                    exclude: ['updatedAt', 'createdAt']
                },
                order: [['tour_id', 'DESC']]
            })

            return res.status(200).json({
                data: all_tours
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    getWaitingTours = async(req, res, next) => {
        try {
            const tours = await Tour.findAll({
                where: {
                    status: StatusTour.WAITING
                }, attributes: {
                    exclude: ['updatedAt', 'createdAt']
                },
                order: [['tour_id', 'DESC']]
            })
            return res.status(200).json({
                tours: tours
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    getOnlineTours = async(req, res, next) => {
        try {
            const tours = await Tour.findAll({
                where: {
                    status: StatusTour.ONLINE
                }, attributes: {
                    exclude: ['updatedAt', 'createdAt']
                },
                order: [['tour_id', 'DESC']]
            })
            return res.status(200).json({
                tours: tours
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    getDeletedTours = async(req, res, next) => {
        try {
            const tours = await Tour.findAll({
                where: {
                    status: StatusTour.DELETED
                }, attributes: {
                    exclude: ['updatedAt', 'createdAt']
                },
                order: [['tour_id', 'DESC']]
            })
            return res.status(200).json({
                tours: tours
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    recoverTour = async(req, res, next) => {
        try {
            const tour_id = req.params.tour_id
            const tour = await Tour.findOne({ where : { tour_id }})
            if (!tour) return res.status(404).json({ Message: "Not found tour!"})
            tour.status = StatusTour.WAITING
            await tour.save()
            return res.status(200).json({ message: "Recover tour successfully"})
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    deleteTour = async (req, res, next) => {
        try {
            const tour_id = req.params.tour_id
            const tour = await Tour.findOne({ where : { tour_id }})
            if (!tour) return res.status(404).json({ Message: "Not found tour!"})
            tour.status = StatusTour.DELETED
            await tour.save()
            return res.status(200).json({ message: "Delete tour successfully"})
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    searchTour = async (req, res, next) => {
        const { departure_place, destination_place, departure_date, time }  = req.query

        let condition = {}

        if (destination_place || departure_place || departure_date || time) {
            const searchConditions = [];
    
            if (destination_place) {
                searchConditions.push({ destination_place: { [Op.like]: '%' + destination_place + '%' } });
            }
    
            if (departure_place) {
                searchConditions.push({ departure_place: { [Op.like]: '%' + departure_place + '%' } });
            }
    
            if (departure_date) {
                const userProvidedDate = new Date(departure_date);

                searchConditions.push({
                    departure_date: {
                        [Op.gte]: userProvidedDate
                    }
                });
            }
    
            if (time) {
                searchConditions.push({ time: { [Op.like]: '%' + time + '%' } });
            }
            condition = {
                [Op.and]: searchConditions
            };
        }
        const tours = await Tour.findAll({ where: condition })

        return res.status(200).json({
            data: tours
        })
    }
}

module.exports = new TourController()