export interface StatisticsResult {
  count: number
  mean?: number
  median?: number
  mode?: any
  min?: number
  max?: number
  standardDeviation?: number
  variance?: number
  quartiles?: {
    q1: number
    q2: number
    q3: number
  }
}

export interface CorrelationResult {
  correlation: number
  significance: 'weak' | 'moderate' | 'strong'
  direction: 'positive' | 'negative' | 'none'
}

export class StatisticsCalculator {
  static calculateNumericStats(values: number[]): StatisticsResult {
    const cleanValues = values.filter(val => val !== null && val !== undefined && !isNaN(val))

    if (cleanValues.length === 0) {
      return { count: 0 }
    }

    const sorted = [...cleanValues].sort((a, b) => a - b)
    const sum = cleanValues.reduce((acc, val) => acc + val, 0)
    const mean = sum / cleanValues.length

    const result: StatisticsResult = {
      count: cleanValues.length,
      mean,
      median: this.calculateMedian(sorted),
      min: sorted[0],
      max: sorted[sorted.length - 1]
    }

    // Calculate variance and standard deviation
    if (cleanValues.length > 1) {
      const variance = cleanValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (cleanValues.length - 1)
      const standardDeviation = Math.sqrt(variance)

      result.variance = variance
      result.standardDeviation = standardDeviation
      result.quartiles = this.calculateQuartiles(sorted)
    }

    // Calculate mode
    result.mode = this.calculateMode(cleanValues)

    return result
  }

  static calculateCategoricalStats(values: any[]): StatisticsResult {
    const cleanValues = values.filter(val => val !== null && val !== undefined)
    const counts = new Map<any, number>()

    cleanValues.forEach(val => {
      counts.set(val, (counts.get(val) || 0) + 1)
    })

    const sortedCounts = Array.from(counts.entries()).sort((a, b) => b[1] - a[1])
    const mode = sortedCounts.length > 0 ? sortedCounts[0][0] : undefined

    return {
      count: cleanValues.length,
      mode,
      // Additional categorical stats could be added here
    }
  }

