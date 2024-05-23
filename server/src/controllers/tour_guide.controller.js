'use strict'

const { RoleUser } = require("../common/status");
const { BadRequestError } = require("../core/error.response");
const GuideTour = require("../models/task.model");
const TourGuide = require("../models/tour_guide.model");
const { findTourById } = require("../services/tour.service")
const bcrypt = require('bcrypt');
const { isAdmin } = require("../middlewares/authenticate");
const User = require("../models/user.model");
const { Op } = require("sequelize");
const Task = require("../models/task.model");
const Tour = require("../models/tour.model");

const role_user = {
    ADMIN: 'admin',
    GUIDER: 'guider',
    CUSTOMER: 'customer'
}

class TourGuideController {
    assignTourToTourGuide = async (req, res, next) => {
        try {
            const { tour_id, listTourGuides, number, description } = req.body;
            
            const tour = await findTourById(tour_id);
            if (!tour) {
                return res.status(404).json({ message: "Tour not found to assign!" });
            }
    
            const guideNames = listTourGuides.map(fullName => {
                const parts = fullName.split(' ');
                const firstname = parts.pop();
                const lastname = parts.join(' ');
                return { firstname, lastname };
            });
    
            const conditions = guideNames.map(name => ({
                firstname: name.firstname,
                lastname: name.lastname,
                role_user: RoleUser.GUIDER
            }));

            console.log("conditions::::", conditions)
    
            const tourGuides = await User.findAll({
                where: {
                    [Op.or]: conditions
                }
            });
    
            if (tourGuides.length === 0) {
                return res.status(404).json({ message: "No tour guides found!" });
            }

            const listTourGuideIds = tourGuides.map(tourGuide => tourGuide.user_id);
    
            const tasks = listTourGuideIds.map(tourGuideId => ({
                tour_id,
                user_id: tourGuideId,
                number,
                description
            }));
    
            await Task.bulkCreate(tasks);
    
            return res.status(200).json({
                message: "Assign tour for tour guide successfully!"
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };

    responseTask = async (req, res, next) => {
        try {
            const { task_id, reason } = req.body
            const task = await Task.findOne({
                where: {
                    task_id
                }
            })

            if (!task) {
                return res.status(404).json({ message: "Not found task is assigned!" })
            }

            return res.status(200).json({ 
                message: "Response task successfully!",
                reason: reason
            })
        } catch (error) { 
            return res.status(500).json({
                message: error.message
            })
        }
    }

    getAllTourGuide = async (req, res, next) => {
        try {
            const allTourGuides = await User.findAll({
                where: {
                    role_user: RoleUser.GUIDER
                }
            })
            return res.status(200).json({
                message: "Get all tour guides successfully!",
                data: allTourGuides
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    createTourGuideDefault = async (req, res, next) => {
        try {
            const tourGuides = [
                { email: 'tourguide1@bktravel.com', password: 'tourguide@123', role_user: role_user.GUIDER },
                { email: 'tourguide2@bktravel.com', password: 'tourguide@123', role_user: role_user.GUIDER },
                { email: 'tourguide3@bktravel.com', password: 'tourguide@123', role_user: role_user.GUIDER },
            ]
    
            for (const tourGuide of tourGuides) {
                const existTourGuide = await TourGuide.findOne({ where: { email: tourGuide.email } });
                if (!existTourGuide) {
                    const hashedPassword = await bcrypt.hashSync(tourGuide.password, 10);
                    console.log(2)
                    const newTourGuide = await TourGuide.create({
                        email: tourGuide.email,
                        password: hashedPassword,
                        role_user: tourGuide.role_user,
                    });
                }
            }

            return res.status(201).json({
                message: "Create tour guide accoutn successfully!"
            })
        } catch (error) {
            throw new Error("Error: ", error.message)
        }
    }

    createTourGuideAccount = async (req, res, next) => {
        try {
            const {
                email, 
                password, 
                lastname,
                firstname,
                gender,
                dob,
                phone_number
            } = req.body

            const access_token = req.headers['authorization']
            const checkAdmin = await isAdmin(access_token)
            if (!checkAdmin) throw new BadRequestError("Can't create tour guide account!")

            const tourGuide = await User.findOne({
                where: { email }
            })
            if (tourGuide) throw new BadRequestError("Email is existed!")
            const newTourGuide = await User.create({
                email,
                password: await bcrypt.hash(password, 10),
                lastname,
                firstname,
                gender,
                dob,
                phone_number,
                role_user: RoleUser.GUIDER
            })

            if (!newTourGuide) throw new BadRequestError("Create new tour guide failed!")
            return res.status(201).json({
                message: "Create tour guide successfully!",
                tour_guide: newTourGuide
            })

        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    getAllTask = async (req, res, next) => {
        try {

        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    getAllTasksOfTourGuide = async (req, res, next) => {
        try {
            const user_id = req.params.user_id
            const allTasks = await Task.findAll({
                where: {
                    user_id: user_id
                },
                include: [Tour]
            })

            return res.status(200).json({
                message: "Get all tasks sussessfully!",
                tasks: allTasks
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new TourGuideController()