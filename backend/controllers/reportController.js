const Return = require("../models/Return");
const Dispatch = require("../models/Dispatch");

// Generate report
const getReports = async (req, res) => {

    try {

        // Read query parameters
        const { startDate, endDate } = req.query;

        // Validate dates
        if (!startDate || !endDate) {

            return res.status(400).json({
                success: false,
                message: "Start date and end date are required."
            });

        }

        // Create date range
        const start = new Date(startDate);

        const end = new Date(endDate);

        end.setHours(23, 59, 59, 999);

        // Fetch dispatches within date range
        const dispatches = await Dispatch.find({

            user: req.user.id,

            dispatchDate: {
                $gte: start,
                $lte: end
            },

            returnCompleted: true

        }).select("_id");

        // Extract dispatch ids
        const dispatchIds = dispatches.map(dispatch => dispatch._id);

        // Fetch return entries
        const returns = await Return.find({

            user: req.user.id,

            dispatch: {
                $in: dispatchIds
            }

        }).populate({

            path: "dispatch",

            populate: {

                path: "salesExecutive",

                select: "name"

            }

        });

        // Initialize summary values
        let totalSoldQuantity = 0;

        let totalRevenue = 0;

        let totalProfit = 0;

        const dailyReports = [];

        const profitTrendMap = {};

        // Prepare report data
        returns.forEach((entry) => {

            const dispatch = entry.dispatch;

            // Skip invalid dispatch
            if (!dispatch) {

                return;

            }

            // Update summary
            totalSoldQuantity += entry.totalSoldQuantity;

            totalRevenue += entry.totalRevenue;

            totalProfit += entry.totalProfit;

            // Format report date
            const reportDate = dispatch.dispatchDate
                .toISOString()
                .split("T")[0];

            // Prepare daily report row
            dailyReports.push({

                date: reportDate,

                salesExecutive: dispatch.salesExecutive.name,

                productsDispatched: dispatch.products.map(product =>
                    `${product.productName} (${product.productSize})`
                ),

                soldQuantity: entry.totalSoldQuantity,

                revenue: entry.totalRevenue,

                profit: entry.totalProfit

            });

            // Initialize profit trend
            if (!profitTrendMap[reportDate]) {

                profitTrendMap[reportDate] = 0;

            }

            // Add daily profit
            profitTrendMap[reportDate] += entry.totalProfit;

        });

        // Convert profit trend object to array
        const profitTrend = Object.keys(profitTrendMap)
            .sort()
            .map(date => ({

                date,

                profit: profitTrendMap[date]

            }));

        // Send response
        res.status(200).json({

            success: true,

            summary: {

                totalSoldQuantity,

                totalRevenue,

                totalProfit

            },

            dailyReports,

            profitTrend

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Server error."

        });

    }

};

module.exports = {
    getReports
};