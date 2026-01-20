import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface GalleryItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  imageUrl?: string;
}

const API_BASE = "http://localhost:5000";

const categories = ["Commercial", "Residential", "Industrial", "Healthcare", "Education", "Retail", "Infrastructure", "Recreation"];

export default function GalleryAdmin() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const editFileInputRef = useRef<HTMLInputElement>(null); // For edit form
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<GalleryItem>>({
    title: "",
    category: "",
    description: "",
  });
  const [editItem, setEditItem] = useState<Partial<GalleryItem>>({});

  useEffect(() => {
    fetch(`${API_BASE}/api/gallery`)
      .then(res => res.json())
      .then(data => {
        const mappedData = data.map((item: any) => ({
          _id: item._id,
          title: item.title,
          category: item.category,
          description: item.description,
          imageUrl: item.imageUrl,
        }));
        setGalleryItems(mappedData);
      })
      .catch(err => {
        console.error(err);
        toast({ title: "Error", description: "Failed to fetch gallery items", variant: "destructive" });
      });
  }, []);

  const handleAddNew = async () => {
    if (!newItem.title || !newItem.category || !newItem.description) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", newItem.title);
      formData.append("description", newItem.description);
      formData.append("category", newItem.category);
      if (fileInputRef.current?.files?.[0]) {
        formData.append("image", fileInputRef.current.files[0]);
      }

      const res = await fetch("http://localhost:5000/api/gallery", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const savedItem = await res.json();
      setGalleryItems([savedItem, ...galleryItems]);
      setNewItem({ title: "", category: "", description: "", imageUrl: "" });
      setIsAddingNew(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast({ title: "Added", description: "Gallery item added successfully" });
    } catch (err: any) {
      toast({ title: "Error", description: `Failed to add item: ${err.message}`, variant: "destructive" });
    }
  };

  const handleEdit = (item: GalleryItem) => {
    if (!item._id) {
      toast({ title: "Error", description: "Invalid item ID", variant: "destructive" });
      return;
    }
    setEditingItem(item._id);
    setEditItem(item);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) {
      toast({ title: "Error", description: "No item selected for editing", variant: "destructive" });
      return;
    }

    if (!editItem.title || !editItem.category || !editItem.description) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", editItem.title || "");
      formData.append("description", editItem.description || "");
      formData.append("category", editItem.category || "");
      if (editFileInputRef.current?.files?.[0]) {
        formData.append("image", editFileInputRef.current.files[0]);
      }

      const res = await fetch(`http://localhost:5000/api/gallery/${editingItem}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const updated = await res.json();
      setGalleryItems(items => items.map(i => (i._id === updated._id ? updated : i)));
      setEditingItem(null);
      setEditItem({});
      if (editFileInputRef.current) editFileInputRef.current.value = "";
      toast({ title: "Updated", description: "Gallery item updated successfully" });
    } catch (err: any) {
      console.error("Frontend PUT error:", err); // Log for debugging
      toast({ title: "Error", description: `Failed to update item: ${err.message}`, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      toast({ title: "Error", description: "Invalid item ID", variant: "destructive" });
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/gallery/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setGalleryItems(items => items.filter(i => i._id !== id));
      toast({ title: "Deleted", description: "Gallery item removed" });
    } catch (err: any) {
      toast({ title: "Error", description: `Failed to delete item: ${err.message}`, variant: "destructive" });
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditItem({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Add New Item */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Gallery Item
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isAddingNew ? (
            <Button onClick={() => setIsAddingNew(true)} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add New Gallery Item
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-title">Title</Label>
                  <Input
                    id="new-title"
                    value={newItem.title || ""}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    placeholder="Enter project title"
                  />
                </div>
                <div>
                  <Label htmlFor="new-category">Category</Label>
                  <Select
                    value={newItem.category || ""}
                    onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="new-description">Description</Label>
                <Textarea
                  id="new-description"
                  value={newItem.description || ""}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="new-image">Upload Image</Label>
                <div className="mt-2">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Image
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddNew}>
                  <Save className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingNew(false);
                    setNewItem({ title: "", category: "", description: "", imageUrl: "" });
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Existing Gallery Items */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Gallery Items ({galleryItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryItems.map((item) => (
              <Card key={item._id} className="p-4 flex flex-col">
                {editingItem === item._id ? (
                  <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`edit-title-${item._id}`}>Title</Label>
                        <Input
                          id={`edit-title-${item._id}`}
                          value={editItem.title || ""}
                          onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edit-category-${item._id}`}>Category</Label>
                        <Select
                          value={editItem.category || ""}
                          onValueChange={(value) => setEditItem({ ...editItem, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`edit-description-${item._id}`}>Description</Label>
                      <Textarea
                        id={`edit-description-${item._id}`}
                        value={editItem.description || ""}
                        onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-image">Upload New Image</Label>
                      <div className="mt-2">
                        <Input
                          ref={editFileInputRef} // Use separate ref for edit form
                          type="file"
                          accept="image/*"
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => editFileInputRef.current?.click()}
                          className="w-full"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Image
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button onClick={handleSaveEdit} size="sm" className="flex-1 sm:flex-none">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit} size="sm" className="flex-1 sm:flex-none">
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <Badge variant="secondary">{item.category}</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </div>

                    <div className="flex gap-2 mt-4 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                        className="flex-1 sm:flex-none"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item._id)}
                        className="flex-1 sm:flex-none"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}