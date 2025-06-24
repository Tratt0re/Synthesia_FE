"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { SummarizeService } from "@/src/services/summarize.service"
import { AnalyzeResponse, LLMModel } from "@/src/types/summarize.type"
import { usePageTitle } from "@/src/contexts/page-title-provider"

import { Form } from "@/src/components/ui/form"
import { Button } from "@/src/components/ui/button"
import { SummarizeFormFields } from "@/src/components/summarize/summarize-form-fields"
import SpinnerCircle from "@/src/components/ui/spinner"
import { DocumentSkeleton } from "@/src/components/ui/skeleton-elements"
import { SummaryWindow } from "@/src/components/summarize/summarize-results"

const formSchema = z.object({
  model: z.string().min(1, "Model is required"),
  language: z.string().min(1, "Language is required"),
  text: z.string().optional(),
  file: z.any().optional(),
  mode: z.enum(["text", "file"]),
  entities: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.mode === "text" && (!data.text || data.text.trim() === "")) {
    ctx.addIssue({
      path: ["text"],
      code: z.ZodIssueCode.custom,
      message: "Text is required when mode is set to 'text'",
    })
  }

  if (data.mode === "file" && !data.file) {
    ctx.addIssue({
      path: ["file"],
      code: z.ZodIssueCode.custom,
      message: "File is required when mode is set to 'file'",
    })
  }

  if (data.entities && data.entities.trim().length > 0) {
    const isValidFormat = /^(\s*[a-zA-Z0-9_]+\s*)(,\s*[a-zA-Z0-9_]+\s*)*$/.test(data.entities)
    if (!isValidFormat) {
      ctx.addIssue({
        path: ["entities"],
        code: z.ZodIssueCode.custom,
        message: "Entities must be a comma-separated list (e.g. disease, risk_factor)",
      })
    }
  }
})

type FormData = z.infer<typeof formSchema>

export default function Summarize() {

  const { setTitle } = usePageTitle()
  const [models, setModels] = useState<LLMModel[]>([])
  const [loading, setLoading] = useState(false)
  const [summaryResult, setSummaryResult] = useState<AnalyzeResponse | undefined>(undefined)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: "",
      language: "eng",
      mode: "text",
      text: "",
      file: undefined,
    },
  })

  useEffect(() => {
    async function fetchModels() {
      try {
        const models = await SummarizeService.listAvailableModels()
        setModels(models)
        if (models.length > 0) form.setValue("model", models[0].model)
      } catch (err) {
        console.error("Failed to load models", err)
      }
    }

    fetchModels()
    setTitle("Summarize")
  }, [form, setTitle])

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const entityArray = data.entities?.split(",").map((e) => e.trim()).filter((e) => e.length > 0)

      if (data.mode === "text" && data.text) {
        const res = await SummarizeService.analyzeText({
          model: data.model,
          language: data.language,
          text: data.text,
          entities: data.entities ? entityArray : [],
        })
        console.log("Text result:", res)
        setSummaryResult(res)
      } else if (data.mode === "file" && data.file) {
        const res = await SummarizeService.analyzeFile(data.file, {
          model: data.model,
          language: data.language,
          entities: data.entities ? entityArray : [],
        })
        console.log("File result:", res)
        setSummaryResult(res)
      }
    } catch (err) {
      console.error("Failed to summarize:", err)
      setSummaryResult(undefined)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col">
        <div className="flex flex-1 items-start justify-center overflow-hidden px-2 py-12">
          <div className="w-full mx-auto grid lg:grid-cols-2 items-start justify-center">

            {/* Form Container */}
            <div className="h-full w-full p-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">

                  <SummarizeFormFields form={form} models={models} />

                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <Button
                      className="flex-1"
                      type="button"
                      variant="outline"
                      disabled={loading}
                      onClick={() => {
                        setSummaryResult(undefined)
                        form.reset()
                      }}
                    >
                      Reset
                    </Button>
                    <Button className="flex-1" type="submit" disabled={loading}>
                      <div className="flex items-center gap-2">
                        {loading && <SpinnerCircle />}
                        {loading ? "Summarizing..." : "Summarize"}
                      </div>
                    </Button>
                  </div>

                </form>
              </Form>
            </div>

            {/* Results Container */}
            <div className="w-full max-w-3xl mx-auto lg:h-[calc(100vh-8rem)] bg-sidebar rounded-xl">
              {loading && <DocumentSkeleton />}
              {summaryResult && <SummaryWindow result={summaryResult} />}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
