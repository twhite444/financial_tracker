import { UserActivityLog } from '../models/UserActivityLog';
import { Request } from 'express';
import mongoose from 'mongoose';

interface ActivityLogParams {
  userId: mongoose.Types.ObjectId | string;
  action: 
    | 'login'
    | 'logout'
    | 'register'
    | 'password_change'
    | 'profile_update'
    | 'plaid_link'
    | 'plaid_unlink'
    | 'failed_login'
    | 'account_locked'
    | 'account_unlocked'
    | 'export_data'
    | 'delete_account';
  details?: string;
  previousData?: any;
  newData?: any;
  success?: boolean;
  errorMessage?: string;
  req?: Request;
}

/**
 * Log user activity
 */
export async function logUserActivity(params: ActivityLogParams): Promise<void> {
  try {
    const {
      userId,
      action,
      details,
      previousData,
      newData,
      success = true,
      errorMessage,
      req,
    } = params;

    const activityData: any = {
      userId,
      action,
      details,
      previousData,
      newData,
      success,
      errorMessage,
      timestamp: new Date(),
    };

    // Extract request metadata if provided
    if (req) {
      activityData.ipAddress = req.ip || req.connection?.remoteAddress;
      activityData.userAgent = req.get('user-agent');
    }

    await UserActivityLog.create(activityData);
  } catch (error) {
    console.error('Error logging user activity:', error);
    // Don't throw - logging failures shouldn't break the main flow
  }
}

/**
 * Get user activity history
 */
export async function getUserActivityHistory(
  userId: string,
  options: {
    limit?: number;
    skip?: number;
    action?: string;
    startDate?: Date;
    endDate?: Date;
  } = {}
) {
  const { limit = 50, skip = 0, action, startDate, endDate } = options;

  const query: any = { userId };

  if (action) {
    query.action = action;
  }

  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = startDate;
    if (endDate) query.timestamp.$lte = endDate;
  }

  const [activities, total] = await Promise.all([
    UserActivityLog.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    UserActivityLog.countDocuments(query),
  ]);

  return {
    activities,
    total,
    page: Math.floor(skip / limit) + 1,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get activity statistics
 */
export async function getActivityStatistics(userId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const stats = await UserActivityLog.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        timestamp: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 },
        lastOccurrence: { $max: '$timestamp' },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  const totalActivities = stats.reduce((sum, stat) => sum + stat.count, 0);
  const failedLogins = await UserActivityLog.countDocuments({
    userId,
    action: 'failed_login',
    timestamp: { $gte: startDate },
  });

  return {
    totalActivities,
    failedLogins,
    actionBreakdown: stats,
    periodDays: days,
  };
}
