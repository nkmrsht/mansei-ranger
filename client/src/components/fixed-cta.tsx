import { Phone, MessageCircle } from "lucide-react";

export default function FixedCTA() {
  const handleEstimateClick = () => {
    const estimateSection = document.getElementById('estimate-wizard');
    if (estimateSection) {
      estimateSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-apple-border z-40 md:hidden">
      <div className="flex">
        <a href="tel:047-123-4567" className="flex-1 flex items-center justify-center py-4 text-primary hover:bg-gray-50 transition-colors">
          <Phone className="w-5 h-5 mr-2" />
          <span className="font-medium">電話</span>
        </a>
        <a href="#" className="flex-1 flex items-center justify-center py-4 text-primary hover:bg-gray-50 transition-colors">
          <MessageCircle className="w-5 h-5 mr-2" />
          <span className="font-medium">LINE</span>
        </a>
        <button 
          onClick={handleEstimateClick}
          className="flex-1 bg-primary text-white py-4 font-medium hover:bg-primary/90 transition-colors"
        >
          見積り
        </button>
      </div>
    </div>
  );
}
