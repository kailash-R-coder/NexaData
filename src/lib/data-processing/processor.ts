import { readFileSync, existsSync } from 'fs'
import * as XLSX from 'xlsx'
import { parse } from 'csv-parse/sync'

export interface DataSchema {
  [key: string]: 'string' | 'number' | 'boolean' | 'date'
}

export interface ProcessingResult {
  data: any[]
  schema: DataSchema
  rowCount: number
  qualityScore: number
  errors: string[]
  warnings: string[]
}

export class DataProcessor {
  static async processFile(filePath: string, mimeType: string): Promise<ProcessingResult> {
    let data: any[] = []
    let schema: DataSchema = {}
    const errors: string[] = []
    const warnings: string[] = []

    try {
      if (!existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`)
      }

      const fileBuffer = readFileSync(filePath)

      switch (mimeType) {
        case 'text/csv':
          ({ data, schema } = this.processCSV(fileBuffer))
          break
        case 'application/vnd.ms-excel':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
          ({ data, schema } = this.processExcel(fileBuffer))
          break
        case 'application/json':
          ({ data, schema } = this.processJSON(fileBuffer))
          break
        default:
          throw new Error(`Unsupported file type: ${mimeType}`)
      }

      // Validate and clean data
      const validationResult = this.validateData(data, schema)
      data = validationResult.data
      errors.push(...validationResult.errors)
      warnings.push(...validationResult.warnings)

      const qualityScore = this.calculateQualityScore(data, schema)

      return {
        data,
        schema,
        rowCount: data.length,
        qualityScore,
        errors,
        warnings
      }
    } catch (error) {
      throw new Error(`Data processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private static processCSV(buffer: Buffer): { data: any[], schema: DataSchema } {
    const content = buffer.toString('utf-8')
    const data = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    })

    const schema = this.inferSchema(data)
    return { data, schema }
  }

  private static processExcel(buffer: Buffer): { data: any[], schema: DataSchema } {
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet)

    const schema = this.inferSchema(data)
    return { data, schema }
  }

  private static processJSON(buffer: Buffer): { data: any[], schema: DataSchema } {
    const content = buffer.toString('utf-8')
    const jsonData = JSON.parse(content)
    const data = Array.isArray(jsonData) ? jsonData : [jsonData]

    const schema = this.inferSchema(data)
    return { data, schema }
  }

  private static inferSchema(data: any[]): DataSchema {
    if (data.length === 0) return {}

    const schema: DataSchema = {}
    const sampleSize = Math.min(100, data.length)
    const sample = data.slice(0, sampleSize)

    Object.keys(sample[0] || {}).forEach(key => {
      const values = sample.map(row => row[key]).filter(val => val !== null && val !== undefined && val !== '')

      if (values.length === 0) {
        schema[key] = 'string'
        return
      }

      const typeCounts = {
        number: 0,
        boolean: 0,
        date: 0,
        string: 0
      }

      values.forEach(value => {
        if (!isNaN(Number(value)) && value !== '') {
          typeCounts.number++
        } else if (typeof value === 'boolean' ||
                   (typeof value === 'string' &&
                    (value.toLowerCase() === 'true' || value.toLowerCase() === 'false'))) {
          typeCounts.boolean++
        } else if (!isNaN(Date.parse(value)) && value !== '') {
          typeCounts.date++
        } else {
          typeCounts.string++
        }
      })

      const maxCount = Math.max(...Object.values(typeCounts))
      const dominantType = Object.keys(typeCounts).find(type =>
        typeCounts[type as keyof typeof typeCounts] === maxCount
      ) as keyof typeof typeCounts

      schema[key] = dominantType || 'string'
    })

    return schema
  }

