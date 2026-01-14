import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Sparkles, Download, Share2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import UploadCard from "./UploadCard";

interface TryOnResult {
  id: string;
  personImage: string;
  clothingImage: string;
  resultImage: string;
  timestamp: Date;
}

interface TryOnToolProps {
  onNewResult: (result: TryOnResult) => void;
}

const TryOnTool = ({ onNewResult }: TryOnToolProps) => {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePersonUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPersonImage(e.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleClothingUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setClothingImage(e.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!personImage || !clothingImage) return;

    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('virtual-tryon', {
        body: { 
          personImage,
          clothingImage
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate try-on');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const resultImage = data?.resultImage || personImage;
      setResult(resultImage);
      
      const newResult: TryOnResult = {
        id: Date.now().toString(),
        personImage,
        clothingImage,
        resultImage,
        timestamp: new Date(),
      };
      onNewResult(newResult);

      toast({
        title: "Virtual Try-On Complete!",
        description: "Your AI-generated look is ready.",
      });

    } catch (error) {
      console.error('Error generating try-on:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setPersonImage(null);
    setClothingImage(null);
    setResult(null);
  };

  const canGenerate = personImage && clothingImage && !isProcessing;

  return (
    <section id="tool-section" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Virtual <span className="gradient-text">Fitting Room</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Upload your photo and any clothing item to see how it looks on you instantly
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Upload Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <UploadCard
              type="person"
              image={personImage}
              onImageUpload={handlePersonUpload}
              onImageRemove={() => setPersonImage(null)}
            />
            <UploadCard
              type="clothing"
              image={clothingImage}
              onImageUpload={handleClothingUpload}
              onImageRemove={() => setClothingImage(null)}
            />
          </div>

          {/* Generate Button */}
          <motion.div 
            className="flex justify-center mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Button
              variant="generate"
              size="xl"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="min-w-64"
            >
              {isProcessing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  Generating Magic...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate My Look
                </>
              )}
            </Button>
          </motion.div>

          {/* Processing Animation */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <div className="relative w-32 h-32 mb-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary/50"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-2 rounded-full border-4 border-transparent border-b-accent border-l-accent/50"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
                  >
                    <Sparkles className="w-8 h-8 text-primary" />
                  </motion.div>
                </div>
                <p className="text-lg font-medium text-muted-foreground">
                  AI is working its magic...
                </p>
                <p className="text-sm text-muted-foreground/60 mt-2">
                  Analyzing garment and fitting to your body
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result */}
          <AnimatePresence>
            {result && !isProcessing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card rounded-3xl p-6 md:p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Your Virtual Try-On</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Download className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Share2 className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full"
                      onClick={handleReset}
                    >
                      <RotateCcw className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground text-center">Your Photo</p>
                    <img 
                      src={personImage!} 
                      alt="Your photo" 
                      className="w-full aspect-[3/4] object-cover rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground text-center">Garment</p>
                    <img 
                      src={clothingImage!} 
                      alt="Clothing" 
                      className="w-full aspect-[3/4] object-cover rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground text-center">Result</p>
                    <div className="relative">
                      <img 
                        src={result} 
                        alt="Result" 
                        className="w-full aspect-[3/4] object-cover rounded-xl ring-2 ring-primary/30"
                      />
                      <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                        AI Generated
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default TryOnTool;
