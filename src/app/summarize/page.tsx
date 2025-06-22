"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { SummarizeService } from "@/src/services/summarize.service"
import { LLMModel } from "@/src/types/summarize.type"
import { usePageTitle } from "@/src/contexts/page-title-provider"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/src/components/ui/form"
import { Button } from "@/src/components/ui/button"
import { Textarea } from "@/src/components/ui/textarea"
import { Input } from "@/src/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/src/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/components/ui/tabs"

const formSchema = z.object({
  model: z.string().min(1, "Model is required"),
  language: z.string().min(1, "Language is required"),
  text: z.string().optional(),
  file: z.any().optional(),
  mode: z.enum(["text", "file"]),
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
})

type FormData = z.infer<typeof formSchema>

export default function Summarize() {

  const { setTitle } = usePageTitle()
  const [models, setModels] = useState<LLMModel[]>([])
  const [loading, setLoading] = useState(false)

  const languages = [
    { label: "English", value: "eng" },
    { label: "Italian", value: "ita" },
    { label: "French", value: "fr" },
    { label: "Spanish", value: "es" },
  ]

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

  const mode = form.watch("mode")

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
      if (data.mode === "text" && data.text) {
        const res = await SummarizeService.analyzeText({
          model: data.model,
          language: data.language,
          text: data.text,
          entities: [],
        })
        console.log("Text result:", res)
      } else if (data.mode === "file" && data.file) {
        const res = await SummarizeService.analyzeFile(data.file, {
          model: data.model,
          language: data.language,
          entities: [],
        })
        console.log("File result:", res)
      }
    } catch (err) {
      console.error("Failed to summarize:", err)
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

                  {/* Tabs for Mode Selection */}
                  <Tabs value={mode} onValueChange={(v) => form.setValue("mode", v as "text" | "file")}>
                    <TabsList>
                      <TabsTrigger value="text">Text Input</TabsTrigger>
                      <TabsTrigger value="file">File Upload</TabsTrigger>
                    </TabsList>

                    <TabsContent value="text">
                      <FormField
                        control={form.control}
                        name="text"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Text</FormLabel>
                            <FormControl>
                              <Textarea
                                rows={6}
                                placeholder="Enter text to summarize"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="file">
                      <FormField
                        control={form.control}
                        name="file"
                        render={({ field: { onChange } }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Upload a File (PDF or TXT)</FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                accept=".pdf,.txt"
                                onChange={(e) => onChange(e.target.files?.[0])}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Model Selection */}
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Model</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a model" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {models.map((m) => (
                                <SelectItem key={m.model} value={m.model}>
                                  {m.model}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/*Language Selection */}
                    <FormField
                      control={form.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Language</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="eng">English</SelectItem>
                              <SelectItem value="ita">Italian</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                              <SelectItem value="es">Spanish</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? "Summarizing..." : "Summarize"}
                  </Button>
                </form>
              </Form>
            </div>

            {/* Results Container */}
            <div className="w-full max-w-3xl mx-auto lg:h-[calc(100vh-8rem)] bg-accent rounded-xl">
              Hello
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
