"use client"

import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/src/components/ui/form"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/src/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/components/ui/tabs"
import { UseFormReturn } from "react-hook-form"
import { LLMModel } from "@/src/types/summarize.type"

type FormSchema = {
    model: string
    language: string
    text?: string
    file?: File
    mode: "text" | "file"
    entities?: string
}

interface Props {
    form: UseFormReturn<FormSchema>
    models: LLMModel[]
}

export function SummarizeFormFields({ form, models }: Props) {
    const mode = form.watch("mode")

    return (
        <>
            {/* Mode Tabs */}
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
                                    <Textarea rows={6} placeholder="Enter text to summarize" {...field} />
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
                                    <Input type="file" accept=".pdf,.txt" onChange={(e) => onChange(e.target.files?.[0])} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </TabsContent>
            </Tabs>

            <FormField
                control={form.control}
                name="entities"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Entities (optional)</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="e.g. disease, risk_factor, date"
                                {...field}
                            />
                        </FormControl>
                        <p className="text-sm text-muted-foreground">
                            Comma-separated list of entities to extract (e.g. <code>disease, risk_factor</code>)
                        </p>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Model + Language */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
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

                <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormLabel>Language</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
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
        </>
    )
}
