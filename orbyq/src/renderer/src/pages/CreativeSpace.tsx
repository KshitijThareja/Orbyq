'use client'

import {
  useState,
  useRef,
  useEffect,
  MouseEvent as ReactMouseEvent,
  ChangeEvent,
  useCallback
} from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Plus,
  FileText,
  Pencil,
  Trash2,
  Undo,
  Redo,
  Type,
  Palette,
  Grid3X3,
  ImageIcon,
  Paintbrush
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import Loader from '@/components/Loader'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ResizableBox } from 'react-resizable'
import 'react-resizable/css/styles.css'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

type CanvasItemStyle = {
  fontSize?: string
  fontWeight?: string
  colorClass?: string
  backgroundClass?: string
  padding?: string
  borderRadius?: string
}

type CanvasItem = {
  id: string
  canvasId: string
  type: string
  content: string
  x: number
  y: number
  width: number
  height: number
  style: CanvasItemStyle | null
}

type CanvasInfo = {
  id: string
  title: string
}

type Document = {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

type MoodBoardItem = {
  id: string
  imageUrl: string
  createdAt: string
}

const CreativeSpace = () => {
  const { callBackend, token } = useAuth()
  const [activeTab, setActiveTab] = useState('canvas')
  const [canvasInfo, setCanvasInfo] = useState<CanvasInfo | null>(null)
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([])
  const [allCanvases, setAllCanvases] = useState<CanvasInfo[]>([])
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editContent, setEditContent] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [history, setHistory] = useState<CanvasItem[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [tempTitle, setTempTitle] = useState('')

  // Documents state
  const [documents, setDocuments] = useState<Document[]>([])
  const [editingDocument, setEditingDocument] = useState<string | null>(null)
  const [viewingDocument, setViewingDocument] = useState<string | null>(null)
  const [editDocumentTitle, setEditDocumentTitle] = useState<string>('')
  const [editDocumentContent, setEditDocumentContent] = useState<string>('')

  // Mood Board state
  const [moodBoardItems, setMoodBoardItems] = useState<MoodBoardItem[]>([])
  const [isAddingMoodBoardItem, setIsAddingMoodBoardItem] = useState(false)

  const [isResizeDialogOpen, setIsResizeDialogOpen] = useState(false)
  const [resizeDimensions, setResizeDimensions] = useState({ width: 0, height: 0 })
  const [resizingItem, setResizingItem] = useState<CanvasItem | null>(null)

  const saveToHistory = useCallback(
    (items: CanvasItem[]) => {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push([...items])
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    },
    [history, historyIndex]
  )

  const fetchCanvasItems = async (canvasId: string, preserveHistory: boolean = false) => {
    setIsLoading(true)
    try {
      console.log(`Fetching canvas items for canvas ID: ${canvasId}`)
      const data = await callBackend<{
        canvas: { id: string; title: string }
        items: CanvasItem[]
      }>(`canvas/${canvasId}`, 'GET')
      console.log('Fetched canvas data:', data)
      setCanvasInfo({ id: data.canvas.id, title: data.canvas.title })
      setCanvasItems(data.items)
      if (!preserveHistory) {
        setHistory([data.items])
        setHistoryIndex(0)
      } else {
        const newHistory = [...history]
        newHistory[historyIndex] = data.items
        setHistory(newHistory)
        setCanvasItems(data.items)
      }
      setErrorMessage(null)
    } catch (err: any) {
      console.error('Error fetching canvas items:', err)
      setErrorMessage(err.message || 'Failed to load canvas items. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAllCanvases = async () => {
    try {
      console.log('Fetching all canvases...')
      const canvases = await callBackend<CanvasInfo[]>('canvases', 'GET')
      console.log('Fetched canvases:', canvases)
      setAllCanvases(canvases)
      return canvases
    } catch (err: any) {
      console.error('Error fetching canvases:', err)
      setErrorMessage('Failed to load canvases: ' + (err.message || 'Unknown error'))
      return []
    }
  }

  const fetchDocuments = async () => {
    try {
      console.log('Fetching all documents...')
      const documents = await callBackend<Document[]>('documents', 'GET')
      console.log('Fetched documents:', documents)
      setDocuments(documents)
      setErrorMessage(null)
    } catch (err: any) {
      console.error('Error fetching documents:', err)
      setErrorMessage('Failed to load documents: ' + (err.message || 'Unknown error'))
    }
  }

  const fetchMoodBoardItems = async () => {
    try {
      console.log('Fetching all mood board items...')
      const items = await callBackend<MoodBoardItem[]>('moodboard', 'GET')
      console.log('Fetched mood board items:', items)
      setMoodBoardItems(items)
      setErrorMessage(null)
    } catch (err: any) {
      console.error('Error fetching mood board items:', err)
      setErrorMessage('Failed to load mood board items: ' + (err.message || 'Unknown error'))
    }
  }

  const createNewCanvas = async () => {
    try {
      console.log('Creating new canvas...')
      const newCanvas = await callBackend<{ id: string; title: string }>('canvas/new', 'POST', {
        title: 'Untitled Canvas'
      })
      console.log('Created new canvas:', newCanvas)
      setCanvasInfo({ id: newCanvas.id, title: newCanvas.title })
      setCanvasItems([])
      setHistory([[]])
      setHistoryIndex(0)
      const updatedCanvases = await fetchAllCanvases()
      if (updatedCanvases.length > 0) {
        await fetchCanvasItems(newCanvas.id)
      }
      setErrorMessage(null)
    } catch (err: any) {
      console.error('Error creating new canvas:', err)
      setErrorMessage('Failed to create new canvas: ' + (err.message || 'Unknown error'))
      setIsLoading(false)
    }
  }

  const createNewDocument = async () => {
    try {
      console.log('Creating new document...')
      const newDocument = await callBackend<Document>('document/new', 'POST', {
        title: 'Untitled Document',
        content: ''
      })
      console.log('Created new document:', newDocument)
      setDocuments([...documents, newDocument])
      setEditingDocument(newDocument.id)
      setEditDocumentTitle(newDocument.title)
      setEditDocumentContent(newDocument.content)
      setErrorMessage(null)
    } catch (err: any) {
      console.error('Error creating new document:', err)
      setErrorMessage('Failed to create new document: ' + (err.message || 'Unknown error'))
    }
  }

  const deleteCanvas = async (canvasId: string) => {
    try {
      console.log(`Deleting canvas ${canvasId}`)
      await callBackend<void>(`canvas/${canvasId}`, 'DELETE')
      const updatedCanvases = await fetchAllCanvases()
      if (canvasId === canvasInfo?.id) {
        if (updatedCanvases.length > 0) {
          await fetchCanvasItems(updatedCanvases[0].id)
        } else {
          await createNewCanvas()
        }
      }
      setErrorMessage(null)
    } catch (err: any) {
      console.error('Error deleting canvas:', err)
      setErrorMessage('Failed to delete canvas: ' + (err.message || 'Unknown error'))
    }
  }

  const deleteDocument = async (documentId: string) => {
    try {
      console.log(`Deleting document ${documentId}`)
      await callBackend<void>(`document/${documentId}`, 'DELETE')
      setDocuments(documents.filter((doc) => doc.id !== documentId))
      if (editingDocument === documentId) {
        setEditingDocument(null)
      }
      if (viewingDocument === documentId) {
        setViewingDocument(null)
      }
      setErrorMessage(null)
    } catch (err: any) {
      console.error('Error deleting document:', err)
      setErrorMessage('Failed to delete document: ' + (err.message || 'Unknown error'))
    }
  }

  const deleteMoodBoardItem = async (itemId: string) => {
    try {
      console.log(`Deleting mood board item ${itemId}`)
      await callBackend<void>(`moodboard/${itemId}`, 'DELETE')
      setMoodBoardItems(moodBoardItems.filter((item) => item.id !== itemId))
      setErrorMessage(null)
    } catch (err: any) {
      console.error('Error deleting mood board item:', err)
      setErrorMessage('Failed to load mood board items: ' + (err.message || 'Unknown error'))
    }
  }

  const loadExistingCanvas = async () => {
    try {
      const canvases = await fetchAllCanvases()
      if (canvases.length > 0) {
        const latestCanvas = canvases[0]
        await fetchCanvasItems(latestCanvas.id)
      } else {
        await createNewCanvas()
      }
      await fetchDocuments()
      await fetchMoodBoardItems()
    } catch (err: any) {
      console.error('Error loading existing canvases:', err)
      setErrorMessage('Failed to load canvases: ' + (err.message || 'Unknown error'))
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadExistingCanvas()
  }, [])

  const updateCanvasTitle = async () => {
    if (!canvasInfo || !tempTitle.trim()) return
    try {
      console.log(`Updating canvas title to: ${tempTitle}`)
      const endpointWithQuery = `canvas/${canvasInfo.id}/title?title=${encodeURIComponent(tempTitle)}`
      await callBackend<void>(endpointWithQuery, 'PUT', null)
      setCanvasInfo({ ...canvasInfo, title: tempTitle })
      setAllCanvases(
        allCanvases.map((c) => (c.id === canvasInfo.id ? { ...c, title: tempTitle } : c))
      )
      setIsEditingTitle(false)
      setErrorMessage(null)
    } catch (err: any) {
      console.error('Error updating canvas title:', err)
      setErrorMessage('Failed to update canvas title: ' + (err.message || 'Unknown error'))
    }
  }

  const updateDocument = async (documentId: string) => {
    try {
      console.log(`Updating document ${documentId}`)
      //@ts-ignore
      const updatedDocument = await callBackend<void>(`document/${documentId}`, 'PUT', {
        title: editDocumentTitle,
        content: editDocumentContent
      })
      setDocuments(
        documents.map((doc) =>
          doc.id === documentId
            ? {
                ...doc,
                title: editDocumentTitle,
                content: editDocumentContent,
                updatedAt: new Date().toISOString()
              }
            : doc
        )
      )
      setEditingDocument(null)
      setViewingDocument(null)
      setErrorMessage(null)
    } catch (err: any) {
      console.error('Error updating document:', err)
      setErrorMessage('Failed to update document: ' + (err.message || 'Unknown error'))
    }
  }

  const handleItemClick = (e: ReactMouseEvent<HTMLDivElement>, item: CanvasItem) => {
    e.stopPropagation()
    setSelectedItem(item.id)
  }

  const handleDoubleClick = (item: CanvasItem) => {
    if (item.type === 'text' || item.type === 'note') {
      setEditingItem(item.id)
      setEditContent(item.content)
    }
  }

  const handleContentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditContent(e.target.value)
  }

  const saveContent = async (item: CanvasItem) => {
    if (editingItem) {
      try {
        console.log(`Saving content for item ${item.id}: ${editContent}`)
        const updatedItem = { ...item, content: editContent }
        await callBackend<void>(`canvas/${canvasInfo?.id}/${item.id}`, 'PUT', updatedItem)
        const newItems = canvasItems.map((i) => (i.id === item.id ? updatedItem : i))
        setCanvasItems(newItems)
        saveToHistory(newItems)
        setEditingItem(null)
        setErrorMessage(null)
      } catch (err: any) {
        console.error('Error saving content:', err)
        setErrorMessage('Failed to update item content.')
        fetchCanvasItems(canvasInfo!.id, true)
      }
    }
  }

  const handleCanvasClick = () => {
    setSelectedItem(null)
    setEditingItem(null)
  }

  const startDrag = (e: ReactMouseEvent<HTMLDivElement>, item: CanvasItem) => {
    if (editingItem) return
    e.stopPropagation()
    setIsDragging(true)
    setSelectedItem(item.id)

    const rect = e.currentTarget.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const onDrag = (e: { clientX: number; clientY: number }) => {
    if (isDragging && selectedItem && canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - canvasRect.left - dragOffset.x
      const y = e.clientY - canvasRect.top - dragOffset.y

      setCanvasItems((items) =>
        items.map((item) =>
          item.id === selectedItem ? { ...item, x: Math.max(0, x), y: Math.max(0, y) } : item
        )
      )
    }
  }

  const endDrag = async () => {
    setIsDragging(false)
    if (selectedItem && canvasInfo) {
      const item = canvasItems.find((i) => i.id === selectedItem)
      if (item) {
        try {
          console.log(`Updating position for item ${item.id}: x=${item.x}, y=${item.y}`)
          await callBackend<void>(`canvas/${canvasInfo.id}/${selectedItem}`, 'PUT', item)
          saveToHistory(canvasItems)
          setErrorMessage(null)
        } catch (err: any) {
          console.error('Error updating item position:', err)
          setErrorMessage('Failed to update item position.')
          fetchCanvasItems(canvasInfo.id, true)
        }
      }
    }
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onDrag)
      window.addEventListener('mouseup', endDrag)

      return () => {
        window.removeEventListener('mousemove', onDrag)
        window.removeEventListener('mouseup', endDrag)
      }
    }
    return undefined
  }, [isDragging, selectedItem, canvasItems, canvasInfo])

  const addItem = async (type: string, file?: File) => {
    if (!canvasInfo) return

    const newItem = {
      canvasId: canvasInfo.id,
      type,
      content: type === 'text' ? 'New text' : type === 'image' ? '' : 'New note',
      x: 200,
      y: 200,
      width: type === 'text' ? 200 : 200,
      height: type === 'text' ? 50 : type === 'image' ? 150 : 100,
      style:
        type === 'text'
          ? { fontSize: '14px', fontWeight: 'normal', colorClass: 'text-foreground' }
          : type === 'note'
            ? { backgroundClass: 'bg-note', padding: '10px', borderRadius: '4px' }
            : {}
    }

    try {
      let createdItem: CanvasItem
      if (file) {
        console.log(`Adding image item with file: ${file.name}`)
        console.log('Authorization token:', token)
        const formData = new FormData()
        const canvasItemBlob = new Blob([JSON.stringify(newItem)], { type: 'application/json' })
        formData.append('canvasItem', canvasItemBlob)
        formData.append('file', file)

        const response = await fetch(`http://localhost:8080/api/canvas/${canvasInfo.id}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        })

        if (!response.ok) {
          const errorText = await response.text()
          if (response.status === 403) {
            throw new Error(
              'Permission denied: You are not authorized to add items to this canvas.'
            )
          }
          throw new Error(`Request failed with status ${response.status}: ${errorText}`)
        }

        const responseText = await response.text()
        console.log('Raw response from image upload:', responseText)
        try {
          createdItem = JSON.parse(responseText)
        } catch (jsonError) {
          console.error('Failed to parse response as JSON:', jsonError)
          await fetchCanvasItems(canvasInfo.id)
          setErrorMessage(null)
          return
        }
      } else {
        console.log(`Adding ${type} item`)
        const rawResponse = await callBackend(`canvas/${canvasInfo.id}`, 'POST', newItem)
        console.log('Raw response from callBackend:', rawResponse)
        try {
          createdItem = typeof rawResponse === 'string' ? JSON.parse(rawResponse) : rawResponse
        } catch (jsonError) {
          console.error('Failed to parse callBackend response as JSON:', jsonError)
          await fetchCanvasItems(canvasInfo.id)
          setErrorMessage(null)
          return
        }
      }
      console.log('Created item:', createdItem)

      setCanvasItems((prevItems) => {
        const newItems = [...prevItems, createdItem]
        setTimeout(() => saveToHistory(newItems), 0)
        return newItems
      })

      setSelectedItem(createdItem.id)
      setErrorMessage(null)
    } catch (err: any) {
      console.error('Error adding item:', err)
      setErrorMessage(`Failed to add new item: ${err.message || 'Unknown error'}`)
    }
  }

  const addMoodBoardItem = async (file: File) => {
    try {
      console.log(`Adding mood board item with file: ${file.name}`)
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`http://localhost:8080/api/moodboard/new`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Request failed with status ${response.status}: ${errorText}`)
      }

      const newItem = await response.json()
      setMoodBoardItems([...moodBoardItems, newItem])
      setErrorMessage(null)
    } catch (err: any) {
      console.error('Error adding mood board item:', err)
      setErrorMessage(`Failed to add mood board item: ${err.message || 'Unknown error'}`)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      addItem('image', file)
    }
  }

  const handleMoodBoardFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      addMoodBoardItem(file)
      setIsAddingMoodBoardItem(false)
    }
  }

  const updateItemImage = async (item: CanvasItem, file: File) => {
    if (!canvasInfo) return

    try {
      console.log(`Updating image for item ${item.id}`)
      const formData = new FormData()
      const canvasItemBlob = new Blob([JSON.stringify(item)], { type: 'application/json' })
      formData.append('canvasItem', canvasItemBlob)
      formData.append('file', file)

      const response = await fetch(`http://localhost:8080/api/canvas/${canvasInfo.id}/${item.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}: ${await response.text()}`)
      }

      const updatedItem = await response.json()
      const newItems = canvasItems.map((i) => (i.id === item.id ? updatedItem : i))
      setCanvasItems(newItems)
      saveToHistory(newItems)
      setErrorMessage(null)
    } catch (err: any) {
      console.error('Error updating item image:', err)
      setErrorMessage('Failed to update item image: ' + (err.message || 'Unknown error'))
      fetchCanvasItems(canvasInfo.id, true)
    }
  }

  const updateItemSize = async (item: CanvasItem, newWidth: number, newHeight: number) => {
    console.log('hello')
    console.log(canvasItems)

    setCanvasItems((prevItems) =>
      prevItems.map((ci) =>
        ci.id === item.id ? { ...ci, width: newWidth, height: newHeight } : ci
      )
    )
  }

  const handleStyleChange = async (item: CanvasItem, newStyle: CanvasItemStyle) => {
    if (!canvasInfo) return

    try {
      console.log(`Updating style for item ${item.id}`)
      const updatedItem = { ...item, style: newStyle }
      await callBackend<void>(`canvas/${canvasInfo.id}/${item.id}`, 'PUT', updatedItem)
      const newItems = canvasItems.map((i) => (i.id === item.id ? updatedItem : i))
      setCanvasItems(newItems)
      saveToHistory(newItems)
      setErrorMessage(null)
    } catch (err: any) {
      console.error('Error updating item style:', err)
      setErrorMessage('Failed to update item style.')
      fetchCanvasItems(canvasInfo.id, true)
    }
  }

  const deleteItem = async () => {
    if (selectedItem && canvasInfo) {
      try {
        console.log(`Deleting item ${selectedItem}`)
        await callBackend<void>(`canvas/${canvasInfo.id}/${selectedItem}`, 'DELETE')
        const newItems = canvasItems.filter((item) => item.id !== selectedItem)
        setCanvasItems(newItems)
        saveToHistory(newItems)
        setSelectedItem(null)
        setEditingItem(null)
        setErrorMessage(null)
      } catch (err: any) {
        console.error('Error deleting item:', err)
        setErrorMessage('Failed to delete item.')
        fetchCanvasItems(canvasInfo.id, true)
      }
    }
  }

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setCanvasItems([...history[newIndex]])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setCanvasItems([...history[newIndex]])
    }
  }

  const measureTextWidth = (text: string, fontSize: string) => {
    const span = document.createElement('span')
    span.style.fontSize = fontSize
    span.style.visibility = 'hidden'
    span.style.position = 'absolute'
    span.style.whiteSpace = 'nowrap'
    span.textContent = text
    document.body.appendChild(span)
    const width = span.offsetWidth + 20
    document.body.removeChild(span)
    return width
  }

  const measureTextHeight = (text: string, fontSize: string, width: number) => {
    const span = document.createElement('span')
    span.style.fontSize = fontSize
    span.style.visibility = 'hidden'
    span.style.position = 'absolute'
    span.style.width = `${width}px`
    span.style.whiteSpace = 'normal'
    span.textContent = text
    document.body.appendChild(span)
    const height = span.offsetHeight + 20
    document.body.removeChild(span)
    return height
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Updated yesterday'
    if (diffDays < 7) return `Updated ${diffDays} days ago`
    if (diffDays < 14) return 'Updated 1 week ago'
    return `Updated on ${date.toLocaleDateString()}`
  }

  const handleResizeDialogOpen = (item: CanvasItem) => {
    setResizingItem(item)
    setResizeDimensions({ width: item.width, height: item.height })
    setIsResizeDialogOpen(true)
  }

  const handleResizeApply = () => {
    if (resizingItem) {
      updateItemSize(resizingItem, resizeDimensions.width, resizeDimensions.height)
      setIsResizeDialogOpen(false)
      setResizingItem(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader size="md" text="Loading your creative space..." />
      </div>
    )
  }

  if (!canvasInfo) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <p className="text-destructive">Failed to load canvas. Please try again.</p>
      </div>
    )
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
              setErrorMessage(null)
              fetchCanvasItems(canvasInfo.id)
              fetchDocuments()
              fetchMoodBoardItems()
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
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-[calc(100%-80px)]">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="tabs-list">
            <TabsTrigger value="canvas" className="tabs-trigger text-foreground">
              Canvas
            </TabsTrigger>
            <TabsTrigger value="documents" className="tabs-trigger text-foreground">
              Documents
            </TabsTrigger>
            <TabsTrigger value="moodboard" className="tabs-trigger text-foreground">
              Mood Board
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            {activeTab === 'canvas' && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground hover:bg-muted"
                  onClick={undo}
                  disabled={historyIndex <= 0}
                >
                  <Undo size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground hover:bg-muted"
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                >
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
              </>
            )}
          </div>
        </div>

        <TabsContent value="canvas" className="h-full mt-0">
          <Card className="h-full bg-background border-border">
            <CardHeader className="p-4 pb-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <Label className="text-foreground">Select Canvas</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Select
                      value={canvasInfo.id}
                      onValueChange={(value) => fetchCanvasItems(value)}
                    >
                      <SelectTrigger className="w-[300px] border-border bg-background text-foreground">
                        <SelectValue placeholder="Select a canvas" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        {allCanvases.map((canvas) => (
                          <div
                            key={canvas.id}
                            className="flex items-center justify-between px-2 py-1"
                          >
                            <SelectItem value={canvas.id} className="flex-1 text-foreground">
                              {canvas.title}
                            </SelectItem>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-muted"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteCanvas(canvas.id)
                              }}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={createNewCanvas}
                    >
                      <Plus size={14} className="mr-1" /> New Canvas
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                {isEditingTitle ? (
                  <Input
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onBlur={updateCanvasTitle}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') updateCanvasTitle()
                    }}
                    autoFocus
                    className="max-w-xs border-border bg-background text-foreground"
                  />
                ) : (
                  <Input
                    className="max-w-xs border-none bg-transparent text-foreground cursor-pointer"
                    value={canvasInfo.title}
                    onClick={() => {
                      setTempTitle(canvasInfo.title)
                      setIsEditingTitle(true)
                    }}
                    readOnly
                  />
                )}
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-foreground hover:bg-muted"
                    onClick={() => addItem('text')}
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
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      <ImageIcon size={14} className="mr-1" /> Image
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-foreground hover:bg-muted"
                    onClick={() => addItem('note')}
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
                  backgroundImage:
                    'radial-gradient(circle, hsl(var(--muted)) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              >
                {canvasItems.map((item) => {
                  const fontSize = item.style?.fontSize ?? '14px'
                  const adjustedWidth =
                    (item.type === 'text' || item.type === 'note') && !editingItem
                      ? Math.max(100, measureTextWidth(item.content, fontSize))
                      : item.width
                  const adjustedHeight =
                    (item.type === 'text' || item.type === 'note') && !editingItem
                      ? Math.max(50, measureTextHeight(item.content, fontSize, adjustedWidth - 20))
                      : item.height

                  if (
                    (item.type === 'text' || item.type === 'note') &&
                    !editingItem &&
                    (adjustedWidth !== item.width || adjustedHeight !== item.height)
                  ) {
                    updateItemSize(item, adjustedWidth, adjustedHeight)
                  }

                  return (
                    <motion.div
                      key={item.id}
                      className={`absolute cursor-move ${selectedItem === item.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                      style={{
                        left: item.x,
                        top: item.y,
                        width: adjustedWidth,
                        height: adjustedHeight
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={(e) => handleItemClick(e, item)}
                      onDoubleClick={() => handleDoubleClick(item)}
                      onMouseDown={(e) => startDrag(e, item)}
                    >
                      {item.type === 'text' && (
                        <>
                          {editingItem === item.id ? (
                            <Input
                              value={editContent}
                              onChange={handleContentChange}
                              onBlur={() => saveContent(item)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveContent(item)
                              }}
                              autoFocus
                              className="w-full border-border bg-background text-foreground"
                            />
                          ) : (
                            <div
                              className={item.style?.colorClass ?? 'text-foreground'}
                              style={{
                                fontSize: item.style?.fontSize ?? '14px',
                                fontWeight: item.style?.fontWeight ?? 'normal'
                              }}
                            >
                              {item.content}
                            </div>
                          )}
                          {(item.type === 'text' || item.type === 'note') &&
                            selectedItem === item.id && (
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
                                <PopoverContent className="w-80 bg-background border-border">
                                  <div className="grid gap-4">
                                    <div className="space-y-2">
                                      <h4 className="font-medium leading-none text-foreground">
                                        Style
                                      </h4>
                                      <p className="text-sm text-muted-foreground">
                                        Adjust the item's appearance
                                      </p>
                                    </div>
                                    <div className="grid gap-2">
                                      <div className="grid grid-cols-3 items-center gap-4">
                                        <Label className="text-foreground" htmlFor="fontSize">
                                          Font Size
                                        </Label>
                                        <Select
                                          value={item.style?.fontSize ?? '14px'}
                                          onValueChange={(value) =>
                                            handleStyleChange(item, {
                                              ...item.style,
                                              fontSize: value
                                            })
                                          }
                                        >
                                          <SelectTrigger
                                            id="fontSize"
                                            className="col-span-2 border-border text-foreground"
                                          >
                                            <SelectValue placeholder="Select font size" />
                                          </SelectTrigger>
                                          <SelectContent className="bg-background border-border">
                                            <SelectItem className="text-foreground" value="12px">
                                              12px
                                            </SelectItem>
                                            <SelectItem className="text-foreground" value="14px">
                                              14px
                                            </SelectItem>
                                            <SelectItem className="text-foreground" value="16px">
                                              16px
                                            </SelectItem>
                                            <SelectItem className="text-foreground" value="18px">
                                              18px
                                            </SelectItem>
                                            <SelectItem className="text-foreground" value="20px">
                                              20px
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="grid grid-cols-3 items-center gap-4">
                                        <Label className="text-foreground" htmlFor="color">
                                          Color
                                        </Label>
                                        <Select
                                          value={item.style?.colorClass ?? 'text-foreground'}
                                          onValueChange={(value) =>
                                            handleStyleChange(item, {
                                              ...item.style,
                                              colorClass: value
                                            })
                                          }
                                        >
                                          <SelectTrigger
                                            id="color"
                                            className="col-span-2 border-border text-foreground"
                                          >
                                            <SelectValue placeholder="Select color" />
                                          </SelectTrigger>
                                          <SelectContent className="bg-background border-border">
                                            <SelectItem
                                              className="text-foreground"
                                              value="text-foreground"
                                            >
                                              Default
                                            </SelectItem>
                                            <SelectItem
                                              className="text-foreground"
                                              value="text-red-500"
                                            >
                                              Red
                                            </SelectItem>
                                            <SelectItem
                                              className="text-foreground"
                                              value="text-blue-500"
                                            >
                                              Blue
                                            </SelectItem>
                                            <SelectItem
                                              className="text-foreground"
                                              value="text-green-500"
                                            >
                                              Green
                                            </SelectItem>
                                            <SelectItem
                                              className="text-foreground"
                                              value="text-purple-500"
                                            >
                                              Purple
                                            </SelectItem>
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
                      {item.type === 'image' && (
                        <ResizableBox
                          width={item.width}
                          height={item.height}
                          minConstraints={[50, 50]}
                          onResize={(e, data) => {
                            e.stopPropagation()
                            updateItemSize(item, data.size.width, data.size.height)
                          }}
                          className="absolute"
                          style={{
                            zIndex: selectedItem === item.id ? 10 : 1
                          }}
                          resizeHandles={['se']}
                          handle={(h) => (
                            <div
                              className={`react-resizable-handle react-resizable-handle-${h}`}
                              onMouseDown={(e) => e.stopPropagation()}
                            >
                              <div className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 hover:bg-blue-600 rounded-tl-md cursor-se-resize flex items-center justify-center">
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  className="text-white"
                                >
                                  <path
                                    d="M8 16L16 8M16 8V16M16 8H8"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                            </div>
                          )}
                        >
                          <div className="w-full h-full relative">
                            <img
                              src={item.content || '/placeholder.svg'}
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
                                    const file = e.target.files?.[0]
                                    if (file) updateItemImage(item, file)
                                  }}
                                />
                                <div className="absolute top-0 right-0 flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-foreground hover:bg-muted"
                                    onClick={() => handleResizeDialogOpen(item)}
                                  >
                                    <Grid3X3 size={14} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-foreground hover:bg-muted"
                                    onClick={() => document.getElementById(`image-update-${item.id}`)?.click()}
                                  >
                                    <Pencil size={14} />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </ResizableBox>
                      )}
                      {item.type === 'note' && (
                        <>
                          {editingItem === item.id ? (
                            <Input
                              value={editContent}
                              onChange={handleContentChange}
                              onBlur={() => saveContent(item)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveContent(item)
                              }}
                              autoFocus
                              className="w-full h-full border-border bg-background text-foreground"
                            />
                          ) : (
                            <div
                              className={`${item.style?.backgroundClass ?? 'bg-note'} h-full rounded-md p-2 text-foreground`}
                              style={{
                                padding: item.style?.padding ?? '10px',
                                borderRadius: item.style?.borderRadius ?? '4px'
                              }}
                            >
                              {item.content}
                            </div>
                          )}
                          {(item.type === 'text' || item.type === 'note') &&
                            selectedItem === item.id && (
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
                                <PopoverContent className="w-80 bg-background border-border">
                                  <div className="grid gap-4">
                                    <div className="space-y-2">
                                      <h4 className="font-medium leading-none text-foreground">
                                        Style
                                      </h4>
                                      <p className="text-sm text-muted-foreground">
                                        Adjust the item's appearance
                                      </p>
                                    </div>
                                    <div className="grid gap-2">
                                      <div className="grid grid-cols-3 items-center gap-4">
                                        <Label className="text-foreground" htmlFor="background">
                                          Background
                                        </Label>
                                        <Select
                                          value={item.style?.backgroundClass ?? 'bg-note'}
                                          onValueChange={(value) =>
                                            handleStyleChange(item, {
                                              ...item.style,
                                              backgroundClass: value
                                            })
                                          }
                                        >
                                          <SelectTrigger
                                            id="background"
                                            className="col-span-2 border-border text-foreground"
                                          >
                                            <SelectValue placeholder="Select background" />
                                          </SelectTrigger>
                                          <SelectContent className="bg-background border-border">
                                            <SelectItem className="text-foreground" value="bg-note">
                                              Default
                                            </SelectItem>
                                            <SelectItem
                                              className="text-foreground"
                                              value="bg-yellow-100"
                                            >
                                              Yellow
                                            </SelectItem>
                                            <SelectItem
                                              className="text-foreground"
                                              value="bg-blue-100"
                                            >
                                              Blue
                                            </SelectItem>
                                            <SelectItem
                                              className="text-foreground"
                                              value="bg-green-100"
                                            >
                                              Green
                                            </SelectItem>
                                            <SelectItem
                                              className="text-foreground"
                                              value="bg-pink-100"
                                            >
                                              Pink
                                            </SelectItem>
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
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="h-full mt-0">
          <Card className="h-full bg-background border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Documents</CardTitle>
              <CardDescription className="text-muted-foreground">
                Create and manage your documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {editingDocument ? (
                <div className="space-y-4">
                  <Input
                    value={editDocumentTitle}
                    onChange={(e) => setEditDocumentTitle(e.target.value)}
                    placeholder="Document Title"
                    className="border-border bg-background text-foreground"
                  />
                  <Textarea
                    value={editDocumentContent}
                    onChange={(e) => setEditDocumentContent(e.target.value)}
                    placeholder="Document Content"
                    className="h-[400px] border-border bg-background text-foreground"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => updateDocument(editingDocument)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingDocument(null)}
                      className="border-border text-foreground hover:bg-muted"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : viewingDocument ? (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    {documents.find((doc) => doc.id === viewingDocument)?.title || 'Document'}
                  </h2>
                  <div className="p-4 bg-muted rounded-md text-foreground whitespace-pre-wrap">
                    {documents.find((doc) => doc.id === viewingDocument)?.content || 'No content'}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const doc = documents.find((doc) => doc.id === viewingDocument)
                        if (doc) {
                          setEditingDocument(doc.id)
                          setEditDocumentTitle(doc.title)
                          setEditDocumentContent(doc.content)
                          setViewingDocument(null)
                        }
                      }}
                      className="border-border text-foreground hover:bg-muted"
                    >
                      <Pencil size={14} className="mr-1" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setViewingDocument(null)}
                      className="border-border text-foreground hover:bg-muted"
                    >
                      Back to List
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documents.map((doc) => (
                    <Card
                      key={doc.id}
                      className="cursor-pointer hover:shadow-md transition-shadow bg-background border-border"
                      onClick={() => setViewingDocument(doc.id)}
                    >
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start">
                          <FileText className="text-muted-foreground" />
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-foreground hover:bg-muted"
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditingDocument(doc.id)
                                setEditDocumentTitle(doc.title)
                                setEditDocumentContent(doc.content)
                              }}
                            >
                              <Pencil size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive hover:bg-muted"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteDocument(doc.id)
                              }}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <h3 className="font-medium text-foreground">{doc.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(doc.updatedAt)}
                        </p>
                      </CardContent>
                    </Card>
                  ))}

                  <Card
                    className="cursor-pointer hover:shadow-md transition-shadow border-dashed border-2 border-border bg-background flex items-center justify-center h-[140px]"
                    onClick={createNewDocument}
                  >
                    <div className="text-center">
                      <Plus size={24} className="mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Create New Document</p>
                    </div>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moodboard" className="h-full mt-0">
          <Card className="h-full bg-background border-border">
            <CardHeader className="p-4 pb-0">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-foreground">Mood Board</CardTitle>
                  <CardDescription className="text-muted-foreground my-2">
                    Collect visual inspiration
                  </CardDescription>
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
                {moodBoardItems.map((item) => (
                  <div
                    key={item.id}
                    className="aspect-square bg-muted rounded-md overflow-hidden relative group"
                  >
                    <img
                      src={item.imageUrl || '/placeholder.svg'}
                      alt={`Mood board item`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-50">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-primary-foreground h-8 w-8 hover:bg-muted"
                          onClick={() => deleteMoodBoardItem(item.id)}
                        >
                          <Trash2 className="text-foreground" size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <div
                  className="aspect-square bg-background rounded-md border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => setIsAddingMoodBoardItem(true)}
                >
                  <div className="text-center">
                    <Plus size={24} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Add Image</p>
                  </div>
                </div>

                {isAddingMoodBoardItem && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <Card className="bg-background border-border p-4">
                      <CardHeader>
                        <CardTitle className="text-foreground">Upload Image</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Input
                          type="file"
                          accept="image/*"
                          className="mb-4 text-foreground"
                          onChange={handleMoodBoardFileChange}
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setIsAddingMoodBoardItem(false)}
                            variant="outline"
                            className="border-border text-foreground hover:bg-muted"
                          >
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isResizeDialogOpen} onOpenChange={setIsResizeDialogOpen}>
        <DialogContent className="bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Resize Image</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="width" className="text-right text-foreground">
                Width
              </Label>
              <Input
                id="width"
                type="number"
                value={resizeDimensions.width}
                onChange={(e) => setResizeDimensions({ ...resizeDimensions, width: Number(e.target.value) })}
                className="col-span-3 border-border bg-background text-foreground"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="height" className="text-right text-foreground">
                Height
              </Label>
              <Input
                id="height"
                type="number"
                value={resizeDimensions.height}
                onChange={(e) => setResizeDimensions({ ...resizeDimensions, height: Number(e.target.value) })}
                className="col-span-3 border-border bg-background text-foreground"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResizeDialogOpen(false)}
              className="border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button onClick={handleResizeApply} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreativeSpace
