import { NextRequest, NextResponse } from "next/server"
import { authConfig } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import * as XLSX from "xlsx"
import { parse } from "csv-parse/sync"

export async function POST(request: NextRequest) {
  try {
    const session = await authConfig()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const dataSourceName = formData.get("name") as string || file.name

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/json"
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only CSV, Excel, and JSON files are supported." },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "uploads")
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Save file to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileName = `${Date.now()}-${file.name}`
    const filePath = join(uploadsDir, fileName)
    await writeFile(filePath, buffer)

    // Parse file content
    let data: any[] = []
    let schema: any = {}

    try {
      if (file.type === "text/csv") {
        const content = buffer.toString("utf-8")
        data = parse(content, {
          columns: true,
          skip_empty_lines: true,
        })

        // Generate schema from CSV
        if (data.length > 0) {
          const firstRow = data[0]
          schema = Object.keys(firstRow).reduce((acc, key) => {
            const value = firstRow[key]
            let type = "string"

            if (value !== null && value !== undefined && value !== "") {
              if (!isNaN(Number(value))) {
                type = "number"
              } else if (value.toLowerCase() === "true" || value.toLowerCase() === "false") {
                type = "boolean"
              } else if (!isNaN(Date.parse(value))) {
                type = "date"
              }
            }

            acc[key] = type
            return acc
          }, {} as Record<string, string>)
        }
      } else if (file.type.includes("sheet")) {
        const workbook = XLSX.read(buffer, { type: "buffer" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        data = XLSX.utils.sheet_to_json(worksheet)

        // Generate schema from Excel
        if (data.length > 0) {
          const firstRow = data[0]
          schema = Object.keys(firstRow).reduce((acc, key) => {
            const value = firstRow[key]
            let type = "string"

            if (typeof value === "number") {
              type = "number"
            } else if (typeof value === "boolean") {
              type = "boolean"
            } else if (value instanceof Date) {
              type = "date"
            }

            acc[key] = type
            return acc
          }, {} as Record<string, string>)
        }
      } else if (file.type === "application/json") {
        const content = buffer.toString("utf-8")
        const jsonData = JSON.parse(content)
        data = Array.isArray(jsonData) ? jsonData : [jsonData]

        // Generate schema from JSON
        if (data.length > 0) {
          const firstRow = data[0]
          schema = Object.keys(firstRow).reduce((acc, key) => {
            const value = firstRow[key]
            let type = "string"

            if (typeof value === "number") {
              type = "number"
            } else if (typeof value === "boolean") {
              type = "boolean"
            } else if (value instanceof Date) {
              type = "date"
            }

            acc[key] = type
            return acc
          }, {} as Record<string, string>)
        }
      }
    } catch (parseError) {
      return NextResponse.json(
        { error: "Failed to parse file content" },
        { status: 400 }
      )
    }

    if (data.length === 0) {
      return NextResponse.json(
        { error: "File contains no data" },
        { status: 400 }
      )
    }

    // Create data source
    const dataSource = await prisma.dataSource.create({
      data: {
        userId: session.user.id,
        name: dataSourceName,
        type: "FILE_UPLOAD",
        connectionConfig: {
          fileName,
          filePath,
          originalName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        },
      },
    })

    // Create dataset
    const dataset = await prisma.dataset.create({
      data: {
        dataSourceId: dataSource.id,
        name: dataSourceName,
        schema,
        rowCount: data.length,
        fileSize: BigInt(file.size),
        qualityScore: calculateDataQuality(data, schema),
      },
    })

    return NextResponse.json({
      message: "File uploaded successfully",
      dataSource,
      dataset,
      preview: data.slice(0, 10), // Return first 10 rows as preview
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

function calculateDataQuality(data: any[], schema: Record<string, string>): number {
  if (data.length === 0) return 0

  let totalCells = 0
  let validCells = 0

  data.forEach(row => {
    Object.keys(schema).forEach(key => {
      totalCells++
      const value = row[key]

      if (value !== null && value !== undefined && value !== "") {
        const expectedType = schema[key]

        if (expectedType === "number" && !isNaN(Number(value))) {
          validCells++
        } else if (expectedType === "boolean" &&
          (typeof value === "boolean" ||
           (typeof value === "string" &&
            (value.toLowerCase() === "true" || value.toLowerCase() === "false")))) {
          validCells++
        } else if (expectedType === "date" && !isNaN(Date.parse(value))) {
          validCells++
        } else if (expectedType === "string" && typeof value === "string") {
          validCells++
        }
      }
    })
  })

  return Math.round((validCells / totalCells) * 100) / 100
}