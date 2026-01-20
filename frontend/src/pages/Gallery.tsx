
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const categories = [
  "All",
  "Commercial",
  "Residential",
  "Industrial",
  "Healthcare",
  "Education",
  "Retail",
  "Infrastructure",
  "Recreation",
];

interface GalleryItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  imageUrl?: string;
}

const API_BASE = "http://localhost:5000"; // Backend base URL

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/gallery`)
      .then((res) => res.json())
      .then((data) => {
        const mappedData = data.map((item: any) => ({
          _id: item._id,
          title: item.title,
          category: item.category,
          description: item.description,
          imageUrl: item.imageUrl,
        }));
        setGalleryItems(mappedData);
      })
      .catch((err) => console.error("Error fetching gallery items:", err));
  }, []);

  const filteredImages =
    selectedCategory === "All"
      ? galleryItems
      : galleryItems.filter((img) => img.category === selectedCategory);

  const openModal = (id: string) => setSelectedImage(id);
  const closeModal = () => setSelectedImage(null);

  const nextImage = () => {
    if (selectedImage !== null) {
      const currentIndex = filteredImages.findIndex((img) => img._id === selectedImage);
      const nextIndex = (currentIndex + 1) % filteredImages.length;
      setSelectedImage(filteredImages[nextIndex]._id);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      const currentIndex = filteredImages.findIndex((img) => img._id === selectedImage);
      const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
      setSelectedImage(filteredImages[prevIndex]._id);
    }
  };

  const selectedImageData = selectedImage
    ? galleryItems.find((img) => img._id === selectedImage)
    : null;

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Our Gallery
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our portfolio of completed construction projects showcasing quality, innovation, and craftsmanship.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "construction" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="mb-2"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <Card
              key={image._id}
              className="group cursor-pointer hover:shadow-construction transition-smooth transform hover:scale-105"
              onClick={() => openModal(image._id)}
            >
              <CardContent className="p-0">
                <div className="aspect-square bg-gradient-ash rounded-t-lg flex items-center justify-center relative overflow-hidden">
                  {image.imageUrl ? (
                    <img
                      src={`${BASE_URL}${image.imageUrl}`}
                      alt={image.title}
                      className="w-full h-full object-cover"
                      onError={(e) => console.error(`Failed to load image: ${BASE_URL}${image.imageUrl}`)} // Debug
                    />
                  ) : (
                    <div className="w-16 h-16 construction-gradient rounded-full flex items-center justify-center">
                      <span className="text-construction-foreground font-bold text-xl">
                        {image.title[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {image.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                    {image.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {image.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 ash-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl text-muted-foreground">🏗️</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No projects found
            </h3>
            <p className="text-muted-foreground">
              No projects match the selected category.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedImage && selectedImageData && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm"
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-ash flex items-center justify-center">
                  {selectedImageData.imageUrl ? (
                    <img
                      src={`${BASE_URL}${selectedImageData.imageUrl}`}
                      alt={selectedImageData.title}
                      className="w-full h-full object-cover"
                      onError={(e) => console.error(`Failed to load modal image: ${BASE_URL}${selectedImageData.imageUrl}`)} // Debug
                    />
                  ) : (
                    <div className="w-32 h-32 construction-gradient rounded-full flex items-center justify-center">
                      <span className="text-construction-foreground font-bold text-4xl">
                        {selectedImageData.title[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {selectedImageData.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    {selectedImageData.title}
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    {selectedImageData.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
