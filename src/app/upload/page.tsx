"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"

interface UploadResult {
  message: string
  dataSource: any
  dataset: any
  preview: any[]
}

export default function UploadPage() {
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [error, setError] = useState("")
  const [dataSourceName, setDataSourceName] = useState("")

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setUploading(true)
    setError("")
    setUploadResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      if (dataSourceName) {
        formData.append("name", dataSourceName)
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setUploadResult(result)
      } else {
        setError(result.error || "Upload failed")
      }
    } catch (err) {
      setError("An error occurred during upload")
    } finally {
      setUploading(false)
    }
  }, [dataSourceName])

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/json": [".json"],
    },
    maxFiles: 1,
    disabled: uploading,
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Upload Data</h1>
        <p className="text-muted-foreground">
          Upload your datasets to start analyzing them with powerful tools and visualizations.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
            <CardDescription>
              Supported formats: CSV, Excel (.xls, .xlsx), JSON
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Dataset Name (Optional)</Label>
              <Input
                id="name"
                placeholder="My Dataset"
                value={dataSourceName}
                onChange={(e) => setDataSourceName(e.target.value)}
                disabled={uploading}
              />
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50"
              } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center space-y-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                {isDragActive ? (
                  <p className="text-sm text-muted-foreground">
                    Drop the file here...
                  </p>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Drag & drop a file here, or click to select
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      CSV, Excel, or JSON files up to 100MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {acceptedFiles.length > 0 && (
              <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                <FileText className="h-4 w-4" />
                <span className="text-sm">{acceptedFiles[0].name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(acceptedFiles[0].size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            )}

            {uploading && (
              <div className="flex items-center space-x-2 p-3 bg-blue-50 text-blue-700 rounded-lg">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
                <span className="text-sm">Uploading and processing...</span>
              </div>
            )}

            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 text-red-700 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {uploadResult && (
              <div className="flex items-center space-x-2 p-3 bg-green-50 text-green-700 rounded-lg">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">{uploadResult.message}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Section */}
        <Card>
          <CardHeader>
            <CardTitle>File Format Guidelines</CardTitle>
            <CardDescription>
              Tips for preparing your data files
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">CSV Files</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• First row should contain column headers</li>
                <li>• Use consistent data types in each column</li>
                <li>• Avoid special characters in headers</li>
                <li>• Use UTF-8 encoding for best compatibility</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Excel Files</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use the first worksheet for your data</li>
                <li>• Keep headers in the first row</li>
                <li>• Avoid merged cells</li>
                <li>• Use simple formatting (no complex formulas)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">JSON Files</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Provide an array of objects</li>
                <li>• Each object represents a row of data</li>
                <li>• Use consistent keys across all objects</li>
                <li>• Keep data types consistent</li>
              </ul>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Pro tip:</strong> Clean your data before uploading for better analysis results.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      {uploadResult && uploadResult.preview && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
            <CardDescription>
              First 10 rows of your uploaded dataset ({uploadResult.dataset.rowCount} total rows)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    {Object.keys(uploadResult.preview[0] || {}).map((key) => (
                      <th key={key} className="border border-border p-2 text-left text-sm font-semibold">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {uploadResult.preview.map((row, index) => (
                    <tr key={index} className="hover:bg-muted/50">
                      {Object.values(row).map((value, cellIndex) => (
                        <td key={cellIndex} className="border border-border p-2 text-sm">
                          {String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Data Quality Score: {uploadResult.dataset.qualityScore}/1.00
              </p>
              <Button asChild>
                <a href="/dashboard">Go to Dashboard</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}