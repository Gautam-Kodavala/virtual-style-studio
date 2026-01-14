import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TryOnResult {
  id: string;
  personImage: string;
  clothingImage: string;
  resultImage: string;
  timestamp: Date;
}

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: TryOnResult[];
  onClearHistory: () => void;
}

const HistorySidebar = ({ isOpen, onClose, history, onClearHistory }: HistorySidebarProps) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Try-On History</h2>
                  <p className="text-sm text-muted-foreground">{history.length} results</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1 p-6">
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Clock className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No try-on history yet</p>
                  <p className="text-sm text-muted-foreground/60 mt-1">
                    Your generated looks will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card rounded-xl p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <img 
                          src={item.personImage} 
                          alt="Person" 
                          className="aspect-square object-cover rounded-lg"
                        />
                        <img 
                          src={item.clothingImage} 
                          alt="Clothing" 
                          className="aspect-square object-cover rounded-lg"
                        />
                        <img 
                          src={item.resultImage} 
                          alt="Result" 
                          className="aspect-square object-cover rounded-lg ring-2 ring-primary/30"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(item.timestamp)}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Footer */}
            {history.length > 0 && (
              <div className="p-6 border-t">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={onClearHistory}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear History
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HistorySidebar;
