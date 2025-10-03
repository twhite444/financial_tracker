import { UserActivityLog } from '../models/UserActivityLog';
import { TransactionHistory } from '../models/TransactionHistory';
import { AccountHistory } from '../models/AccountHistory';
import mongoose from 'mongoose';

export interface AnomalyAlert {
  userId: string;
  type: 'failed_logins' | 'suspicious_transaction' | 'rapid_changes' | 'unusual_access' | 'data_exfiltration';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  metadata: any;
  timestamp: Date;
}

/**
 * Detect multiple failed login attempts
 */
export async function detectFailedLoginAnomalies(userId: string): Promise<AnomalyAlert | null> {
  const oneHourAgo = new Date(Date.now() - 3600000);

  const failedLogins = await UserActivityLog.countDocuments({
    userId,
    action: 'failed_login',
    timestamp: { $gte: oneHourAgo },
  });

  if (failedLogins >= 5) {
    return {
      userId,
      type: 'failed_logins',
      severity: failedLogins >= 10 ? 'critical' : 'high',
      description: `${failedLogins} failed login attempts detected in the last hour`,
      metadata: { count: failedLogins, timeWindow: '1 hour' },
      timestamp: new Date(),
    };
  }

  return null;
}

/**
 * Detect suspicious transaction patterns
 */
export async function detectSuspiciousTransactions(userId: string): Promise<AnomalyAlert | null> {
  const fifteenMinutesAgo = new Date(Date.now() - 900000);

  // Check for rapid transaction creation
  const recentTransactions = await TransactionHistory.countDocuments({
    userId,
    action: 'created',
    timestamp: { $gte: fifteenMinutesAgo },
  });

  if (recentTransactions >= 20) {
    return {
      userId,
      type: 'suspicious_transaction',
      severity: 'high',
      description: `${recentTransactions} transactions created in 15 minutes - possible bot activity`,
      metadata: { count: recentTransactions, timeWindow: '15 minutes' },
      timestamp: new Date(),
    };
  }

  // Check for high-value transaction anomalies
  const recentHighValueTransactions = await TransactionHistory.find({
    userId,
    action: 'created',
    timestamp: { $gte: new Date(Date.now() - 86400000) }, // Last 24 hours
    'newData.amount': { $gte: 10000 }, // Transactions >= $10,000
  }).countDocuments();

  if (recentHighValueTransactions >= 5) {
    return {
      userId,
      type: 'suspicious_transaction',
      severity: 'medium',
      description: `${recentHighValueTransactions} high-value transactions (>$10k) in 24 hours`,
      metadata: { count: recentHighValueTransactions, threshold: 10000 },
      timestamp: new Date(),
    };
  }

  return null;
}

/**
 * Detect rapid account changes
 */
export async function detectRapidAccountChanges(userId: string): Promise<AnomalyAlert | null> {
  const tenMinutesAgo = new Date(Date.now() - 600000);

  const recentChanges = await AccountHistory.countDocuments({
    userId,
    timestamp: { $gte: tenMinutesAgo },
  });

  if (recentChanges >= 10) {
    return {
      userId,
      type: 'rapid_changes',
      severity: 'medium',
      description: `${recentChanges} account changes in 10 minutes - unusual activity`,
      metadata: { count: recentChanges, timeWindow: '10 minutes' },
      timestamp: new Date(),
    };
  }

  return null;
}

/**
 * Detect unusual access patterns
 */
export async function detectUnusualAccess(userId: string): Promise<AnomalyAlert | null> {
  const oneDayAgo = new Date(Date.now() - 86400000);

  // Get recent login IPs
  const recentLogins = await UserActivityLog.find({
    userId,
    action: 'login',
    success: true,
    timestamp: { $gte: oneDayAgo },
  }).select('ipAddress timestamp').lean();

  if (recentLogins.length === 0) return null;

  // Check for multiple different IPs
  const uniqueIPs = new Set(recentLogins.map(l => l.ipAddress).filter(Boolean));

  if (uniqueIPs.size >= 5) {
    return {
      userId,
      type: 'unusual_access',
      severity: 'medium',
      description: `Login from ${uniqueIPs.size} different IP addresses in 24 hours`,
      metadata: { 
        uniqueIPCount: uniqueIPs.size, 
        timeWindow: '24 hours',
        ips: Array.from(uniqueIPs).slice(0, 3) // Only first 3 for privacy
      },
      timestamp: new Date(),
    };
  }

  return null;
}

