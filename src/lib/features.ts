/**
 * Feature flag utilities
 * 
 * Controls which features are enabled/disabled via environment variables
 */

export const isSeatMapEnabled = (): boolean => {
    return process.env.NEXT_PUBLIC_FEATURE_SEAT_MAP_ENABLED === "true"
  }

  export const isReportUserEnabled = (): boolean => {
    return process.env.NEXT_PUBLIC_FEATURE_REPORT_USER_ENABLED === "true"
  }

  // Add more feature flags here as needed
  // export const isFeatureXEnabled = (): boolean => {
  //   return process.env.NEXT_PUBLIC_FEATURE_X_ENABLED === "true"
  // }