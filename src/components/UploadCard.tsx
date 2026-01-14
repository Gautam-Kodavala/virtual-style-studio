import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, User, Shirt, X, ImageIcon } from "lucide-react";

interface UploadCardProps {
  type: "person" | "clothing";
  image: string | null;
  onImageUpload: (file: File) => void;
  onImageRemove: () => void;
}

const UploadCard = ({ type, image, onImageUpload, onImageRemove }: UploadCardProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const Icon = type === "person" ? User : Shirt;
  const title = type === "person" ? "Upload Your Photo" : "Upload Clothing Image";
  const description = type === "person" 
    ? "Full-body photo for best results" 
    : "Any garment from any online store";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300
          ${isDragging 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-border hover:border-primary/50 hover:bg-secondary/50"
          }
          ${image ? "border-solid border-primary/30" : ""}
        `}
      >
        {image ? (
          <div className="relative aspect-[3/4] group">
            <img 
              src={image} 
              alt={type === "person" ? "Your photo" : "Clothing"} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onImageRemove}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-5 h-5 text-foreground" />
            </motion.button>
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <label className="block">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileSelect}
                  className="hidden" 
                />
                <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-white/90 backdrop-blur-sm cursor-pointer hover:bg-white transition-colors">
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Change Image</span>
                </div>
              </label>
            </div>
          </div>
        ) : (
          <label className="block cursor-pointer">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileSelect}
              className="hidden" 
            />
            <div className="aspect-[3/4] flex flex-col items-center justify-center p-8 text-center">
              <motion.div
                animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6"
              >
                <Icon className="w-10 h-10 text-primary" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm mb-6">{description}</p>
              <div className="flex items-center gap-2 text-primary">
                <Upload className="w-5 h-5" />
                <span className="font-medium">Click or drag to upload</span>
              </div>
            </div>
          </label>
        )}
      </div>
    </motion.div>
  );
};

export default UploadCard;
