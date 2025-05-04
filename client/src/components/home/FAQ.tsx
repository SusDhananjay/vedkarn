import { useState } from "react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible className="mt-6 space-y-6 divide-y divide-gray-200">
            <AccordionItem value="item-1" className="pt-6">
              <AccordionTrigger className="text-lg font-medium text-gray-900">
                How does MentorConnect work?
              </AccordionTrigger>
              <AccordionContent className="text-base text-gray-500 pt-2">
                MentorConnect allows students to find and book 1:1 sessions with mentors from their target universities or companies. 
                Students can search for mentors, view their profiles, and book sessions at a fixed price of ₹1500. 
                All sessions are conducted through our integrated video platform.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="pt-6">
              <AccordionTrigger className="text-lg font-medium text-gray-900">
                How much does a mentorship session cost?
              </AccordionTrigger>
              <AccordionContent className="text-base text-gray-500 pt-2">
                All mentorship sessions are priced at a flat rate of ₹1500. This covers a 45-60 minute 1:1 session with your 
                chosen mentor. The price is fixed to keep things simple and transparent.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="pt-6">
              <AccordionTrigger className="text-lg font-medium text-gray-900">
                How do I prepare for a mentorship session?
              </AccordionTrigger>
              <AccordionContent className="text-base text-gray-500 pt-2">
                Before your session, we recommend you send a message to your mentor outlining your goals and what you hope to achieve. 
                Prepare specific questions and any documents you'd like to discuss. Make sure your internet connection is stable and that 
                you have a quiet environment for the video call.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="pt-6">
              <AccordionTrigger className="text-lg font-medium text-gray-900">
                What happens if I need to reschedule or cancel?
              </AccordionTrigger>
              <AccordionContent className="text-base text-gray-500 pt-2">
                You can reschedule a session up to 24 hours before the scheduled time at no extra cost. Cancellations made at least 
                48 hours in advance are eligible for a full refund. For cancellations within 24 hours, a 50% refund will be issued.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="pt-6">
              <AccordionTrigger className="text-lg font-medium text-gray-900">
                How do I become a mentor?
              </AccordionTrigger>
              <AccordionContent className="text-base text-gray-500 pt-2">
                To become a mentor, you need to fill out an application on our platform. We review each application carefully to 
                ensure our mentors are qualified and genuinely interested in helping students. Once approved, you can set up your 
                profile, define your availability, and start accepting mentoring sessions.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
