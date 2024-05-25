'use strict'

const { StatusTour } = require("../common/status")
const Attraction = require("../models/attraction.model")
const OtherAttraction = require("../models/other_attraction.model")
const Schedule = require("../models/schedule.model")
const { findTourById } = require("../services/tour.service")
const redis = require("redis")

let redisClient;
(async () => {
    redisClient = redis.createClient();
    redisClient.on("error", (error) => console.error(`Error : ${error}`));
    redisClient.on("connect", () => console.log("Redis connected"));
    await redisClient.connect();
})();

class ScheduleController {
    createSchedule = async(req, res, next) => {
        try {
            const tour_id = req.body.tour_id
            const tour = await findTourById(tour_id)
            if (!tour) return res.status(404).json({ message: "Not found tour for creating schedule!" })

            const exist_schedule = await Schedule.findOne({ where: { tour_id: tour_id }})
            if (exist_schedule) return res.status(400).json({ message: "Tour has already been scheduled! "})

            const schedule_detail = req.body.schedule_detail

            for (const schedule of schedule_detail) {
                for (const detail of schedule.detail) {
                    const name = detail.name;

                    const attraction = await Attraction.findOne({ where: { name: name }})
                    if (!attraction) {
                        let exist_attraction = await OtherAttraction.findOne({ where: { name: name }})
                        if (!exist_attraction) {
                            exist_attraction = await OtherAttraction.create({
                                name: detail.name,
                                note: detail.note || null,
                                description: detail.description
                            })
                        }
                        else {
                            exist_attraction.note = detail.note || null;
                            exist_attraction.description = detail.description;
                            await exist_attraction.save()
                        }
                    }
                    else {
                        attraction.note = detail.note || null;
                        attraction.description = detail.description;
                        await attraction.save()
                    }
                }
            }
            const new_schedule = await Schedule.create({
                schedule_detail: JSON.parse(JSON.stringify(schedule_detail)),
                tour_id: tour_id
            })

            tour.status = StatusTour.ONLINE
            await tour.save()

            redisClient.del("waiting_tours")
            redisClient.del("online_tours")
            
            return res.status(201).json({ 
                data: new_schedule,
                message: "Create schedule for tour successfully! "
            })
            
        } catch(error) {
            return res.status(500).json({ message: error.message })
        }
    }

    updateSchedule = async (req, res, next) => {
        try {
            // const id = req.params.id;
            const {
                tour_id, schedule_date, range_time, note, status
            } = req.body

            const tour = await findTourById(tour_id)
            if (!tour) {
                return res.status(404).json({ message: "Not found tour!" })
            }

            const schedule = await Schedule.findOne({
                where: {
                    tour_id
                }
            })
            if (!schedule) {
                return res.status(404).json({ message: "Not found schedule for updating!" })
            }

            for (const scheduleItem of schedule.schedule_detail) {
                for (const detail of scheduleItem.detail) {
                    const name = detail.name;
    
                    const attraction = await Attraction.findOne({ where: { name: name } });
                    if (!attraction) {
                        let exist_attraction = await OtherAttraction.findOne({ where: { name: name } });
                        if (!exist_attraction) {
                            exist_attraction = await OtherAttraction.create({
                                name: detail.name,
                                note: detail.note || null,
                                description: detail.description
                            });
                        } else {
                            exist_attraction.note = detail.note || null;
                            exist_attraction.description = detail.description;
                            await exist_attraction.save();
                        }
                    } else {
                        attraction.note = detail.note || null;
                        attraction.description = detail.description;
                        await attraction.save();
                    }
                }
            }

            schedule.schedule_detail = JSON.parse(JSON.stringify(schedule_detail));
            await schedule.save();

            tour.status = StatusTour.ONLINE;
            await tour.save();

            redisClient.del("waiting_tours");
            redisClient.del("online_tours");

            return res.status(200).json({
                message: "Update schedule for tour successfully!",
                data: schedule
            });

        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    updateScheduleDetails = async (req, res, next) => {
        try {
            const { tour_id, schedule_detail } = req.body;
    
            const schedule = await Schedule.findOne({ where: { tour_id } });
    
            if (!schedule) {
                return res.status(404).json({ message: "Schedule not found!" });
            }
    
            let scheduleDetails = schedule.schedule_detail;
            schedule.schedule_detail = [];
            await schedule.save()
    
            for (const detailUpdate of schedule_detail) {
                const { date, detail } = detailUpdate;
                for (const item of detail) {
                    const { range_time, note, status } = item;
    
                    scheduleDetails = scheduleDetails.map(sd => {
                        if (sd.date === date) {
                            sd.detail = sd.detail.map(d => {
                                if (d.range_time === range_time) {
                                    if (note !== undefined) d.note = note;
                                    if (status !== undefined) d.status = status;
                                }
                                return d;
                            });
                        }
                        return sd;
                    });
                }
            }
    
            schedule.schedule_detail = scheduleDetails;
            await schedule.save();
    
            return res.status(200).json({
                message: "Schedule updated successfully!",
                schedule
            });
    
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
    
    

    deleteSchedule = async(req, res, next) => {
        try {
            const tour_id = req.params.tour_id
            const schedule = await Schedule.findOne({ where: { tour_id: tour_id} })
            await schedule.destroy()
            return res.status(200).json({ message: "Delete schedule successfully!" })
        } catch(error) {
            return res.status(500).json({ message: error.message })
        }
    }

    getWeatherData = async(req, res, next) => {
        const { city } = req.query
        const apiKey = process.env.API_KEY_WEATHER
        const encodedCity = encodeURIComponent(city);
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=metric&APPID=${apiKey}`;
        try {
            const response = await fetch(weatherURL)
            const weatherData = await response.json()
            return res.status(200).json({
                message: "Get weather of city successfully!",
                data: weatherData
            })
        } catch (error) {
            console.log("Error fetching weather data:", error);
            throw error;
        }
    }
}

module.exports = new ScheduleController()