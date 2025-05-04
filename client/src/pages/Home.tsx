import { Link } from "wouter";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";
import BecomeAMentor from "@/components/home/BecomeAMentor";
import FAQ from "@/components/home/FAQ";
import CTA from "@/components/home/CTA";

export default function Home() {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <Features />
      <Testimonials />
      <BecomeAMentor />
      <FAQ />
      <CTA />
    </div>
  );
}