/**
 * Detect potential data exfiltration
 */
export async function detectDataExfiltration(userId: string): Promise<AnomalyAlert | null> {
  const oneHourAgo = new Date(Date.now() - 3600000);

  // Check for excessive data export activities
  const exports = await UserActivityLog.countDocuments({
    userId,
    action: 'export_data',
    timestamp: { $gte: oneHourAgo },
  });

  if (exports >= 3) {
    return {
      userId,
      type: 'data_exfiltration',
      severity: 'critical',
      description: `${exports} data export attempts in 1 hour - potential data breach`,
      metadata: { count: exports, timeWindow: '1 hour' },
      timestamp: new Date(),
    };
  }

  return null;
}

/**
 * Run all anomaly detections for a user
 */
export async function runAnomalyDetection(userId: string): Promise<AnomalyAlert[]> {
  const alerts: AnomalyAlert[] = [];

  try {
    const [
      failedLoginAlert,
      suspiciousTransactionAlert,
      rapidChangesAlert,
      unusualAccessAlert,
      dataExfiltrationAlert,
    ] = await Promise.all([
      detectFailedLoginAnomalies(userId),
      detectSuspiciousTransactions(userId),
      detectRapidAccountChanges(userId),
      detectUnusualAccess(userId),
      detectDataExfiltration(userId),
    ]);

    if (failedLoginAlert) alerts.push(failedLoginAlert);
    if (suspiciousTransactionAlert) alerts.push(suspiciousTransactionAlert);
    if (rapidChangesAlert) alerts.push(rapidChangesAlert);
    if (unusualAccessAlert) alerts.push(unusualAccessAlert);
    if (dataExfiltrationAlert) alerts.push(dataExfiltrationAlert);
  } catch (error) {
    console.error('Error running anomaly detection:', error);
  }

  return alerts;
}

/**
 * Check for anomalies and log them
 */
export async function checkAndLogAnomalies(userId: string): Promise<void> {
  try {
    const alerts = await runAnomalyDetection(userId);

    if (alerts.length > 0) {
      console.warn(`🚨 Security Alerts for user ${userId}:`, alerts);

      // In production, you would:
      // 1. Send email notification
      // 2. Create a security incident ticket
      // 3. Log to security monitoring service (e.g., Sentry, LogRocket)
      // 4. Potentially lock the account if severity is critical

      for (const alert of alerts) {
        if (alert.severity === 'critical') {
          console.error(`⚠️ CRITICAL ALERT: ${alert.description}`);
          // TODO: Implement account locking or additional verification
          // await lockUserAccount(userId, alert.description);
          // await sendSecurityAlert(userId, alert);
        }
      }
    }
  } catch (error) {
    console.error('Error checking anomalies:', error);
  }
}

/**
 * Get anomaly detection statistics for a user
 */
export async function getAnomalyStats(userId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const [
    totalFailedLogins,
    totalLogins,
    uniqueIPs,
    exportCount,
  ] = await Promise.all([
    UserActivityLog.countDocuments({
      userId,
      action: 'failed_login',
      timestamp: { $gte: startDate },
    }),
    UserActivityLog.countDocuments({
      userId,
      action: 'login',
      success: true,
      timestamp: { $gte: startDate },
    }),
    UserActivityLog.distinct('ipAddress', {
      userId,
      action: 'login',
      timestamp: { $gte: startDate },
    }),
    UserActivityLog.countDocuments({
      userId,
      action: 'export_data',
      timestamp: { $gte: startDate },
    }),
  ]);

  const failureRate = totalLogins > 0 
    ? ((totalFailedLogins / (totalLogins + totalFailedLogins)) * 100).toFixed(2)
    : '0';

  return {
    period: `Last ${days} days`,
    totalFailedLogins,
    totalLogins,
    failureRate: `${failureRate}%`,
    uniqueIPCount: uniqueIPs.length,
    dataExports: exportCount,
    riskLevel: totalFailedLogins > 10 ? 'high' : totalFailedLogins > 5 ? 'medium' : 'low',
  };
}
