import Header from "@/components/header";
import Hero from "@/components/hero";
import Problems from "@/components/problems";
import Process from "@/components/process";
import TrustSignals from "@/components/trust-signals";
import EstimateWizard from "@/components/estimate-wizard";
import Reviews from "@/components/reviews";
import ProductShowcase from "@/components/product-showcase";
import FAQ from "@/components/faq";
import FixedCTA from "@/components/fixed-cta";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Problems />
      <Process />
      <TrustSignals />
      <EstimateWizard />
      <Reviews />
      <ProductShowcase />
      <FAQ />
      <FixedCTA />
      <Footer />
    </div>
  );
}