  static calculateCorrelation(xValues: number[], yValues: number[]): CorrelationResult {
    // Filter out pairs where either value is null/undefined/NaN
    const pairs: [number, number][] = []
    for (let i = 0; i < Math.min(xValues.length, yValues.length); i++) {
      const x = xValues[i]
      const y = yValues[i]
      if (x !== null && x !== undefined && !isNaN(x) &&
          y !== null && y !== undefined && !isNaN(y)) {
        pairs.push([x, y])
      }
    }

    if (pairs.length < 2) {
      return { correlation: 0, significance: 'weak', direction: 'none' }
    }

    const n = pairs.length
    const sumX = pairs.reduce((sum, [x]) => sum + x, 0)
    const sumY = pairs.reduce((sum, [, y]) => sum + y, 0)
    const sumXY = pairs.reduce((sum, [x, y]) => sum + x * y, 0)
    const sumX2 = pairs.reduce((sum, [x]) => sum + x * x, 0)
    const sumY2 = pairs.reduce((sum, [, y]) => sum + y * y, 0)

    const correlation = (n * sumXY - sumX * sumY) /
      Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))

    return {
      correlation: isNaN(correlation) ? 0 : correlation,
      significance: this.getCorrelationSignificance(Math.abs(correlation)),
      direction: this.getCorrelationDirection(correlation)
    }
  }

  static detectOutliers(values: number[]): {
    outliers: number[]
    outlierIndices: number[]
    method: 'iqr' | 'zscore'
  } {
    const cleanValues = values.map((val, idx) => ({ value: val, index: idx }))
      .filter(item => item.value !== null && item.value !== undefined && !isNaN(item.value))

    if (cleanValues.length < 4) {
      return { outliers: [], outlierIndices: [], method: 'iqr' }
    }

    // Use IQR method for outlier detection
    const numericValues = cleanValues.map(item => item.value).sort((a, b) => a - b)
    const quartiles = this.calculateQuartiles(numericValues)
    const iqr = quartiles.q3 - quartiles.q1
    const lowerBound = quartiles.q1 - 1.5 * iqr
    const upperBound = quartiles.q3 + 1.5 * iqr

    const outliers: number[] = []
    const outlierIndices: number[] = []

    cleanValues.forEach(item => {
      if (item.value < lowerBound || item.value > upperBound) {
        outliers.push(item.value)
        outlierIndices.push(item.index)
      }
    })

    return { outliers, outlierIndices, method: 'iqr' }
  }

  static calculateTrend(values: number[], timeLabels?: string[]): {
    trend: 'increasing' | 'decreasing' | 'stable'
    slope?: number
    confidence?: number
  } {
    const cleanValues = values.map((val, idx) => ({ value: val, index: idx }))
      .filter(item => item.value !== null && item.value !== undefined && !isNaN(item.value))

    if (cleanValues.length < 2) {
      return { trend: 'stable' }
    }

    // Simple linear regression to detect trend
    const n = cleanValues.length
    const sumX = cleanValues.reduce((sum, item) => sum + item.index, 0)
    const sumY = cleanValues.reduce((sum, item) => sum + item.value, 0)
    const sumXY = cleanValues.reduce((sum, item) => sum + item.index * item.value, 0)
    const sumX2 = cleanValues.reduce((sum, item) => sum + item.index * item.index, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)

    let trend: 'increasing' | 'decreasing' | 'stable'
    if (Math.abs(slope) < 0.01) {
      trend = 'stable'
    } else if (slope > 0) {
      trend = 'increasing'
    } else {
      trend = 'decreasing'
    }

    // Calculate simple confidence based on R-squared
    const meanY = sumY / n
    const ssTotal = cleanValues.reduce((sum, item) => sum + Math.pow(item.value - meanY, 2), 0)
    const ssResidual = cleanValues.reduce((sum, item) => {
      const predicted = slope * item.index + (meanY - slope * (sumX / n))
      return sum + Math.pow(item.value - predicted, 2)
    }, 0)
    const rSquared = 1 - (ssResidual / ssTotal)

    return {
      trend,
      slope,
      confidence: Math.max(0, Math.min(1, rSquared))
    }
  }

  private static calculateMedian(sortedValues: number[]): number {
    const mid = Math.floor(sortedValues.length / 2)
    if (sortedValues.length % 2 === 0) {
      return (sortedValues[mid - 1] + sortedValues[mid]) / 2
    } else {
      return sortedValues[mid]
    }
  }

  private static calculateQuartiles(sortedValues: number[]): { q1: number, q2: number, q3: number } {
    const q2 = this.calculateMedian(sortedValues)

    const lowerHalf = sortedValues.slice(0, Math.floor(sortedValues.length / 2))
    const upperHalf = sortedValues.slice(Math.ceil(sortedValues.length / 2))

    const q1 = this.calculateMedian(lowerHalf)
    const q3 = this.calculateMedian(upperHalf)

    return { q1, q2, q3 }
  }

  private static calculateMode(values: number[]): any {
    const counts = new Map<number, number>()
    let maxCount = 0
    let mode: number | undefined

    values.forEach(value => {
      const count = (counts.get(value) || 0) + 1
      counts.set(value, count)

      if (count > maxCount) {
        maxCount = count
        mode = value
      }
    })

    return mode
  }

  private static getCorrelationSignificance(correlation: number): 'weak' | 'moderate' | 'strong' {
    if (correlation < 0.3) return 'weak'
    if (correlation < 0.7) return 'moderate'
    return 'strong'
  }

  private static getCorrelationDirection(correlation: number): 'positive' | 'negative' | 'none' {
    if (Math.abs(correlation) < 0.1) return 'none'
    return correlation > 0 ? 'positive' : 'negative'
  }
}