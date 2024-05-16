'use strict'

const sequelize = require("../database/connect.mysql")
const Attraction = require("../models/attraction.model")
const AttractionTour = require("../models/attraction_tour.model")
const Destination = require("../models/destination.model")
const DestinationTour = require("../models/destination_tour.model")
const Schedule = require("../models/schedule.model")
const Tour = require("../models/tour.model")

const findTourById = async(tour_id) => {
    return await Tour.findOne({ where: { tour_id: tour_id }})
}

const findIdByNameTour = async(name_tour) => {
    return await Tour.findOne({ where: { name: name_tour }})
}

const duplicateTour = async(tour_id) => {
    const transaction = await sequelize.transaction()
    try {
        const tour = await Tour.findByPk(tour_id, {
            include: [
                { model: Destination, as: "destinations" },
                { model: Attraction, as: "attractions" },
                { model: Schedule, as: "schedule"}
            ]
        });

        if (!tour) {
            throw new Error("Tour not found!")
        }

        const newTourData = tour.get({ plain: true })
        delete newTourData.tour_id;
        delete newTourData.current_customers;
        delete newTourData.booked_number;
        delete newTourData.status;

        const duplicatedTour = await Tour.create(newTourData, { transaction })

        // Copy schedule to new tour
        if (tour.schedule) {
            const newScheduleData = {
                tour_id: duplicatedTour.tour_id,
                schedule_detail: tour.schedule.schedule_detail
            };
            await Schedule.create(newScheduleData, { transaction });
        }

        // Copy destinations relate to new tour
        const destinationsData = tour.destinations.map(dest => ({
            tour_id: duplicatedTour.tour_id,
            destination_id: dest.destination_id,
        }));

        await DestinationTour.bulkCreate(destinationsData, { transaction });

        // Copy attractions relate to new tour
        const attractionsData = tour.attractions.map(attr => ({
            tour_id: duplicatedTour.tour_id,
            attraction_id: attr.attraction_id,
        }));

        await AttractionTour.bulkCreate(attractionsData, { transaction });

        await transaction.commit()

        return duplicatedTour
    } catch (error) {
        await transaction.rollback();
        console.error('Error duplicating tour:', error);
        throw error;
    }
}

module.exports = {
    findTourById,
    findIdByNameTour,
    duplicateTour
}