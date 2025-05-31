"use client"

import { useState, useRef, useEffect, MouseEvent as ReactMouseEvent, ChangeEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, FileText, Pencil, Trash2, Save, Undo, Redo, Type, Palette, Grid3X3, ImageIcon, Paintbrush } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import Loader from "@/components/Loader"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type CanvasItemStyle = {
  fontSize?: string;
  fontWeight?: string;
  colorClass?: string;
  backgroundClass?: string;
  padding?: string;
  borderRadius?: string;
};

type CanvasItem = {
  id: string;
  type: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style: CanvasItemStyle | null;
};

const CreativeSpace = () => {
  const { callBackend, token } = useAuth();
  const [activeTab, setActiveTab] = useState("canvas");
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchCanvasItems = async () => {
    setIsLoading(true);
    try {
      const data = await callBackend<{ items: CanvasItem[] }>("canvas", "GET");
      setCanvasItems(data.items);
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load canvas items. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCanvasItems();
  }, []);

  const handleItemClick = (e: ReactMouseEvent<HTMLDivElement>, item: CanvasItem) => {
    e.stopPropagation();
    setSelectedItem(item.id);
  };

  const handleDoubleClick = (item: CanvasItem) => {
    if (item.type === "text" || item.type === "note") {
      setEditingItem(item.id);
      setEditContent(item.content);
    }
  };

  const handleContentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditContent(e.target.value);
  };

  const saveContent = async (item: CanvasItem) => {
    if (editingItem) {
      try {
        const updatedItem = { ...item, content: editContent };
        await callBackend<void>(`canvas/${item.id}`, "PUT", updatedItem);
        setCanvasItems((items) =>
          items.map((i) => (i.id === item.id ? updatedItem : i))
        );
        setEditingItem(null);
        setErrorMessage(null);
      } catch (err: any) {
        setErrorMessage("Failed to update item content.");
        fetchCanvasItems();
      }
    }
  };

  const handleCanvasClick = () => {
    setSelectedItem(null);
    setEditingItem(null);
  };

  const startDrag = (e: ReactMouseEvent<HTMLDivElement>, item: CanvasItem) => {
    if (editingItem) return; // Prevent dragging while editing
    e.stopPropagation();
    setIsDragging(true);
    setSelectedItem(item.id);

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const onDrag = (e: { clientX: number; clientY: number }) => {
    if (isDragging && selectedItem && canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - canvasRect.left - dragOffset.x;
      const y = e.clientY - canvasRect.top - dragOffset.y;

      setCanvasItems((items) =>
        items.map((item) =>
          item.id === selectedItem ? { ...item, x: Math.max(0, x), y: Math.max(0, y) } : item
        )
      );
    }
  };

  const endDrag = async () => {
    setIsDragging(false);
    if (selectedItem) {
      const item = canvasItems.find((i) => i.id === selectedItem);
      if (item) {
        try {
          await callBackend<void>(`canvas/${selectedItem}`, "PUT", item);
          setErrorMessage(null);
        } catch (err: any) {
          setErrorMessage("Failed to update item position.");
          fetchCanvasItems();
        }
      }
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onDrag);
      window.addEventListener("mouseup", endDrag);

      return () => {
        window.removeEventListener("mousemove", onDrag);
        window.removeEventListener("mouseup", endDrag);
      };
    }
    return undefined;
  }, [isDragging, selectedItem, canvasItems]);

  const addItem = async (type: string, file?: File) => {
    const newItem = {
      type,
      content: type === "text" ? "New text" : type === "image" ? "/placeholder.svg" : "New note",
      x: 200,
      y: 200,
      width: type === "text" ? 200 : 200,
      height: type === "text" ? 50 : type === "image" ? 150 : 100,
      style:
        type === "text"
          ? { fontSize: "14px", fontWeight: "normal", colorClass: "text-foreground" }
          : type === "note"
            ? { backgroundClass: "bg-note", padding: "10px", borderRadius: "4px" }
            : {},
    };

    try {
      let createdItem: CanvasItem;
      if (file) {
        // Use browser's native FormData and fetch for multipart requests
        const formData = new FormData();
        // Explicitly set Content-Type for canvasItem part
        const canvasItemBlob = new Blob([JSON.stringify(newItem)], { type: "application/json" });
        formData.append("canvasItem", canvasItemBlob);
        formData.append("file", file);

        const response = await fetch("http://localhost:8080/api/canvas", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}: ${await response.text()}`);
        }

        createdItem = await response.json();
      } else {
        // Use callBackend for JSON requests
        createdItem = await callBackend<CanvasItem>("canvas", "POST", newItem);
      }
      setCanvasItems([...canvasItems, createdItem]);
      setSelectedItem(createdItem.id);
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage("Failed to add new item: " + (err.message || "Unknown error"));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      addItem("image", file);
    }
  };

  const updateItemImage = async (item: CanvasItem, file: File) => {
    try {
      // Use browser's native FormData and fetch for multipart requests
      const formData = new FormData();
      // Explicitly set Content-Type for canvasItem part
      const canvasItemBlob = new Blob([JSON.stringify(item)], { type: "application/json" });
      formData.append("canvasItem", canvasItemBlob);
      formData.append("file", file);

      const response = await fetch(`http://localhost:8080/api/canvas/${item.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}: ${await response.text()}`);
      }

      const updatedItem = { ...item };
      setCanvasItems((items) =>
        items.map((i) => (i.id === item.id ? updatedItem : i))
      );
      fetchCanvasItems(); // Fetch updated item with new image content
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage("Failed to update item image: " + (err.message || "Unknown error"));
    }
  };

  const handleStyleChange = async (item: CanvasItem, newStyle: CanvasItemStyle) => {
    try {
      const updatedItem = { ...item, style: newStyle };
      await callBackend<void>(`canvas/${item.id}`, "PUT", updatedItem);
      setCanvasItems((items) =>
        items.map((i) => (i.id === item.id ? updatedItem : i))
      );
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage("Failed to update item style.");
      fetchCanvasItems();
    }
  };

  const deleteItem = async () => {
    if (selectedItem) {
      try {
        await callBackend<void>(`canvas/${selectedItem}`, "DELETE");
        setCanvasItems((items) => items.filter((item) => item.id !== selectedItem));
        setSelectedItem(null);
        setEditingItem(null);
        setErrorMessage(null);
      } catch (err: any) {
        setErrorMessage("Failed to delete item.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader size="md" text="Loading your creative space..." />
      </div>
    );
  }

  return (
    <div className="p-6 h-full bg-background">
      {errorMessage && (
        <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
          {errorMessage}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setErrorMessage(null);
              fetchCanvasItems();
            }}
            className="ml-2"
          >
            Retry
          </Button>
        </div>
      )}

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
          <TabsList className="tabs-list">
            <TabsTrigger value="canvas" className="tabs-trigger text-foreground">Canvas</TabsTrigger>
            <TabsTrigger value="documents" className="tabs-trigger text-foreground">Documents</TabsTrigger>
            <TabsTrigger value="moodboard" className="tabs-trigger text-foreground">Mood Board</TabsTrigger>
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
                  <div>
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-foreground hover:bg-muted"
                      onClick={() => document.getElementById("image-upload")?.click()}
                    >
                      <ImageIcon size={14} className="mr-1" /> Image
                    </Button>
                  </div>
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
                    onDoubleClick={() => handleDoubleClick(item)}
                    onMouseDown={(e) => startDrag(e, item)}
                  >
                    {item.type === "text" && (
                      <>
                        {editingItem === item.id ? (
                          <Input
                            value={editContent}
                            onChange={handleContentChange}
                            onBlur={() => saveContent(item)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveContent(item);
                            }}
                            autoFocus
                            className="w-full border-border bg-background text-foreground"
                          />
                        ) : (
                          <div
                            className={item.style?.colorClass ?? "text-foreground"}
                            style={{
                              fontSize: item.style?.fontSize ?? "14px",
                              fontWeight: item.style?.fontWeight ?? "normal",
                            }}
                          >
                            {item.content}
                          </div>
                        )}
                        {(item.type === "text" || item.type === "note") && selectedItem === item.id && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-0 right-0 text-foreground hover:bg-muted"
                              >
                                <Paintbrush size={14} />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="grid gap-4">
                                <div className="space-y-2">
                                  <h4 className="font-medium leading-none text-foreground">Style</h4>
                                  <p className="text-sm text-muted-foreground">Adjust the item’s appearance</p>
                                </div>
                                <div className="grid gap-2">
                                  <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="fontSize">Font Size</Label>
                                    <Select
                                      value={item.style?.fontSize ?? "14px"}
                                      onValueChange={(value) =>
                                        handleStyleChange(item, {
                                          ...item.style,
                                          fontSize: value,
                                        })
                                      }
                                    >
                                      <SelectTrigger id="fontSize" className="col-span-2">
                                        <SelectValue placeholder="Select font size" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="12px">12px</SelectItem>
                                        <SelectItem value="14px">14px</SelectItem>
                                        <SelectItem value="16px">16px</SelectItem>
                                        <SelectItem value="18px">18px</SelectItem>
                                        <SelectItem value="20px">20px</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="color">Color</Label>
                                    <Select
                                      value={item.style?.colorClass ?? "text-foreground"}
                                      onValueChange={(value) =>
                                        handleStyleChange(item, {
                                          ...item.style,
                                          colorClass: value,
                                        })
                                      }
                                    >
                                      <SelectTrigger id="color" className="col-span-2">
                                        <SelectValue placeholder="Select color" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="text-foreground">Default</SelectItem>
                                        <SelectItem value="text-red-500">Red</SelectItem>
                                        <SelectItem value="text-blue-500">Blue</SelectItem>
                                        <SelectItem value="text-green-500">Green</SelectItem>
                                        <SelectItem value="text-purple-500">Purple</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </>
                    )}
                    {item.type === "image" && (
                      <>
                        <img
                          src={item.content || "/placeholder.svg"}
                          alt="Canvas item"
                          className="w-full h-full object-cover rounded-md"
                        />
                        {selectedItem === item.id && (
                          <div>
                            <input
                              type="file"
                              id={`image-update-${item.id}`}
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) updateItemImage(item, file);
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-0 right-0 text-foreground hover:bg-muted"
                              onClick={() => document.getElementById(`image-update-${item.id}`)?.click()}
                            >
                              <Pencil size={14} />
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                    {item.type === "note" && (
                      <>
                        {editingItem === item.id ? (
                          <Input
                            value={editContent}
                            onChange={handleContentChange}
                            onBlur={() => saveContent(item)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveContent(item);
                            }}
                            autoFocus
                            className="w-full h-full border-border bg-background text-foreground"
                          />
                        ) : (
                          <div
                            className={`${item.style?.backgroundClass ?? "bg-note"} h-full rounded-md p-2 text-foreground`}
                            style={{
                              padding: item.style?.padding ?? "10px",
                              borderRadius: item.style?.borderRadius ?? "4px",
                            }}
                          >
                            {item.content}
                          </div>
                        )}
                        {(//@ts-ignore
                          item.type === "text" || item.type === "note") && selectedItem === item.id && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-0 right-0 text-foreground hover:bg-muted"
                              >
                                <Paintbrush size={14} />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="grid gap-4">
                                <div className="space-y-2">
                                  <h4 className="font-medium leading-none text-foreground">Style</h4>
                                  <p className="text-sm text-muted-foreground">Adjust the item’s appearance</p>
                                </div>
                                <div className="grid gap-2">
                                  <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="background">Background</Label>
                                    <Select
                                      value={item.style?.backgroundClass ?? "bg-note"}
                                      onValueChange={(value) =>
                                        handleStyleChange(item, {
                                          ...item.style,
                                          backgroundClass: value,
                                        })
                                      }
                                    >
                                      <SelectTrigger id="background" className="col-span-2">
                                        <SelectValue placeholder="Select background" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="bg-note">Default</SelectItem>
                                        <SelectItem value="bg-yellow-100">Yellow</SelectItem>
                                        <SelectItem value="bg-blue-100">Blue</SelectItem>
                                        <SelectItem value="bg-green-100">Green</SelectItem>
                                        <SelectItem value="bg-pink-100">Pink</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </>
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
                      src="/placeholder.svg"
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
  );
};

export default CreativeSpace;