"use client"

import { useState, useRef, useEffect, MouseEvent as ReactMouseEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, FileText, Pencil, Trash2, Save, Undo, Redo, Type, Palette, Grid3X3, ImageIcon } from "lucide-react"
import { motion } from "framer-motion"
import placeholder from '../../../../resources/placeholder.svg'

type CanvasItemStyle = {
  fontSize?: string;
  fontWeight?: string;
  colorClass?: string; // Use Tailwind class instead of color
  backgroundClass?: string; // Use Tailwind class for background
  padding?: string;
  borderRadius?: string;
};

type CanvasItem = {
  id: number;
  type: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style: CanvasItemStyle;
};

const CreativeSpace = () => {
  const [activeTab, setActiveTab] = useState("canvas")
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([
    {
      id: 1,
      type: "text",
      content: "Project Ideas",
      x: 100,
      y: 50,
      width: 200,
      height: 50,
      style: { fontSize: "24px", fontWeight: "bold", colorClass: "text-foreground" },
    },
    {
      id: 2,
      type: "text",
      content:
        "This is a space for creative thinking and brainstorming. Add notes, images, and links to organize your thoughts.",
      x: 100,
      y: 120,
      width: 300,
      height: 80,
      style: { fontSize: "14px", colorClass: "text-muted-foreground" },
    },
    {
      id: 3,
      type: "image",
      content: placeholder,
      x: 500,
      y: 80,
      width: 200,
      height: 150,
      style: {},
    },
    {
      id: 4,
      type: "note",
      content: "Remember to schedule the team meeting for next week",
      x: 500,
      y: 250,
      width: 200,
      height: 100,
      style: { backgroundClass: "bg-note", padding: "10px", borderRadius: "4px" },
    },
  ])

  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleItemClick = (e: ReactMouseEvent<HTMLDivElement>, item: CanvasItem) => {
    e.stopPropagation()
    setSelectedItem(item.id)
  }

  const handleCanvasClick = () => {
    setSelectedItem(null)
  }

  const startDrag = (e: ReactMouseEvent<HTMLDivElement>, item: CanvasItem) => {
    e.stopPropagation()
    setIsDragging(true)
    setSelectedItem(item.id)

    const rect = e.currentTarget.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const onDrag = (e: { clientX: number; clientY: number }) => {
    if (isDragging && selectedItem && canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - canvasRect.left - dragOffset.x
      const y = e.clientY - canvasRect.top - dragOffset.y

      setCanvasItems((items) =>
        items.map((item) => (item.id === selectedItem ? { ...item, x: Math.max(0, x), y: Math.max(0, y) } : item)),
      )
    }
  }

  const endDrag = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onDrag)
      window.addEventListener("mouseup", endDrag)

      return () => {
        window.removeEventListener("mousemove", onDrag)
        window.removeEventListener("mouseup", endDrag)
      }
    }
    return undefined
  }, [isDragging])

  const addItem = (type: string) => {
    const newItem: CanvasItem = {
      id: Date.now(),
      type,
      content: type === "text" ? "New text" : type === "image" ? placeholder : "New note",
      x: 200,
      y: 200,
      width: type === "text" ? 200 : 200,
      height: type === "text" ? 50 : type === "image" ? 150 : 100,
      style: type === "text"
        ? { fontSize: "14px", fontWeight: "normal", colorClass: "text-foreground" }
        : type === "note"
          ? { backgroundClass: "bg-note", padding: "10px", borderRadius: "4px" }
          : {},
    }

    setCanvasItems([...canvasItems, newItem])
    setSelectedItem(newItem.id as unknown as null)
  }

  const deleteItem = () => {
    if (selectedItem) {
      setCanvasItems((items) => items.filter((item) => item.id !== selectedItem))
      setSelectedItem(null)
    }
  }

  return (
    <div className="p-6 h-full bg-background">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Creative Space</h1>
          <p className="text-muted-foreground">Organize your ideas and inspirations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
            <Save size={14} className="mr-1" /> Save
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus size={14} className="mr-1" /> New Canvas
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-[calc(100%-80px)]">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="canvas" className="data-[state=active]:bg-background">Canvas</TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-background">Documents</TabsTrigger>
            <TabsTrigger value="moodboard" className="data-[state=active]:bg-background">Mood Board</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
              <Undo size={16} />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
              <Redo size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:bg-muted"
              onClick={deleteItem}
              disabled={!selectedItem}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>

        <TabsContent value="canvas" className="h-full mt-0">
          <Card className="h-full bg-background border-border">
            <CardHeader className="p-4 pb-4">
              <div className="flex justify-between items-center">
                <Input
                  className="max-w-xs border-border bg-background text-foreground placeholder:text-muted-foreground"
                  placeholder="Untitled Canvas"
                  defaultValue="Project Brainstorming"
                />
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-foreground hover:bg-muted"
                    onClick={() => addItem("text")}
                  >
                    <Type size={14} className="mr-1" /> Text
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-foreground hover:bg-muted"
                    onClick={() => addItem("image")}
                  >
                    <ImageIcon size={14} className="mr-1" /> Image
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-foreground hover:bg-muted"
                    onClick={() => addItem("note")}
                  >
                    <FileText size={14} className="mr-1" /> Note
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 h-[calc(100%-70px)]">
              <div
                ref={canvasRef}
                className="w-full h-full bg-background rounded-md border border-border overflow-auto relative"
                onClick={handleCanvasClick}
                style={{
                  backgroundImage: "radial-gradient(circle, hsl(var(--muted)) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              >
                {canvasItems.map((item) => (
                  <motion.div
                    key={item.id}
                    className={`absolute cursor-move ${selectedItem === item.id ? "ring-2 ring-primary ring-offset-2" : ""}`}
                    style={{
                      left: item.x,
                      top: item.y,
                      width: item.width,
                      height: item.height,
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={(e) => handleItemClick(e, item)}
                    onMouseDown={(e) => startDrag(e, item)}
                  >
                    {item.type === "text" && (
                      <div
                        className={item.style.colorClass}
                        style={{
                          fontSize: item.style.fontSize,
                          fontWeight: item.style.fontWeight,
                        }}
                      >
                        {item.content}
                      </div>
                    )}
                    {item.type === "image" && (
                      <img
                        src={item.content || placeholder}
                        alt="Canvas item"
                        className="w-full h-full object-cover rounded-md"
                      />
                    )}
                    {item.type === "note" && (
                      <div className={`${item.style.backgroundClass} h-full rounded-md p-2 text-foreground`}>
                        {item.content}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="h-full mt-0">
          <Card className="h-full bg-background border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Documents</CardTitle>
              <CardDescription className="text-muted-foreground">Create and manage your documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: "Project Proposal", date: "Updated 2 days ago" },
                  { title: "Meeting Notes", date: "Updated 1 week ago" },
                  { title: "Research Findings", date: "Updated 3 days ago" },
                  { title: "Design Guidelines", date: "Updated yesterday" },
                ].map((doc, i) => (
                  <Card
                    key={i}
                    className="cursor-pointer hover:shadow-md transition-shadow bg-background border-border"
                  >
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <FileText className="text-muted-foreground" />
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-foreground hover:bg-muted">
                          <Pencil size={14} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <h3 className="font-medium text-foreground">{doc.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{doc.date}</p>
                    </CardContent>
                  </Card>
                ))}

                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow border-dashed border-2 border-border bg-background flex items-center justify-center h-[140px]"
                >
                  <div className="text-center">
                    <Plus size={24} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Create New Document</p>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moodboard" className="h-full mt-0">
          <Card className="h-full bg-background border-border">
            <CardHeader className="p-4 pb-0">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-foreground">Mood Board</CardTitle>
                  <CardDescription className="text-muted-foreground">Collect visual inspiration</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border text-foreground hover:bg-muted"
                  >
                    <Grid3X3 size={14} className="mr-1" /> Layout
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border text-foreground hover:bg-muted"
                  >
                    <Palette size={14} className="mr-1" /> Theme
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="aspect-square bg-muted rounded-md overflow-hidden relative group">
                    <img
                      src={placeholder}
                      alt={`Mood board item ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-primary-foreground h-8 w-8 hover:bg-muted"
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-primary-foreground h-8 w-8 hover:bg-muted"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <div
                  className="aspect-square bg-background rounded-md border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-muted transition-colors"
                >
                  <div className="text-center">
                    <Plus size={24} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Add Image</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CreativeSpace