  private static validateData(data: any[], schema: DataSchema): { data: any[], errors: string[], warnings: string[] } {
    const errors: string[] = []
    const warnings: string[] = []
    const cleanedData: any[] = []

    data.forEach((row, index) => {
      const cleanedRow: any = {}
      let rowHasErrors = false

      Object.keys(schema).forEach(key => {
        const value = row[key]
        const expectedType = schema[key]

        if (value === null || value === undefined || value === '') {
          cleanedRow[key] = null
          return
        }

        let convertedValue = value
        let conversionError = false

        try {
          switch (expectedType) {
            case 'number':
              convertedValue = Number(value)
              if (isNaN(convertedValue)) {
                conversionError = true
              }
              break
            case 'boolean':
              if (typeof value === 'boolean') {
                convertedValue = value
              } else if (typeof value === 'string') {
                convertedValue = value.toLowerCase() === 'true'
              } else {
                conversionError = true
              }
              break
            case 'date':
              convertedValue = new Date(value)
              if (isNaN(convertedValue.getTime())) {
                conversionError = true
              }
              break
            case 'string':
              convertedValue = String(value)
              break
          }
        } catch (error) {
          conversionError = true
        }

        if (conversionError) {
          errors.push(`Row ${index + 1}: Could not convert "${key}" value "${value}" to ${expectedType}`)
          rowHasErrors = true
        }

        cleanedRow[key] = convertedValue
      })

      if (!rowHasErrors) {
        cleanedData.push(cleanedRow)
      }
    })

    // Add warnings for data quality issues
    if (cleanedData.length < data.length) {
      warnings.push(`${data.length - cleanedData.length} rows were removed due to validation errors`)
    }

    // Check for missing values
    Object.keys(schema).forEach(key => {
      const missingCount = cleanedData.filter(row =>
        row[key] === null || row[key] === undefined
      ).length

      if (missingCount > cleanedData.length * 0.5) {
        warnings.push(`Column "${key}" has more than 50% missing values`)
      }
    })

    return { data: cleanedData, errors, warnings }
  }

  private static calculateQualityScore(data: any[], schema: DataSchema): number {
    if (data.length === 0) return 0

    let totalCells = 0
    let validCells = 0

    data.forEach(row => {
      Object.keys(schema).forEach(key => {
        totalCells++
        const value = row[key]

        if (value !== null && value !== undefined) {
          const expectedType = schema[key]

          let isValid = false
          switch (expectedType) {
            case 'number':
              isValid = !isNaN(Number(value))
              break
            case 'boolean':
              isValid = typeof value === 'boolean'
              break
            case 'date':
              isValid = value instanceof Date && !isNaN(value.getTime())
              break
            case 'string':
              isValid = typeof value === 'string'
              break
          }

          if (isValid) {
            validCells++
          }
        }
      })
    })

    return Math.round((validCells / totalCells) * 100) / 100
  }

  static getDataSummary(data: any[], schema: DataSchema) {
    if (data.length === 0) {
      return { message: "No data available" }
    }

    const summary: any = {
      rowCount: data.length,
      columnCount: Object.keys(schema).length,
      columns: {}
    }

    Object.keys(schema).forEach(key => {
      const values = data.map(row => row[key]).filter(val => val !== null && val !== undefined)
      const type = schema[key]

      const columnInfo: any = {
        type,
        nonNullCount: values.length,
        nullCount: data.length - values.length
      }

      if (values.length > 0) {
        switch (type) {
          case 'number':
            const numValues = values as number[]
            columnInfo.min = Math.min(...numValues)
            columnInfo.max = Math.max(...numValues)
            columnInfo.mean = numValues.reduce((sum, val) => sum + val, 0) / numValues.length
            columnInfo.median = this.calculateMedian(numValues)
            break
          case 'string':
            const strValues = values as string[]
            columnInfo.uniqueCount = new Set(strValues).size
            columnInfo.maxLength = Math.max(...strValues.map(s => s.length))
            columnInfo.minLength = Math.min(...strValues.map(s => s.length))
            columnInfo.averageLength = strValues.reduce((sum, s) => sum + s.length, 0) / strValues.length
            break
          case 'boolean':
            const boolValues = values as boolean[]
            const trueCount = boolValues.filter(val => val).length
            columnInfo.trueCount = trueCount
            columnInfo.falseCount = boolValues.length - trueCount
            break
          case 'date':
            const dateValues = values as Date[]
            const dates = dateValues.filter(d => d instanceof Date && !isNaN(d.getTime()))
            if (dates.length > 0) {
              columnInfo.minDate = new Date(Math.min(...dates.map(d => d.getTime())))
              columnInfo.maxDate = new Date(Math.max(...dates.map(d => d.getTime())))
            }
            break
        }
      }

      summary.columns[key] = columnInfo
    })

    return summary
  }

  private static calculateMedian(numbers: number[]): number {
    const sorted = [...numbers].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)

    if (sorted.length % 2 === 0) {
      return (sorted[mid - 1] + sorted[mid]) / 2
    } else {
      return sorted[mid]
    }
  }
}